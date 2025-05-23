import { NextRequest, NextResponse } from 'next/server';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

const API_BASE_URL = 'https://v2deployment-production.up.railway.app';

/**
 * Handle POST requests to the generate-treatment-plan endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Log the request
    console.log('Generate Treatment Plan Endpoint: Received request with body:', body);
    
    // Forward to the generate-treatment-plan endpoint
    const treatmentPlanEndpoint = `${API_BASE_URL}/generate-treatment-plan`;
    console.log(`Generate Treatment Plan Endpoint: Forwarding to ${treatmentPlanEndpoint}`);
    
    // Make the request to the AI API
    const response = await fetch(treatmentPlanEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log('Generate Treatment Plan Endpoint: Response status:', response.status);
    
    // Get the response data
    let data;
    try {
      data = await response.json();
      console.log('Generate Treatment Plan Endpoint: Response data:', data);
    } catch (error) {
      const text = await response.text();
      console.log('Generate Treatment Plan Endpoint: Parse error:', error);
      console.log('Generate Treatment Plan Endpoint: Raw response text:', text);
      return NextResponse.json(
        { error: 'Invalid JSON in API response', text, parseError: error instanceof Error ? error.message : String(error) },
        { status: response.status }
      );
    }
    
    // Return the response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Generate Treatment Plan Endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy generate-treatment-plan request', message: error instanceof Error ? error.message : String(error) },
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