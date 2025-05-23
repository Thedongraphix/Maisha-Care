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

  // Clear any existing proactive reconnect timer
  if (proactiveReconnectTimer) {
    clearTimeout(proactiveReconnectTimer);
    proactiveReconnectTimer = null;
  }

  // For SSE, we need to use the direct API URL since proxy doesn't support EventSource
  const DIRECT_API_URL = 'https://v2deployment-production.up.railway.app';
  logger.info(`SSE: Connecting to ${DIRECT_API_URL}/consultation/${consultationId}/events`);
  eventSource = new EventSource(`${DIRECT_API_URL}/consultation/${consultationId}/events`);

  eventSource.onopen = () => {
    logger.info('SSE: Connection established.');
    resetBackoff();
    connectionStartTime = Date.now();
    
    // Schedule proactive reconnection before Railway's 5-minute timeout
    // Reconnect at 4 minutes 30 seconds to be safe
    const PROACTIVE_RECONNECT_TIME = 4.5 * 60 * 1000; // 4.5 minutes
    proactiveReconnectTimer = setTimeout(() => {
      logger.info('SSE: Proactively reconnecting before timeout...');
      disconnectEventStream();
      // Small delay before reconnecting
      setTimeout(() => connectToEventStream(onMessage, onError), 100);
    }, PROACTIVE_RECONNECT_TIME);
  };

  eventSource.onmessage = (event) => {
    try {
      const eventData: WorkflowEvent = JSON.parse(event.data);
      
      // Log ALL events for debugging
      logger.debug('SSE: Raw event received:', {
        type: eventData.event_type,
        workflow: eventData.workflow_name,
        message: eventData.message?.substring(0, 50), // First 50 chars
        time: new Date().toISOString()
      });
      
      // Check for various heartbeat formats
      const isHeartbeat = 
        eventData.event_type === 'HEARTBEAT' || 
        eventData.workflow_name === 'heartbeat' || 
        eventData.workflow_name === 'ping' ||
        eventData.message === 'ping' ||
        eventData.message === 'keep-alive' ||
        eventData.message?.toLowerCase().includes('heartbeat');
        
      if (isHeartbeat) {
        logger.info('SSE: Heartbeat detected at', new Date().toISOString());
        return;
      }
      
      onMessage(eventData);
    } catch (error) {
      logger.error('SSE: Error parsing event data:', error, 'Raw event:', event.data);
    }
  };

  eventSource.onerror = (errorEvent) => {
    logger.error('SSE: Connection error:', errorEvent);
    
    // Clear proactive reconnect timer
    if (proactiveReconnectTimer) {
      clearTimeout(proactiveReconnectTimer);
      proactiveReconnectTimer = null;
    }
    
    eventSource?.close();
    
    if (onError) {
      onError(errorEvent);
    }
    
    // Implement exponential backoff for reconnection
    const backoffTime = getBackoffTime();
    if (backoffTime !== -1) {
      logger.info(`SSE: Retrying connection in ${backoffTime / 1000}s...`);
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

