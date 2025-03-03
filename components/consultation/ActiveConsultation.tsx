'use client';
import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import ConsultationHeader from '@/components/consultation/ConsultationHeader';
import ProgressBar from '@/components/consultation/ProgressBar';
import MessageList from '@/components/consultation/MessageList';
import VoiceConsultation from '@/components/consultation/VoiceConsultation';
import InputArea from '@/components/consultation/InputArea';

// Types
import { Message, UploadedFile } from '@/app/consultation/types';

interface ActiveConsultationProps {
  consultationType: string;
  onClose: () => void;
  setIsFinalizing: (value: boolean) => void;
  isFinalizing: boolean;
}

const ActiveConsultation: React.FC<ActiveConsultationProps> = ({ 
  consultationType, 
  onClose,
  setIsFinalizing,
  isFinalizing
}) => {
  // States
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I'm Dr. AI. Please describe your symptoms so I can help you today.", sender: 'ai', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [progress, setProgress] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Message handling functions
  const sendMessage = () => {
    if (!inputText.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Add user message with timestamp
    const newMessages = [
      ...messages, 
      { 
        id: Date.now(), 
        text: inputText, 
        sender: 'user' as const, 
        timestamp: new Date() 
      }
    ];
    
    setMessages(newMessages);
    setInputText('');
    
    // Simulate AI response after a delay
    setTimeout(() => {
      let aiResponse: string;
      
      // Different responses based on progress
      switch(progress) {
        case 1:
          aiResponse = "I understand. Can you tell me how long you've been experiencing these symptoms?";
          break;
        case 2:
          aiResponse = "Thank you for the details. Are you currently taking any medications?";
          break;
        case 3:
          aiResponse = "That's helpful information. Do you have any relevant medical history I should be aware of?";
          break;
        case 4:
          aiResponse = "Based on the information you've provided, I have some initial thoughts. Would you like to upload any relevant medical documents or images for a more accurate assessment?";
          break;
        default:
          aiResponse = "Thank you for all this information. I've analyzed your symptoms and have prepared some recommendations. Would you like to finalize this consultation?";
      }
      
      setMessages([
        ...newMessages, 
        { 
          id: Date.now(), 
          text: aiResponse, 
          sender: 'ai' as const,
          timestamp: new Date()
        }
      ]);
      
      setProgress(Math.min(5, progress + 1));
      setIsSubmitting(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      
      // Simulate processing voice message
      setIsSubmitting(true);
      setTimeout(() => {
        const aiResponse = {
          id: Date.now(),
          text: "I've processed your voice message. Can you provide any additional details about your symptoms?",
          sender: 'ai' as const,
          timestamp: new Date()
        };
        
        setMessages([...messages, aiResponse]);
        setProgress(Math.min(5, progress + 1));
        setIsSubmitting(false);
      }, 2000);
    } else {
      // Start recording
      setIsRecording(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: UploadedFile[] = Array.from(e.target.files).map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type
      }));
      
      setUploadedFiles([...uploadedFiles, ...newFiles]);
      
      // Add message about uploaded files
      setMessages([
        ...messages,
        {
          id: Date.now(),
          text: `Uploaded ${newFiles.length} file${newFiles.length > 1 ? 's' : ''}: ${newFiles.map(f => f.name).join(', ')}`,
          sender: 'user',
          timestamp: new Date()
        }
      ]);
      
      // AI response acknowledging files
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            text: `Thank you for uploading the file${newFiles.length > 1 ? 's' : ''}. I'll analyze ${newFiles.length > 1 ? 'them' : 'it'} along with your symptoms.`,
            sender: 'ai',
            timestamp: new Date()
          }
        ]);
      }, 1000);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const removeFile = (fileId: number) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId));
  };
  
  const finalizeCase = () => {
    setIsFinalizing(true);
    
    // Show processing message
    setMessages([
      ...messages,
      {
        id: Date.now(),
        text: "Processing your consultation and securely storing your data...",
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
    
    // Simulate blockchain/IPFS storage process
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: "Your consultation has been successfully processed and securely stored. You can access your diagnosis and recommendations in your patient dashboard.",
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
      
      setTimeout(() => {
        setIsFinalizing(false);
        onClose();
      }, 2000);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <ConsultationHeader consultationType={consultationType} />

      {/* Progress bar */}
      <ProgressBar progress={progress} />

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {consultationType === 'text' ? (
          <MessageList 
            messages={messages} 
            uploadedFiles={uploadedFiles} 
            removeFile={removeFile} 
            isSubmitting={isSubmitting} 
            messagesEndRef={messagesEndRef} 
          />
        ) : (
          <VoiceConsultation 
            isRecording={isRecording} 
            messages={messages} 
          />
        )}
      </div>
      
      {/* Input area */}
      <InputArea 
        consultationType={consultationType}
        inputText={inputText}
        setInputText={setInputText}
        sendMessage={sendMessage}
        handleKeyPress={handleKeyPress}
        toggleRecording={toggleRecording}
        isRecording={isRecording}
        handleFileUpload={handleFileUpload}
        fileInputRef={fileInputRef}
        isSubmitting={isSubmitting}
        isFinalizing={isFinalizing}
      />

      {/* Finalize button */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <button
          onClick={finalizeCase}
          disabled={progress < 3 || isFinalizing}
          className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            progress < 3 || isFinalizing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-color1 to-color4 text-white hover:shadow-md'
          }`}
        >
          {isFinalizing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Finalize Consultation
            </>
          )}
        </button>
        <p className="text-xs text-center text-gray-500 mt-2">
          {progress < 3 
            ? 'Continue the consultation to enable finalization'
            : 'Once finalized, your case will be securely encrypted and stored on the blockchain'}
        </p>
      </div>
    </div>
  );
};

export default ActiveConsultation;