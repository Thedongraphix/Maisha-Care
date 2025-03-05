'use client';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import ConsultationSelection from './ConsultationSelection';
import ActiveConsultation from './ActiveConsultation';

interface ConsultationModalProps {
  onClose: () => void;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({ onClose }) => {
  const [activeConsultation, setActiveConsultation] = useState<string | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const startConsultation = (type: string) => {
    setActiveConsultation(type);
  };

  const handleClose = () => {
    if (isFinalizing) return; // Prevent closing during finalization
    onClose();
    
    // Reset states after modal animation completes
    setTimeout(() => {
      setActiveConsultation(null);
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4">
      <div 
        className={`bg-white w-full sm:rounded-2xl shadow-2xl 
        ${activeConsultation 
          ? 'h-full sm:h-[80vh] sm:max-h-[800px]' 
          : 'h-auto sm:max-w-2xl mx-auto'
        } 
        ${activeConsultation ? 'sm:max-w-4xl' : ''}`}
      >
        {/* Close button - moved inside for mobile */}
        <button 
          onClick={handleClose}
          disabled={isFinalizing}
          className={`absolute top-3 right-3 text-gray-500 hover:text-gray-800 z-10 
          transition-colors bg-white/80 backdrop-blur-sm rounded-full p-1.5 ${
            isFinalizing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <X className="w-5 h-5" />
        </button>
        {!activeConsultation ? (
          <ConsultationSelection onSelect={startConsultation} />
        ) : (
          <ActiveConsultation 
            consultationType={activeConsultation} 
            onClose={handleClose}
            setIsFinalizing={setIsFinalizing}
            isFinalizing={isFinalizing}
          />
        )}
      </div>
    </div>
  );
};

export default ConsultationModal;