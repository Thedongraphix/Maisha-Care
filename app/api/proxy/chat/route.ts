import { NextRequest, NextResponse } from 'next/server';
import logger from '@/utils/logger'; // Import the logger

// Configure maximum duration for this function (60 seconds for Pro plan)
export const maxDuration = 60;

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

const API_BASE_URL = 'https://v2deployment-production.up.railway.app';
const AI_RESPONSE_TIMEOUT = 28000; // 28 seconds for AI to respond to a regular message

/**
 * Handle POST requests to the chat endpoint
 */
export async function POST(request: NextRequest) {
  let clientConsultationId: string | null = null;
  try {
    const formData = await request.formData();
    clientConsultationId = formData.get('consultation_id') as string | null;

    const backendFormData = new FormData();
    const entries = Array.from(formData.entries());
    for (const [key, value] of entries) {
      backendFormData.append(key, value);
    }
    
    const hasFile = formData.has('file');
    
    if (hasFile) {
      logger.info(`Chat Proxy: File upload detected for consultation: ${clientConsultationId}. Sending to backend non-blockingly.`);
      
      // Fix: Add timeout and abort mechanism for background file upload
      const backgroundController = new AbortController();
      const backgroundTimeoutId = setTimeout(() => {
        logger.warn(`Chat Proxy: Background file upload timeout for consultation: ${clientConsultationId}`);
        backgroundController.abort();
      }, 15000); // 15 seconds timeout
      
      // Send to backend but don't wait for the full response from the AI here.
      // The AI backend itself should handle the file and then trigger SSE events.
      fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        body: backendFormData,
        signal: backgroundController.signal,
      }).then(() => {
        clearTimeout(backgroundTimeoutId);
        logger.info(`Chat Proxy: Background file upload completed for consultation: ${clientConsultationId}`);
      }).catch(error => {
        clearTimeout(backgroundTimeoutId);
        // Log error, but the client has already received a 202.
        if (error.name === 'AbortError') {
          logger.warn(`Chat Proxy: Background file upload aborted (timeout) for consultation: ${clientConsultationId}`);
        } else {
          logger.error('Chat Proxy: Background file upload to AI backend failed:', error);
        }
      });
      
      // Return 202 Accepted: Client should now wait for SSE events for test_analysis workflow
      return NextResponse.json({
        consultation_id: clientConsultationId,
        status_detail: 'file_processing_initiated',
        message: '', // No direct message for chat UI
        stage: 'processing_file', // A more specific stage for client UI
        next_steps: 'Your file is being analyzed. I will notify you.'
      }, { status: 202 });
    }
    
    // For regular messages, wait for the AI response but with a timeout
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
      const errorData = await aiResponse.json().catch(() => ({ detail: `AI backend HTTP error: ${aiResponse.status}` }));
      logger.error(`Chat Proxy: AI backend returned error ${aiResponse.status}:`, errorData);
      return NextResponse.json(errorData, { status: aiResponse.status });
    }
    
    const data = await aiResponse.json();
    logger.info(`Chat Proxy: Received direct AI response for ${clientConsultationId}:`, data);
    return NextResponse.json(data);
    
  } catch (error: any) {
    logger.error('Chat Proxy: Error in POST handler:', error);
    
    if (error.name === 'AbortError') {
      // This means the AI_RESPONSE_TIMEOUT was hit for a regular message
      logger.warn(`Chat Proxy: AbortError (AI timeout) for consultation: ${clientConsultationId}`);
      return NextResponse.json({
        consultation_id: clientConsultationId,
        status_detail: 'ai_response_timeout',
        message: '', // No direct message for chat UI
        stage: 'processing_message', // A stage to indicate AI is still thinking
        next_steps: 'The AI is taking a moment to process your request...'
      }, { status: 202 }); // 202 Accepted, client should expect SSE
    }
    
    return NextResponse.json({ detail: 'Chat proxy internal server error' }, { status: 500 });
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