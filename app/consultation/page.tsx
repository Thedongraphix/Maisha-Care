'use client';
import React, { useState } from 'react';
// import { motion } from 'framer-motion'; // Removed as per user action
// import NavBar from '@/components/shared/NavBar'; // Assuming not used here or in layout
// import Footer from '@/components/shared/Footer'; // Assuming not used here or in layout
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import ActiveConsultation from '@/components/consultation/ActiveConsultation';

const ConsultationPage = () => {
  const [activeConsultationType, setActiveConsultationType] = useState<'text' | 'voice' | null>(null);
  const router = useRouter();

  const startConsultation = (type: 'text' | 'voice') => {
    setActiveConsultationType(type);
  };

  const handleConsultationClose = () => {
    setActiveConsultationType(null);
  };

  if (!activeConsultationType) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 bg-white shadow-xl rounded-lg min-h-[50vh]">
        <h2 className="text-3xl font-semibold mb-6 text-slate-800 font-grotesk">Start Your AI Consultation</h2>
        <p className="mb-8 text-slate-600 max-w-md">
          Choose your preferred method to interact with our AI health assistant, Dr. Stacy.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button 
            onClick={() => startConsultation('text')} 
            variant="default" 
            size="lg" 
            className="bg-indigo-600 hover:bg-indigo-700 px-8 py-6 text-lg"
          >
            Start Text Chat
          </Button>
          <Button 
            onClick={() => startConsultation('voice')} 
            variant="outline" 
            size="lg"
            className="px-8 py-6 text-lg border-indigo-600 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
          >
            Start Voice Chat (Beta)
          </Button>
        </div>
        <Button onClick={() => router.push('/')} variant="link" className="text-indigo-600 hover:text-indigo-800">
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    // Removed motion.div wrapper
    <div className="w-full">
      <ActiveConsultation 
        consultationType={activeConsultationType}
        onClose={handleConsultationClose}
      />
    </div>
  );
};

export default ConsultationPage;