import { NextRequest, NextResponse } from 'next/server';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

// Mock doctor data
const mockDoctor = {
  id: 'D12345',
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@maishacare.com',
  phone: '+254 712 345 678',
  specialization: 'General Practitioner',
  hospital: 'Maisha Care Hospital',
  yearsOfExperience: 8,
  qualifications: [
    'MD, University of Nairobi',
    'Fellowship in Primary Care',
    'Certified in Telemedicine Practice'
  ],
  bio: 'Dr. Sarah Johnson is a dedicated general practitioner with 8 years of experience in primary care and telemedicine. She is passionate about making healthcare accessible to all patients through innovative digital solutions.',
  profileImage: 'https://randomuser.me/api/portraits/women/45.jpg',
  joinedDate: '2022-02-15',
  casesHandled: 128
};

export async function GET() {
  try {
    // In a real application, this would fetch from a database based on the authenticated user
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return NextResponse.json(mockDoctor);
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    return NextResponse.json({ error: 'Failed to fetch doctor profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In a real application, this would update the database
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Merge existing data with updated fields
    const updatedDoctor = {
      ...mockDoctor,
      ...body
    };
    
    return NextResponse.json({ 
      message: 'Profile updated successfully',
      data: updatedDoctor
    });
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    return NextResponse.json({ error: 'Failed to update doctor profile' }, { status: 500 });
  }
}