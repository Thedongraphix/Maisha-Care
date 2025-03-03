import React from 'react';
import { X, Paperclip } from 'lucide-react';
import { Message, UploadedFile } from '@/app/consultation/types';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageListProps {
  messages: Message[];
  uploadedFiles: UploadedFile[];
  removeFile: (fileId: number) => void;
  isSubmitting: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  uploadedFiles, 
  removeFile, 
  isSubmitting, 
  messagesEndRef 
}) => {
  // Format time for messages
  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col space-y-3 sm:space-y-4">
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <motion.div 
            key={message.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              delay: index * 0.05
            }}
            className={`max-w-[85%] sm:max-w-[80%] ${
              message.sender === 'user' 
                ? 'ml-auto bg-gradient-to-r from-color1 to-color4 text-white' 
                : 'mr-auto bg-white border border-gray-100 text-gray-800'
            } rounded-2xl p-3 sm:p-4 shadow-sm relative`}
          >
            <div className="text-sm sm:text-base mb-1">{message.text}</div>
            <div 
              className={`text-[10px] sm:text-xs ${
                message.sender === 'user' ? 'text-white/70' : 'text-gray-400'
              } text-right mt-1`}
            >
              {formatTime(message.timestamp)}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* File uploads section */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border border-gray-100 rounded-xl p-3 sm:p-4 bg-white shadow-sm"
          >
            <h4 className="font-medium text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3">Uploaded files:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <AnimatePresence>
                {uploadedFiles.map(file => (
                  <motion.div 
                    key={file.id} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, x: -10 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="bg-gray-50 rounded-lg p-2 text-xs sm:text-sm flex items-center justify-between group hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center overflow-hidden">
                      <Paperclip className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-color1 flex-shrink-0" />
                      <span className="truncate text-gray-700">{file.name}</span>
                    </div>
                    <motion.button 
                      onClick={() => removeFile(file.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                      <X className="w-3 h-3" />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Typing indicator when waiting for AI response */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mr-auto bg-white border border-gray-100 rounded-2xl p-4 shadow-sm max-w-[80%]"
          >
            <div className="flex space-x-2">
              <motion.div 
                className="w-2 h-2 rounded-full bg-color1/40"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
              ></motion.div>
              <motion.div 
                className="w-2 h-2 rounded-full bg-color1/60"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
              ></motion.div>
              <motion.div 
                className="w-2 h-2 rounded-full bg-color1/80"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
              ></motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reference for auto-scrolling */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;