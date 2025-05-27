import { NextRequest, NextResponse } from 'next/server';
import logger from '@/utils/logger'; // Import the logger

// Configure maximum duration for this function (60 seconds for Pro plan)
export const maxDuration = 60;

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

// Use environment variable with fallback
const API_BASE_URL = process.env.AI_BACKEND_URL || 'https://v2deployment-production.up.railway.app';
const AI_RESPONSE_TIMEOUT = 240000; // 4 minutes (was 28 seconds)
const FILE_UPLOAD_TIMEOUT = 15000; // 15 seconds for file upload

// Track active uploads for potential cleanup/status
const activeUploads = new Map<string, AbortController>();

/**
 * Handle POST requests to the chat endpoint
 */
export async function POST(request: NextRequest) {
  let clientConsultationId: string | null = null;
  
  try {
    const formData = await request.formData();
    clientConsultationId = formData.get('consultation_id') as string | null;

    // Basic validation
    if (clientConsultationId && !/^[a-f0-9-]{36}$/i.test(clientConsultationId)) {
      logger.warn(`Chat Proxy: Invalid consultation ID format: ${clientConsultationId}`);
      return NextResponse.json(
        { detail: 'Invalid consultation ID format' },
        { status: 400 }
      );
    }

    const backendFormData = new FormData();
    const entries = Array.from(formData.entries());
    for (const [key, value] of entries) {
      backendFormData.append(key, value);
    }
    
    const hasFile = formData.has('file');
    
    if (hasFile) {
      logger.info(`Chat Proxy: File upload detected for consultation: ${clientConsultationId}`);
      
      // Create a unique upload ID
      const uploadId = `${clientConsultationId}-${Date.now()}`;
      const backgroundController = new AbortController();
      
      // Track this upload
      activeUploads.set(uploadId, backgroundController);
      
      const backgroundTimeoutId = setTimeout(() => {
        logger.warn(`Chat Proxy: Background file upload timeout for consultation: ${clientConsultationId}`);
        backgroundController.abort();
        activeUploads.delete(uploadId);
      }, FILE_UPLOAD_TIMEOUT);
      
      // Send to backend with better error handling
      fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        body: backendFormData,
        signal: backgroundController.signal,
      }).then(async (response) => {
        clearTimeout(backgroundTimeoutId);
        activeUploads.delete(uploadId);
        
        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          logger.error(`Chat Proxy: Background file upload failed with status ${response.status}: ${errorText}`);
          // Consider sending an error event through a separate channel (e.g., webhook, database)
        } else {
          logger.info(`Chat Proxy: Background file upload completed successfully for consultation: ${clientConsultationId}`);
        }
      }).catch(error => {
        clearTimeout(backgroundTimeoutId);
        activeUploads.delete(uploadId);
        
        if (error.name === 'AbortError') {
          logger.warn(`Chat Proxy: Background file upload aborted (timeout) for consultation: ${clientConsultationId}`);
        } else {
          logger.error('Chat Proxy: Background file upload to AI backend failed:', error);
        }
        // Consider implementing a dead letter queue or notification system
      });
      
      // Return 202 with more detailed status
      return NextResponse.json({
        consultation_id: clientConsultationId,
        status_detail: 'file_processing_initiated',
        message: '',
        stage: 'processing_file',
        next_steps: 'Your file is being analyzed. I will notify you shortly.',
        upload_id: uploadId // Can be used for status checking if needed
      }, { status: 202 });
    }
    
    // For regular messages, wait for the AI response
    logger.info(`Chat Proxy: Regular message for consultation: ${clientConsultationId}. Awaiting AI response.`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      logger.warn(`Chat Proxy: AI response timeout for consultation: ${clientConsultationId}`);
      controller.abort();
    }, AI_RESPONSE_TIMEOUT);
    
    const aiResponse = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      body: backendFormData,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!aiResponse.ok) {
      const errorData = await aiResponse.json().catch(() => ({ 
        detail: `AI backend HTTP error: ${aiResponse.status}` 
      }));
      logger.error(`Chat Proxy: AI backend returned error ${aiResponse.status}:`, errorData);
      
      // Ensure consistent error format
      const errorResponse = {
        detail: errorData.detail || errorData.message || `AI service error: ${aiResponse.status}`,
        consultation_id: clientConsultationId,
        status_code: aiResponse.status
      };
      
      return NextResponse.json(errorResponse, { status: aiResponse.status });
    }
    
    const data = await aiResponse.json();
    logger.info(`Chat Proxy: Received direct AI response for ${clientConsultationId}`);
    return NextResponse.json(data);
    
  } catch (error: any) {
    logger.error('Chat Proxy: Error in POST handler:', error);
    
    if (error.name === 'AbortError') {
      logger.warn(`Chat Proxy: AbortError (AI timeout) for consultation: ${clientConsultationId}`);
      return NextResponse.json({
        consultation_id: clientConsultationId,
        status_detail: 'ai_response_timeout',
        message: '',
        stage: 'processing_message',
        next_steps: 'The AI is taking a moment to process your request...'
      }, { status: 202 });
    }
    
    // Consistent error format
    return NextResponse.json({ 
      detail: error.message || 'Chat proxy internal server error',
      consultation_id: clientConsultationId,
      error_type: error.name || 'UnknownError'
    }, { status: 500 });
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Cleanup function for server shutdown (if needed)
export function cleanup() {
  // Abort all active uploads
  activeUploads.forEach((controller, uploadId) => {
    logger.info(`Cleanup: Aborting upload ${uploadId}`);
    controller.abort();
  });
  activeUploads.clear();
} 