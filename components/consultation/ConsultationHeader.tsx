import React from 'react';
import { MessageSquare, Mic, X, User, Shield } from 'lucide-react';

interface ConsultationHeaderProps {
  consultationType: string;
  onClose: () => void;
}

const ConsultationHeader: React.FC<ConsultationHeaderProps> = ({ consultationType, onClose }) => {
  return (
    <div className="bg-white border-b border-gray-200 p-3 sm:p-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-color1/10 text-color1 flex items-center justify-center mr-3">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Dr. Stacy</h3>
          <div className="flex items-center text-xs text-gray-500">
            <Shield className="w-3 h-3 mr-1" />
            <span>AI Medical Assistant</span>
            <span className="mx-2">•</span>
            {consultationType === 'text' ? (
              <div className="flex items-center">
                <MessageSquare className="w-3 h-3 mr-1 text-color1" />
                <span>Text Consultation</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Mic className="w-3 h-3 mr-1 text-color1" />
                <span>Voice Consultation</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <button
        onClick={onClose}
        className="bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-color1/30"
        aria-label="Close consultation"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ConsultationHeader;