'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Clock, Clipboard, FileText, ChevronDown, ChevronUp, CheckCircle, Edit } from 'lucide-react';
import Link from 'next/link';

// Case data interface
interface CaseDetails {
  id: string;
  patientId: string;
  patientName: string;
  createdAt: string;
  status: string;
  age?: number;
  gender?: string;
  symptoms: string[];
  medicalHistory?: string;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  aiRecommendations: {
    diagnosis: string;
    confidence: number;
    treatmentPlan: string;
    suggestedTests?: string[];
    medications?: {
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
    }[];
    followUp?: string;
  };
}

export default function CaseDetailsPage({ params }: { params: { id: string } }) {
  const [caseDetails, setCaseDetails] = useState<CaseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showPatientInfo, setShowPatientInfo] = useState(true);
  const [showAiRecommendations, setShowAiRecommendations] = useState(true);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // In real app, fetch data from API
    const fetchCaseDetails = async () => {
      try {
        // This would be the API call:
        // const response = await fetch(`/api/cases/${params.id}`);
        // const data = await response.json();

        // Mock data for development
        const mockCaseDetails: CaseDetails = {
          id: params.id,
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
        };

        setTimeout(() => {
          setCaseDetails(mockCaseDetails);
          setTreatmentPlan(mockCaseDetails.aiRecommendations.treatmentPlan);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching case details:', error);
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [params.id]);

  // Handle case update
  const handleCaseUpdate = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real app, make API call to update the case
      // await fetch(`/api/cases/${params.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     treatmentPlan,
      //     doctorNotes,
      //   }),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state to reflect changes
      if (caseDetails) {
        setCaseDetails({
          ...caseDetails,
          status: 'Complete',
          aiRecommendations: {
            ...caseDetails.aiRecommendations,
            treatmentPlan: treatmentPlan,
          }
        });
      }
      
      setEditMode(false);
      setIsSubmitting(false);
      
      // Show success toast (in a real app)
      alert('Case updated successfully');
    } catch (error) {
      console.error('Error updating case:', error);
      setIsSubmitting(false);
      
      // Show error toast (in a real app)
      alert('Failed to update case. Please try again.');
    }
  };

  // Handle approve AI recommendations
  const handleApproveRecommendations = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real app, make API call to approve the case
      // await fetch(`/api/cases/${params.id}/approve`, {
      //   method: 'POST',
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      if (caseDetails) {
        setCaseDetails({
          ...caseDetails,
          status: 'Complete',
        });
      }
      
      setIsSubmitting(false);
      
      // Show success toast (in a real app)
      alert('Case approved successfully');
    } catch (error) {
      console.error('Error approving case:', error);
      setIsSubmitting(false);
      
      // Show error toast (in a real app)
      alert('Failed to approve case. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-color1"></div>
      </div>
    );
  }

  if (!caseDetails) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700">Case not found</h2>
        <p className="mt-2 text-gray-500">The case you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
        <Link href="/doctors/dashboard" className="mt-4 inline-flex items-center text-color1 hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button and page heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center">
          <Link href="/doctors/dashboard" className="mr-4 p-2 text-gray-500 hover:text-color1 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Case #{caseDetails.id}</h1>
          <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${
            caseDetails.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' :
            caseDetails.status === 'Complete' ? 'bg-green-100 text-green-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {caseDetails.status}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <Clock className="mr-1.5 h-4 w-4" />
          <span>Created on {formatDate(caseDetails.createdAt)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Patient Information */}
        <div className="lg:col-span-1 space-y-6">
          {/* Patient overview section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setShowPatientInfo(!showPatientInfo)}
            >
              <div className="flex items-center font-medium">
                <User className="mr-2 h-5 w-5 text-color1" />
                <h2 className="text-lg font-semibold">Patient Overview</h2>
              </div>
              {showPatientInfo ? 
                <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                <ChevronDown className="h-5 w-5 text-gray-400" />
              }
            </div>
            
            {showPatientInfo && (
              <div className="p-4 pt-0 border-t border-gray-100">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Patient Name:</span>
                    <span className="font-medium">{caseDetails.patientName}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Patient ID:</span>
                    <span className="font-medium">{caseDetails.patientId}</span>
                  </div>
                  
                  {caseDetails.age && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Age:</span>
                      <span className="font-medium">{caseDetails.age} years</span>
                    </div>
                  )}
                  
                  {caseDetails.gender && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Gender:</span>
                      <span className="font-medium">{caseDetails.gender}</span>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-gray-500 mb-2">Symptoms:</h3>
                    <div className="flex flex-wrap gap-2">
                      {caseDetails.symptoms.map((symptom, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {caseDetails.medicalHistory && (
                    <div>
                      <h3 className="text-gray-500 mb-2">Medical History:</h3>
                      <p className="text-sm">{caseDetails.medicalHistory}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Attachments section */}
          {caseDetails.attachments && caseDetails.attachments.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center font-medium mb-3">
                  <Clipboard className="mr-2 h-5 w-5 text-color1" />
                  <h2 className="text-lg font-semibold">Attachments</h2>
                </div>
                
                <div className="space-y-3">
                  {caseDetails.attachments.map(attachment => (
                    <div 
                      key={attachment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium">{attachment.name}</span>
                      </div>
                      <a 
                        href={attachment.url}
                        className="text-color1 text-sm hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Right column - AI Recommendations and Doctor Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Recommendations section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setShowAiRecommendations(!showAiRecommendations)}
            >
              <div className="flex items-center font-medium">
                <ClipboardIcon className="mr-2 h-5 w-5 text-color1" />
                <h2 className="text-lg font-semibold">AI Recommendations</h2>
              </div>
              {showAiRecommendations ? 
                <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                <ChevronDown className="h-5 w-5 text-gray-400" />
              }
            </div>
            
            {showAiRecommendations && (
              <div className="p-4 pt-2 border-t border-gray-100">
                <div className="space-y-5">
                  {/* AI Confidence indicator */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">AI Confidence</span>
                    <div className="flex items-center">
                      <div className="w-24 h-2 bg-gray-200 rounded-full mr-2 overflow-hidden">
                        <div 
                          className="h-full bg-color1" 
                          style={{ width: `${caseDetails.aiRecommendations.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round(caseDetails.aiRecommendations.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Diagnosis */}
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Diagnosis</h3>
                    <p className="text-gray-800">{caseDetails.aiRecommendations.diagnosis}</p>
                  </div>
                  
                  {/* Treatment Plan */}
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Treatment Plan</h3>
                    {editMode ? (
                      <textarea
                        value={treatmentPlan}
                        onChange={(e) => setTreatmentPlan(e.target.value)}
                        className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color1/30 focus:border-color1"
                        placeholder="Update the treatment plan..."
                      />
                    ) : (
                      <p className="text-gray-800">{caseDetails.aiRecommendations.treatmentPlan}</p>
                    )}
                  </div>
                  
                  {/* Suggested Tests */}
                  {caseDetails.aiRecommendations.suggestedTests && caseDetails.aiRecommendations.suggestedTests.length > 0 && (
                    <div>
                      <h3 className="text-sm text-gray-500 mb-1">Suggested Tests</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {caseDetails.aiRecommendations.suggestedTests.map((test, index) => (
                          <li key={index} className="text-gray-800">{test}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Medications */}
                  {caseDetails.aiRecommendations.medications && caseDetails.aiRecommendations.medications.length > 0 && (
                    <div>
                      <h3 className="text-sm text-gray-500 mb-1">Medications</h3>
                      <div className="space-y-3">
                        {caseDetails.aiRecommendations.medications.map((medication, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-md">
                            <div className="font-medium">{medication.name}</div>
                            <div className="text-sm text-gray-600">
                              <span className="inline-block mr-4">Dosage: {medication.dosage}</span>
                              <span>Frequency: {medication.frequency}</span>
                            </div>
                            <div className="text-sm text-gray-600">Duration: {medication.duration}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Follow Up */}
                  {caseDetails.aiRecommendations.followUp && (
                    <div>
                      <h3 className="text-sm text-gray-500 mb-1">Follow Up</h3>
                      <p className="text-gray-800">{caseDetails.aiRecommendations.followUp}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Doctor Notes section - only visible in edit mode */}
          {editMode && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center font-medium mb-3">
                  <FileText className="mr-2 h-5 w-5 text-color1" />
                  <h2 className="text-lg font-semibold">Doctor Notes</h2>
                </div>
                
                <textarea
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color1/30 focus:border-color1"
                  placeholder="Add your notes about this case..."
                />
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {caseDetails.status !== 'Complete' && !editMode && (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className="flex-1 bg-white border border-color1 text-color1 px-6 py-3 rounded-lg font-medium hover:bg-color1/5 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="h-5 w-5" />
                  Modify Plan
                </button>
                <button
                  onClick={handleApproveRecommendations}
                  disabled={isSubmitting}
                  className="flex-1 bg-color1 text-white px-6 py-3 rounded-lg font-medium hover:bg-color1/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Approve Plan
                    </>
                  )}
                </button>
              </>
            )}
            
            {editMode && (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCaseUpdate}
                  disabled={isSubmitting}
                  className="flex-1 bg-color1 text-white px-6 py-3 rounded-lg font-medium hover:bg-color1/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Update Case
                    </>
                  )}
                </button>
              </>
            )}
            
            {caseDetails.status === 'Complete' && !editMode && (
              <div className="flex-1 bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Case completed successfully
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Clipboard icon component
function ClipboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}