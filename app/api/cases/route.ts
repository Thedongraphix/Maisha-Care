import { NextRequest, NextResponse } from 'next/server';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

// Sample cases data (summary version for listing)
const mockCases = [
  {
    id: '12345',
    patientId: 'P12345',
    patientName: 'John D.',
    createdAt: '2023-06-15T10:30:00',
    status: 'Pending Review',
    urgency: 'Medium',
    age: 45,
    gender: 'Male',
    symptoms: ['Fever', 'Cough', 'Fatigue', 'Shortness of breath'],
  },
  {
    id: '12346',
    patientId: 'P12346',
    patientName: 'Alice K.',
    createdAt: '2023-06-10T14:45:00',
    status: 'Pending Review',
    urgency: 'Low',
    age: 32,
    gender: 'Female',
    symptoms: ['Headache', 'Dizziness', 'Vision changes', 'Nausea'],
  },
  {
    id: '12347',
    patientId: 'P12347',
    patientName: 'Robert M.',
    createdAt: '2023-06-20T09:15:00',
    status: 'Complete',
    urgency: 'Medium',
    age: 58,
    gender: 'Male',
    symptoms: ['Joint pain', 'Morning stiffness', 'Fatigue', 'Low-grade fever'],
  },
  {
    id: '12348',
    patientId: 'P12348',
    patientName: 'Sarah J.',
    createdAt: '2023-06-22T16:30:00',
    status: 'Pending Review',
    urgency: 'High',
    age: 67,
    gender: 'Female',
    symptoms: ['Chest pain', 'Shortness of breath', 'Dizziness'],
  },
  {
    id: '12349',
    patientId: 'P12349',
    patientName: 'Michael P.',
    createdAt: '2023-06-18T11:20:00',
    status: 'In Progress',
    urgency: 'Medium',
    age: 41,
    gender: 'Male',
    symptoms: ['Abdominal pain', 'Nausea', 'Loss of appetite'],
  },
  {
    id: '12350',
    patientId: 'P12350',
    patientName: 'Emma L.',
    createdAt: '2023-06-19T13:15:00',
    status: 'Complete',
    urgency: 'Low',
    age: 28,
    gender: 'Female',
    symptoms: ['Sore throat', 'Mild fever', 'Cough'],
  },
  {
    id: '12351',
    patientId: 'P12351',
    patientName: 'David W.',
    createdAt: '2023-06-21T10:45:00',
    status: 'In Progress',
    urgency: 'Medium',
    age: 52,
    gender: 'Male',
    symptoms: ['Lower back pain', 'Numbness in leg', 'Difficulty walking'],
  },
  {
    id: '12352',
    patientId: 'P12352',
    patientName: 'Olivia S.',
    createdAt: '2023-06-17T08:30:00',
    status: 'Pending Review',
    urgency: 'Medium',
    age: 36,
    gender: 'Female',
    symptoms: ['Rash', 'Itching', 'Mild fever'],
  }
];

export async function GET(request: NextRequest) {
  try {
    // Get search parameters from the request
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const urgency = searchParams.get('urgency');
    const search = searchParams.get('search')?.toLowerCase();
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Filter cases based on query parameters
    let filteredCases = [...mockCases];
    
    if (status && status !== 'All') {
      filteredCases = filteredCases.filter(c => c.status === status);
    }
    
    if (urgency && urgency !== 'All') {
      filteredCases = filteredCases.filter(c => c.urgency === urgency);
    }
    
    if (search) {
      filteredCases = filteredCases.filter(c => 
        c.patientName.toLowerCase().includes(search) || 
        c.patientId.toLowerCase().includes(search) ||
        c.symptoms.some(s => s.toLowerCase().includes(search))
      );
    }
    
    return NextResponse.json({
      cases: filteredCases,
      total: filteredCases.length
    });
  } catch (error) {
    console.error('Error fetching cases:', error);
    return NextResponse.json({ error: 'Failed to fetch cases data' }, { status: 500 });
  }
}