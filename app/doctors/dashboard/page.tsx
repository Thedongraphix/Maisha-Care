'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Clock, ChevronDown, AlertCircle, Check, FileText } from 'lucide-react';

// Define case status types
type CaseStatus = 'Pending Review' | 'In Review' | 'Awaiting Tests' | 'Complete';

// Define case interface
interface Case {
  id: string;
  patientId: string;
  patientName: string;
  createdAt: string;
  status: CaseStatus;
  urgency: 'Low' | 'Medium' | 'High';
  age?: number;
  gender?: string;
  symptoms?: string[];
}

export default function DoctorDashboard() {
  const router = useRouter();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('date');

  // Mock data for initial development
  useEffect(() => {
    // In a real app, this would be an API call
    const mockCases: Case[] = [
      {
        id: 'case-001',
        patientId: 'P12345',
        patientName: 'John D.',
        createdAt: '2023-06-15T10:30:00',
        status: 'Pending Review',
        urgency: 'Medium',
        age: 45,
        gender: 'Male',
        symptoms: ['Fever', 'Cough', 'Fatigue']
      },
      {
        id: 'case-002',
        patientId: 'P54321',
        patientName: 'Sara K.',
        createdAt: '2023-06-16T14:45:00',
        status: 'In Review',
        urgency: 'High',
        age: 32,
        gender: 'Female',
        symptoms: ['Headache', 'Dizziness']
      },
      {
        id: 'case-003',
        patientId: 'P67890',
        patientName: 'Michael T.',
        createdAt: '2023-06-14T09:15:00',
        status: 'Complete',
        urgency: 'Low',
        age: 28,
        gender: 'Male',
        symptoms: ['Sore throat', 'Runny nose']
      },
      {
        id: 'case-004',
        patientId: 'P98765',
        patientName: 'Emily R.',
        createdAt: '2023-06-17T11:20:00',
        status: 'Awaiting Tests',
        urgency: 'Medium',
        age: 52,
        gender: 'Female',
        symptoms: ['Joint pain', 'Swelling']
      },
    ];

    // Simulate API delay
    setTimeout(() => {
      setCases(mockCases);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter cases by status
  const filteredCases = cases.filter(c => 
    statusFilter === 'All' ? true : c.status === statusFilter
  );

  // Sort cases by date or urgency
  const sortedCases = [...filteredCases].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'urgency') {
      const urgencyValues = { 'Low': 1, 'Medium': 2, 'High': 3 };
      return urgencyValues[b.urgency] - urgencyValues[a.urgency];
    }
    return 0;
  });

  // Handle case click to navigate to case details
  const handleCaseClick = (caseId: string) => {
    router.push(`/doctors/dashboard/case/${caseId}`);
  };

  // Get status badge style based on status
  const getStatusBadgeStyle = (status: CaseStatus) => {
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

  // Get urgency badge style based on urgency level
  const getUrgencyBadgeStyle = (urgency: string) => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Patient Cases</h1>
        
        {/* Search bar */}
        <div className="relative max-w-xs">
          <input
            type="text"
            placeholder="Search cases..."
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-color1/30 focus:border-color1"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
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

      {/* Cases list */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-color1"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCases.map((c) => (
            <div 
              key={c.id}
              onClick={() => handleCaseClick(c.id)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="font-semibold text-lg text-gray-900">{c.patientName}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyBadgeStyle(c.urgency)}`}>
                  {c.urgency}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <div>Patient ID: {c.patientId}</div>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Clock className="mr-1.5 h-4 w-4" />
                <span>{formatDate(c.createdAt)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(c.status)}`}>
                  {c.status}
                </span>
                
                {c.status === 'Pending Review' && (
                  <span className="flex items-center text-xs text-color1 font-medium">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Needs review
                  </span>
                )}
                
                {c.status === 'Complete' && (
                  <span className="flex items-center text-xs text-green-600 font-medium">
                    <Check className="mr-1 h-3 w-3" />
                    Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Empty state */}
      {!loading && sortedCases.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="bg-gray-100 p-3 rounded-full mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No cases found</h3>
          <p className="text-gray-500 max-w-md">
            {statusFilter !== 'All' 
              ? `There are no cases with status "${statusFilter}".` 
              : "You don't have any assigned cases yet."}
          </p>
        </div>
      )}
    </div>
  );
}