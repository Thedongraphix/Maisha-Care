import { NextRequest, NextResponse } from 'next/server';

// Mark this route as dynamic to prevent caching
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const API_BASE_URL = 'https://v2deployment-production.up.railway.app';

/**
 * Handle POST requests to the analyze-case endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Get the consultation ID from the query parameters
    const url = new URL(request.url);
    const consultationId = url.searchParams.get('consultation_id');
    
    if (!consultationId) {
      return NextResponse.json(
        { error: 'Missing required consultation_id parameter' },
        { status: 400 }
      );
    }
    
    // Add timestamp for debug logging
    const timestamp = new Date().toISOString();
    console.log(`Analyze Case Endpoint (${timestamp}): Processing request for consultation ID: ${consultationId}`);
    
    // Add cache buster
    const cacheBuster = `&cache_bust=${Date.now()}`;
    
    // Forward to the analyze-case endpoint
    const analyzeEndpoint = `${API_BASE_URL}/analyze-case?consultation_id=${consultationId}${cacheBuster}`;
    console.log(`Analyze Case Endpoint (${timestamp}): Forwarding to ${analyzeEndpoint}`);
    
    // Make the request to the AI API
    const response = await fetch(analyzeEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    console.log(`Analyze Case Endpoint (${timestamp}): Response status: ${response.status}`);
    
    // Get the response data
    let data;
    try {
      data = await response.json();
      console.log(`Analyze Case Endpoint (${timestamp}): Response received successfully`);
      
      // Success! Now let's immediately fetch the updated consultation to ensure it's in our system
      console.log(`Analyze Case Endpoint (${timestamp}): Fetching updated consultation data...`);
      
      try {
        const updatedConsultationResponse = await fetch(
          `${API_BASE_URL}/consultation/${consultationId}?include_history=false${cacheBuster}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache'
            },
            cache: 'no-store',
            next: { revalidate: 0 }
          }
        );
        
        if (updatedConsultationResponse.ok) {
          const consultationData = await updatedConsultationResponse.json();
          console.log(`Analyze Case Endpoint (${timestamp}): Successfully fetched updated consultation, stage: ${consultationData.stage}`);
          
          // Add the consultation data to our response for easy access
          data.consultation = consultationData;
        } else {
          console.warn(`Analyze Case Endpoint (${timestamp}): Failed to fetch updated consultation: ${updatedConsultationResponse.status}`);
        }
      } catch (fetchError) {
        console.error(`Analyze Case Endpoint (${timestamp}): Error fetching updated consultation:`, fetchError);
        // We don't want to fail the whole request if this additional fetch fails
      }
      
    } catch (error) {
      const text = await response.text();
      console.log(`Analyze Case Endpoint (${timestamp}): Parse error:`, error);
      console.log(`Analyze Case Endpoint (${timestamp}): Raw response text:`, text);
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
    console.error('Analyze Case Endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy analyze-case request', message: error instanceof Error ? error.message : String(error) },
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
  });
} 