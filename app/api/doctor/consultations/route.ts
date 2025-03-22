import { NextResponse } from 'next/server';

// Mark this route as dynamic to prevent any caching
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const API_BASE_URL = 'https://ai-engine-production-487a.up.railway.app';

/**
 * Directly fetch consultations from the AI engine
 * Filter to only include consultations that have been analyzed and finalized
 */
export async function GET() {
  try {
    const timestamp = new Date().toISOString();
    console.log(`Doctor Consultations API: Fetching at ${timestamp}`);
    
    // Direct call to get all consultation IDs
    const consultationsEndpoint = `${API_BASE_URL}/consultations`;
    console.log(`Doctor Dashboard: Calling ${consultationsEndpoint}`);
    
    const response = await fetch(consultationsEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch consultations: ${response.status}`);
    }
    
    // Get the list of consultation IDs
    const consultationIds = await response.json();
    console.log(`Received ${consultationIds.length} consultation IDs`);
    
    // Fetch details for each consultation - request conversation history to help extract names
    const consultationsData = await Promise.all(
      consultationIds.map(async (id: string) => {
        try {
          // Get consultation details with conversation history
          const detailResponse = await fetch(
            `${API_BASE_URL}/consultation/${id}?include_history=true`, 
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
              },
              cache: 'no-store',
              next: { revalidate: 0 }
            }
          );
          
          if (!detailResponse.ok) {
            console.warn(`Failed to fetch details for consultation ${id}: ${detailResponse.status}`);
            return null;
          }
          
          return await detailResponse.json();
        } catch (error) {
          console.error(`Error fetching consultation ${id}:`, error);
          return null;
        }
      })
    );
    
    // Filter out failed requests
    const validConsultations = consultationsData.filter(consultation => consultation !== null);
    
    // Only include consultations that have been finalized by patients
    // These typically are in stages that indicate analysis has been completed
    const finalizedConsultations = validConsultations.filter(consultation => {
      // Check if it has reached an analyzed stage
      const analyzedStages = ['DIAGNOSIS', 'TREATMENT_PLAN', 'COMPLETED'];
      const hasReachedAnalyzedStage = analyzedStages.includes(consultation.stage);
      
      // Check if it has diagnosis or analysis results 
      // (these usually indicate the consultation was properly finalized)
      const hasDiagnosis = !!consultation.final_diagnosis;
      const hasAnalysisResults = 
        !!consultation.analysis_results?.diagnoses?.length || 
        !!consultation.analysis_results?.test_recommendations?.length;
      
      // Log each consultation's finalization status for debugging
      const isFinalized = hasReachedAnalyzedStage || hasDiagnosis || hasAnalysisResults;
      console.log(`Consultation ${consultation.consultation_id}: Stage=${consultation.stage}, HasDiagnosis=${hasDiagnosis}, HasAnalysisResults=${hasAnalysisResults}, IsFinalized=${isFinalized}`);
      
      return isFinalized;
    });
    
    // Sort by updated_at date, newest first
    finalizedConsultations.sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at).getTime();
      const dateB = new Date(b.updated_at || b.created_at).getTime();
      return dateB - dateA;
    });
    
    console.log(`Returning ${finalizedConsultations.length} finalized consultations out of ${validConsultations.length} valid consultations`);
    
    // Return with no-cache headers
    return NextResponse.json(finalizedConsultations, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consultations', message: error instanceof Error ? error.message : String(error) },
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