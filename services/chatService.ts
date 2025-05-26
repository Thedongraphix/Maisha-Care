import logger from '@/utils/logger';

// Use proxy routes instead of direct API calls
const API_BASE_URL = '/api/proxy';

// API response types from integration.md
export interface ChatResponse {
  consultation_id: string;
  message: string;
  stage: string;
  next_steps?: string;
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
 * @param messageText - The user's message text
 * @param fileToUpload - Optional file to upload
 * @returns Promise<ChatResponse> - The AI's response
 */
export async function sendMessage(messageText: string, fileToUpload?: File): Promise<ChatResponse> {
  logger.debug('Sending message to API:', messageText, fileToUpload ? `with file: ${fileToUpload.name}` : '');
  const consultationId = getConsultationId();
  logger.debug('Using consultation ID:', consultationId);
  
  const formData = new FormData();
  formData.append('message', messageText);

  if (consultationId) {
    formData.append('consultation_id', consultationId);
  }

  if (fileToUpload) {
    formData.append('file', fileToUpload);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      body: formData,
      // Do not set Content-Type header manually for FormData
    });

    logger.debug('API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: `HTTP error: ${response.status}` }));
      // Attempt to clear consultation ID if it's a "not found" error, then rethrow for UI handling.
      if (response.status === 404 && errorData.detail && errorData.detail.toLowerCase().includes('consultation not found')) {
        logger.warn('Consultation not found on server. Clearing local ID.');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('maisha_consultation_id');
        }
      }
      throw new Error(errorData.detail || `Error: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    logger.debug('Received response from API:', data);

    if (data.consultation_id) {
      setConsultationId(data.consultation_id);
    }

    return data;
  } catch (error) {
    logger.error('Error sending message to API:', error);
    // Re-throw the error so the component can handle it (e.g., display to user)
    throw error instanceof Error ? error : new Error('Failed to communicate with the AI service');
  }
}

let eventSource: EventSource | null = null;
let reconnectAttempt = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const BASE_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30000;
let connectionStartTime = Date.now();
let proactiveReconnectTimer: NodeJS.Timeout | null = null;

function getBackoffTime(): number {
  if (reconnectAttempt >= MAX_RECONNECT_ATTEMPTS) {
    logger.error("SSE: Max reconnection attempts reached.");
    return -1; // Indicate no more retries
  }
  const delay = Math.min(BASE_RECONNECT_DELAY * Math.pow(2, reconnectAttempt), MAX_RECONNECT_DELAY);
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
  onError?: (error: Event) => void
) => {
  if (eventSource) {
    logger.info('Closing existing SSE connection before creating new one');
    eventSource.close();
  }

  const consultationId = getConsultationId();
  if (!consultationId) {
    logger.warn('No consultation ID found for SSE connection');
    return;
  }

  const url = `${API_BASE_URL}/consultation/${consultationId}/events`;
  logger.info('Connecting to SSE:', url);
  
  try {
    eventSource = new EventSource(url);
    connectionStartTime = Date.now();
    
    eventSource.onopen = () => {
      logger.info('SSE connection opened successfully');
      resetBackoff();
    };

    eventSource.onmessage = (event) => {
      try {
        const eventData: WorkflowEvent = JSON.parse(event.data);
        logger.info('SSE message event received:', eventData);
        
        // Handle timeout warning specially
        if (eventData.workflow_name === 'connection' && 
            eventData.message?.includes('timeout soon')) {
          logger.warn('SSE connection timeout warning received');
          // Could trigger a proactive reconnect here if needed
        }
        
        onEvent(eventData);
      } catch (error) {
        logger.error('Error parsing SSE event:', error);
      }
    };

    eventSource.onerror = (error) => {
      logger.error('SSE connection error:', error);
      logger.info(`SSE readyState: ${eventSource?.readyState}`);
      
      if (onError) {
        onError(error);
      }
      
      // Add automatic reconnection logic with backoff
      if (eventSource?.readyState === EventSource.CLOSED) {
        const backoffTime = getBackoffTime();
        if (backoffTime > 0) {
          logger.info(`SSE connection closed, attempting to reconnect in ${backoffTime}ms...`);
          setTimeout(() => {
            if (getConsultationId()) {
              connectToEventStream(onEvent, onError);
            }
          }, backoffTime);
        } else {
          logger.error('Max reconnection attempts reached for SSE');
        }
      }
    };

    // Handle ping events - these come as a separate event type
    eventSource.addEventListener('ping', (event: MessageEvent) => {
      try {
        const pingData = JSON.parse(event.data);
        logger.debug('SSE ping received:', pingData);
        
        // Log connection health
        if (pingData.connection_duration) {
          logger.debug(`Connection healthy - Duration: ${pingData.connection_duration}, Last activity: ${pingData.last_activity}`);
        }
      } catch (error) {
        logger.error('Error parsing ping event:', error);
      }
    });
    
    // Log connection duration periodically
    const logInterval = setInterval(() => {
      if (eventSource && eventSource.readyState === EventSource.OPEN) {
        const duration = Date.now() - connectionStartTime;
        logger.debug(`SSE connection alive for ${Math.floor(duration / 1000)}s`);
      } else {
        clearInterval(logInterval);
      }
    }, 30000); // Log every 30 seconds
    
  } catch (error) {
    logger.error('Failed to create EventSource:', error);
    if (onError) {
      onError(new Event('connection-failed'));
    }
  }
};

/**
 * Disconnects from the Server-Sent Events stream.
 */
export function disconnectEventStream(): void {
  if (eventSource) {
    logger.info('SSE: Disconnecting...');
    eventSource.close();
    eventSource = null;
    resetBackoff();
    
    // Clear proactive reconnect timer
    if (proactiveReconnectTimer) {
      clearTimeout(proactiveReconnectTimer);
      proactiveReconnectTimer = null;
    }
  }
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

