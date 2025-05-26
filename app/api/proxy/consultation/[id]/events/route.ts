import { NextRequest } from 'next/server';

const API_BASE_URL = 'https://v2deployment-production.up.railway.app';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const consultationId = params.id;
  
  if (!consultationId) {
    return new Response('Consultation ID is required', { status: 400 });
  }

  try {
    // Create the SSE connection to the backend
    const backendUrl = `${API_BASE_URL}/consultation/${consultationId}/events`;
    
    console.log('Proxying SSE request to:', backendUrl);
    
    // Don't use fetch for SSE - create a proper streaming response
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
              'Accept': 'text/event-stream',
              'Cache-Control': 'no-cache',
            },
            // Important: Don't abort on timeout for SSE
            signal: undefined,
          });

          if (!response.ok || !response.body) {
            console.error('Backend SSE connection failed:', response.status);
            controller.close();
            return;
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              console.log('SSE stream ended');
              controller.close();
              break;
            }
            
            // Forward the raw SSE data
            controller.enqueue(value);
            
            // Log the data for debugging
            const text = decoder.decode(value, { stream: true });
            if (text.includes('data:')) {
              console.log('SSE data forwarded:', text.substring(0, 200));
            }
          }
        } catch (error) {
          console.error('SSE streaming error:', error);
          controller.error(error);
        }
      },
    });

    // Return the SSE response with proper headers
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable nginx buffering
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error) {
    console.error('SSE proxy error:', error);
    return new Response('Internal server error', { status: 500 });
  }
} 