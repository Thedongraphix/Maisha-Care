import { NextRequest, NextResponse } from 'next/server';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

const API_BASE_URL = 'https://v2deployment-production.up.railway.app';

/**
 * Handle POST requests to the chat endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Check if this is a multipart/form-data request
    const contentType = request.headers.get('Content-Type') || '';
    
    let body: FormData | string;
    let headers: HeadersInit = {
      'Accept': 'application/json',
    };

    if (contentType.includes('multipart/form-data')) {
      // Handle file upload with form data
      body = await request.formData();
      // Don't set Content-Type for FormData, let fetch set it with boundary
    } else {
      // Handle JSON request
      const jsonBody = await request.json();
      body = JSON.stringify(jsonBody);
      headers['Content-Type'] = 'application/json';
    }
    
    // Forward to the chat endpoint
    const chatEndpoint = `${API_BASE_URL}/chat`;
    
    // Make the request to the AI API
    const response = await fetch(chatEndpoint, {
      method: 'POST',
      headers,
      body,
    });
    
    // Get the response data
    let data;
    try {
      data = await response.json();
    } catch (error) {
      const text = await response.text();
      return NextResponse.json(
        { error: 'Invalid JSON in API response', text, parseError: error instanceof Error ? error.message : String(error) },
        { status: response.status }
      );
    }
    
    // Return the response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Chat Endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy chat request', message: error instanceof Error ? error.message : String(error) },
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