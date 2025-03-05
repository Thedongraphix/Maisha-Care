'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NavBar from '@/components/shared/NavBar';
import Footer from '@/components/shared/Footer';
import ActiveConsultation from '@/components/consultation/ActiveConsultation';
import ConsultationSelection from '@/components/consultation/ConsultationSelection';

const ConsultationPage = () => {
  const [activeConsultation, setActiveConsultation] = useState<string | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const startConsultation = (type: string) => {
    setActiveConsultation(type);
  };

  const closeConsultation = () => {
    if (isFinalizing) return; // Prevent closing during finalization
    
    // Reset states after animation completes
    setTimeout(() => {
      setActiveConsultation(null);
    }, 300);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-color1/5 to-white pt-24"
    >
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white sm:rounded-2xl shadow-lg overflow-hidden">
          {!activeConsultation ? (
            <ConsultationSelection onSelect={startConsultation} />
          ) : (
            <ActiveConsultation 
              consultationType={activeConsultation}
              onClose={closeConsultation}
              setIsFinalizing={setIsFinalizing}
              isFinalizing={isFinalizing}
            />
          )}
        </div>
      </div>
      
      <Footer />
    </motion.div>
  );
};

export default ConsultationPage;