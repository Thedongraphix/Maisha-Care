import { NextRequest, NextResponse } from 'next/server';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

const API_BASE_URL = 'https://ai-engine-production-487a.up.railway.app';

/**
 * Handle POST requests to the upload endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    
    // Log the request (without the actual file content)
    const fileInfo = formData.get('file') as File;
    console.log('Upload Endpoint: Received file upload request', {
      fileName: fileInfo?.name,
      fileType: fileInfo?.type,
      fileSize: fileInfo?.size,
    });
    
    // Forward to the upload endpoint
    const uploadEndpoint = `${API_BASE_URL}/upload`;
    console.log(`Upload Endpoint: Forwarding to ${uploadEndpoint}`);
    
    // Make the request to the AI API
    const response = await fetch(uploadEndpoint, {
      method: 'POST',
      body: formData,
    });
    
    console.log('Upload Endpoint: Response status:', response.status);
    
    // Get the response data
    let data;
    try {
      data = await response.json();
      console.log('Upload Endpoint: Response data:', data);
    } catch (error) {
      const text = await response.text();
      console.log('Upload Endpoint: Parse error:', error);
      console.log('Upload Endpoint: Raw response text:', text);
      return NextResponse.json(
        { error: 'Invalid JSON in API response', text, parseError: error instanceof Error ? error.message : String(error) },
        { status: response.status }
      );
    }
    
    // Return the response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Upload Endpoint error:', error);
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 