'use client';
import { useState } from 'react';
import ConsultationModal from '@/components/consultation/ConsultationModal';

export const useConsultation = () => {
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  
  const openConsultationModal = () => setShowConsultationModal(true);
  const closeConsultationModal = () => setShowConsultationModal(false);
  
  const ConsultationModalComponent = showConsultationModal ? (
    <ConsultationModal onClose={closeConsultationModal} />
  ) : null;
  
  return {
    openConsultationModal,
    ConsultationModalComponent
  };
};