'use client';
import React, { useState, useRef, useEffect } from 'react';
import ConsultationHeader from '@/components/consultation/ConsultationHeader';
import ProgressBar from '@/components/consultation/ProgressBar';
import MessageList from '@/components/consultation/MessageList';
import VoiceConsultation from '@/components/consultation/VoiceConsultation';
import InputArea from '@/components/consultation/InputArea';

// Types
import { Message, UploadedFile } from '@/app/consultation/types';
import { checkAPIHealth,} from '@/services/aiService';

// Import our improved chat service
import { sendMessageToAPI, uploadFileToAPI, AIResponse } from '@/services/chatService';

// Extend the UploadedFile type for our needs
interface ExtendedUploadedFile extends UploadedFile {
  size: number;
  url: string;
}

// Extended AIResponse for file uploads
interface FileUploadResponse extends AIResponse {
  fileUrl?: string;
  file_url?: string;
}

// Add this type definition at the beginning of the file, with other interfaces
type MessageRole = 'user' | 'assistant';

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
  const [uploadedFiles, setUploadedFiles] = useState<ExtendedUploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update state definition with the proper type
  const [conversationHistory, setConversationHistory] = useState<Array<{role: MessageRole, content: string}>>([
    { role: 'assistant' as MessageRole, content: "Hello! I'm Dr. AI. Please describe your symptoms so I can help you today." }
  ]);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Verify API connection on mount
  useEffect(() => {
    verifyAPIConnection();
  }, []);

  // Function to verify API connection
  const verifyAPIConnection = async () => {
    try {
      const result = await checkAPIHealth();
      console.log('API Health Check:', result);
      if (!result.isAvailable) {
        // Add message to inform user about API issues
        setMessages(prevMessages => [
          ...prevMessages,
          { 
            id: Date.now(), 
            text: "I'm having trouble connecting to the server. You can still describe your symptoms, but I might be running in offline mode.", 
            sender: 'ai', 
            timestamp: new Date() 
          }
        ]);
      }
    } catch (error) {
      console.error('API Connection Error:', error);
    }
  };

  // Fallback response when API is not available
  const sendFallbackMessage = () => {
    const fallbackResponses = [
      "I understand you're not feeling well. Could you provide more details about your symptoms?",
      "Thank you for sharing. Based on your description, you might want to consult with a healthcare professional.",
      "I'm analyzing your symptoms. It would help if you could tell me how long you've been experiencing them.",
    ];
    
    const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
    return {
      message: fallbackResponses[randomIndex]
    };
  };

  // Updated message handling function to use our improved chat service
  const sendMessage = async () => {
    if (!inputText.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Add user message with timestamp
    const userMessage = { 
      id: Date.now(), 
      text: inputText, 
      sender: 'user' as const, 
      timestamp: new Date() 
    };
    
    // Update messages state
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    
    // Update conversation history for API
    const updatedHistory = [
      ...conversationHistory,
      { role: 'user' as MessageRole, content: inputText }
    ];
    setConversationHistory(updatedHistory);
    
    try {
      // Add thinking message
      const thinkingId = Date.now() + 1;
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          id: thinkingId, 
          text: "Thinking...", 
          sender: 'ai', 
          timestamp: new Date() 
        }
      ]);
      
      // Get existing consultation ID if available
      const consultationId = localStorage.getItem('maisha_consultation_id');
      
      // Call the AI service API
      let aiResponse;
      
      try {
        console.log('Calling API with message:', inputText);
        
        // Use our improved chat service
        aiResponse = await sendMessageToAPI(inputText, consultationId);
        
        console.log('API Response:', aiResponse);
        
        // Store consultation ID if we received one
        if (aiResponse.consultation_id) {
          localStorage.setItem('maisha_consultation_id', aiResponse.consultation_id);
        }
      } catch (apiError) {
        console.error('API call failed, using fallback:', apiError);
        aiResponse = sendFallbackMessage();
      }
      
      // Remove thinking message and add real response
      setMessages(prevMessages => {
        // Filter out thinking message
        const filteredMessages = prevMessages.filter(msg => msg.id !== thinkingId);
        
        // Add AI response
        return [
          ...filteredMessages,
          { 
            id: Date.now() + 2, 
            text: aiResponse.message, 
            sender: 'ai', 
            timestamp: new Date() 
          }
        ];
      });
      
      // Update conversation history
      setConversationHistory([
        ...updatedHistory,
        { role: 'assistant' as MessageRole, content: aiResponse.message }
      ]);
      
      // Update progress if we have stage information
      if (aiResponse && typeof aiResponse === 'object' && 'stage' in aiResponse) {
        const stageValue = parseInt(String(aiResponse.stage));
        if (!isNaN(stageValue) && stageValue > progress) {
          setProgress(stageValue);
        }
      } else {
        // Fallback progress update
        setProgress(prev => Math.min(5, prev + 1));
      }
    } catch (error) {
      console.error('Error in message sending:', error);
      
      // Add error message
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          id: Date.now() + 3, 
          text: "I'm sorry, I encountered an error. Please try again.", 
          sender: 'ai', 
          timestamp: new Date() 
        }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle key press for input field
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Updated toggleRecording function for voice consultation
  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      
      // Simulate processing voice message
      setIsSubmitting(true);
      
      // Here you would normally:
      // 1. Convert audio to text
      // 2. Send text to AI API
      // For now, we'll use a placeholder message
      const transcribedText = "This is a simulated voice message";
      
      try {
        // Add user message
        const userMessage = {
          id: Date.now(),
          text: `[Voice Message]: ${transcribedText}`,
          sender: 'user' as const,
          timestamp: new Date()
        };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        
        // Update conversation history
        const updatedHistory = [
          ...conversationHistory,
          { role: 'user' as MessageRole, content: transcribedText }
        ];
        setConversationHistory(updatedHistory);
        
        // Call AI API with transcribed text (with fallback)
        let aiResponse;
        try {
          aiResponse = await sendMessageToAPI(transcribedText, localStorage.getItem('maisha_consultation_id'));
        } catch (apiError) {
          console.error('API call failed for voice message, using fallback:', apiError);
          aiResponse = sendFallbackMessage();
        }
        
        // Add AI response
        const newAIMessage = {
          id: Date.now(),
          text: aiResponse.message,
          sender: 'ai' as const,
          timestamp: new Date()
        };
        setMessages(prevMessages => [...prevMessages, newAIMessage]);
        
        // Update conversation history
        setConversationHistory([
          ...updatedHistory,
          { role: 'assistant' as MessageRole, content: aiResponse.message }
        ]);
        
        // Update progress
        if (aiResponse && typeof aiResponse === 'object' && 'stage' in aiResponse) {
          const stageValue = parseInt(String(aiResponse.stage));
          if (!isNaN(stageValue) && stageValue > progress) {
            setProgress(stageValue);
          }
        }
      } catch (error) {
        // Handle error
        setMessages(prevMessages => [
          ...prevMessages, 
          { 
            id: Date.now(), 
            text: "I'm sorry, I couldn't process your voice message. Please try again or type your message.", 
            sender: 'ai' as const,
            timestamp: new Date()
          }
        ]);
        console.error('Error processing voice message:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Start recording
      setIsRecording(true);
    }
  };

  // Handle removing an uploaded file
  const removeFile = (fileId: number) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    
    // Notify user that file was removed
    setMessages(prevMessages => [
      ...prevMessages,
      { 
        id: Date.now(), 
        text: "File has been removed from the consultation.", 
        sender: 'ai', 
        timestamp: new Date() 
      }
    ]);
  };

  // Handle finalizing the consultation
  const finalizeCase = async () => {
    if (progress < 3 || isFinalizing) return;
    
    setIsFinalizing(true);
    
    try {
      // Get the consultation ID for future implementation of API finalization
      const consultationId = localStorage.getItem('maisha_consultation_id');
      console.log('Finalizing consultation:', consultationId);
      
      // Here you would normally call an API to finalize
      // await finalizeConsultation(consultationId);
      
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add a final message
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          id: Date.now(), 
          text: "Your consultation has been finalized. Thank you for using Maisha Care!", 
          sender: 'ai', 
          timestamp: new Date() 
        }
      ]);
      
      // Delay closure to allow user to read the message
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error finalizing consultation:', error);
      
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          id: Date.now(), 
          text: "There was an error finalizing your consultation. Please try again.", 
          sender: 'ai', 
          timestamp: new Date() 
        }
      ]);
      
      setIsFinalizing(false);
    }
  };

  // Function for handling file uploads
  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;
    
    setIsSubmitting(true);
    
    // Get consultation ID
    const consultationId = localStorage.getItem('maisha_consultation_id');
    
    try {
      // Convert FileList to array
      const fileArray = Array.from(files);
      
      // Process each file
      for (const file of fileArray) {
        // Show uploading message
        const uploadingId = Date.now();
        setMessages(prevMessages => [
          ...prevMessages,
          { 
            id: uploadingId, 
            text: `Uploading ${file.name}...`, 
            sender: 'user', 
            timestamp: new Date() 
          }
        ]);
        
        // Use our improved chat service for file upload
        const response = await uploadFileToAPI(file, consultationId) as FileUploadResponse;
        
        // Add file to uploaded files list
        const newFile: ExtendedUploadedFile = {
          id: Date.now(), // Use number as per type definition
          name: file.name,
          type: file.type,
          size: file.size,
          url: response.fileUrl || response.file_url || '', // Try both possible response formats
        };
        
        setUploadedFiles(prev => [...prev, newFile]);
        
        // Update the uploading message to show it's complete
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === uploadingId 
              ? { ...msg, text: `Uploaded: ${file.name}` } 
              : msg
          )
        );
        
        // Add AI response about the file if available
        if (response.message) {
          setMessages(prevMessages => [
            ...prevMessages,
            { 
              id: Date.now(), 
              text: response.message, 
              sender: 'ai', 
              timestamp: new Date() 
            }
          ]);
          
          // Update conversation history
          setConversationHistory(prev => [
            ...prev,
            { role: 'assistant' as MessageRole, content: response.message }
          ]);
        }
      }
    } catch (error) {
      console.error('File upload error:', error);
      
      // Show error message
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          id: Date.now(), 
          text: error instanceof Error 
            ? `File upload failed: ${error.message}` 
            : 'File upload failed: Unknown error', 
          sender: 'ai', 
          timestamp: new Date() 
        }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };
  
  // Note: The following functions are not currently used in the UI
  // If you need drag-and-drop functionality, add onDrop={handleFileDrop} to a container
  // and onClick={handleFileButtonClick} to a button
  
  // // Handle file drop event
  // const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  //   if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
  //     handleFileUpload(e.dataTransfer.files);
  //   }
  // };
  // 
  // // Handle file selection button click
  // const handleFileButtonClick = () => {
  //   fileInputRef.current?.click();
  // };

  /* 
   * This function is for debugging API connectivity issues.
   * Uncomment and add a button with onClick={testAPIConnection} when needed.
   */
  // const testAPIConnection = async () => {
  //   try {
  //     const result = await testDirectAPIConnection();
  //     setMessages(prevMessages => [
  //       ...prevMessages,
  //       { 
  //         id: Date.now(), 
  //         text: `API Connection Test: ${result.success ? "Success" : "Failed"} - ${result.success ? String(result.data?.message || "Connected") : result.error}`, 
  //         sender: 'ai', 
  //         timestamp: new Date() 
  //       }
  //     ]);
  //   } catch (error) {
  //     console.error('API connection test failed:', error);
  //     setMessages(prevMessages => [
  //       ...prevMessages,
  //       { 
  //         id: Date.now(), 
  //         text: `API Connection Test Failed: ${error instanceof Error ? error.message : String(error)}`, 
  //         sender: 'ai', 
  //         timestamp: new Date() 
  //       }
  //     ]);
  //   }
  // };

  return (
    <div className="flex flex-col h-full relative">
      <ConsultationHeader onClose={onClose} consultationType={consultationType} />
      <ProgressBar progress={progress} />
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto bg-white/60 backdrop-blur-md">
        {consultationType === 'text' ? (
          <MessageList 
            messages={messages} 
            messagesEndRef={messagesEndRef} 
            uploadedFiles={uploadedFiles}
            removeFile={removeFile}
            isSubmitting={isSubmitting}
          />
        ) : (
          <VoiceConsultation 
            isRecording={isRecording}
            messages={messages}
          />
        )}
      </div>
      
      <div className="mb-4 flex justify-center">
      
      </div>
      
      <InputArea 
        consultationType={consultationType}
        inputText={inputText}
        setInputText={setInputText}
        sendMessage={sendMessage}
        handleKeyPress={handleKeyPress}
        toggleRecording={toggleRecording}
        isRecording={isRecording}
        handleFileUpload={handleFileInputChange}
        fileInputRef={fileInputRef}
        isSubmitting={isSubmitting}
        isFinalizing={isFinalizing}
      />
      
      {/* Finalize button */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <button
          onClick={finalizeCase}
          disabled={progress < 3 || isFinalizing}
          className={`w-full py-3 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2 ${
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