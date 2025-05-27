import { NextRequest } from 'next/server';
import logger from '@/utils/logger';

const API_BASE_URL = process.env.AI_BACKEND_URL || 'https://v2deployment-production.up.railway.app';
const SSE_IDLE_TIMEOUT = 30000; // 30 seconds without data
const MAX_RECONNECT_ATTEMPTS = 3;

// UUID validation regex
const UUID_REGEX = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const consultationId = params.id;
  
  if (!consultationId || !UUID_REGEX.test(consultationId)) {
    logger.warn(`Invalid consultation ID format: ${consultationId}`);
    return new Response('event: error\ndata: {"error": "Invalid consultation ID"}\n\n', { 
      status: 400,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      }
    });
  }

  let reconnectAttempts = 0;
  
  const createSSEStream = async (): Promise<Response> => {
    try {
      const backendUrl = `${API_BASE_URL}/consultation/${consultationId}/events`;
      logger.info(`Proxying SSE request to: ${backendUrl}`);
      
      const abortController = new AbortController();
      const decoder = new TextDecoder();
      let lastDataTime = Date.now();
      let idleCheckInterval: NodeJS.Timeout | null = null;
      
      const stream = new ReadableStream({
        async start(controller) {
          // Send initial connection event
          const connectEvent = `event: connection\ndata: {"status": "connected", "consultation_id": "${consultationId}"}\n\n`;
          controller.enqueue(new TextEncoder().encode(connectEvent));
          
          try {
            const response = await fetch(backendUrl, {
              method: 'GET',
              headers: {
                'Accept': 'text/event-stream',
                'Cache-Control': 'no-cache',
              },
              signal: abortController.signal,
            });

            if (!response.ok || !response.body) {
              logger.error('Backend SSE connection failed:', response.status);
              const errorEvent = `event: error\ndata: {"error": "Backend connection failed", "status": ${response.status}}\n\n`;
              controller.enqueue(new TextEncoder().encode(errorEvent));
              controller.close();
              return;
            }

            const reader = response.body.getReader();
            
            // Set up idle timeout check
            idleCheckInterval = setInterval(() => {
              const idleTime = Date.now() - lastDataTime;
              if (idleTime > SSE_IDLE_TIMEOUT) {
                logger.warn(`SSE idle timeout reached for consultation: ${consultationId}`);
                const timeoutEvent = `event: timeout\ndata: {"message": "Connection idle timeout"}\n\n`;
                controller.enqueue(new TextEncoder().encode(timeoutEvent));
                abortController.abort();
              }
            }, 5000); // Check every 5 seconds
            
            let buffer = '';
            
            while (true) {
              const { done, value } = await reader.read();
              
              if (done) {
                logger.info('SSE stream ended normally');
                if (buffer) {
                  // Send any remaining buffered data
                  controller.enqueue(new TextEncoder().encode(buffer));
                }
                controller.close();
                break;
              }
              
              lastDataTime = Date.now();
              
              // Decode with streaming support for multi-byte characters
              const chunk = decoder.decode(value, { stream: true });
              buffer += chunk;
              
              // Forward complete SSE messages only
              const lines = buffer.split('\n');
              const remainingBuffer = lines.pop() || '';
              
              if (lines.length > 0) {
                const completeData = lines.join('\n') + '\n';
                controller.enqueue(new TextEncoder().encode(completeData));
                
                // Log significant events
                if (completeData.includes('data:') && !completeData.includes('ping')) {
                  logger.debug(`SSE data forwarded for ${consultationId}:`, completeData.substring(0, 200));
                }
              }
              
              buffer = remainingBuffer;
            }
          } catch (error: any) {
            logger.error('SSE streaming error:', error);
            
            if (error.name === 'AbortError') {
              logger.info('SSE stream aborted');
            } else {
              const errorEvent = `event: error\ndata: {"error": "${error.message || 'Streaming error'}"}\n\n`;
              controller.enqueue(new TextEncoder().encode(errorEvent));
            }
            
            controller.close();
          } finally {
            // Cleanup
            if (idleCheckInterval) {
              clearInterval(idleCheckInterval);
            }
            // Ensure any remaining decoder state is flushed
            const remaining = decoder.decode();
            if (remaining) {
              controller.enqueue(new TextEncoder().encode(remaining));
            }
          }
        },
        
        cancel() {
          logger.info(`SSE stream cancelled by client for consultation: ${consultationId}`);
          abortController.abort();
          if (idleCheckInterval) {
            clearInterval(idleCheckInterval);
          }
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no',
          'Transfer-Encoding': 'chunked',
          'X-Content-Type-Options': 'nosniff',
        },
      });

    } catch (error) {
      logger.error('SSE proxy error:', error);
      
      // Send error as SSE event
      const errorStream = new ReadableStream({
        start(controller) {
          const errorEvent = `event: error\ndata: {"error": "Internal server error", "retry": ${reconnectAttempts < MAX_RECONNECT_ATTEMPTS}}\n\n`;
          controller.enqueue(new TextEncoder().encode(errorEvent));
          controller.close();
        }
      });
      
      return new Response(errorStream, { 
        status: 500,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
        }
      });
    }
  };

  return createSSEStream();
}

// Handle preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 