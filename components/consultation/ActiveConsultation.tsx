'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ConsultationHeader from '@/components/consultation/ConsultationHeader';
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

// Add this to the existing imports at the top
import { v4 as uuidv4 } from 'uuid';

// Helper function to create dates in East Africa Time (EAT)
const createEATDate = () => {
  // Create a date object
  const date = new Date();
  
  // Format it to a string in EAT (UTC+3) - this is a simpler approach since we only care about displaying
  // We're not doing timezone conversion here, just ensuring the timestamp is created consistently
  return date;
};

const ActiveConsultation: React.FC<ActiveConsultationProps> = ({ 
  consultationType, 
  onClose,
  setIsFinalizing,
  isFinalizing
}) => {
  // States
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "Hello! I'm Dr. AI. Please start by providing your name, age, and gender. Then tell me about your symptoms - what's bothering you, where is the pain or discomfort located, when did it start, and how severe is it on a scale of 1-10?", 
      sender: 'ai', 
      timestamp: createEATDate() 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [progress, setProgress] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<ExtendedUploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canFinalize, setCanFinalize] = useState(false); // Explicit state for finalization readiness
  
  // Update state definition with the proper type
  const [conversationHistory, setConversationHistory] = useState<Array<{role: MessageRole, content: string}>>([
    { 
      role: 'assistant' as MessageRole, 
      content: "Hello! I'm Dr. AI. Please start by providing your name, age, and gender. Then tell me about your symptoms - what's bothering you, where is the pain or discomfort located, when did it start, and how severe is it on a scale of 1-10?" 
    }
  ]);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Debug logging for consultation status
  useEffect(() => {
    console.log('Consultation Status:', {
      messagesCount: messages.length,
      userMessages: messages.filter(m => m.sender === 'user').length,
      progress,
      canFinalize,
      consultationId: localStorage.getItem('maisha_consultation_id')
    });
  }, [messages.length, progress, canFinalize]);

  // Wrap checkFinalizationReadiness in useCallback to prevent dependency changes
  const checkFinalizationReadiness = useCallback(() => {
    // Determine if the consultation can be finalized based on various factors
    const minMessagesRequired = 5;
    const hasEnoughMessages = messages.length >= minMessagesRequired;

    // Only allow finalization if there's been enough back and forth
    // and if we're not in the middle of sending a message
    const canFinalize = 
      hasEnoughMessages && 
      !isSubmitting && 
      messages[messages.length - 1]?.sender === 'ai';

    setCanFinalize(canFinalize);
    
    return canFinalize;
  }, [messages, isSubmitting]);

  // Update message tracking and check finalization readiness when messages change
  useEffect(() => {
    // Update message count for analytics
    setProgress(Math.min(100, messages.length * 10));
    
    // Check finalization readiness whenever messages change
    checkFinalizationReadiness();
  }, [messages, checkFinalizationReadiness]);

  // Verify API connection on mount
  useEffect(() => {
    verifyAPIConnection();
  }, []);

  // Generate a new consultation ID when the component mounts
  useEffect(() => {
    // Generate a unique consultation ID for this session
    const newConsultationId = uuidv4();
    console.log('Generated new consultation ID:', newConsultationId);
    
    // Store it in localStorage
    localStorage.setItem('maisha_consultation_id', newConsultationId);
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
            timestamp: createEATDate() 
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
      timestamp: createEATDate()
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
    
    // Always increment progress when user sends a message (but cap at 5)
    // This ensures progress increases naturally with conversation
    const userMessageCount = messages.filter(m => m.sender === 'user').length + 1; // Including current message
    const newProgress = Math.min(5, Math.max(userMessageCount, progress));
    
    if (newProgress > progress) {
      console.log(`Increasing progress from ${progress} to ${newProgress} based on message count`);
      setProgress(newProgress);
    }
    
    try {
      // Add thinking message
      const thinkingId = Date.now() + 1;
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          id: thinkingId, 
          text: "Thinking...", 
          sender: 'ai', 
          timestamp: createEATDate() 
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
            timestamp: createEATDate() 
          }
        ];
      });
      
      // Update conversation history
      setConversationHistory([
        ...updatedHistory,
        { role: 'assistant' as MessageRole, content: aiResponse.message }
      ]);
      
      // Check if the consultation can be finalized after receiving the AI response
      setTimeout(() => {
        checkFinalizationReadiness();
      }, 500);
      
      // After sending the first message, if the system doesn't detect a name introduction,
      // prompt the user to provide their name if they haven't already
      if (messages.length === 2 && !inputText.toLowerCase().includes('name') && !inputText.toLowerCase().includes('i am') && !inputText.toLowerCase().includes("i'm")) {
        setTimeout(() => {
          setMessages(prevMessages => [
            ...prevMessages,
            { 
              id: Date.now(), 
              text: "To provide better service, could you please share your name with me?", 
              sender: 'ai', 
              timestamp: createEATDate() 
            }
          ]);
        }, 1000);
      }

      // Add prompts for critical missing information after a few messages
      if (messages.length === 5) { // After a couple of exchanges
        // Use explicit type for missingInfo array
        const missingInfo: string[] = [];
        
        // Extract information from messages so far
        const allUserText = messages
          .filter(m => m.sender === 'user')
          .map(m => m.text.toLowerCase())
          .join(' ');
        
        // Check for key information
        if (!allUserText.match(/\b(my name is|i am|i'm|call me)\b/i)) {
          missingInfo.push("your name");
        }
        
        if (!allUserText.match(/\b(\d+\s*(years?|yrs?|y\.?o\.?)|age)\b/i)) {
          missingInfo.push("your age");
        }
        
        if (!allUserText.match(/\b(male|female|man|woman|boy|girl)\b/i)) {
          missingInfo.push("your gender");
        }
        
        if (!allUserText.match(/\b(start|began|since|for|ago|day|week|month)\b/i)) {
          missingInfo.push("when your symptoms started");
        }
        
        if (!allUserText.match(/\b(pain|hurt|ache)\s+(in|on|my)\s+\w+/i)) {
          missingInfo.push("where the symptoms are located");
        }
        
        if (!allUserText.match(/\b(severe|severity|scale|rate|\/10|out of 10)\b/i)) {
          missingInfo.push("how severe your symptoms are on a scale of 1-10");
        }
        
        // If we're missing critical information, prompt for it
        if (missingInfo.length > 0) {
          setTimeout(() => {
            // Limit to asking about at most 2 things at once
            const itemsToAsk = missingInfo.slice(0, 2);
            const infoPrompt = itemsToAsk.join(" and ");
            
            setMessages(prevMessages => [
              ...prevMessages,
              { 
                id: Date.now(), 
                text: `To help with my assessment, could you please tell me ${infoPrompt}?`, 
                sender: 'ai', 
                timestamp: createEATDate() 
              }
            ]);
          }, 1500);
        }
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
          timestamp: createEATDate() 
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
          timestamp: createEATDate()
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
          timestamp: createEATDate()
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
            timestamp: createEATDate()
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
        timestamp: createEATDate() 
      }
    ]);
  };

  // Handle finalizing the consultation - ensure patient info is sent
  const finalizeCase = async () => {
    // Check if consultation can be finalized
    if (!canFinalize || isFinalizing) {
      console.log('Cannot finalize:', { canFinalize, isFinalizing, progress });
      return;
    }
    
    setIsFinalizing(true);
    
    try {
      // Get the consultation ID from localStorage
      const consultationId = localStorage.getItem('maisha_consultation_id');
      
      if (!consultationId) {
        throw new Error('No consultation ID found');
      }
      
      console.log('Finalizing consultation with ID:', consultationId);
      
      // Extract patient info directly from current messages
      const patientInfo = extractPatientInfoFromMessages(messages);
      console.log('Extracted patient info from current conversation:', patientInfo);
      
      // Call the analyze-case endpoint to process and finalize the consultation
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ai-engine-production-487a.up.railway.app';
      const analyzeEndpoint = `${apiBaseUrl}/analyze-case?consultation_id=${consultationId}`;
      console.log('Calling analyze-case endpoint directly:', analyzeEndpoint);
      
      const analyzeResponse = await fetch(analyzeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!analyzeResponse.ok) {
        throw new Error(`Failed to analyze consultation: ${analyzeResponse.status}`);
      }
      
      // Get the analysis results
      const analysisResults = await analyzeResponse.json();
      console.log('Analysis complete:', analysisResults);
      
      // Add a final message
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          id: Date.now(), 
          text: "Your consultation has been analyzed and sent to a doctor for review. Thank you for using Maisha Care!", 
          sender: 'ai', 
          timestamp: createEATDate() 
        }
      ]);
      
      // Clear the consultation ID from localStorage
      localStorage.removeItem('maisha_consultation_id');
      
      // Delay closure to allow user to read the message
      setTimeout(() => {
        onClose();
      }, 5000);
    } catch (error) {
      console.error('Error finalizing consultation:', error);
      
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          id: Date.now(), 
          text: "There was an error finalizing your consultation. Please try again.", 
          sender: 'ai', 
          timestamp: createEATDate() 
        }
      ]);
    } finally {
      setIsFinalizing(false);
    }
  };

  // Add a new function to extract patient info from the current messages
  const extractPatientInfoFromMessages = (messages: Message[]) => {
    const patientInfo = {
      name: '',
      age: 0,
      gender: '',
      symptoms: [] as string[],
      severity: 0,
      onset: '',
      location: ''
    };
    
    // Process each user message to extract information
    const userMessages = messages.filter(msg => msg.sender === 'user');
    
    for (const message of userMessages) {
      const content = message.text.toLowerCase();
      
      // Extract name with improved patterns
      if (!patientInfo.name) {
        // Improved name patterns with enhanced boundaries
        const namePatterns = [
          /my name is\s+([A-Za-z\s\'\"]+?)(?:[.,]|\s+and|\s+i am|\s+i'm|\s+a\s+|\s+an\s+|\s+i've|$)/i,
          /i am\s+([A-Za-z\s\'\"]+?)(?:[.,]|\s+and|\s+i am|\s+a\s+|\s+an\s+|\s+i'm|\s+i've|$)/i,
          /i'm\s+([A-Za-z\s\'\"]+?)(?:[.,]|\s+and|\s+i am|\s+a\s+|\s+an\s+|\s+i'm|\s+i've|$)/i,
          /this is\s+([A-Za-z\s\'\"]+?)(?:[.,]|\s+and|\s+a\s+|\s+an\s+|$)/i,
          /call me\s+([A-Za-z\s\'\"]+?)(?:[.,]|\s+and|\s+a\s+|\s+an\s+|$)/i,
          /name:?\s+([A-Za-z\s\'\"]+?)(?:[.,]|\s+and|\s+a\s+|\s+an\s+|$)/i,
          /the name's\s+([A-Za-z\s\'\"]+?)(?:[.,]|\s+and|\s+a\s+|\s+an\s+|$)/i,
          /i go by\s+([A-Za-z\s\'\"]+?)(?:[.,]|\s+and|\s+a\s+|\s+an\s+|$)/i
        ];
        
        // Try each pattern
        for (const pattern of namePatterns) {
          const match = message.text.match(pattern);
          if (match && match[1] && match[1].trim().length > 1) {
            let extractedName = match[1].trim();
            
            // Clean up the name - remove any gender identifiers
            extractedName = extractedName.replace(/\s+a\s+(male|female|man|woman).*$/i, '');
            extractedName = extractedName.replace(/\s+an?\s+(adult|elderly|old|young)\s+(male|female|man|woman).*$/i, '');
            
            // Filter out common false positives
            const commonPhrases = ['not sure', 'a patient', 'feeling', 'sick', 'not feeling well', 
                                 'here', 'having', 'suffering', 'experiencing'];
            const isCommonPhrase = commonPhrases.some(phrase => 
              extractedName.toLowerCase().includes(phrase)
            );
            
            // Check that it's not just a single letter or too long
            const isValidName = extractedName.length > 1 && 
                               extractedName.length < 40 && 
                               !isCommonPhrase;
            
            if (isValidName) {
              patientInfo.name = extractedName;
              console.log(`Found name: "${extractedName}" using pattern: ${pattern}`);
              break;
            }
          }
        }
        
        // Fallback - look for name format at beginning of message
        if (!patientInfo.name && /^[A-Z][a-z]+\b/.test(message.text)) {
          const firstWord = message.text.split(/\s+/)[0];
          if (firstWord && firstWord.length > 2 && firstWord.length < 40 && 
              !/^(I'm|I|The|My|This|It's|Its|His|Her|Their|Our|Your)/i.test(firstWord)) {
            patientInfo.name = firstWord;
            console.log(`Found name at beginning of message: "${firstWord}"`);
          }
        }
      }
      
      // Extract age
      if (!patientInfo.age && (content.includes('year') || content.includes('age') || content.includes(' old'))) {
        const agePatterns = [
          /(\d+)\s+years?\s+old/i,
          /age\s+(?:is\s+)?(\d+)/i,
          /i am\s+(\d+)(?:\s+years?\s+old)?/i,
          /i'm\s+(\d+)(?:\s+years?\s+old)?/i,
          /(\d+)\s+years?/i,
          /(\d+)\s*y\.?o/i
        ];
        
        for (const pattern of agePatterns) {
          const match = message.text.match(pattern);
          if (match && match[1]) {
            const potentialAge = parseInt(match[1], 10);
            if (potentialAge > 0 && potentialAge < 120) { // Sanity check
              patientInfo.age = potentialAge;
              break;
            }
          }
        }
      }
      
      // Extract gender - improved to catch gender after name declaration
      if (!patientInfo.gender) {
        // Check for explicit gender mentions
        if (content.includes('female') || content.includes('woman') || content.includes('girl') || content.includes('lady')) {
          patientInfo.gender = 'Female';
        } else if ((content.includes('male') && !content.includes('female')) || 
                   content.includes('man') || content.includes('boy') || 
                   content.includes('gentleman')) {
          patientInfo.gender = 'Male';
        }
        
        // Check for patterns like "I am a male" or "Chris a male"
        const genderPatterns = [
          /(?:i am|i'm|am)\s+a\s+(male|female)/i,
          /(?:i am|i'm|am)\s+a\s+(man|woman)/i,
          /\w+\s+a\s+(male|female)/i,
          /\w+\s+a\s+(man|woman)/i
        ];
        
        for (const pattern of genderPatterns) {
          const match = message.text.match(pattern);
          if (match && match[1]) {
            const gender = match[1].toLowerCase();
            if (gender === 'male' || gender === 'man') {
              patientInfo.gender = 'Male';
              break;
            } else if (gender === 'female' || gender === 'woman') {
              patientInfo.gender = 'Female';
              break;
            }
          }
        }
      }
      
      // Extract location of symptoms
      if (!patientInfo.location && (content.includes('pain') || content.includes('hurt') || content.includes('ache'))) {
        const locationPatterns = [
          /pain (?:in|on) (?:my|the) ([a-z\s]+)(?:\.|\s|,|$)/i,
          /([a-z\s]+) (?:is|are) (?:hurting|painful|aching)/i,
          /(?:my|the) ([a-z\s]+) hurts/i,
          /(?:having|have|experiencing) ([a-z\s]+) pain/i
        ];
        
        for (const pattern of locationPatterns) {
          const match = message.text.match(pattern);
          if (match && match[1]) {
            const location = match[1].trim();
            // Check that we got a body part, not a general description
            if (location.length > 2 && location.length < 30) {
              patientInfo.location = location;
              break;
            }
          }
        }
      }
      
      // Extract onset (when symptoms started)
      if (!patientInfo.onset && (content.includes('start') || content.includes('since') || content.includes('began') || 
                               content.includes('day') || content.includes('week') || 
                               content.includes('month') || content.includes('yesterday'))) {
        const onsetPatterns = [
          /(?:started|began|noticed) ([^\.]+?)(?:\.|\s*$)/i,
          /(?:for|since|about|almost) ([^\.]+?)(?:\.|\s*$)/i,
          /(?:past|last) ([^\.]+?)(?:\.|\s*$)/i
        ];
        
        for (const pattern of onsetPatterns) {
          const match = message.text.match(pattern);
          if (match && match[1]) {
            const onset = match[1].trim();
            if (onset.length > 2 && onset.length < 50) {
              patientInfo.onset = onset;
              break;
            }
          }
        }
      }
      
      // Extract severity with improved patterns
      if (patientInfo.severity === 0 && 
        (content.includes('sever') || content.includes('pain') || 
          content.includes('scale') || content.includes('rate') || 
          content.includes('out of') || content.includes('/10'))) {
        const severityPatterns = [
          /(\d+)(?:\s*\/\s*|\s+out\s+of\s+)10/i,
          /severity(?:\s*(?:is|of))?\s*(?:about)?\s*(\d+)/i,
          /pain(?:\s*(?:is|at|level))?\s*(?:about|around)?\s*(\d+)/i,
          /rate(?:\s*(?:it|as|the pain|my pain|this))?\s*(?:a|as|at)?\s*(\d+)/i,
          /(?:my pain is|pain level is|i would say|i'd say|i rate it)\s*(?:a|about)?\s*(\d+)/i,
          /(?:^|\s)(\d{1,2})(?:\/10|\s*out of 10)/i
        ];
        
        for (const pattern of severityPatterns) {
          const match = message.text.match(pattern);
          if (match && match[1]) {
            const severity = parseInt(match[1], 10);
            if (severity >= 0 && severity <= 10) {
              patientInfo.severity = severity;
              console.log(`Found severity: ${severity} using pattern: ${pattern}`);
              break;
            }
          }
        }
      }
      
      // Collect symptoms mentioned
      const symptomKeywords = [
        'pain', 'ache', 'fever', 'cough', 'headache', 'nausea', 'vomit', 
        'dizz', 'tired', 'fatigue', 'weak', 'sore', 'rash', 'itch', 
        'swelling', 'swell', 'short of breath', 'breathing', 'chest', 
        'stomach', 'abdominal', 'diarrhea', 'constipation', 'blood'
      ];
      
      for (const keyword of symptomKeywords) {
        if (content.includes(keyword) && 
          !patientInfo.symptoms.some(s => content.includes(s))) {
          // Extract the symptom with surrounding context
          const index = content.indexOf(keyword);
          const start = Math.max(0, index - 15);
          const end = Math.min(content.length, index + 25);
          const symptomContext = content.substring(start, end);
          
          if (symptomContext && !patientInfo.symptoms.includes(symptomContext)) {
            patientInfo.symptoms.push(symptomContext);
          }
        }
      }
    }
    
    return patientInfo;
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
            timestamp: createEATDate() 
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
              timestamp: createEATDate() 
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
          timestamp: createEATDate() 
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
  //         timestamp: createEATDate() 
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
  //         timestamp: createEATDate() 
  //       }
  //     ]);
  //   }
  // };

  return (
    <div className="flex flex-col h-full">
      <ConsultationHeader 
        consultationType={consultationType}
        onClose={onClose}
      />
      
      <div className="flex-1 overflow-hidden flex flex-col bg-gray-50 relative">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
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
      </div>
      
      {/* Finalize button - simplified styling */}
      <div className="border-t border-gray-200 p-4 bg-white shadow-sm">
        <button
          onClick={finalizeCase}
          disabled={!canFinalize || isFinalizing}
          className={`w-full py-3 rounded-2xl font-medium transition-all flex items-center justify-center gap-2 ${
            !canFinalize || isFinalizing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-color1 to-color4 text-white hover:shadow-md shadow-lg animate-pulse'
          }`}
        >
          {isFinalizing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              Finalize and Submit
            </>
          )}
        </button>
        <p className="text-xs text-center text-gray-500 mt-2">
          {!canFinalize 
            ? 'Continue the consultation to enable finalization'
            : 'Your consultation will be sent to a doctor for review'}
        </p>
      </div>
    </div>
  );
};

export default ActiveConsultation;