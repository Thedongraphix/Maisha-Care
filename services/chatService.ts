import logger from '@/utils/logger';

// Define the API URLs
const API_PROXY = '/api/proxy';
const DIRECT_API = 'https://ai-engine-production-487a.up.railway.app'; 

// API response types
export interface AIResponse {
  consultation_id: string;
  message: string;
  stage?: string;
  next_steps?: string;
}

// Extended response for file uploads
export interface FileUploadResponse extends AIResponse {
  fileUrl?: string;
  file_url?: string;
}

/**
 * Send a message to the AI API
 * @param message - The user's message
 * @param consultationId - Optional consultation ID for continuing a conversation
 * @returns Promise<AIResponse> - The AI's response
 */
export async function sendMessageToAPI(message: string, consultationId?: string | null): Promise<AIResponse> {
  logger.debug('Sending message to API:', message);
  logger.debug('Using consultation ID:', consultationId);
  
  // Create payload - initially try with the provided consultation ID
  let payload = {
    message,
    consultation_id: consultationId
  };
  
  // First try using the proxy
  try {
    logger.debug('Attempting to send message via proxy...');
    
    let response = await fetch(`${API_PROXY}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    logger.debug('Proxy response status:', response.status);
    
    // If we get a 404/500 specifically about consultation not found, retry without the ID
    if (response.status === 500 || response.status === 404) {
      const errorData = await response.json();
      logger.warn('Error response:', errorData);
      
      // Check if it's a consultation not found error
      if (
        errorData.detail && 
        (errorData.detail.includes('Consultation') || errorData.detail.includes('consultation')) && 
        errorData.detail.includes('not found')
      ) {
        logger.info('Consultation not found, starting a new session');
        
        // Clear the stored consultation ID
        if (typeof window !== 'undefined') {
          localStorage.removeItem('maisha_consultation_id');
        }
        
        // Create a new payload with the consultation_id set to null
        payload = { 
          message,
          consultation_id: null 
        };
        
        // Try again with the new payload
        response = await fetch(`${API_PROXY}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
        
        logger.debug('New session response status:', response.status);
      }
    }
    
    if (response.ok) {
      const data = await response.json();
      logger.debug('Received response via proxy:', data);
      return data;
    } else {
      logger.warn('Proxy request failed with status:', response.status);
      throw new Error(`Proxy request failed with status: ${response.status}`);
    }
  } catch (proxyError) {
    logger.error('Error with proxy request:', proxyError);
    
    // If proxy fails, try direct connection
    logger.info('Trying direct connection...');
    
    try {
      // For direct connection, use the latest payload (which may have removed the consultation_id if it was invalid)
      const directResponse = await fetch(`${DIRECT_API}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      logger.debug('Direct API response status:', directResponse.status);
      
      if (directResponse.ok) {
        const data = await directResponse.json();
        logger.debug('Received response via direct connection:', data);
        return data;
      } else {
        throw new Error(`Direct API request failed with status: ${directResponse.status}`);
      }
    } catch (directError) {
      logger.error('Error with direct API request:', directError);
      throw new Error('Failed to communicate with the AI service');
    }
  }
}

/**
 * Upload a file to the AI API
 * @param file - The file to upload
 * @param consultationId - Optional consultation ID for continuing a conversation
 * @returns Promise<FileUploadResponse> - The AI's response including file information
 */
export async function uploadFileToAPI(file: File, consultationId?: string | null): Promise<FileUploadResponse> {
  logger.debug('Uploading file to API:', file.name);
  logger.debug('Using consultation ID:', consultationId);
  
  // Create form data
  const formData = new FormData();
  formData.append('file', file);
  
  if (consultationId) {
    formData.append('consultation_id', consultationId);
  }
  
  // First try using the proxy
  try {
    logger.debug('Attempting to upload file via proxy...');
    
    const response = await fetch(`${API_PROXY}/upload`, {
      method: 'POST',
      body: formData
    });
    
    logger.debug('Proxy upload response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      logger.debug('Received upload response via proxy:', data);
      return data;
    } else {
      logger.warn('Proxy upload request failed with status:', response.status);
      throw new Error(`Proxy upload request failed with status: ${response.status}`);
    }
  } catch (proxyError) {
    logger.error('Error with proxy upload request:', proxyError);
    
    // If proxy fails, try direct connection
    logger.info('Trying direct upload connection...');
    
    try {
      const directResponse = await fetch(`${DIRECT_API}/upload`, {
        method: 'POST',
        body: formData
      });
      
      logger.debug('Direct API upload response status:', directResponse.status);
      
      if (directResponse.ok) {
        const data = await directResponse.json();
        logger.debug('Received upload response via direct connection:', data);
        return data;
      } else {
        throw new Error(`Direct API upload request failed with status: ${directResponse.status}`);
      }
    } catch (directError) {
      logger.error('Error with direct API upload request:', directError);
      throw new Error('Failed to upload file to the AI service');
    }
  }
} 