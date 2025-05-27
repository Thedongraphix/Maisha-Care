import { NextRequest, NextResponse } from 'next/server';
import logger from '@/utils/logger'; // Import the logger

// Configure maximum duration for this function (60 seconds for Pro plan)
export const maxDuration = 60;

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

// Use environment variable with fallback
const API_BASE_URL = process.env.AI_BACKEND_URL || 'https://v2deployment-production.up.railway.app';
const AI_RESPONSE_TIMEOUT = 240000; // 4 minutes (was 28 seconds)
const FILE_UPLOAD_TIMEOUT = 180000; // 3 minutes for file upload

// Track active uploads for potential cleanup/status
const activeUploads = new Map<string, AbortController>();

/**
 * Handle POST requests to the chat endpoint
 */
export async function POST(request: NextRequest) {
  let clientConsultationId: string | null = null;
  const requestTimestamp = Date.now();
  logger.info(`Chat Proxy: Received POST request. Timestamp: ${requestTimestamp}`);

  try {
    const formData = await request.formData();
    clientConsultationId = formData.get('consultation_id') as string | null;
    logger.info(`Chat Proxy: Parsed form data. Consultation ID: ${clientConsultationId}`);

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
    const targetUrl = `${API_BASE_URL}/chat`;

    if (hasFile) {
      logger.info(`Chat Proxy: File upload detected for consultation: ${clientConsultationId}. Target URL: ${targetUrl}`);

      const uploadId = `${clientConsultationId || 'no-id'}-${Date.now()}`;
      const backgroundController = new AbortController();
      activeUploads.set(uploadId, backgroundController);

      const backgroundTimeoutId = setTimeout(() => {
        logger.warn(`Chat Proxy: Background file upload timeout for ${uploadId}, consultation: ${clientConsultationId}`);
        backgroundController.abort();
        activeUploads.delete(uploadId);
      }, FILE_UPLOAD_TIMEOUT);

      logger.info(`Chat Proxy: Initiating background fetch for file upload ${uploadId} to ${targetUrl}`);
      fetch(targetUrl, {
        method: 'POST',
        body: backendFormData,
        signal: backgroundController.signal,
      }).then(async (response) => {
        clearTimeout(backgroundTimeoutId);
        activeUploads.delete(uploadId);
        const responseStatus = response.status;
        const responseOk = response.ok;
        logger.info(`Chat Proxy: Background file upload fetch completed for ${uploadId}. Status: ${responseStatus}, OK: ${responseOk}`);

        if (!responseOk) {
          const errorText = await response.text().catch(() => `Unknown error, status ${responseStatus}`);
          logger.error(`Chat Proxy: Background file upload for ${uploadId} failed with status ${responseStatus}: ${errorText}`);
        } else {
          logger.info(`Chat Proxy: Background file upload ${uploadId} completed successfully for consultation: ${clientConsultationId}`);
        }
      }).catch(error => {
        clearTimeout(backgroundTimeoutId);
        activeUploads.delete(uploadId);

        if (error.name === 'AbortError') {
          logger.warn(`Chat Proxy: Background file upload ${uploadId} aborted (likely timeout) for consultation: ${clientConsultationId}`);
        } else {
          logger.error(`Chat Proxy: Background file upload to AI backend for ${uploadId} failed. Name: ${error.name}, Message: ${error.message}, Cause: ${error.cause}`, error);
        }
      });

      return NextResponse.json({
        consultation_id: clientConsultationId,
        status_detail: 'file_processing_initiated',
        message: '',
        stage: 'processing_file',
        next_steps: 'Your file is being analyzed. I will notify you shortly.',
        upload_id: uploadId
      }, { status: 202 });
    }

    logger.info(`Chat Proxy: Regular message for consultation: ${clientConsultationId}. Target URL: ${targetUrl}. Awaiting AI response.`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      logger.warn(`Chat Proxy: AI response timeout for consultation: ${clientConsultationId}. Aborting fetch to ${targetUrl}.`);
      controller.abort();
    }, AI_RESPONSE_TIMEOUT);

    logger.info(`Chat Proxy: Initiating direct fetch for regular message to ${targetUrl}`);
    const aiResponse = await fetch(targetUrl, {
      method: 'POST',
      body: backendFormData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    logger.info(`Chat Proxy: Direct fetch to ${targetUrl} completed. Status: ${aiResponse.status}, OK: ${aiResponse.ok}`);

    if (!aiResponse.ok) {
      const errorStatus = aiResponse.status;
      const errorData = await aiResponse.json().catch(() => ({
        detail: `AI backend HTTP error: ${errorStatus} when calling ${targetUrl}`
      }));
      logger.error(`Chat Proxy: AI backend at ${targetUrl} returned error ${errorStatus}:`, errorData);

      const errorResponse = {
        detail: errorData.detail || errorData.message || `AI service error at ${targetUrl}: ${errorStatus}`,
        consultation_id: clientConsultationId,
        status_code: errorStatus
      };

      return NextResponse.json(errorResponse, { status: errorStatus });
    }

    const data = await aiResponse.json();
    logger.info(`Chat Proxy: Received direct AI response from ${targetUrl} for ${clientConsultationId}`);
    return NextResponse.json(data);

  } catch (error: any) {
    // This catch block is for errors in the proxy logic itself, including failed fetch calls
    logger.error(
      `Chat Proxy: Error in POST handler. Consultation ID: ${clientConsultationId}, Timestamp: ${requestTimestamp}. Error Name: ${error.name}, Message: ${error.message}, Cause: ${JSON.stringify(error.cause)}, Stack: ${error.stack}`,
       error // Log the full error object for more details if available
    );

    if (error.name === 'AbortError') {
      logger.warn(`Chat Proxy: AbortError (likely AI timeout) for consultation: ${clientConsultationId}`);
      return NextResponse.json({
        consultation_id: clientConsultationId,
        status_detail: 'ai_response_timeout',
        message: '',
        stage: 'processing_message',
        next_steps: 'The AI is taking a moment to process your request...'
      }, { status: 202 }); // Return 202 for timeout as client expects potential recovery via SSE
    }

    // For other errors, including "fetch failed"
    return NextResponse.json({
      detail: error.message || 'Chat proxy internal server error',
      consultation_id: clientConsultationId,
      error_type: error.name || 'UnknownError',
      error_cause: error.cause ? JSON.stringify(error.cause) : 'N/A'
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
      'Access-Control-Allow-Origin': '*', // Adjust for production
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Cleanup function for server shutdown (if needed)
// This might not be reliably called in all serverless environments.
export function cleanup() {
  logger.info('Chat Proxy: Cleanup function called. Aborting active file uploads.');
  activeUploads.forEach((controller, uploadId) => {
    logger.info(`Cleanup: Aborting upload ${uploadId}`);
    controller.abort();
  });
  activeUploads.clear();
} 