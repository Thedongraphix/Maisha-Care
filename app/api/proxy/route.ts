import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://ai-engine-production-487a.up.railway.app';

/**
 * Proxy POST requests to the chat endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Check if this is a file upload by inspecting Content-Type
    const contentType = request.headers.get('Content-Type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      return handleFileUpload(request);
    } else {
      return handleChatRequest(request);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to AI Engine API', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * Handle chat API request
 */
async function handleChatRequest(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Log the request
    console.log('Chat Proxy: Received request with body:', body);
    
    // Forward to the chat endpoint
    const chatEndpoint = `${API_BASE_URL}/chat`;
    console.log(`Chat Proxy: Forwarding to ${chatEndpoint}`);
    
    // Make the request to the AI API
    const response = await fetch(chatEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log('Chat Proxy: Response status:', response.status);
    
    // Get the response data
    let data;
    try {
      data = await response.json();
      console.log('Chat Proxy: Response data:', data);
    } catch (error) {
      const text = await response.text();
      console.log('Chat Proxy: Parse error:', error);
      console.log('Chat Proxy: Raw response text:', text);
      return NextResponse.json(
        { error: 'Invalid JSON in API response', text, parseError: error instanceof Error ? error.message : String(error) },
        { status: response.status }
      );
    }
    
    // Return the response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Chat Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy chat request', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * Handle file upload request
 */
async function handleFileUpload(request: NextRequest) {
  try {
    // Forward the file upload request directly
    const formData = await request.formData();
    
    console.log('File Upload Proxy: Received file upload request');
    
    // Forward to the upload endpoint
    const uploadEndpoint = `${API_BASE_URL}/upload`;
    console.log(`File Upload Proxy: Forwarding to ${uploadEndpoint}`);
    
    // Make the request to the AI API
    const response = await fetch(uploadEndpoint, {
      method: 'POST',
      body: formData,
    });
    
    console.log('File Upload Proxy: Response status:', response.status);
    
    // Get the response data
    let data;
    try {
      data = await response.json();
      console.log('File Upload Proxy: Response data:', data);
    } catch (error) {
      const text = await response.text();
      console.log('File Upload Proxy: Parse error:', error);
      console.log('File Upload Proxy: Raw response text:', text);
      return NextResponse.json(
        { error: 'Invalid JSON in API response', text, parseError: error instanceof Error ? error.message : String(error) },
        { status: response.status }
      );
    }
    
    // Return the response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('File Upload Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy file upload request', message: error instanceof Error ? error.message : String(error) },
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

/**
 * Handle GET requests for health checks
 */
export async function GET() {
  try {
    console.log(`Health Check: Checking API at ${API_BASE_URL}`);
    
    // Forward the request to the AI Engine API
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    // Get the response data
    let data;
    try {
      data = await response.json();
      console.log('Health Check: API response:', data);
    } catch (error) {
      const text = await response.text();
      console.log('Health Check: Parse error:', error);
      console.log('Health Check: Raw response text:', text);
      return NextResponse.json(
        { error: 'Invalid JSON in API response', text, parseError: error instanceof Error ? error.message : String(error) },
        { status: response.status }
      );
    }
    
    // Return the response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Health Check error:', error);
    return NextResponse.json(
      { error: 'Failed to check API health', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 