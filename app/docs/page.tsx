'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NavBar from '@/components/shared/NavBar';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';
import { Search, Book, Code, ChevronRight, ArrowRight, Copy, Check } from 'lucide-react';

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('getting-started');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const docSections = [
    { id: 'getting-started', name: 'Getting Started', icon: Book },
    { id: 'guides', name: 'Guides', icon: Book },
    { id: 'api-reference', name: 'API Reference', icon: Code },
  ];

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-color4">Maisha Care Documentation</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about integrating and working with Maisha Care&apos;s healthcare platform.
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
              placeholder="Search documentation..."
            />
          </div>
        </div>
      </section>

      {/* Documentation Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="sticky top-24 bg-white rounded-xl shadow-sm p-6 space-y-2">
              <h3 className="font-semibold text-lg mb-4 text-color4">Documentation</h3>
              {docSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left transition-all ${
                    activeTab === section.id
                      ? 'bg-color1/10 text-color1 font-medium'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span>{section.name}</span>
                  {activeTab === section.id && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              {activeTab === 'getting-started' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-color4">Getting Started with Maisha Care</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Introduction</h3>
                      <p className="text-gray-600 mb-4">
                        Maisha Care is a blockchain-powered healthcare platform that connects patients with doctors for quick consultations. This guide will help you get started with integrating our services.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3">Installation</h3>
                      <p className="text-gray-600 mb-4">
                        You can install our SDK using npm or yarn:
                      </p>
                      <div className="relative">
                        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                          <code>npm install @maisha-care/sdk</code>
                        </pre>
                        <button 
                          onClick={() => copyToClipboard('npm install @maisha-care/sdk', 0)}
                          className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-800 hover:bg-gray-700"
                        >
                          {copiedIndex === 0 ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3">Quick Start</h3>
                      <p className="text-gray-600 mb-4">
                        Here&apos;s a simple example to integrate the consultation widget:
                      </p>
                      <div className="relative mb-6">
                        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                          <code>{`import { MaishaConsultation } from '@maisha-care/sdk';

// Initialize the consultation widget
const consultation = new MaishaConsultation({
  apiKey: 'YOUR_API_KEY',
  container: '#consultation-widget'
});

// Start the consultation process
consultation.start();`}</code>
                        </pre>
                        <button 
                          onClick={() => copyToClipboard(`import { MaishaConsultation } from '@maisha-care/sdk';\n\n// Initialize the consultation widget\nconst consultation = new MaishaConsultation({\n  apiKey: 'YOUR_API_KEY',\n  container: '#consultation-widget'\n});\n\n// Start the consultation process\nconsultation.start();`, 1)}
                          className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-800 hover:bg-gray-700"
                        >
                          {copiedIndex === 1 ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </button>
                      </div>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
                      <h4 className="font-semibold text-blue-700 mb-2">Need Help?</h4>
                      <p className="text-blue-600">
                        If you need assistance, check our community forum or contact our support team.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3">Next Steps</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Link 
                          href="#guides"
                          onClick={() => setActiveTab('guides')}
                          className="block p-4 bg-gray-50 hover:bg-color1/5 rounded-lg border border-gray-200 transition-colors"
                        >
                          <h4 className="font-semibold mb-2 flex items-center">
                            <Book className="mr-2 w-5 h-5 text-color1" />
                            Explore Guides
                          </h4>
                          <p className="text-sm text-gray-600">
                            Learn how to implement specific features and best practices
                          </p>
                        </Link>
                        <Link 
                          href="#api-reference"
                          onClick={() => setActiveTab('api-reference')}
                          className="block p-4 bg-gray-50 hover:bg-color1/5 rounded-lg border border-gray-200 transition-colors"
                        >
                          <h4 className="font-semibold mb-2 flex items-center">
                            <Code className="mr-2 w-5 h-5 text-color1" />
                            API Reference
                          </h4>
                          <p className="text-sm text-gray-600">
                            Detailed documentation of all available API endpoints
                          </p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'guides' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-color4">Maisha Care Implementation Guides</h2>
                  
                  <div className="space-y-8">
                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        {
                          title: "Patient Authentication",
                          description: "Learn how to securely authenticate patients using our blockchain system",
                          icon: Book
                        },
                        {
                          title: "Integrating AI Diagnosis",
                          description: "A guide to implementing AI-assisted diagnosis in your app",
                          icon: Book
                        },
                        {
                          title: "Doctor Consultations",
                          description: "How to set up and manage real-time doctor consultations",
                          icon: Book
                        },
                        {
                          title: "Medical Records",
                          description: "Securely storing and accessing medical records on the blockchain",
                          icon: Book
                        }
                      ].map((guide, index) => (
                        <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                          <div className="p-5">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 bg-color1/10 rounded-full flex items-center justify-center">
                                <guide.icon className="w-4 h-4 text-color1" />
                              </div>
                              <h3 className="font-semibold">{guide.title}</h3>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
                            <Link href="#" className="text-color1 font-medium text-sm inline-flex items-center">
                              Read guide <ArrowRight className="ml-1 w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-color1/5 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-3">Advanced Topics</h3>
                      <p className="text-gray-600 mb-4">
                        Explore advanced implementation guides for enterprise-level integrations.
                      </p>
                      <ul className="space-y-2">
                        {[
                          "Handling high-volume patient data",
                          "Multi-region deployment",
                          "Custom AI training for specific diagnoses",
                          "Regulatory compliance and security"
                        ].map((topic, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <ChevronRight className="w-4 h-4 text-color1 flex-shrink-0" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'api-reference' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-color4">API Reference</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Authentication</h3>
                      <p className="text-gray-600 mb-4">
                        All API requests must be authenticated using API keys or OAuth tokens.
                      </p>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                        <h4 className="text-lg font-medium mb-2">API Key Authentication</h4>
                        <p className="text-gray-600 mb-3">Include your API key in the Authorization header:</p>
                        <div className="relative">
                          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                            <code>Authorization: Bearer YOUR_API_KEY</code>
                          </pre>
                          <button 
                            onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY', 2)}
                            className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-800 hover:bg-gray-700"
                          >
                            {copiedIndex === 2 ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3">Endpoints</h3>
                      
                      <div className="divide-y divide-gray-200">
                        {[
                          {
                            method: 'GET',
                            path: '/api/v1/patients',
                            description: 'Retrieve a list of patients',
                            methodColor: 'bg-green-500'
                          },
                          {
                            method: 'POST',
                            path: '/api/v1/consultations',
                            description: 'Create a new consultation session',
                            methodColor: 'bg-blue-500'
                          },
                          {
                            method: 'GET',
                            path: '/api/v1/doctors',
                            description: 'Get available doctors',
                            methodColor: 'bg-green-500'
                          },
                          {
                            method: 'PUT',
                            path: '/api/v1/medical-records/:id',
                            description: 'Update a medical record',
                            methodColor: 'bg-yellow-500'
                          },
                          {
                            method: 'DELETE',
                            path: '/api/v1/consultations/:id',
                            description: 'Cancel a consultation',
                            methodColor: 'bg-red-500'
                          }
                        ].map((endpoint, index) => (
                          <div key={index} className="py-4 flex items-center">
                            <div className={`${endpoint.methodColor} text-white font-mono text-xs font-bold px-2 py-1 rounded-md w-16 text-center mr-4`}>
                              {endpoint.method}
                            </div>
                            <div className="font-mono text-sm mr-4">{endpoint.path}</div>
                            <div className="text-gray-600 text-sm">{endpoint.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6">
                      <Link href="/api-reference" className="inline-flex items-center text-color1 font-medium">
                        View complete API documentation <ArrowRight className="ml-1 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
} 