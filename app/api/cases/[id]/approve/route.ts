import { NextRequest, NextResponse } from 'next/server';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const caseId = params.id;
    
    // In a real application, this would update the database to mark the case as approved
    // and potentially trigger notifications or other workflows
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({ 
      message: 'Case approved successfully',
      caseId,
      status: 'Complete',
      approvedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error approving case:', error);
    return NextResponse.json({ error: 'Failed to approve case' }, { status: 500 });
  }
}