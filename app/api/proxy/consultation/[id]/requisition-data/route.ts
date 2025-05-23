import { NextRequest, NextResponse } from 'next/server';

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
  try {
    // Get the consultation ID from the route parameters
    const consultationId = params.id;
    
    if (!consultationId) {
      return NextResponse.json(
        { error: 'Missing required consultation ID' },
        { status: 400 }
      );
    }
    
    // Add a timestamp for debugging
    const timestamp = new Date().toISOString();
    console.log(`Requisition Data Endpoint (${timestamp}): Fetching requisition data for consultation ID: ${consultationId}`);
    
    // Forward to the requisition-data endpoint
    const requisitionEndpoint = `${API_BASE_URL}/consultation/${consultationId}/requisition-data`;
    console.log(`Requisition Data Endpoint (${timestamp}): Forwarding to ${requisitionEndpoint}`);
    
    // Make the request to the AI API
    const response = await fetch(requisitionEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    console.log(`Requisition Data Endpoint (${timestamp}): Response status: ${response.status}`);
    
    // Handle 404 gracefully as it means data is not yet available
    if (response.status === 404) {
      console.log(`Requisition Data Endpoint (${timestamp}): Requisition data not yet available`);
      return NextResponse.json(
        { error: 'Requisition data not yet available' },
        { status: 404 }
      );
    }
    
    // Get the response data
    let data;
    try {
      data = await response.json();
      console.log(`Requisition Data Endpoint (${timestamp}): Response received successfully`);
    } catch (error) {
      const text = await response.text();
      console.log(`Requisition Data Endpoint (${timestamp}): Parse error:`, error);
      console.log(`Requisition Data Endpoint (${timestamp}): Raw response text:`, text);
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
    console.error('Requisition Data Endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requisition data', message: error instanceof Error ? error.message : String(error) },
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