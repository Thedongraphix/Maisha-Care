import React from 'react';
import { MessageSquare, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConsultationSelectionProps {
  onSelectMethod: (type: string) => void;
}

const ConsultationSelection: React.FC<ConsultationSelectionProps> = ({ onSelectMethod }) => {
  return (
    <div className="min-h-[100dvh] sm:min-h-0 p-4 sm:p-8 pt-16 sm:pt-8 flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-color1 to-color4 bg-clip-text text-transparent">
          Choose Your Consultation Method
        </h2>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto text-sm sm:text-base">
          Select how you'd like to connect with our AI-powered healthcare system
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto w-full">
        <motion.button 
          onClick={() => onSelectMethod('text')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border-2 border-color1 text-color1 p-6 sm:p-8 rounded-2xl
            hover:bg-color1/5 transition-all duration-300 
            flex flex-col items-center group hover:shadow-lg"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-color1/10 rounded-full 
            flex items-center justify-center mb-4 
            group-hover:bg-color1/20 transition-colors"
          >
            <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Text Consultation</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Chat with our AI assistant to describe your symptoms
          </p>
        </motion.button>
        
        <motion.button 
          onClick={() => onSelectMethod('voice')}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border-2 border-color1 text-color1 p-6 sm:p-8 rounded-2xl
            hover:bg-color1/5 transition-all duration-300 
            flex flex-col items-center group hover:shadow-lg"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-color1/10 rounded-full 
            flex items-center justify-center mb-4 
            group-hover:bg-color1/20 transition-colors"
          >
            <Mic className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Voice Consultation</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Speak with our AI assistant using your microphone
          </p>
        </motion.button>
      </div>
    </div>
  );
};

export default ConsultationSelection;