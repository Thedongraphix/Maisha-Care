import { NextRequest, NextResponse } from 'next/server';

// Configure maximum duration for this function (60 seconds for Pro plan)
export const maxDuration = 60;

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

const API_BASE_URL = 'https://v2deployment-production.up.railway.app';

/**
 * Handle POST requests to the chat endpoint
 */
export async function POST(request: NextRequest) {
  let backendFormData: FormData | undefined;
  let consultationId: FormDataEntryValue | null = null;
  
  try {
    const formData = await request.formData();
    
    // Extract consultation_id early in case we need it for error handling
    consultationId = formData.get('consultation_id');
    
    // Create a new FormData instance for the backend
    backendFormData = new FormData();
    
    // Copy all fields from the incoming form data
    const entries = Array.from(formData.entries());
    for (const [key, value] of entries) {
      backendFormData.append(key, value);
    }
    
    // For file uploads, return immediately with a processing response
    // The actual response will come through SSE
    const hasFile = formData.has('file');
    
    if (hasFile && consultationId) {
      // Send the file to backend but don't wait for the full response
      fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        body: backendFormData,
      }).catch(error => {
        console.error('Background file upload error:', error);
      });
      
      // Return immediately with a processing message
      return new Response(JSON.stringify({
        consultation_id: consultationId.toString(),
        message: "I've received your test results and I'm analyzing them now. This typically takes 2-4 minutes. I'll notify you as soon as the analysis is complete.",
        stage: 'processing',
        next_steps: 'Please wait while I analyze your test results...'
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // For regular messages, wait for the response
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s for regular messages
    
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      body: backendFormData,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: `HTTP error: ${response.status}` }));
      return new Response(JSON.stringify(errorData), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error: any) {
    console.error('Chat proxy error:', error);
    
    // Handle timeout specially
    if (error.name === 'AbortError') {
      // Use the consultation_id we extracted earlier
      const id = consultationId || '';
      
      return new Response(JSON.stringify({
        consultation_id: id.toString(),
        message: "Processing your request. You'll receive a notification when complete.",
        stage: 'processing',
        next_steps: 'Please wait...'
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ detail: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
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