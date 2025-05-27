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
  reconnectAttempt = 0;
}

// Store ping handler at module level for proper cleanup
let currentPingHandler: ((event: MessageEvent) => void) | null = null;

// Add a flag to prevent reconnection during intentional closure
let isIntentionalClose = false;

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
    isIntentionalClose = true;
    eventSource.close();
    eventSource = null;
    currentPingHandler = null;
    isIntentionalClose = false;
  }

  const consultationId = getConsultationId();
  if (!consultationId) {
    logger.warn('SSE: No consultation ID, cannot connect.');
    if (onError) onError(new Event('NoConsultationID'));
    return;
  }

  // Store the consultation ID at connection time
  const connectionConsultationId = consultationId;
  
  const url = `${API_BASE_URL}/consultation/${consultationId}/events`;
  logger.info(`SSE: Attempting to connect to: ${url} (Attempt: ${reconnectAttempt + 1})`);
  
  try {
    eventSource = new EventSource(url);
    
    eventSource.onopen = () => {
      logger.info('SSE: Connection opened successfully.');
      resetBackoff();
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
          logger.warn('SSE: Connection timeout warning received, preparing to reconnect');
          // Prepare for reconnection but don't close yet
        }
      } catch (error) {
        logger.error('SSE: Error parsing ping event data:', { data: event.data, error });
      }
    };
    
    eventSource.addEventListener('ping', currentPingHandler);

    eventSource.onerror = (errorEvent: Event) => {
      logger.error('SSE: Connection error occurred.', { 
        errorEvent, 
        readyState: eventSource?.readyState,
        isIntentionalClose 
      });
      
      if (onError && !isIntentionalClose) {
        onError(errorEvent);
      }
      
      if (isIntentionalClose) {
        logger.info('SSE: Skipping reconnection due to intentional close.');
        return;
      }
      
      if (eventSource && eventSource.readyState === EventSource.CLOSED) {
        const currentEventSourceInstance = eventSource;
        eventSource = null;

        // Cleanup
        currentEventSourceInstance.onopen = null;
        currentEventSourceInstance.onmessage = null;
        currentEventSourceInstance.onerror = null;
        if (currentPingHandler) {
          currentEventSourceInstance.removeEventListener('ping', currentPingHandler);
          currentPingHandler = null;
        }

        const backoffTime = getBackoffTime();
        if (backoffTime > 0) {
          logger.info(`SSE: Connection closed. Attempting to reconnect in ${backoffTime}ms (attempt ${reconnectAttempt} of ${MAX_RECONNECT_ATTEMPTS})...`);
          
          setTimeout(() => {
            const currentConsultationId = getConsultationId();
            // Only reconnect if it's still the same consultation
            if (currentConsultationId === connectionConsultationId && !eventSource) { 
              logger.info(`SSE: Reconnecting for consultation ${currentConsultationId}`);
              connectToEventStream(onEvent, onError, onOpen);
            } else {
              logger.info(`SSE: Reconnection aborted; consultation changed or new connection established.`);
              resetBackoff();
            }
          }, backoffTime);
        } else {
          logger.error('SSE: Max reconnection attempts reached.');
          // Reset attempts for next manual connection
          resetBackoff();
          if (onError) onError(new Event('MaxRetriesReached')); 
        }
      } else {
        logger.warn('SSE: Error event received, but connection not in CLOSED state. Current readyState: ' + eventSource?.readyState);
      }
    };
    
  } catch (error) {
    logger.error('SSE: Failed to create EventSource instance:', error);
    currentPingHandler = null;
    
    if (onError) {
      onError(new Event('EventSourceCreationError'));
    }
    
    const backoffTime = getBackoffTime();
    if (backoffTime > 0) {
      logger.info(`SSE: EventSource creation failed. Retrying in ${backoffTime}ms...`);
      setTimeout(() => {
        const currentConsultationId = getConsultationId();
        if (currentConsultationId === connectionConsultationId) {
          connectToEventStream(onEvent, onError, onOpen);
        }
      }, backoffTime);
    } else {
      logger.error('SSE: Max reconnection attempts for EventSource creation reached.');
      resetBackoff();
      if (onError) onError(new Event('MaxRetriesReachedEventSourceCreation'));
    }
  }
};

/**
 * Disconnects from the Server-Sent Events stream.
 */
export function disconnectEventStream(): void {
  if (eventSource) {
    logger.info('SSE: Intentionally disconnecting event stream.');
    // Remove listeners before closing to prevent them firing on the old instance during close
    eventSource.onopen = null;
    eventSource.onmessage = null;
    eventSource.onerror = null;
    // Fix: Use the stored handler reference for proper removal
    if (currentPingHandler) {
      eventSource.removeEventListener('ping', currentPingHandler);
      currentPingHandler = null; // Clear the reference after removal
    }
    eventSource.close();
    eventSource = null;
  }
  resetBackoff(); 
}

/**
 * Fetches test requisition data for the current consultation.
 * @returns Promise<TestRequisitionData | null> - The requisition data or null if not found/error.
 */
export async function fetchRequisitionData(): Promise<TestRequisitionData | null> {
  const consultationId = getConsultationId();
  if (!consultationId) {
    logger.warn('fetchRequisitionData: No active consultation ID.');
    return null;
  }

  logger.debug('Fetching test requisition data for consultation ID:', consultationId);
  try {
    const response = await fetch(`${API_BASE_URL}/consultation/${consultationId}/requisition-data`);
    if (!response.ok) {
      if (response.status === 404) {
        logger.info('Test requisition data not yet available.');
        return null;
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error fetching requisition data: ${response.status}`);
    }
    const data: TestRequisitionData = await response.json();
    logger.debug('Received requisition data:', data);
    return data;
  } catch (error) {
    logger.error('Requisition data fetch error:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch requisition data');
  }
}

