import React from 'react';
import { X, Paperclip, FileText } from 'lucide-react';
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
    <div className="flex flex-col space-y-4 md:space-y-6 w-full max-w-4xl mx-auto">
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
            className={`max-w-[85%] md:max-w-[75%] ${
              message.sender === 'user' 
                ? 'ml-auto' 
                : 'mr-auto'
            }`}
          >
            <div className={`
              ${message.sender === 'user' 
                ? 'bg-gradient-to-r from-color1 to-color4 text-white rounded-2xl rounded-tr-sm' 
                : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm shadow-sm'}
              p-3.5 md:p-4
            `}>
              <div className="text-sm md:text-base mb-1">{message.text}</div>
              <div 
                className={`text-[10px] md:text-xs ${
                  message.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                } text-right`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
            {message.sender === 'ai' && (
              <div className="mt-1 ml-2 text-xs text-gray-500">Dr. Stacy</div>
            )}
            {message.sender === 'user' && (
              <div className="mt-1 mr-2 text-xs text-gray-500 text-right">You</div>
            )}
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
            className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm mx-auto w-full max-w-lg"
          >
            <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-color1" />
              Uploaded files
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <AnimatePresence>
                {uploadedFiles.map(file => (
                  <motion.div 
                    key={file.id} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, x: -10 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="bg-gray-50 rounded-lg p-2.5 text-sm flex items-center justify-between group hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center overflow-hidden">
                      <Paperclip className="w-4 h-4 mr-2 text-color1 flex-shrink-0" />
                      <span className="truncate text-gray-700">{file.name}</span>
                    </div>
                    <motion.button 
                      onClick={() => removeFile(file.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                      <X className="w-3.5 h-3.5" />
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
            className="mr-auto bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-4 shadow-sm max-w-[60%]"
          >
            <div className="text-sm text-gray-500">Dr. Stacy is typing...</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reference for auto-scrolling */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;