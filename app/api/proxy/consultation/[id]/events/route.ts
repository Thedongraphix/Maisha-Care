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
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

    if (!response.ok) {
      console.error('Backend SSE connection failed:', response.status, response.statusText);
      return new Response(`Backend error: ${response.status}`, { status: response.status });
    }

    // Create a readable stream to proxy the SSE data
    const stream = new ReadableStream({
      start(controller) {
        const reader = response.body?.getReader();
        
        if (!reader) {
          controller.close();
          return;
        }

        function pump(): Promise<void> {
          if (!reader) {
            return Promise.resolve();
          }
          
          return reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            
            // Forward the chunk to the client
            controller.enqueue(value);
            return pump();
          }).catch((error) => {
            console.error('SSE stream error:', error);
            controller.error(error);
          });
        }

        return pump();
      },
    });

    // Return the SSE response with proper headers
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    });

  } catch (error) {
    console.error('SSE proxy error:', error);
    return new Response('Internal server error', { status: 500 });
  }
} 