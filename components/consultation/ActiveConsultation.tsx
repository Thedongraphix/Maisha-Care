'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  sendMessage,
  connectToEventStream,
  disconnectEventStream,
  fetchRequisitionData,
  ChatResponse,
  WorkflowEvent,
  TestRequisitionData, 
} from '@/services/chatService';
import { resetChatState, getConsultationId as getStoredConsultationId } from '@/utils/consultationUtils';
import logger from '@/utils/logger';
import { Paperclip, Send, FileText, AlertCircle, Info, RotateCcw, XCircle, DownloadCloud, CheckCircle2, Mic, Square } from 'lucide-react';
import { ThreeDots } from 'react-loader-spinner';


interface Message {
  id: string; 
  text: string;
  sender: 'user' | 'assistant' | 'system';
  stage?: string;
  next_steps?: string;
  file_name?: string;
  file_url?: string;
  timestamp?: Date; 
}

interface WorkflowStatus {
  type: 'info' | 'error' | 'success' | 'loading';
  message: string;
  workflowName?: string;
}

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const MAX_FILE_SIZE_MB = 10;

interface ActiveConsultationProps {
  consultationType: 'text' | 'voice'; 
  onClose: () => void;
}

const createTimestamp = () => new Date();

export default function ActiveConsultation({ consultationType, onClose }: ActiveConsultationProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [isSending, setIsSending] = useState(false); 
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus | null>(null);
  const [showRequisitionButton, setShowRequisitionButton] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const storedId = getStoredConsultationId();
    if (storedId) {
      setConsultationId(storedId);
      addMessage({
        id: Date.now().toString() + '-system',
        text: "Welcome back! Resuming your previous session.",
        sender: 'system',
        timestamp: createTimestamp(),
      }, true); 
    } else {
       addMessage({
        id: Date.now().toString(),
        text: "Hello! I'm Dr. Stacy, your Maisha Care AI assistant. How can I help you today?",
        sender: 'assistant',
        timestamp: createTimestamp(), 
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const addMessage = (message: Message, addToTop = false) => {
    setMessages(prev => addToTop ? [message, ...prev] : [...prev, message]);
  };

  const handleWorkflowEvent = useCallback((eventData: WorkflowEvent) => {
    logger.info('SSE Event Received:', eventData);
    
    if (isReconnecting) {
      setIsReconnecting(false);
    }
    
    if (eventData.consultation_id !== consultationId) {
        logger.warn('SSE Event for different consultation ID received, ignoring.', { current: consultationId, event: eventData.consultation_id });
        return;
    }

    let statusType: WorkflowStatus['type'] = 'info';
    if (eventData.event_type === 'WORKFLOW_ERROR') statusType = 'error';
    else if (eventData.event_type === 'WORKFLOW_COMPLETE') statusType = 'success';
    else if (eventData.event_type === 'WORKFLOW_START' || eventData.event_type === 'WORKFLOW_PROGRESS') statusType = 'loading';

    setWorkflowStatus({
      type: statusType,
      message: eventData.message,
      workflowName: eventData.workflow_name,
    });

    if (eventData.event_type === 'WORKFLOW_START' || eventData.event_type === 'WORKFLOW_PROGRESS') {
      if (eventData.workflow_name !== 'connection') {
        setIsLoading(true);
      }
    } else if (eventData.event_type === 'WORKFLOW_COMPLETE' || eventData.event_type === 'WORKFLOW_ERROR') {
      setIsLoading(false);
      setIsSending(false);
      setTimeout(() => setWorkflowStatus(null), statusType === 'error' ? 7000 : 4000);
    }

    if (eventData.event_type === 'WORKFLOW_COMPLETE') {
      if (eventData.workflow_name === 'test_recommendation') {
        setShowRequisitionButton(true);
      }
      if (eventData.workflow_name === 'diagnosis' || eventData.workflow_name === 'treatment_plan') {
        // Potentially update currentStage directly if SSE provides it
        // if (eventData.stage) setCurrentStage(eventData.stage);
      }
    }
  }, [consultationId, isReconnecting]);

  const handleSseError = useCallback((error: Event) => {
    logger.error('SSE Connection Error:', error);
    setIsReconnecting(true);
    setWorkflowStatus({
      type: 'info',
      message: 'Reconnecting to server...'
    });
  }, []);

  useEffect(() => {
    if (consultationId) {
      connectToEventStream(handleWorkflowEvent, handleSseError);
    } else {
      if (typeof window !== 'undefined') localStorage.removeItem('maisha_consultation_id');
    }
    return () => {
      disconnectEventStream();
    };
  }, [consultationId, handleWorkflowEvent, handleSseError]);

  const handleSendMessage = async (messageTextOverride?: string) => {
    const textToSend = messageTextOverride || inputMessage;
    if ((!textToSend.trim() && !selectedFile) || isSending) return;

    setIsSending(true);
    setIsLoading(true); 
    setWorkflowStatus({ type: 'loading', message: 'Sending your message...' });

    const optimisticUserMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      file_name: selectedFile?.name,
      timestamp: createTimestamp(),
    };
    addMessage(optimisticUserMessage);
    
    setInputMessage(''); 

    try {
      const response: ChatResponse = await sendMessage(textToSend, selectedFile || undefined);
      
      if (response.consultation_id && !consultationId) {
        setConsultationId(response.consultation_id);
      } else if (response.consultation_id && consultationId !== response.consultation_id) {
        setConsultationId(response.consultation_id);
      }
      setCurrentStage(response.stage);
      setShowRequisitionButton(response.stage === 'awaiting_tests' || (showRequisitionButton && response.stage !== 'test_recommendation_pending'));

      addMessage({
        id: Date.now().toString() + '-ai',
        text: response.message,
        sender: 'assistant',
        stage: response.stage,
        next_steps: response.next_steps,
        timestamp: createTimestamp(),
      });
      
      setSelectedFile(null); 
      setFilePreview(null);
      if(fileInputRef.current) fileInputRef.current.value = '';
      
      setIsSending(false);
      setIsLoading(false);
      setWorkflowStatus(null);

    } catch (error: any) {
      logger.error('Error sending message:', error);
      addMessage({
        id: Date.now().toString() + '-err',
        text: error.message || "Sorry, I encountered an error. Please try again.",
        sender: 'system',
        timestamp: createTimestamp(),
      });
      setWorkflowStatus({ type: 'error', message: error.message || "Failed to send message." });
      if (error.message && error.message.toLowerCase().includes('consultation not found')){
        setConsultationId(null);
      }
      
      setIsSending(false);
      setIsLoading(false);
    }
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setWorkflowStatus({type: 'error', message: `Invalid file type. Allowed: JPG, PNG, PDF, DOC(X)`});
        if (fileInputRef.current) fileInputRef.current.value = '';
        setSelectedFile(null); setFilePreview(null);
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setWorkflowStatus({type: 'error', message: `File too large. Max size: ${MAX_FILE_SIZE_MB}MB`});
        if (fileInputRef.current) fileInputRef.current.value = '';
        setSelectedFile(null); setFilePreview(null);
        return;
      }
      setSelectedFile(file);
      setFilePreview(file.name);
      setWorkflowStatus(null); 
    } else {
      setSelectedFile(null);
      setFilePreview(null);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSending) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    resetChatState(); 
    disconnectEventStream();
    setConsultationId(null);
    setCurrentStage(null);
    setMessages([
      {
        id: Date.now().toString(),
        text: "Hello! I'm Dr. Stacy, your Maisha Care AI assistant. How can I help you today?",
        sender: 'assistant',
        timestamp: createTimestamp(),
      }
    ]);
    setInputMessage('');
    setIsLoading(false);
    setIsSending(false);
    setSelectedFile(null);
    setFilePreview(null);
    setWorkflowStatus(null);
    setShowRequisitionButton(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    logger.info('Chat has been reset.');
    onClose(); 
  };

  const handleGenerateRequisition = async () => {
    if (!consultationId) {
        setWorkflowStatus({type: 'error', message: 'No active consultation for requisition.'});
      return;
    }
    setIsLoading(true);
    setWorkflowStatus({ type: 'loading', message: 'Fetching requisition data...'});
    try {
        const data: TestRequisitionData | null = await fetchRequisitionData();
        if (data) {
            logger.info('TestRequisitionData fetched:', data);
            setWorkflowStatus({type: 'success', message: `Requisition for ${data.patient_name} ready.` });
            alert(`PDF Requisition Details:\nPatient: ${data.patient_name}, Age: ${data.patient_age}, Sex: ${data.patient_sex}\nTests: ${data.tests_requested.join(', ')}\nNotes: ${data.clinical_notes || 'N/A'}\nPriority: ${data.priority}`);
        } else {
            setWorkflowStatus({type: 'info', message: 'No requisition data available or an error occurred while fetching.'});
        }
    } catch (error: any) {
        logger.error('Error fetching requisition data:', error);
        setWorkflowStatus({type: 'error', message: error.message || 'Could not fetch requisition data.'});
    } finally {
        setIsLoading(false);
        setTimeout(() => setWorkflowStatus(null), 6000);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      addMessage({id: Date.now().toString(), text: "[Voice recording started...]", sender: 'system', timestamp: createTimestamp()});
    } else {
        handleSendMessage("[Simulated Voice Message Transcription]");
    }
    logger.info(`Recording toggled: ${!isRecording}`);
  };
  
  const handleFinalizeConsultation = () => {
    if (currentStage === 'Completed' || currentStage === 'treatment_plan_generated' || currentStage === 'diagnosis_complete') {
        addMessage({id: Date.now().toString(), text: "Consultation has been concluded. Thank you for using Maisha Care!", sender: 'system', timestamp: createTimestamp()});
        logger.info('Consultation concluded by user action or final stage reached.');
        if (typeof window !== 'undefined') {
            localStorage.removeItem('maisha_consultation_id');
        }
        setConsultationId(null); 
        onClose(); 
    } else {
        setWorkflowStatus({type: 'info', message: 'The consultation is still in progress. Please wait for the AI to guide you to completion.'});
        setTimeout(() => setWorkflowStatus(null), 5000);
    }
  };

  const isInputDisabled = isLoading || isSending;
  const canShowFileUpload = currentStage === 'awaiting_tests';
  const canShowFinalizeButton = currentStage === 'Completed' || currentStage === 'treatment_plan_generated' || currentStage === 'diagnosis_complete';


  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-h-[750px] w-full max-w-3xl bg-background shadow-xl rounded-xl overflow-hidden font-jost antialiased">
      <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center shadow-md">
        <div>
          <h2 className="text-xl font-grotesk font-semibold">Maisha Care AI</h2>
          {currentStage && <p className="text-xs opacity-90 font-jost">Stage: <span className='font-semibold capitalize'>{currentStage.replace(/_/g, ' ')}</span></p>}
        </div>
        <div className='flex items-center gap-2'>
          {isReconnecting && (
            <div className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span>Reconnecting...</span>
            </div>
          )}
          {canShowFinalizeButton && (
            <button
                onClick={handleFinalizeConsultation}
                title="Conclude Consultation"
                className="p-2 rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors text-xs px-3 py-1.5 font-jost"
            >
                Conclude
            </button>
          )}
          <button 
            onClick={handleResetChat}
            title="Start New Chat"
            className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {workflowStatus && (
        <div className={`px-4 py-2.5 text-sm font-medium text-white flex items-center gap-2.5 shadow-inner font-jost ${ 
            workflowStatus.type === 'error' ? 'bg-destructive text-destructive-foreground' : 
            workflowStatus.type === 'success' ? 'bg-green-600 text-white' :
            workflowStatus.type === 'loading' ? 'bg-blue-600 text-white' :
            'bg-sky-600 text-white'
          }`}>
          {workflowStatus.type === 'loading' && <ThreeDots height={18} width={18} color="currentColor" />}
          {workflowStatus.type === 'error' && <AlertCircle size={18} />}
          {workflowStatus.type === 'success' && <CheckCircle2 size={18} />}
          {workflowStatus.type === 'info' && <Info size={18} />}
          <span>{workflowStatus.workflowName ? `(${workflowStatus.workflowName}) ` : ''}{workflowStatus.message}</span>
        </div>
      )}

      <div className="flex-1 p-3 sm:p-4 space-y-4 overflow-y-auto bg-secondary scroll-smooth">
        {messages.map(message => (
          <div 
            key={message.id}
            className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${
              message.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
            }`}
          >
            <div className={`
              px-4 py-2.5 rounded-xl shadow-md font-jost
              ${message.sender === 'user' 
                ? 'bg-primary text-primary-foreground rounded-br-lg'
                : message.sender === 'assistant'
                ? 'bg-card text-card-foreground border border-border rounded-bl-lg'
                : 'bg-muted text-muted-foreground border border-border text-xs italic rounded-lg'
              }
            `}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
              {message.file_name && (
                <div className="mt-2 pt-1.5 border-t border-black/10 text-xs opacity-80 flex items-center gap-1.5">
                    <FileText size={14}/> <span>{message.file_name}</span>
                </div>
              )}
            </div>
            {message.sender === 'assistant' && message.next_steps && (
              <p className="text-xs text-muted-foreground mt-1.5 px-1 font-jost">Next: {message.next_steps}</p>
            )}
            {message.timestamp && (
                 <p className={`text-xs text-muted-foreground/80 mt-1 px-1 ${message.sender === 'user' ? 'text-right' : 'text-left'} w-full font-jost`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </p>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {(filePreview || (showRequisitionButton && consultationId)) && (
        <div className="p-3 border-t border-border bg-background flex flex-wrap justify-center sm:justify-between items-center gap-2 shadow-sm">
          {filePreview && (
            <div className="text-xs text-foreground bg-muted border border-border px-3 py-1.5 rounded-md flex items-center gap-2 font-jost">
              <FileText size={16} className="text-primary"/>
              <span className="font-medium">{filePreview}</span>
              <button onClick={clearSelectedFile} className="p-0.5 hover:text-destructive text-muted-foreground">
                <XCircle size={16}/>
              </button>
            </div>
          )}
          {showRequisitionButton && consultationId && (
             <button
                onClick={handleGenerateRequisition}
                disabled={isInputDisabled} 
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto justify-center font-jost"
            >
                <DownloadCloud size={16}/> Download Test Requisition
            </button>
          )}
        </div>
      )}

      <div className="border-t border-border p-3 bg-background flex items-end gap-2">
        {canShowFileUpload && (
            <label htmlFor="file-upload" title="Attach File" className={`p-3 rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer ${isInputDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Paperclip size={20} />
                <input id="file-upload" type="file" accept={ALLOWED_FILE_TYPES.join(',')} className="hidden" onChange={handleFileSelection} ref={fileInputRef} disabled={isInputDisabled} />
            </label>
        )}
        {consultationType === 'voice' && ( 
            <button onClick={toggleRecording} title={isRecording ? "Stop Recording" : "Start Recording"} className={`p-3 rounded-full text-white transition-colors ${isRecording ? 'bg-destructive hover:bg-red-700' : 'bg-primary hover:opacity-90'} ${(isInputDisabled && !isRecording) ? 'opacity-50 cursor-not-allowed' : ''} font-jost`} disabled={(isInputDisabled && !isRecording) || false}>
                {isRecording ? <Square size={20}/> : <Mic size={20} />}
            </button>
        )}
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={canShowFileUpload ? "Type message or upload results..." : "Type your message..."}
          className="flex-1 border border-input bg-background rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px] max-h-[100px] leading-snug disabled:bg-muted disabled:cursor-not-allowed font-jost text-foreground placeholder:text-muted-foreground"
          rows={1}
          disabled={isInputDisabled || (consultationType === 'voice' && isRecording)} 
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={isInputDisabled || (!inputMessage.trim() && !selectedFile)}
          title="Send Message"
          className="bg-primary text-primary-foreground p-3 rounded-full hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center aspect-square font-jost"
        >
          {isSending ? (
            <ThreeDots height={20} width={20} color="currentColor" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
    </div>
  );
} 