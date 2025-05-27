import logger from '@/utils/logger';

// Use proxy routes instead of direct API calls
const API_BASE_URL = '/api/proxy';

// API response types from integration.md
export interface ChatResponse {
  consultation_id: string | null; // Can be null if error before ID established
  message: string;
  stage: string;
  next_steps?: string;
  status_detail?: 'file_processing_initiated' | 'ai_response_timeout' | string; // For proxy signals
  _isBackgroundProcessing?: boolean; // Internal flag for ActiveConsultation to manage UI
}

export interface WorkflowEvent {
  consultation_id: string;
  event_type: 'WORKFLOW_START' | 'WORKFLOW_PROGRESS' | 'WORKFLOW_COMPLETE' | 'WORKFLOW_ERROR' | 'HEARTBEAT';
  workflow_name: string;
  message: string;
  timestamp: string;
}

export interface TestRequisitionData {
  patient_name: string;
  patient_age: number;
  patient_sex: string;
  requesting_physician: string;
  date_requested: string;
  tests_requested: string[];
  clinical_notes?: string;
  priority: 'Routine' | 'Urgent';
}

// Add a new interface for file upload status
export interface FileUploadResponse {
  consultation_id: string;
  message: string;
  stage: string;
  next_steps?: string;
  processing?: boolean;
  processing_message?: string;
}

const getConsultationId = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('maisha_consultation_id');
  }
  return null;
};

const setConsultationId = (id: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('maisha_consultation_id', id);
  }
};

/**
 * Send a message to the AI API (supports file uploads)
 * Modified to handle long-running file processing
 */
export async function sendMessage(messageText: string, fileToUpload?: File): Promise<ChatResponse> {
  logger.debug('chatService.sendMessage:', { messageText, fileName: fileToUpload?.name });
  const currentConsultationId = getConsultationId();
  
  const formData = new FormData();
  formData.append('message', messageText);

  if (currentConsultationId) {
    formData.append('consultation_id', currentConsultationId);
  }

  if (fileToUpload) {
    formData.append('file', fileToUpload);
  }

  let isTimeoutAbort = false;
  
  try {
    const controller = new AbortController();
    // Increase client timeout to match backend processing time
    const CLIENT_TIMEOUT = 250000; // 4 minutes and 10 seconds
    const clientToProxyTimeoutId = setTimeout(() => {
        logger.warn('chatService: Timeout sending request to our Next.js proxy /api/proxy/chat');
        isTimeoutAbort = true;
        controller.abort();
    }, CLIENT_TIMEOUT);

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(clientToProxyTimeoutId);
    logger.debug(`chatService: Proxy response status: ${response.status}`);

    const data: ChatResponse = await response.json();
    logger.debug('chatService: Received data from proxy:', data);

    // Always update consultation ID if received
    if (data.consultation_id && data.consultation_id !== currentConsultationId) {
      setConsultationId(data.consultation_id);
      logger.info(`chatService: Consultation ID updated to ${data.consultation_id}`);
    } else if (data.consultation_id && !currentConsultationId) {
      setConsultationId(data.consultation_id);
      logger.info(`chatService: New consultation ID set: ${data.consultation_id}`);
    }

    if (response.status === 202) {
      logger.info('chatService: Received 202 - background processing initiated');
      return {
        ...data,
        message: '',
        _isBackgroundProcessing: true 
      };
    }

    if (!response.ok) {
      const errorDetail = (data as any).detail || `Error from AI service: ${response.status}`;
      logger.error(`chatService: Error from proxy/AI: ${errorDetail}`);
      if (response.status === 404 && errorDetail.toLowerCase().includes('consultation not found')) {
        logger.warn('chatService: Consultation not found on server. Clearing local ID.');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('maisha_consultation_id');
        }
      }
      throw new Error(errorDetail);
    }

    return data;

  } catch (error: any) {
    logger.error('chatService.sendMessage: CATCH block error:', error);
    
    if (error.name === 'AbortError') {
      if (isTimeoutAbort) {
        logger.warn('chatService: Request to Next.js proxy timed out.');
        return {
          consultation_id: currentConsultationId,
          message: '', 
          stage: 'processing_error',
          next_steps: 'The request is taking longer than expected. Please wait for the response via real-time updates.',
          _isBackgroundProcessing: true,
          status_detail: 'client_proxy_timeout'
        };
      }
      logger.warn('chatService: Request was aborted.');
      throw new Error('Request was cancelled');
    }
    
    throw error instanceof Error ? error : new Error('Failed to communicate with the AI service');
  }
}

let eventSource: EventSource | null = null;
export let reconnectAttempt = 0; // Export for potential read-only access if needed, though direct use is discouraged
export const MAX_RECONNECT_ATTEMPTS = 5;
const BASE_RECONNECT_DELAY = 2000;
const MAX_RECONNECT_DELAY = 30000;

// Flag to prevent reconnection during intentional closure or while a reconnection attempt is pending
let isIntentionalClose = false;
let reconnectionTimeoutId: NodeJS.Timeout | null = null;

// Store ping handler at module level for proper cleanup
let currentPingHandler: ((event: MessageEvent) => void) | null = null;

function getBackoffTime(): number {
  if (reconnectAttempt >= MAX_RECONNECT_ATTEMPTS) {
    logger.error("SSE: Max reconnection attempts reached.");
    return -1; // Indicate no more retries
  }
  // Exponential backoff with jitter
  const delay = Math.min(
    BASE_RECONNECT_DELAY * Math.pow(2, reconnectAttempt) + Math.random() * 1000, 
    MAX_RECONNECT_DELAY
  );
  reconnectAttempt++;
  return delay;
}

function resetBackoff(): void {
  logger.info('SSE: Resetting backoff attempts and timeout.');
  reconnectAttempt = 0;
  if (reconnectionTimeoutId) {
    clearTimeout(reconnectionTimeoutId);
    reconnectionTimeoutId = null;
  }
}

/**
 * Connects to the Server-Sent Events stream for a consultation.
 * @param onEvent - Callback function to handle incoming WorkflowEvent messages.
 * @param onError - Optional callback function to handle SSE errors.
 */
export const connectToEventStream = (
  onEvent: (event: WorkflowEvent) => void,
  onError?: (error: Event) => void,
  onOpen?: () => void
) => {
  if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
    logger.info('SSE: connectToEventStream called while connection already open or connecting. Closing existing one first.');
    disconnectEventStream(); // Will set isIntentionalClose and clean up
  }

  const consultationId = getConsultationId();
  if (!consultationId) {
    logger.warn('SSE: No consultation ID, cannot connect.');
    if (onError) onError(new Event('NoConsultationID'));
    return;
  }

  // Store the consultation ID at the time of this connection attempt
  // Used to prevent reconnection if the ID changes later.
  const connectionConsultationId = consultationId;

  isIntentionalClose = false; // Reset for this new connection attempt
  if (reconnectionTimeoutId) { // Clear any pending reconnection timeout from a previous attempt
      logger.debug('SSE: Clearing previous reconnection timeout.');
      clearTimeout(reconnectionTimeoutId);
      reconnectionTimeoutId = null;
  }

  const url = `${API_BASE_URL}/consultation/${consultationId}/events`;
  logger.info(`SSE: Attempting to connect to: ${url} (Attempt: ${reconnectAttempt + 1} / ${MAX_RECONNECT_ATTEMPTS +1 })`);
  
  try {
    eventSource = new EventSource(url);
    
    eventSource.onopen = () => {
      logger.info('SSE: Connection opened successfully.');
      resetBackoff(); // Reset attempts and any pending reconnection timeout
      if (onOpen) onOpen();
    };

    eventSource.onmessage = (event: MessageEvent) => {
      try {
        const eventData: WorkflowEvent = JSON.parse(event.data);
        logger.info('SSE: Received message event:', eventData);
        onEvent(eventData);
      } catch (error) {
        logger.error('SSE: Error parsing event data:', { data: event.data, error });
      }
    };
    
    // Create and store the ping handler
    currentPingHandler = (event: MessageEvent) => {
      try {
        const pingData = JSON.parse(event.data);
        logger.debug('SSE: Received named "ping" event with data:', pingData);
        
        // Check for timeout warning
        if (typeof pingData === 'object' && pingData.message?.includes('timeout soon')) {
          logger.warn('SSE: Connection timeout warning received, server may close soon.');
        }
      } catch (error) {
        logger.error('SSE: Error parsing ping event data:', { data: event.data, error });
      }
    };
    
    eventSource.addEventListener('ping', currentPingHandler);

    eventSource.onerror = (errorEvent: Event) => {
      const currentReadyState = eventSource?.readyState; // Capture before nullifying
      logger.error('SSE: Connection error occurred on EventSource.', {
        errorEvent,
        readyState: currentReadyState,
        isIntentionalClose
      });

      // Inform the UI/consumer about the error, unless it was an intentional close
      if (onError && !isIntentionalClose) {
        onError(errorEvent);
      }

      // Clean up the current failing EventSource instance
      if (eventSource) {
        const oldEventSource = eventSource; // Keep a reference for cleanup
        eventSource = null; // Nullify the global reference immediately

        oldEventSource.onopen = null;
        oldEventSource.onmessage = null;
        oldEventSource.onerror = null;
        if (currentPingHandler) {
          oldEventSource.removeEventListener('ping', currentPingHandler);
          currentPingHandler = null;
        }
        oldEventSource.close(); // This should ensure its readyState becomes CLOSED
        logger.info('SSE: Closed failed EventSource instance.');
      }

      if (isIntentionalClose) {
        logger.info('SSE: Skipping reconnection due to intentional close flag.');
        resetBackoff(); // Clear any pending retry timers and attempts count
        return;
      }

      // Proceed with reconnection logic if not an intentional close
      const backoffTime = getBackoffTime();
      if (backoffTime > 0) {
        logger.info(`SSE: Connection error. Attempting to reconnect in ${backoffTime}ms (attempt ${reconnectAttempt} of ${MAX_RECONNECT_ATTEMPTS})...`);

        if (reconnectionTimeoutId) clearTimeout(reconnectionTimeoutId); // Clear previous if any

        reconnectionTimeoutId = setTimeout(() => {
          reconnectionTimeoutId = null; // Clear the stored ID once the timeout executes
          const currentConsultationIdForRetry = getConsultationId();
          // Only reconnect if it's still the same consultation AND no new eventSource was created in the meantime
          // (e.g., by a direct call to connectToEventStream)
          if (currentConsultationIdForRetry === connectionConsultationId && !eventSource) {
            logger.info(`SSE: Reconnecting for consultation ${currentConsultationIdForRetry}`);
            connectToEventStream(onEvent, onError, onOpen); // Recursive call to reconnect
          } else {
            if (currentConsultationIdForRetry !== connectionConsultationId) {
                logger.info(`SSE: Reconnection aborted; consultation ID changed. Old: ${connectionConsultationId}, New: ${currentConsultationIdForRetry}`);
            } else if (eventSource) {
                logger.info(`SSE: Reconnection aborted; a new EventSource instance already exists or was created.`);
            }
            resetBackoff(); // Reset attempts if not actually reconnecting
          }
        }, backoffTime);
      } else {
        logger.error('SSE: Max reconnection attempts reached after error. No more automatic retries.');
        if (onError) onError(new Event('MaxRetriesReached'));
        resetBackoff(); // Reset attempts for future manual connection
      }
    };
    
  } catch (error) { // Catches errors from `new EventSource(url)` itself
    logger.error('SSE: Failed to create EventSource instance (e.g., network issue, invalid URL):', error);
    currentPingHandler = null; // Ensure cleared if addEventListener failed
    if (eventSource) { // Defensive: ensure eventSource is null if creation failed badly
        eventSource.close();
        eventSource = null;
    }

    if (onError) {
      onError(new Event('EventSourceCreationError'));
    }

    // Fallback retry for EventSource creation failure
    if (!isIntentionalClose) { // Only retry if not an intentional close
        const backoffTime = getBackoffTime();
        if (backoffTime > 0) {
          logger.info(`SSE: EventSource creation failed. Retrying in ${backoffTime}ms...`);
          if (reconnectionTimeoutId) clearTimeout(reconnectionTimeoutId);
          reconnectionTimeoutId = setTimeout(() => {
            reconnectionTimeoutId = null;
            const currentConsultationIdForRetry = getConsultationId();
            if (currentConsultationIdForRetry === connectionConsultationId && !eventSource) { // Check ID and if eventSource is still null
              connectToEventStream(onEvent, onError, onOpen);
            } else {
              logger.info('SSE: Aborting retry for EventSource creation due to changed conditions.');
              resetBackoff();
            }
          }, backoffTime);
        } else {
          logger.error('SSE: Max reconnection attempts for EventSource creation reached.');
          if (onError) onError(new Event('MaxRetriesReachedEventSourceCreation'));
          resetBackoff();
        }
    }
  }
};

/**
 * Disconnects from the Server-Sent Events stream.
 */
export function disconnectEventStream(): void {
  logger.info('SSE: disconnectEventStream called.');
  isIntentionalClose = true; // Set flag to indicate this is a deliberate disconnection

  if (reconnectionTimeoutId) { // Clear any pending reconnection attempts
    clearTimeout(reconnectionTimeoutId);
    reconnectionTimeoutId = null;
    logger.info('SSE: Cleared pending reconnection attempt due to disconnect.');
  }

  if (eventSource) {
    logger.info('SSE: Intentionally closing active event stream.');
    eventSource.onopen = null;
    eventSource.onmessage = null;
    eventSource.onerror = null;
    if (currentPingHandler) {
      eventSource.removeEventListener('ping', currentPingHandler);
      currentPingHandler = null;
    }
    eventSource.close();
    eventSource = null;
  } else {
    logger.info('SSE: No active event stream to disconnect.');
  }
  // resetBackoff(); // Consider if backoff attempts should always be reset on manual disconnect
  // Keeping attempts means if user disconnects/reconnects quickly to a still problematic source,
  // it will continue backoff. Resetting means it starts fresh.
  // For now, let onopen reset backoff for a "successful" connection.
}

/**
 * Fetches test requisition data for the current consultation.
 * @returns Promise<TestRequisitionData | null> - The requisition data or null if not found/error.
 */
export async function fetchRequisitionData(): Promise<TestRequisitionData | null> {
  const consultationId = getConsultationId();
  if (!consultationId) {
    logger.warn('fetchRequisitionData: No consultation ID found.');
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/consultation/${consultationId}/requisition-data`);
    if (!response.ok) {
      if (response.status === 404) {
        logger.warn(`fetchRequisitionData: No requisition data found for consultation ${consultationId} (404).`);
        return null;
      }
      throw new Error(`Failed to fetch requisition data: ${response.status}`);
    }
    const data: TestRequisitionData = await response.json();
    logger.info('fetchRequisitionData: Requisition data fetched successfully.', data);
    return data;
  } catch (error) {
    logger.error('fetchRequisitionData: Error fetching requisition data:', error);
    return null;
  }
}

