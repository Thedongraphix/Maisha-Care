'use client';
import React, { useState } from 'react';
import ConsultationModal from '@/components/consultation/ConsultationModal';

const ConsultationFlow = () => {
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  
  const closeConsultationModal = () => setShowConsultationModal(false);

  return (
    <>
      {/* Consultation Modal Component */}
      {showConsultationModal && (
        <ConsultationModal onClose={closeConsultationModal} />
      )}
    </>
  );
};

export default ConsultationFlow;