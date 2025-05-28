import config from '@/lib/config';

// Define interfaces for API responses
interface HealthCheckResponse {
  isAvailable: boolean;
  error?: string;
  data?: any;
}

interface DirectTestResponse {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Check if the API is available through proxy
 * @returns Promise with health check status
 */
export async function checkAPIHealth(): Promise<HealthCheckResponse> {
  try {
    console.log('Checking API health at:', config.API_PROXY_BASE);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeouts.HEALTH_CHECK);
    
    console.log('Making health check GET request...');
    
    const response = await fetch(`${config.API_PROXY_BASE}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('Health check response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Health check failed with status:', response.status, errorText);
      return { isAvailable: false, error: `Status ${response.status}: ${errorText}` };
    }
    
    const data = await response.json();
    console.log('API health check response:', data);
    return { isAvailable: true, data };
  } catch (error) {
    console.error('API health check failed with error:', error);
    return { 
      isAvailable: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Test connection to the API through our proxy
 * @param testMessage - Optional test message to send
 * @returns Promise with test results
 */
export async function testDirectAPIConnection(testMessage?: string): Promise<DirectTestResponse> {
  try {
    const message = testMessage || "Hello, this is a test message from Maisha Care.";
    
    console.log('Testing API connection with message:', message);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeouts.HEALTH_CHECK);
    
    const response = await fetch(`${config.API_PROXY_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    console.log('Test response status:', response.status);
    
    if (response.ok) {
      const data: AIResponse = await response.json();
      console.log('Test response data:', data);
      
      return {
        success: true,
        data: data
      };
    } else {
      const errorText = await response.text();
      console.error('Test request failed with status:', response.status);
      console.error('Error text:', errorText);
      
      return {
        success: false,
        error: `API returned status ${response.status}: ${errorText}`
      };
    }
  } catch (error) {
    console.error('Test connection error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Types that match the backend schemas
export interface AIResponse {
  consultation_id: string;
  message: string;
  stage: string;
  next_steps?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Core function for sending messages to the AI - SIMPLIFIED to use only proxy
export async function sendMessageToAI(message: string, conversationHistory: Array<{role: 'user' | 'assistant', content: string}>) {
  console.log('Sending message to AI via proxy:', { message, historyLength: conversationHistory.length });
  
  try {
    // Get the consultation ID from localStorage
    const consultationId = getConsultationIdFromHistory(conversationHistory);
    
    const requestBody = {
      message,
      consultation_id: consultationId
    };
    
    console.log('Request payload:', JSON.stringify(requestBody));
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeouts.CHAT_REQUEST);
    
    // Use ONLY proxy route to avoid conflicts
    const response = await fetch(`${config.API_PROXY_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('AI response data:', data);
    
    // Store the consultation_id in localStorage for future use
    if (data.consultation_id) {
      localStorage.setItem('maisha_consultation_id', data.consultation_id);
    }
    
    return {
      message: data.message || "Sorry, I couldn't process your message."
    };
  } catch (error) {
    console.error('Error communicating with AI service:', error);
    throw error;
  }
}

// Helper function to extract consultation ID from conversation history
function getConsultationIdFromHistory(history: Array<{role: 'user' | 'assistant', content: string}>): string | undefined {
  // Check localStorage first
  const storedId = localStorage.getItem('maisha_consultation_id');
  if (storedId) {
    return storedId;
  }
  
  // Otherwise try to find it in the conversation
  for (let i = history.length - 1; i >= 0; i--) {
    const message = history[i];
    if (message.role === 'assistant') {
      const match = message.content.match(/consultation_id["']?:\s*["']([0-9a-f-]+)["']/i);
      if (match && match[1]) {
        return match[1];
      }
    }
  }
  
  return undefined;
}

export async function sendFileToAI(file: File) {
  console.log('Uploading file to AI:', { fileName: file.name, fileType: file.type, fileSize: file.size });
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add consultation ID if available
    const consultationId = localStorage.getItem('maisha_consultation_id');
    if (consultationId) {
      formData.append('consultation_id', consultationId);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeouts.FILE_UPLOAD);
    
    const response = await fetch(`${config.API_PROXY_BASE}/chat`, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('File upload API error response:', errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('File upload response data:', data);
    return data;
  } catch (error) {
    console.error('Error uploading file to AI service:', error);
    throw error;
  }
}

// Additional function to analyze the current consultation case
export async function analyzeCase() {
  const consultationId = localStorage.getItem('maisha_consultation_id');
  if (!consultationId) {
    throw new Error('No active consultation found');
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeouts.HEALTH_CHECK);
    
    const response = await fetch(`${config.API_PROXY_BASE}/analyze-case?consultation_id=${consultationId}`, {
      method: 'POST',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Case analysis error:', errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Case analysis results:', data);
    return data;
  } catch (error) {
    console.error('Error analyzing case:', error);
    throw error;
  }
}

// Function to generate treatment plan
export async function generateTreatmentPlan(doctorNotes?: string) {
  const consultationId = localStorage.getItem('maisha_consultation_id');
  if (!consultationId) {
    throw new Error('No active consultation found');
  }
  
  try {
    const requestBody = {
      consultation_id: consultationId,
      doctor_notes: doctorNotes || '',
      encrypted: false
    };
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeouts.CHAT_REQUEST);
    
    const response = await fetch(`${config.API_PROXY_BASE}/generate-treatment-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Treatment plan generation error:', errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Treatment plan results:', data);
    return data;
  } catch (error) {
    console.error('Error generating treatment plan:', error);
    throw error;
  }
}