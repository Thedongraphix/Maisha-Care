import { NextRequest } from 'next/server';

// Mark this route as dynamic to prevent caching
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const API_BASE_URL = 'https://v2deployment-production.up.railway.app';

/**
 * Handle GET requests to fetch test requisition data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const consultationId = params.id;
  
  if (!consultationId) {
    return new Response('Consultation ID is required', { status: 400 });
  }

  try {
    const backendUrl = `${API_BASE_URL}/consultation/${consultationId}/requisition-data`;
    
    console.log('Fetching requisition data from:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return new Response('Requisition data not found', { status: 404 });
      }
      return new Response(`Backend error: ${response.status}`, { status: response.status });
    }

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });

  } catch (error) {
    console.error('Requisition data proxy error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
  });
} 