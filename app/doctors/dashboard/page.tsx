'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Clock, ChevronDown, AlertCircle, Check, FileText, RefreshCw } from 'lucide-react';
import logger from '../../../lib/logger';

// Define consultation interface matching the AI's output
interface Consultation {
  consultation_id: string;
  created_at: string;
  updated_at: string;
  stage: string;
  patient_info?: {
    name?: string;
    age?: number;
    gender?: string;
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
    prescription?: {
      medications: Array<{
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
      }>;
    };
  };
  analysis_results?: {
    diagnoses: string[];
    test_recommendations: string[];
    reasoning_summary: string;
  };
  conversation_history?: Array<{
    role: string;
    content: string;
  }>;
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
  
  // If we still don't have a name, check if there's an ID we can use
  if (consultation.patient_info?.id) {
    return `Patient ${consultation.patient_info.id}`;
  }
  
  // If all else fails, use consultation ID as reference
  return `Patient ${consultation.consultation_id.substring(0, 8)}`;
}

// Function to map API stage to UI status
function mapStageToStatus(stage: string): string {
  switch (stage) {
    case 'DIAGNOSIS':
      return 'Pending Review';
    case 'TREATMENT_PLAN':
      return 'In Review';
    case 'COMPLETED':
      return 'Complete';
    default:
      return 'Awaiting Tests';
  }
}

// Function to map severity to urgency
function mapSeverityToUrgency(severity?: number): 'Low' | 'Medium' | 'High' {
  if (!severity) return 'Medium';
  if (severity >= 8) return 'High';
  if (severity >= 5) return 'Medium';
  return 'Low';
}

export default function DoctorDashboard() {
  const router = useRouter();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('date');
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Memoize expensive operations
  const fetchConsultations = useCallback(async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      
      setError(null);
      
      // Add timestamp parameter to bust cache
      const timestamp = Date.now();
      const response = await fetch(`/api/doctor/consultations?t=${timestamp}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch consultations: ${response.status}`);
      }
      
      const data = await response.json();
      logger.info(`Fetched ${data.length} consultations at ${new Date().toLocaleTimeString()}`);
      
      // Log patient info from each consultation for debugging
      if (process.env.NODE_ENV !== 'production') {
        data.forEach((consultation: Consultation) => {
          logger.debug(`Consultation ${consultation.consultation_id} - Patient: ${extractPatientName(consultation)}`);
          logger.debug(`Patient info:`, consultation.patient_info);
          if (consultation.symptom_assessment) {
            logger.debug(`Severity: ${consultation.symptom_assessment.severity}`);
          }
        });
      }
      
      setConsultations(data);
      // Update with EAT formatting
      setLastFetchTime(formatToEAT(new Date().toISOString()));
    } catch (error) {
      logger.error('Error fetching consultations:', error);
      setError('Failed to load consultations. Please try again.');
      
      // No mock data - we only want to show real data
      setConsultations([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Refresh button handler
  const handleRefresh = useCallback(() => {
    fetchConsultations(false);
  }, [fetchConsultations]);

  useEffect(() => {
    // Initial fetch
    fetchConsultations();
    
    // Set up interval to fetch data every 15 seconds
    const interval = setInterval(() => {
      logger.debug('Auto-refreshing data...');
      fetchConsultations(false);
    }, 15000); // 15 seconds
    
    return () => clearInterval(interval);
  }, [fetchConsultations]);

  // Using useMemo to optimize filtering and sorting operations
  const filteredConsultations = useMemo(() => {
    return consultations
      .filter(c => {
        // Apply status filter
        if (statusFilter !== 'All') {
          return mapStageToStatus(c.stage) === statusFilter;
        }
        return true;
      })
      .filter(c => {
        // Apply search filter
        if (!searchTerm) return true;
        
        const patientName = extractPatientName(c).toLowerCase();
        const consultation_id = c.consultation_id.toLowerCase();
        const complaint = c.chief_complaint?.complaint?.toLowerCase() || '';
        
        return patientName.includes(searchTerm.toLowerCase()) || 
              consultation_id.includes(searchTerm.toLowerCase()) ||
              complaint.includes(searchTerm.toLowerCase());
      });
  }, [consultations, statusFilter, searchTerm]);

  // Sort consultations - also memoized
  const sortedConsultations = useMemo(() => {
    return [...filteredConsultations].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime();
      } else if (sortBy === 'urgency') {
        const severityA = a.symptom_assessment?.severity || 0;
        const severityB = b.symptom_assessment?.severity || 0;
        return severityB - severityA;
      }
      return 0;
    });
  }, [filteredConsultations, sortBy]);

  // Handle clicking on a consultation to view details
  const handleConsultationClick = useCallback((consultationId: string) => {
    router.push(`/doctors/dashboard/case/${consultationId}`);
  }, [router]);

  // Get status badge style based on stage
  const getStatusBadgeStyle = (stage: string) => {
    const status = mapStageToStatus(stage);
    switch(status) {
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Review':
        return 'bg-blue-100 text-blue-800';
      case 'Awaiting Tests':
        return 'bg-purple-100 text-purple-800';
      case 'Complete':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get urgency badge style
  const getUrgencyBadgeStyle = (severity?: number) => {
    const urgency = mapSeverityToUrgency(severity);
    switch(urgency) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Patient Cases</h1>
        
        <div className="flex items-center gap-3">
          {lastFetchTime && (
            <span className="text-sm text-gray-500">Last updated: {lastFetchTime}</span>
          )}
          <button 
            onClick={handleRefresh} 
            className="flex items-center px-3 py-2 bg-color1 text-white rounded-md hover:bg-color2 transition-colors"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative max-w-xs">
        <input
          type="text"
          placeholder="Search cases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-color1/30 focus:border-color1"
        />
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Status filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-color1/30 focus:border-color1"
          >
            <option value="All">All Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="In Review">In Review</option>
            <option value="Awaiting Tests">Awaiting Tests</option>
            <option value="Complete">Complete</option>
          </select>
          <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>

        {/* Sort by filter */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pl-9 pr-8 py-2 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-color1/30 focus:border-color1"
          >
            <option value="date">Sort by Date</option>
            <option value="urgency">Sort by Urgency</option>
          </select>
          <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Cases list */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-color1"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedConsultations.map((consultation) => {
            const patientName = extractPatientName(consultation);
            const status = mapStageToStatus(consultation.stage);
            const urgency = mapSeverityToUrgency(consultation.symptom_assessment?.severity);
            
            return (
              <div 
                key={consultation.consultation_id}
                onClick={() => handleConsultationClick(consultation.consultation_id)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="font-semibold text-lg text-gray-900">{patientName}</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyBadgeStyle(consultation.symptom_assessment?.severity)}`}>
                    {urgency}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <div>
                    {consultation.patient_info?.age && consultation.patient_info?.gender 
                      ? `${consultation.patient_info.age} years, ${consultation.patient_info.gender}`
                      : 'No patient details'}
                  </div>
                </div>
                
                <div className="text-sm text-gray-700 mb-3 line-clamp-2">
                  {consultation.chief_complaint?.complaint || 'No chief complaint'}
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="mr-1.5 h-4 w-4" />
                  <span>{formatToEAT(consultation.updated_at || consultation.created_at)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(consultation.stage)}`}>
                    {status}
                  </span>
                  
                  {status === 'Pending Review' && (
                    <span className="flex items-center text-xs text-color1 font-medium">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Needs review
                    </span>
                  )}
                  
                  {status === 'Complete' && (
                    <span className="flex items-center text-xs text-green-600 font-medium">
                      <Check className="mr-1 h-3 w-3" />
                      Completed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Empty state */}
      {!loading && sortedConsultations.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="bg-gray-100 p-3 rounded-full mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No cases found</h3>
          <p className="text-gray-500 max-w-md">
            {statusFilter !== 'All' 
              ? `There are no cases with status "${statusFilter}".` 
              : searchTerm 
                ? `No cases match your search for "${searchTerm}".` 
                : "There are no cases available at the moment."}
          </p>
        </div>
      )}
    </div>
  );
}