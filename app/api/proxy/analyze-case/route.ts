import { NextRequest, NextResponse } from 'next/server';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

const API_BASE_URL = 'https://ai-engine-production-487a.up.railway.app';

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
    
    // Log the request
    console.log('Analyze Case Endpoint: Processing request for consultation ID:', consultationId);
    
    // Forward to the analyze-case endpoint
    const analyzeEndpoint = `${API_BASE_URL}/analyze-case?consultation_id=${consultationId}`;
    console.log(`Analyze Case Endpoint: Forwarding to ${analyzeEndpoint}`);
    
    // Make the request to the AI API
    const response = await fetch(analyzeEndpoint, {
      method: 'POST',
    });
    
    console.log('Analyze Case Endpoint: Response status:', response.status);
    
    // Get the response data
    let data;
    try {
      data = await response.json();
      console.log('Analyze Case Endpoint: Response data:', data);
    } catch (error) {
      const text = await response.text();
      console.log('Analyze Case Endpoint: Parse error:', error);
      console.log('Analyze Case Endpoint: Raw response text:', text);
      return NextResponse.json(
        { error: 'Invalid JSON in API response', text, parseError: error instanceof Error ? error.message : String(error) },
        { status: response.status }
      );
    }
    
    // Return the response
    return NextResponse.json(data, { status: response.status });
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
    },
  });
} 