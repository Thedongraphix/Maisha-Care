import { NextRequest, NextResponse } from 'next/server';

// Mark this route as dynamic to prevent caching
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const API_BASE_URL = 'https://ai-engine-production-487a.up.railway.app';

/**
 * Handle GET requests to fetch consultation details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the consultation ID from the route parameters
    const consultationId = params.id;
    
    if (!consultationId) {
      return NextResponse.json(
        { error: 'Missing required consultation ID' },
        { status: 400 }
      );
    }
    
    // Get the include_history query parameter
    const url = new URL(request.url);
    const includeHistory = url.searchParams.get('include_history') === 'true';
    
    // Add a timestamp for debugging
    const timestamp = new Date().toISOString();
    console.log(`Consultation Endpoint (${timestamp}): Fetching consultation with ID: ${consultationId}`);
    console.log(`Consultation Endpoint (${timestamp}): Include history: ${includeHistory}`);
    
    // Add cache buster
    const cacheBuster = `&cache_bust=${Date.now()}`;
    
    // Forward to the consultation endpoint
    const consultationEndpoint = `${API_BASE_URL}/consultation/${consultationId}?include_history=${includeHistory}${cacheBuster}`;
    console.log(`Consultation Endpoint (${timestamp}): Forwarding to ${consultationEndpoint}`);
    
    // Make the request to the AI API
    const response = await fetch(consultationEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    console.log(`Consultation Endpoint (${timestamp}): Response status: ${response.status}`);
    
    // Get the response data
    let data;
    try {
      data = await response.json();
      console.log(`Consultation Endpoint (${timestamp}): Response received`);
    } catch (error) {
      const text = await response.text();
      console.log(`Consultation Endpoint (${timestamp}): Parse error:`, error);
      console.log(`Consultation Endpoint (${timestamp}): Raw response text:`, text);
      return NextResponse.json(
        { error: 'Invalid JSON in API response', text, parseError: error instanceof Error ? error.message : String(error) },
        { status: response.status }
      );
    }
    
    // Return the response with no-cache headers
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Consultation Endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy consultation request', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
  });
} 