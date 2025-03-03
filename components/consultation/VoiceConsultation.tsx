import React from 'react';
import { Mic } from 'lucide-react';
import { Message } from '@/app/consultation/types';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceConsultationProps {
  isRecording: boolean;
  messages: Message[];
}

const VoiceConsultation: React.FC<VoiceConsultationProps> = ({ isRecording, messages }) => {
  // Generate random heights for the audio visualization
  const generateBars = () => {
    return Array.from({ length: 30 }, () => Math.random() * 100);
  };
  
  const [barHeights, setBarHeights] = React.useState(generateBars());
  
  // Update bar heights while recording
  React.useEffect(() => {
    if (!isRecording) return;
    
    const interval = setInterval(() => {
      setBarHeights(generateBars());
    }, 100);
    
    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <motion.div 
        className={`w-40 h-40 rounded-full flex items-center justify-center mb-8 ${
          isRecording 
            ? 'bg-gradient-to-br from-red-50 to-red-100' 
            : 'bg-gradient-to-br from-gray-50 to-gray-100'
        }`}
        initial={{ scale: 0.9 }}
        animate={{ 
          scale: isRecording ? [1, 1.05, 1] : 1,
          boxShadow: isRecording 
            ? '0 0 0 rgba(239, 68, 68, 0.4)' 
            : '0 0 0 rgba(0, 0, 0, 0)'
        }}
        transition={{ 
          repeat: isRecording ? Infinity : 0, 
          duration: 2
        }}
      >
        <Mic className={`w-16 h-16 ${
          isRecording ? 'text-red-500' : 'text-gray-400'
        } transition-colors duration-300`} />
      </motion.div>
      
      <motion.h3 
        className="text-2xl font-medium mb-3 text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {isRecording ? 'Listening...' : 'Ready to listen'}
      </motion.h3>
      
      <motion.p 
        className="text-gray-500 mb-8 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {isRecording 
          ? 'Please speak clearly and describe your symptoms in detail' 
          : 'Press the microphone button to start speaking'}
      </motion.p>
      
      {/* Modern audio waveform visualization */}
      <AnimatePresence>
        {isRecording && (
          <motion.div 
            className="flex items-end justify-center gap-[2px] mb-10 h-24 w-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {barHeights.map((height, i) => (
              <motion.div 
                key={i}
                className="bg-gradient-to-t from-color1 to-color4 rounded-full w-1"
                initial={{ height: 4 }}
                animate={{ 
                  height: `${height * 0.4 + 4}px`,
                }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                  mass: 0.5
                }}
                style={{ 
                  opacity: height / 100,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show messages if any */}
      <AnimatePresence>
        {messages.length > 1 && (
          <motion.div 
            className="w-full max-w-md mt-4 border border-gray-100 rounded-xl p-4 bg-white shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <h4 className="font-medium text-sm text-gray-700 mb-2 text-left">Conversation:</h4>
            <div className="max-h-40 overflow-y-auto">
              {messages.map((message, index) => (
                <motion.div 
                  key={message.id}
                  className={`mb-2 text-sm p-2 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-gray-50 ml-4 border border-gray-100' 
                      : 'bg-color1/5 mr-4'
                  } text-left`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {message.text}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceConsultation;