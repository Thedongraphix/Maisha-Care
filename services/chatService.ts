import logger from '@/utils/logger';
import { API_BASE_URL } from '@/utils/constants';

// API response types from integration.md
export interface ChatResponse {
  consultation_id: string;
  message: string;
  stage: string;
  next_steps?: string;
}

export interface WorkflowEvent {
  consultation_id: string;
  event_type: 'WORKFLOW_START' | 'WORKFLOW_PROGRESS' | 'WORKFLOW_COMPLETE' | 'WORKFLOW_ERROR';
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
 * @param onMessage - Callback function to handle incoming WorkflowEvent messages.
 * @param onError - Optional callback function to handle SSE errors.
 */
export function connectToEventStream(
  onMessage: (event: WorkflowEvent) => void,
  onError?: (error: Event) => void
): void {
  const consultationId = getConsultationId();
  if (!consultationId) {
    logger.warn('SSE: No consultation ID, cannot connect.');
    return;
  }

  if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
    logger.warn('SSE: Connection already open or connecting.');
    return;
  }

  logger.log(`SSE: Connecting to ${API_BASE_URL}/consultation/${consultationId}/events`);
  eventSource = new EventSource(`${API_BASE_URL}/consultation/${consultationId}/events`);

  eventSource.onopen = () => {
    logger.log('SSE: Connection established.');
    resetBackoff();
  };

  eventSource.onmessage = (event) => {
    try {
      const eventData: WorkflowEvent = JSON.parse(event.data);
      logger.debug('SSE: Received event:', eventData);
      onMessage(eventData); // Pass parsed data to the callback
    } catch (error) {
      logger.error('SSE: Error parsing event data:', error);
    }
  };

  eventSource.onerror = (errorEvent) => {
    logger.error('SSE: Connection error:', errorEvent);
    eventSource?.close(); 
    if (onError) {
      onError(errorEvent);
    }
    const backoffTime = getBackoffTime();
    if (backoffTime !== -1) {
      logger.log(`SSE: Retrying connection in ${backoffTime / 1000}s...`);
      setTimeout(() => connectToEventStream(onMessage, onError), backoffTime);
      } else {
        logger.error('SSE: Stopped retrying after max attempts.');
    }
  };
}

/**
 * Disconnects from the Server-Sent Events stream.
 */
export function disconnectEventStream(): void {
  if (eventSource) {
    logger.log('SSE: Disconnecting...');
    eventSource.close();
    eventSource = null;
    resetBackoff(); // Reset backoff attempts when explicitly disconnecting
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