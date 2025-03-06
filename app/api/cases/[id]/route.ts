import { NextRequest, NextResponse } from 'next/server';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

// Sample cases data for development purposes
const mockCases = [
  {
    id: '12345',
    patientId: 'P12345',
    patientName: 'John D.',
    createdAt: '2023-06-15T10:30:00',
    status: 'Pending Review',
    age: 45,
    gender: 'Male',
    symptoms: ['Fever', 'Cough', 'Fatigue', 'Shortness of breath'],
    medicalHistory: 'Hypertension, Diabetes Type 2',
    attachments: [
      {
        id: 'att-001',
        name: 'Blood Test Results.pdf',
        type: 'application/pdf',
        url: '#'
      },
      {
        id: 'att-002',
        name: 'Chest X-Ray.jpg',
        type: 'image/jpeg',
        url: '#'
      }
    ],
    aiRecommendations: {
      diagnosis: 'Suspected COVID-19 with mild to moderate symptoms, complicated by existing conditions of hypertension and diabetes.',
      confidence: 0.87,
      treatmentPlan: 'Recommend home isolation with close monitoring of symptoms. Control of diabetes and hypertension should continue with current medications. If oxygen levels drop below 94%, immediate hospital care is advised.',
      suggestedTests: [
        'RT-PCR for COVID-19',
        'Complete Blood Count',
        'C-Reactive Protein',
        'D-dimer'
      ],
      medications: [
        {
          name: 'Paracetamol',
          dosage: '500mg',
          frequency: 'Every 6 hours as needed',
          duration: 'For fever and pain'
        },
        {
          name: 'Continue current medications for hypertension and diabetes',
          dosage: 'As prescribed',
          frequency: 'As prescribed',
          duration: 'Ongoing'
        }
      ],
      followUp: 'Remote follow-up in 3 days to assess symptom progression.'
    }
  },
  {
    id: '12346',
    patientId: 'P12346',
    patientName: 'Alice K.',
    createdAt: '2023-06-10T14:45:00',
    status: 'Pending Review',
    age: 32,
    gender: 'Female',
    symptoms: ['Headache', 'Dizziness', 'Vision changes', 'Nausea'],
    medicalHistory: 'None reported',
    attachments: [],
    aiRecommendations: {
      diagnosis: 'Suspected migraine with aura, possible vestibular involvement.',
      confidence: 0.82,
      treatmentPlan: 'Recommend rest in a quiet, dark room. Avoid triggers such as bright lights, loud noises, and certain foods.',
      suggestedTests: [
        'Neurological examination',
        'Visual field testing'
      ],
      medications: [
        {
          name: 'Sumatriptan',
          dosage: '50mg',
          frequency: 'At onset of migraine, may repeat after 2 hours if needed',
          duration: 'Not to exceed 100mg in 24 hours'
        },
        {
          name: 'Metoclopramide',
          dosage: '10mg',
          frequency: 'With each dose of sumatriptan',
          duration: 'As needed for nausea'
        }
      ],
      followUp: 'If symptoms persist beyond 72 hours, in-person evaluation is recommended.'
    }
  },
  {
    id: '12347',
    patientId: 'P12347',
    patientName: 'Robert M.',
    createdAt: '2023-06-20T09:15:00',
    status: 'Complete',
    age: 58,
    gender: 'Male',
    symptoms: ['Joint pain', 'Morning stiffness', 'Fatigue', 'Low-grade fever'],
    medicalHistory: 'Hyperlipidemia, Previous knee injury',
    attachments: [
      {
        id: 'att-003',
        name: 'Joint X-Rays.pdf',
        type: 'application/pdf',
        url: '#'
      }
    ],
    aiRecommendations: {
      diagnosis: 'Rheumatoid arthritis, moderate severity, primarily affecting knees and hands.',
      confidence: 0.91,
      treatmentPlan: 'Anti-inflammatory medication regimen with physical therapy. Recommend moderate exercise that does not exacerbate joint pain.',
      suggestedTests: [
        'Rheumatoid factor',
        'Anti-CCP antibodies',
        'ESR and CRP',
        'Complete Blood Count'
      ],
      medications: [
        {
          name: 'Methotrexate',
          dosage: '15mg',
          frequency: 'Once weekly',
          duration: 'Long-term, with regular liver function monitoring'
        },
        {
          name: 'Folic acid',
          dosage: '1mg',
          frequency: 'Daily except on methotrexate day',
          duration: 'While on methotrexate'
        },
        {
          name: 'Prednisone',
          dosage: '10mg',
          frequency: 'Daily',
          duration: 'Short-term, taper over 3 weeks'
        }
      ],
      followUp: 'In-person follow-up in 4 weeks to assess treatment efficacy.'
    }
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In a real application, this would fetch from a database
    const caseId = params.id;
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find the case with the matching ID
    const caseData = mockCases.find(c => c.id === caseId);
    
    if (!caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }
    
    return NextResponse.json(caseData);
  } catch (error) {
    console.error('Error fetching case:', error);
    return NextResponse.json({ error: 'Failed to fetch case data' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const caseId = params.id;
    const body = await request.json();
    
    // In a real application, this would update in a database
    // For demo purposes, we'll just return success
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({ 
      message: 'Case updated successfully',
      data: {
        id: caseId,
        ...body
      }
    });
  } catch (error) {
    console.error('Error updating case:', error);
    return NextResponse.json({ error: 'Failed to update case data' }, { status: 500 });
  }
}