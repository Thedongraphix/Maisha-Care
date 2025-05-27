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

  try {
    // This timeout is client-to-OUR-chat-proxy.
    // The proxy itself has a timeout for communication with the AI_BASE_URL.
    const controller = new AbortController();
    const clientToProxyTimeoutId = setTimeout(() => {
        logger.warn('chatService: Timeout sending request to our Next.js proxy /api/proxy/chat');
        controller.abort('ClientToProxyTimeout');
    }, 35000); // e.g., 35s, slightly longer than AI_RESPONSE_TIMEOUT in proxy

    const response = await fetch(`${API_BASE_URL}/chat`, { // API_BASE_URL is /api/proxy
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(clientToProxyTimeoutId);
    logger.debug(`chatService: Proxy response status: ${response.status}`);

    const data: ChatResponse = await response.json();
    logger.debug('chatService: Received data from proxy:', data);

    // Always update consultation ID if received, regardless of status
    if (data.consultation_id && data.consultation_id !== currentConsultationId) {
      setConsultationId(data.consultation_id);
      logger.info(`chatService: Consultation ID updated to ${data.consultation_id}`);
    } else if (data.consultation_id && !currentConsultationId) {
      setConsultationId(data.consultation_id);
      logger.info(`chatService: New consultation ID set: ${data.consultation_id}`);
    }


    if (response.status === 202) {
      // Proxy signaled background processing (file upload or AI thinking timeout)
      return {
        ...data, // Contains consultation_id, stage, next_steps, status_detail
        message: '', // Ensure no message is displayed in chat log for this
        _isBackgroundProcessing: true 
      };
    }

    if (!response.ok) {
      // Handle errors relayed from the AI backend by the proxy (e.g., 4xx, 5xx)
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

    // This is a direct, successful response from the AI via the proxy (HTTP 200)
    return data;

  } catch (error: any) {
    logger.error('chatService.sendMessage: CATCH block error:', error);
    if (error.message === 'ClientToProxyTimeout') {
      logger.warn('chatService: Request to Next.js proxy timed out.');
      return {
        consultation_id: currentConsultationId, // Use existing ID
        message: '', 
        stage: 'processing_error', // Indicate a local problem
        next_steps: 'Experiencing connection issues. Please wait or try again.',
        _isBackgroundProcessing: true, // Let UI show a persistent status
        status_detail: 'client_proxy_timeout'
      };
    }
    // For other errors (network, JSON parsing, etc.)
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
    eventSource.close(); // This should trigger its onerror if it was open, then our logic continues
    eventSource = null;
  }

  const consultationId = getConsultationId();
  if (!consultationId) {
    logger.warn('SSE: No consultation ID, cannot connect.');
    if (onError) onError(new Event('NoConsultationID'));
    return;
  }

  const url = `${API_BASE_URL}/consultation/${consultationId}/events`;
  logger.info(`SSE: Attempting to connect to: ${url} (Attempt: ${reconnectAttempt + 1})`);
  
  try {
    eventSource = new EventSource(url);
    
    eventSource.onopen = () => {
      logger.info('SSE: Connection opened successfully.');
      resetBackoff(); // Reset attempts on successful opening
      if (onOpen) onOpen();
    };

    eventSource.onmessage = (event: MessageEvent) => {
      // Raw comment pings from server (e.g., ": ping - ...") are not delivered here by EventSource.
      // They are comments in the SSE protocol.
      // EventSource only delivers messages that start with "data:", "id:", or "event:".
      try {
        const eventData: WorkflowEvent = JSON.parse(event.data);
        // logger.debug('SSE: Message event (event.data):', event.data);
        onEvent(eventData);
      } catch (error) {
        logger.error('SSE: Error parsing non-JSON data in onmessage or malformed WorkflowEvent JSON:', { data: event.data, error });
        // It's possible the server sends a non-JSON string as a "message" event.
        // If so, onEvent should be prepared or we should filter here.
        // For now, we assume valid WorkflowEvent JSON for "message" events.
      }
    };
    
    eventSource.addEventListener('ping', (event: MessageEvent) => {
        // This handles events explicitly named "ping" by the server: `event: ping\ndata: {...}\n\n`
        try {
            const pingData = JSON.parse(event.data); // As per your example, ping data is JSON
            logger.debug('SSE: Received named "ping" event with data:', pingData);
            // Can be used to confirm liveness if needed.
        } catch (error) {
            logger.error('SSE: Error parsing JSON data for named "ping" event:', { data: event.data, error });
        }
    });

    eventSource.onerror = (errorEvent: Event) => {
      logger.error('SSE: Connection error occurred.', { errorEvent, readyState: eventSource?.readyState });
      
      if (onError) {
        onError(errorEvent); // Notify the component immediately
      }
      
      // If the EventSource is closed, it means the connection is truly gone.
      // This could be due to the 5-min server timeout, network error, SSL error during close, etc.
      if (eventSource && eventSource.readyState === EventSource.CLOSED) {
        const currentEventSourceInstance = eventSource; // Capture instance before nulling
        eventSource = null; // Important: nullify to allow new EventSource creation

        // Prevent event listeners from being called on the old, closed instance
        currentEventSourceInstance.onopen = null;
        currentEventSourceInstance.onmessage = null;
        currentEventSourceInstance.onerror = null;
        currentEventSourceInstance.removeEventListener('ping', ()=>{}); // Crude way to remove, better to store handler


        const backoffTime = getBackoffTime();
        if (backoffTime > 0) {
          logger.info(`SSE: Connection closed. Attempting to reconnect in ${backoffTime}ms (attempt ${reconnectAttempt} of ${MAX_RECONNECT_ATTEMPTS})...`);
          setTimeout(() => {
            // Check if a consultation is still active and no new EventSource has been created in the meantime
            if (getConsultationId() && !eventSource) { 
              connectToEventStream(onEvent, onError, onOpen);
            } else {
              logger.info('SSE: Reconnection aborted; consultation ID changed or new EventSource already active.');
            }
          }, backoffTime);
        } else {
          logger.error('SSE: Max reconnection attempts reached. Giving up on automatic reconnections.');
          if (onError) onError(new Event('MaxRetriesReached')); 
        }
      } else {
        // If readyState is CONNECTING, the browser is likely handling retries internally.
        // If readyState is OPEN but an error occurred, it might be a non-fatal issue.
        logger.warn('SSE: Error event received, but connection not in CLOSED state. Current readyState: ' + eventSource?.readyState);
      }
    };
    
  } catch (error) { // This catches errors during `new EventSource(url)`
    logger.error('SSE: Failed to create EventSource instance:', error);
    if (onError) {
      onError(new Event('EventSourceCreationError'));
    }
    // Attempt retry if EventSource creation itself fails
    const backoffTime = getBackoffTime();
    if (backoffTime > 0) {
        logger.info(`SSE: EventSource creation failed. Retrying in ${backoffTime}ms...`);
        setTimeout(() => {
            if (getConsultationId()) {
                connectToEventStream(onEvent, onError, onOpen);
            }
        }, backoffTime);
    } else {
        logger.error('SSE: Max reconnection attempts for EventSource creation reached.');
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
    // eventSource.removeEventListener('ping', specificPingHandler); // If you store the handler
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

