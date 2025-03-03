'use client';
import React, { useState } from 'react';
import ConsultationModal from '@/components/consultation/ConsultationModal';

const ConsultationFlow = () => {
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  
  const openConsultationModal = () => setShowConsultationModal(true);
  const closeConsultationModal = () => setShowConsultationModal(false);

  return (
    <>
      {/* This button can be removed since we'll trigger from patients page */}
      <button 
        onClick={openConsultationModal}
        className="w-full bg-color1 text-white py-3 px-6 rounded-lg font-medium hover:bg-color1/90 transition-colors flex items-center justify-center gap-2 shadow-md"
      >
        Get Started Now
      </button>

      {/* Consultation Modal Component */}
      {showConsultationModal && (
        <ConsultationModal onClose={closeConsultationModal} />
      )}
    </>
  );
};

export default ConsultationFlow;