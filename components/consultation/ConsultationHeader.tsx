import React from 'react';
import { MessageSquare, Mic, X } from 'lucide-react';

interface ConsultationHeaderProps {
  consultationType: string;
  onClose: () => void;
}

const ConsultationHeader: React.FC<ConsultationHeaderProps> = ({ consultationType, onClose }) => {
  return (
    <div className="bg-gradient-to-r from-color1 to-color4 text-white p-4 flex items-center">
      <div className="flex-1 flex items-center gap-2">
        {consultationType === 'text' ? (
          <MessageSquare className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
        <h3 className="font-semibold">
          {consultationType === 'text' ? 'Text Consultation' : 'Voice Consultation'}
        </h3>
      </div>
      <div className="bg-white/20 px-3 py-1 rounded-full text-sm flex items-center gap-1">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        AI Assistant: Dr. Maisha
      </div>
      <button 
        onClick={onClose}
        className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Close consultation"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ConsultationHeader;