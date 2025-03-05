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
  console.log('Sending message to API:', message);
  console.log('Using consultation ID:', consultationId);
  
  // Create payload
  const payload = {
    message,
    consultation_id: consultationId
  };
  
  // First try using the proxy
  try {
    console.log('Attempting to send message via proxy...');
    
    const response = await fetch(`${API_PROXY}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    console.log('Proxy response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Received response via proxy:', data);
      return data;
    } else {
      console.log('Proxy request failed with status:', response.status);
      throw new Error(`Proxy request failed with status: ${response.status}`);
    }
  } catch (proxyError) {
    console.error('Error with proxy request:', proxyError);
    
    // If proxy fails, try direct connection
    console.log('Trying direct connection...');
    
    try {
      const directResponse = await fetch(`${DIRECT_API}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      console.log('Direct API response status:', directResponse.status);
      
      if (directResponse.ok) {
        const data = await directResponse.json();
        console.log('Received response via direct connection:', data);
        return data;
      } else {
        throw new Error(`Direct API request failed with status: ${directResponse.status}`);
      }
    } catch (directError) {
      console.error('Error with direct API request:', directError);
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
  console.log('Uploading file to API:', file.name);
  console.log('Using consultation ID:', consultationId);
  
  // Create form data
  const formData = new FormData();
  formData.append('file', file);
  
  if (consultationId) {
    formData.append('consultation_id', consultationId);
  }
  
  // First try using the proxy
  try {
    console.log('Attempting to upload file via proxy...');
    
    const response = await fetch(`${API_PROXY}/upload`, {
      method: 'POST',
      body: formData
    });
    
    console.log('Proxy upload response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Received upload response via proxy:', data);
      return data;
    } else {
      console.log('Proxy upload request failed with status:', response.status);
      throw new Error(`Proxy upload request failed with status: ${response.status}`);
    }
  } catch (proxyError) {
    console.error('Error with proxy upload request:', proxyError);
    
    // If proxy fails, try direct connection
    console.log('Trying direct upload connection...');
    
    try {
      const directResponse = await fetch(`${DIRECT_API}/upload`, {
        method: 'POST',
        body: formData
      });
      
      console.log('Direct API upload response status:', directResponse.status);
      
      if (directResponse.ok) {
        const data = await directResponse.json();
        console.log('Received upload response via direct connection:', data);
        return data;
      } else {
        throw new Error(`Direct API upload request failed with status: ${directResponse.status}`);
      }
    } catch (directError) {
      console.error('Error with direct API upload request:', directError);
      throw new Error('Failed to upload file to the AI service');
    }
  }
} 