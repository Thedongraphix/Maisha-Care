'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft,  AlertCircle, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import logger from '../../../../../lib/logger';
import config from '@/lib/config';

// Using direct consultation interface from the AI
interface Consultation {
  consultation_id: string;
  created_at: string;
  updated_at: string;
  stage: string;
  patient_info?: {
    name?: string;
    age?: number;
    gender?: string;
    id?: string;
  };
  chief_complaint?: {
    complaint: string;
  };
  final_diagnosis?: string;
  diagnoses?: string[];
  symptom_assessment?: {
    location: string;
    onset: string;
    quality: string;
    timing_pattern: string;
    severity: number;
  };
  treatment_plan?: {
    goal: string;
    lifestyle_modifications?: string[];
    follow_up?: string;
    monitoring?: string[];
    prescription?: {
      medications: Array<{
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
        special_instructions?: string;
      }>;
    };
  };
  conversation_history?: Array<{
    role: string;
    content: string;
  }>;
  analysis_results?: {
    diagnoses: string[];
    test_recommendations: string[];
    reasoning_summary: string;
    critique?: Record<string, unknown>;
  };
}

// Helper function to format dates in East Africa Time (EAT)
function formatToEAT(dateString: string): string {
  try {
    if (!dateString) return 'Unknown date';
    
    // Create date object from string
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', dateString);
      return 'Invalid date';
    }
    
    // Format to EAT (UTC+3)
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Africa/Nairobi',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    };
    
    // Use en-KE locale for East African format
    const formattedDate = new Intl.DateTimeFormat('en-KE', options).format(date);
    console.log(`Formatted date: ${dateString} → ${formattedDate}`);
    return formattedDate;
  } catch (error) {
    console.error('Error formatting date to EAT:', error, 'for date string:', dateString);
    
    // Fallback: Just display the raw date string
    return dateString || 'Unknown date';
  }
}

// Helper function to extract patient name from consultation data
function extractPatientName(consultation: Consultation): string {
  // First check if there's a name in patient_info
  if (consultation.patient_info?.name) {
    // Clean up the name - remove any gender identifiers that might have been included
    let name = consultation.patient_info.name;
    name = name.replace(/\s+a\s+(male|female|man|woman).*$/i, '');
    name = name.replace(/\s+an?\s+(adult|elderly|old|young)\s+(male|female|man|woman).*$/i, '');
    
    // Log the cleaned name for debugging
    logger.debug(`Extracted name (after cleanup): "${name}" from original: "${consultation.patient_info.name}"`);
    
    return name;
  }
  
  // If not, try to extract from conversation history if available
  if (consultation.conversation_history && consultation.conversation_history.length > 0) {
    // Look for messages where the user might introduce themselves
    for (const message of consultation.conversation_history) {
      if (message.role === 'user') {
        // Try to extract name using enhanced patterns
        const namePatterns = [
          /my name is\s+([A-Za-z\s\'\"]+?)(?:[.,]|\s+and|\s+i am|\s+i'm|\s+a\s+|\s+an\s+|\s+i've|$)/i,
          /i am\s+([A-Za-z\s\'\"]+?)(?:[.,]|\s+and|\s+i am|\s+a\s+|\s+an\s+|\s+i'm|\s+i've|$)/i,
          /i'm\s+([A-Za-z\s\'\"]+?)(?:[.,]|\s+and|\s+i am|\s+a\s+|\s+an\s+|\s+i'm|\s+i've|$)/i,
          /this is\s+([A-Za-z\s\'\"]+?)(?:[.,]|\s+and|\s+a\s+|\s+an\s+|$)/i,
          /call me\s+([A-Za-z\s\'\"]+?)(?:[.,]|\s+and|\s+a\s+|\s+an\s+|$)/i,
          /name:?\s+([A-Za-z\s\'\"]+?)(?:[.,]|\s+and|\s+a\s+|\s+an\s+|$)/i
        ];
        
        for (const pattern of namePatterns) {
          const match = message.content.match(pattern);
          if (match && match[1] && match[1].trim().length > 1) {
            let extractedName = match[1].trim();
            
            // Clean up the name - remove any gender identifiers
            extractedName = extractedName.replace(/\s+a\s+(male|female|man|woman).*$/i, '');
            extractedName = extractedName.replace(/\s+an?\s+(adult|elderly|old|young)\s+(male|female|man|woman).*$/i, '');
            
            // Filter out common false positives
            const commonPhrases = ['not sure', 'a patient', 'feeling', 'sick', 'not feeling well'];
            const isCommonPhrase = commonPhrases.some(phrase => 
              extractedName.toLowerCase().includes(phrase)
            );
            
            if (!isCommonPhrase && extractedName.length > 1 && extractedName.length < 40) {
              return extractedName;
            }
          }
        }
        
        // Fallback - look for name format at beginning of message
        if (/^[A-Z][a-z]+\b/.test(message.content)) {
          const firstWord = message.content.split(/\s+/)[0];
          if (firstWord && firstWord.length > 2 && firstWord.length < 40 && 
              !/^(I'm|I|The|My|This|It's|Its|His|Her|Their|Our|Your)/i.test(firstWord)) {
            return firstWord;
          }
        }
      }
    }
  }
  
  // If all else fails, use consultation ID as reference
  return `Patient ${consultation.consultation_id.substring(0, 8)}`;
}

export default function CaseDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch consultation data directly from the API
    const fetchConsultationDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Direct API call to get consultation data with history
        const timestamp = Date.now();
        const apiBaseUrl = config.AI_BACKEND_URL;
        const url = `${apiBaseUrl}/consultation/${params.id}?include_history=true&t=${timestamp}`;
        
        logger.info(`Fetching consultation details directly from: ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeouts.HEALTH_CHECK);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          cache: 'no-store',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch consultation: ${response.status}`);
        }
        
        const data = await response.json();
        logger.debug('Fetched consultation data:', data);
        
        // Add debugging for patient info and severity
        if (data.patient_info) {
          logger.debug('Patient info from API:', data.patient_info);
          
          // Clean any problematic name format
          if (data.patient_info.name) {
            const originalName = data.patient_info.name;
            data.patient_info.name = data.patient_info.name
              .replace(/\s+a\s+(male|female|man|woman).*$/i, '')
              .replace(/\s+an?\s+(adult|elderly|old|young)\s+(male|female|man|woman).*$/i, '');
            
            logger.debug(`Cleaned patient name: "${originalName}" → "${data.patient_info.name}"`);
          }
        }
        
        if (data.symptom_assessment?.severity) {
          logger.debug('Severity from API:', data.symptom_assessment.severity);
        }
        
        // Set the consultation data directly
        setConsultation(data);
      } catch (error) {
        logger.error('Error fetching consultation details:', error);
        setError('Failed to load consultation details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchConsultationDetails();
  }, [params.id]);

  // Update the formatDate function to use EAT
  const formatDate = useCallback((dateString: string): string => {
    if (!dateString) return 'Unknown date';
    return formatToEAT(dateString);
  }, []);

  // Handle submitting doctor's review
  const handleSubmitReview = useCallback(async () => {
    if (!doctorNotes.trim()) {
      alert('Please add some notes before submitting your review');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real implementation, you would send this to your backend
      // For now we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Review submitted successfully!');
      router.push('/doctors/dashboard');
    } catch (error) {
      logger.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [doctorNotes, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-color1"></div>
      </div>
    );
  }

  if (error || !consultation) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error || 'Consultation not found'}</span>
          </div>
        </div>
        <Link href="/doctors/dashboard" className="text-color1 hover:underline flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex items-center mb-2">
        <button 
          onClick={() => router.push('/doctors/dashboard')}
          className="flex items-center text-color1 hover:text-color2 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Back to Cases</span>
        </button>
      </div>
      
      {/* Patient information and case details header */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Patient info card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 w-full md:w-1/3">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Patient Information</h2>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{extractPatientName(consultation)}</p>
            </div>
            
            {consultation.patient_info?.age && (
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <p className="font-medium">{consultation.patient_info.age} years</p>
              </div>
            )}
            
            {consultation.patient_info?.gender && (
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{consultation.patient_info.gender}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-gray-500">Case ID</p>
              <p className="font-medium font-mono text-sm">{consultation.consultation_id}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Date Created</p>
              <p className="font-medium">{formatDate(consultation.created_at)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium">{formatDate(consultation.updated_at || consultation.created_at)}</p>
            </div>
          </div>
        </div>
        
        {/* Status and actions section */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">Case Status</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              consultation.stage === 'COMPLETED' ? 'bg-green-100 text-green-800' :
              consultation.stage === 'TREATMENT_PLAN' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {consultation.stage === 'DIAGNOSIS' ? 'Pending Review' :
               consultation.stage === 'TREATMENT_PLAN' ? 'In Review' :
               consultation.stage === 'COMPLETED' ? 'Complete' : 'Awaiting Tests'}
            </span>
          </div>
          
          {consultation.symptom_assessment?.severity !== undefined && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Severity Level</p>
              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium mr-2 ${
                  consultation.symptom_assessment.severity >= 8 ? 'bg-red-100 text-red-800' :
                  consultation.symptom_assessment.severity >= 5 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {consultation.symptom_assessment.severity >= 8 ? 'High' :
                   consultation.symptom_assessment.severity >= 5 ? 'Medium' : 'Low'}
                </span>
                <span className="text-sm text-gray-700">
                  {consultation.symptom_assessment.severity}/10
                </span>
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Chief Complaint</p>
            <p className="font-medium">{consultation.chief_complaint?.complaint || 'Not specified'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Action Required</p>
            {consultation.stage === 'COMPLETED' ? (
              <div className="flex items-center text-green-600">
                <Check className="h-5 w-5 mr-1" />
                <span>No action required - case is complete</span>
              </div>
            ) : (
              <div className="flex items-center text-color1">
                <AlertCircle className="h-5 w-5 mr-1" />
                <span>Review required</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex overflow-x-auto">
          <button
            className={`py-4 px-6 text-sm font-medium border-b-2 -mb-px ${
              activeTab === 'summary' ? 'border-color1 text-color1' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button
            className={`py-4 px-6 text-sm font-medium border-b-2 -mb-px ${
              activeTab === 'details' ? 'border-color1 text-color1' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Case Details
          </button>
          <button
            className={`py-4 px-6 text-sm font-medium border-b-2 -mb-px ${
              activeTab === 'diagnosis' ? 'border-color1 text-color1' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('diagnosis')}
          >
            Diagnosis
          </button>
          <button
            className={`py-4 px-6 text-sm font-medium border-b-2 -mb-px ${
              activeTab === 'treatment' ? 'border-color1 text-color1' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('treatment')}
          >
            Treatment Plan
          </button>
          <button
            className={`py-4 px-6 text-sm font-medium border-b-2 -mb-px ${
              activeTab === 'conversation' ? 'border-color1 text-color1' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('conversation')}
          >
            Conversation
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="mb-8">
        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Consultation Summary</h2>
              
              <div className="space-y-4">
                {consultation.chief_complaint && (
                  <div>
                    <p className="text-sm text-gray-500">Chief Complaint</p>
                    <p className="font-medium">{consultation.chief_complaint.complaint}</p>
                  </div>
                )}
                
                {consultation.final_diagnosis && (
                  <div>
                    <p className="text-sm text-gray-500">AI Diagnosis</p>
                    <p className="font-medium text-color1">{consultation.final_diagnosis}</p>
                  </div>
                )}
                
                {consultation.treatment_plan && (
                  <div>
                    <p className="text-sm text-gray-500">Treatment Goal</p>
                    <p className="font-medium">{consultation.treatment_plan.goal}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Case Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {consultation.symptom_assessment && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Symptom Assessment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{consultation.symptom_assessment.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Onset</p>
                    <p className="font-medium">{consultation.symptom_assessment.onset}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quality</p>
                    <p className="font-medium">{consultation.symptom_assessment.quality}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Timing Pattern</p>
                    <p className="font-medium">{consultation.symptom_assessment.timing_pattern}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Severity</p>
                    <p className="font-medium">{consultation.symptom_assessment.severity}/10</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Consultation Timeline</h2>
              <div className="space-y-3">
                <div className="flex">
                  <div className="flex-shrink-0 h-4 w-4 rounded-full bg-green-500 mt-1 mr-3"></div>
                  <div>
                    <p className="font-medium">Consultation Created</p>
                    <p className="text-sm text-gray-500">{formatDate(consultation.created_at)}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-500 mt-1 mr-3"></div>
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-sm text-gray-500">{formatDate(consultation.updated_at)}</p>
                  </div>
                </div>
                
                {(consultation.stage === 'DIAGNOSIS' || consultation.stage === 'TREATMENT_PLAN' || consultation.stage === 'COMPLETED') && consultation.final_diagnosis && (
                  <div className="flex">
                    <div className="flex-shrink-0 h-4 w-4 rounded-full bg-purple-500 mt-1 mr-3"></div>
                    <div>
                      <p className="font-medium">Diagnosis Generated</p>
                      <p className="text-sm text-gray-500">{consultation.final_diagnosis}</p>
                    </div>
                  </div>
                )}
                
                {(consultation.stage === 'TREATMENT_PLAN' || consultation.stage === 'COMPLETED') && consultation.treatment_plan && (
                  <div className="flex">
                    <div className="flex-shrink-0 h-4 w-4 rounded-full bg-yellow-500 mt-1 mr-3"></div>
                    <div>
                      <p className="font-medium">Treatment Plan Created</p>
                      <p className="text-sm text-gray-500">{consultation.treatment_plan.goal}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Diagnosis Tab */}
        {activeTab === 'diagnosis' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Diagnosis Information</h2>
              
              {consultation.final_diagnosis ? (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Final Diagnosis</p>
                  <p className="text-xl font-bold text-color1">{consultation.final_diagnosis}</p>
                </div>
              ) : (
                <p className="text-yellow-600 mb-4">No final diagnosis has been determined yet.</p>
              )}
              
              {consultation.diagnoses && consultation.diagnoses.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Differential Diagnoses</p>
                  <ul className="list-disc list-inside space-y-1">
                    {consultation.diagnoses.map((diagnosis, index) => (
                      <li key={index} className="font-medium">
                        {diagnosis}
                        {index === 0 && <span className="ml-2 text-blue-600 text-sm">(Primary)</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {consultation.analysis_results?.reasoning_summary && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Diagnostic Reasoning</p>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="whitespace-pre-line">{consultation.analysis_results.reasoning_summary}</p>
                  </div>
                </div>
              )}
            </div>
            
            {consultation.analysis_results?.test_recommendations && consultation.analysis_results.test_recommendations.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Recommended Tests</h2>
                <ul className="list-disc list-inside space-y-1">
                  {consultation.analysis_results.test_recommendations.map((test, index) => (
                    <li key={index} className="font-medium">{test}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* Treatment Plan Tab */}
        {activeTab === 'treatment' && (
          <div className="space-y-6">
            {consultation.treatment_plan ? (
              <>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold mb-4">Treatment Goal</h2>
                  <p className="whitespace-pre-line">{consultation.treatment_plan.goal}</p>
                </div>
                
                {consultation.treatment_plan.prescription && consultation.treatment_plan.prescription.medications && consultation.treatment_plan.prescription.medications.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">Medications</h2>
                    <div className="space-y-4">
                      {consultation.treatment_plan.prescription.medications.map((medication, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-md">
                          <p className="font-semibold">{medication.name}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                            <div>
                              <p className="text-sm text-gray-500">Dosage</p>
                              <p>{medication.dosage}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Frequency</p>
                              <p>{medication.frequency}</p>
                            </div>
                            {medication.duration && (
                              <div>
                                <p className="text-sm text-gray-500">Duration</p>
                                <p>{medication.duration}</p>
                              </div>
                            )}
                            {medication.special_instructions && (
                              <div>
                                <p className="text-sm text-gray-500">Special Instructions</p>
                                <p>{medication.special_instructions}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {consultation.treatment_plan.lifestyle_modifications && consultation.treatment_plan.lifestyle_modifications.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">Lifestyle Recommendations</h2>
                    <ul className="list-disc list-inside space-y-1">
                      {consultation.treatment_plan.lifestyle_modifications.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {consultation.treatment_plan.follow_up && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">Follow-up Plan</h2>
                    <p>{consultation.treatment_plan.follow_up}</p>
                  </div>
                )}
                
                {consultation.treatment_plan.monitoring && consultation.treatment_plan.monitoring.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">Monitoring Recommendations</h2>
                    <ul className="list-disc list-inside space-y-1">
                      {consultation.treatment_plan.monitoring.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-md">
                <h2 className="text-lg font-semibold mb-2">No Treatment Plan Available</h2>
                <p>This consultation does not have a treatment plan yet.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Conversation Tab */}
        {activeTab === 'conversation' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Patient-AI Conversation</h2>
            
            {consultation.conversation_history && consultation.conversation_history.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {consultation.conversation_history.map((message, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg ${
                      message.role === 'assistant' 
                        ? 'bg-blue-50 ml-8' 
                        : 'bg-gray-50 mr-8'
                    }`}
                  >
                    <p className="text-xs font-medium mb-1 text-gray-500">
                      {message.role === 'assistant' ? 'AI Assistant' : 'Patient'}
                    </p>
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No conversation history available.</p>
            )}
          </div>
        )}
      </div>
      
      {/* Doctor's Review Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Doctor&apos;s Review</h2>
        
        <div className="mb-4">
          <label htmlFor="doctor-notes" className="block text-sm font-medium text-gray-700 mb-2">
            Your Notes
          </label>
          <textarea
            id="doctor-notes"
            rows={4}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-color1 focus:border-transparent"
            placeholder="Add your notes, observations, and recommendations..."
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={() => router.push('/doctors/dashboard')}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-color1 text-white rounded-md hover:bg-color2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmitReview}
            disabled={isSubmitting || !doctorNotes.trim()}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
}