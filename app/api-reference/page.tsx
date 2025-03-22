'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NavBar from '@/components/shared/NavBar';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';
import { Search, Copy, Check, ChevronDown, ChevronUp, Code, BookOpen, FileJson, Shield, Star, Info, ArrowRight, ChevronRight } from 'lucide-react';

export default function ApiReferencePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openEndpoint, setOpenEndpoint] = useState<string | null>('get-patients');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('patients');

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleEndpoint = (id: string) => {
    setOpenEndpoint(openEndpoint === id ? null : id);
  };

  const apiCategories = [
    { id: 'authentication', name: 'Authentication', icon: Shield },
    { id: 'patients', name: 'Patients', icon: BookOpen },
    { id: 'doctors', name: 'Doctors', icon: Star },
    { id: 'consultations', name: 'Consultations', icon: Code },
    { id: 'medical-records', name: 'Medical Records', icon: FileJson },
  ];

  const endpoints = {
    patients: [
      {
        id: 'get-patients',
        method: 'GET',
        path: '/api/v1/patients',
        description: 'Retrieve a list of patients',
        parameters: [
          { name: 'limit', type: 'integer', description: 'Maximum number of records to return' },
          { name: 'offset', type: 'integer', description: 'Number of records to skip' },
          { name: 'status', type: 'string', description: 'Filter by patient status' }
        ],
        responses: [
          { code: '200', description: 'A paginated list of patients' },
          { code: '401', description: 'Unauthorized' },
          { code: '403', description: 'Forbidden' }
        ],
        example: {
          request: 'GET /api/v1/patients?limit=10&offset=0',
          response: `{
  "total": 120,
  "limit": 10,
  "offset": 0,
  "patients": [
    {
      "id": "p_1234567890",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "created_at": "2023-02-15T09:30:00Z",
      "status": "active"
    },
    // More patients...
  ]
}`
        }
      },
      {
        id: 'get-patient',
        method: 'GET',
        path: '/api/v1/patients/:id',
        description: 'Retrieve a specific patient',
        parameters: [
          { name: 'id', type: 'string', description: 'Patient ID', required: true }
        ],
        responses: [
          { code: '200', description: 'Patient details' },
          { code: '404', description: 'Patient not found' },
          { code: '401', description: 'Unauthorized' }
        ],
        example: {
          request: 'GET /api/v1/patients/p_1234567890',
          response: `{
  "id": "p_1234567890",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "dob": "1985-05-15",
  "gender": "male",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "postal_code": "12345",
    "country": "US"
  },
  "medical_history": [
    {
      "condition": "Hypertension",
      "diagnosed_at": "2019-08-24",
      "status": "ongoing"
    }
  ],
  "created_at": "2023-02-15T09:30:00Z",
  "updated_at": "2023-03-20T14:25:30Z",
  "status": "active"
}`
        }
      },
      {
        id: 'create-patient',
        method: 'POST',
        path: '/api/v1/patients',
        description: 'Create a new patient',
        parameters: [
          { name: 'name', type: 'string', description: 'Full name of the patient', required: true },
          { name: 'email', type: 'string', description: 'Email address', required: true },
          { name: 'phone', type: 'string', description: 'Phone number' },
          { name: 'dob', type: 'string', description: 'Date of birth (YYYY-MM-DD)', required: true },
          { name: 'gender', type: 'string', description: 'Gender (male/female/other)' },
          { name: 'address', type: 'object', description: 'Patient address' }
        ],
        responses: [
          { code: '201', description: 'Patient created successfully' },
          { code: '400', description: 'Invalid request data' },
          { code: '409', description: 'Email already exists' }
        ],
        example: {
          request: `POST /api/v1/patients
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+9876543210",
  "dob": "1990-08-20",
  "gender": "female",
  "address": {
    "street": "456 Oak Avenue",
    "city": "Metropolis",
    "state": "NY",
    "postal_code": "54321",
    "country": "US"
  }
}`,
          response: `{
  "id": "p_9876543210",
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+9876543210",
  "dob": "1990-08-20",
  "gender": "female",
  "address": {
    "street": "456 Oak Avenue",
    "city": "Metropolis",
    "state": "NY",
    "postal_code": "54321",
    "country": "US"
  },
  "created_at": "2023-05-18T10:25:00Z",
  "updated_at": "2023-05-18T10:25:00Z",
  "status": "active"
}`
        }
      }
    ],
    doctors: [
      // Doctor endpoints would be defined here
    ],
    consultations: [
      // Consultation endpoints would be defined here
    ],
    'medical-records': [
      // Medical Record endpoints would be defined here
    ],
    authentication: [
      // Authentication endpoints would be defined here
    ]
  };

  const currentEndpoints = endpoints[activeCategory as keyof typeof endpoints] || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-color1/5 to-white pt-24"
    >
      <NavBar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-color4">Maisha Care API Reference</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive documentation for the Maisha Care API, enabling you to integrate our healthcare services.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-color1 focus:border-transparent"
              placeholder="Search API endpoints..."
            />
          </div>
        </div>
      </section>

      {/* API Reference Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="sticky top-24 bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-6 text-color4">API Reference</h3>
              
              <div className="space-y-2">
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-500 mb-3">Base URL</div>
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <code className="text-sm text-color1">https://api.maishacare.com/v1</code>
                    <button 
                      onClick={() => copyToClipboard('https://api.maishacare.com/v1', 98)}
                      className="p-1 rounded-md hover:bg-gray-200"
                    >
                      {copiedIndex === 98 ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                    </button>
                  </div>
                </div>
                
                {apiCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left transition-all ${
                      activeCategory === category.id
                        ? 'bg-color1/10 text-color1 font-medium'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <category.icon className="w-5 h-5" />
                    <span>{category.name}</span>
                    {activeCategory === category.id && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link 
                  href="/docs"
                  className="flex items-center gap-2 text-color1 font-medium hover:underline"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Back to Documentation</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* API Introduction */}
              <div className="border-b border-gray-200 p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-4 text-color4">
                  {apiCategories.find(cat => cat.id === activeCategory)?.name || ''} API
                </h2>
                <p className="text-gray-600">
                  {activeCategory === 'patients' && "Endpoints for managing patient data, creating new patients, and retrieving patient information."}
                  {activeCategory === 'doctors' && "Endpoints for doctor profiles, availability, and specializations."}
                  {activeCategory === 'consultations' && "Endpoints for managing patient-doctor consultations."}
                  {activeCategory === 'medical-records' && "Endpoints for secure storage and retrieval of patient medical records."}
                  {activeCategory === 'authentication' && "Endpoints for authenticating users and managing API access."}
                </p>

                {activeCategory === 'authentication' && (
                  <div className="bg-color1/5 p-4 rounded-lg mt-6 flex items-start gap-3">
                    <Info className="w-5 h-5 text-color1 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Authentication Required</h4>
                      <p className="text-sm text-gray-600">All API requests require authentication using API keys or OAuth tokens.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Endpoints */}
              <div className="divide-y divide-gray-200">
                {currentEndpoints.length > 0 ? (
                  currentEndpoints.map((endpoint, index) => (
                    <div key={endpoint.id} className="p-6 md:p-8">
                      <div 
                        className="flex items-start justify-between cursor-pointer" 
                        onClick={() => toggleEndpoint(endpoint.id)}
                      >
                        <div className="flex items-start gap-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                            endpoint.method === 'GET' ? 'bg-green-500' :
                            endpoint.method === 'POST' ? 'bg-blue-500' :
                            endpoint.method === 'PUT' ? 'bg-yellow-500' :
                            endpoint.method === 'DELETE' ? 'bg-red-500' : 'bg-gray-500'
                          }`}>
                            {endpoint.method}
                          </span>
                          <div>
                            <h3 className="font-mono text-lg font-medium">{endpoint.path}</h3>
                            <p className="text-gray-600 mt-1">{endpoint.description}</p>
                          </div>
                        </div>
                        <button className="text-gray-400">
                          {openEndpoint === endpoint.id ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {openEndpoint === endpoint.id && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          {/* Parameters */}
                          {endpoint.parameters && endpoint.parameters.length > 0 && (
                            <div className="mb-8">
                              <h4 className="text-lg font-semibold mb-3">Parameters</h4>
                              <div className="bg-gray-50 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {endpoint.parameters.map((param, paramIndex) => (
                                      <tr key={paramIndex} className={paramIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{param.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{param.type}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{param.description}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{param.required ? 'Yes' : 'No'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Responses */}
                          {endpoint.responses && endpoint.responses.length > 0 && (
                            <div className="mb-8">
                              <h4 className="text-lg font-semibold mb-3">Responses</h4>
                              <div className="bg-gray-50 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Code</th>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {endpoint.responses.map((response, responseIndex) => (
                                      <tr key={responseIndex} className={responseIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{response.code}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{response.description}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Example */}
                          {endpoint.example && (
                            <div>
                              <h4 className="text-lg font-semibold mb-3">Example</h4>
                              
                              {/* Request */}
                              <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="text-sm font-medium text-gray-500">Request</h5>
                                  <button 
                                    onClick={() => copyToClipboard(endpoint.example.request, index)}
                                    className="p-1 rounded-md hover:bg-gray-200"
                                  >
                                    {copiedIndex === index ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                                  </button>
                                </div>
                                <div className="relative">
                                  <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm">
                                    <code>{endpoint.example.request}</code>
                                  </pre>
                                </div>
                              </div>
                              
                              {/* Response */}
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="text-sm font-medium text-gray-500">Response</h5>
                                  <button 
                                    onClick={() => copyToClipboard(endpoint.example.response, index + 100)}
                                    className="p-1 rounded-md hover:bg-gray-200"
                                  >
                                    {copiedIndex === index + 100 ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                                  </button>
                                </div>
                                <div className="relative">
                                  <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm">
                                    <code>{endpoint.example.response}</code>
                                  </pre>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="text-gray-400 mb-2">
                      <Code className="w-12 h-12 mx-auto opacity-30" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-1">No endpoints available</h3>
                    <p className="text-gray-500">This section is still under development</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
} 