'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  sendMessage,
  connectToEventStream,
  disconnectEventStream,
  fetchRequisitionData,
  ChatResponse,
  WorkflowEvent,
  TestRequisitionData, 
  reconnectAttempt,
  MAX_RECONNECT_ATTEMPTS
} from '@/services/chatService';
import { resetChatState, getConsultationId as getStoredConsultationId } from '@/utils/consultationUtils';
import logger from '@/utils/logger';
import { Paperclip, Send, FileText, AlertCircle, Info, RotateCcw, XCircle, DownloadCloud, CheckCircle2, Mic, Square } from 'lucide-react';
import { ThreeDots } from 'react-loader-spinner';
import { jsPDF } from 'jspdf';


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
  timeoutId?: NodeJS.Timeout;
}

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const MAX_FILE_SIZE_MB = 10;
const WORKFLOW_STATUS_CLEAR_DELAY = 5000;

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
  const [isReconnectingSse, setIsReconnectingSse] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [sseConnected, setSseConnected] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileProcessingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const workflowStatusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pdfBlobUrlRef = useRef<string | null>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const addMessage = useCallback((message: Message, addToTop = false) => {
    setMessages(prev => addToTop ? [message, ...prev] : [...prev, message]);
  }, []);

  const clearWorkflowStatus = useCallback(() => {
    if (workflowStatusTimeoutRef.current) {
      clearTimeout(workflowStatusTimeoutRef.current);
      workflowStatusTimeoutRef.current = null;
    }
    setWorkflowStatus(null);
  }, []);

  const setWorkflowStatusWithTimeout = useCallback((status: WorkflowStatus | null, delay?: number) => {
    if (workflowStatusTimeoutRef.current) {
      clearTimeout(workflowStatusTimeoutRef.current);
      workflowStatusTimeoutRef.current = null;
    }

    setWorkflowStatus(status);

    if (status && status.type !== 'loading' && delay !== 0) {
      const timeoutDelay = delay ?? WORKFLOW_STATUS_CLEAR_DELAY;
      workflowStatusTimeoutRef.current = setTimeout(() => {
        setWorkflowStatus(null);
        workflowStatusTimeoutRef.current = null;
      }, timeoutDelay);
    }
  }, []);

  const handleSseError = useCallback((error: Event) => {
    logger.error('SSE Connection Error callback in ActiveConsultation:', error);
    setSseConnected(false);
    setIsReconnectingSse(true); 
    setWorkflowStatusWithTimeout({
      type: 'info', 
      message: 'Connection to real-time updates lost. Attempting to reconnect...',
      workflowName: 'connection'
    }, 0);
  }, [setWorkflowStatusWithTimeout]);

  const handleWorkflowError = useCallback((eventData: WorkflowEvent, workflowName: string) => {
    addMessage({
        id: Date.now().toString() + '-workflow-error-' + workflowName,
        text: `An issue occurred with ${workflowName}: ${eventData.message}`,
        sender: 'system',
        timestamp: new Date(eventData.timestamp),
    });
    setIsLoading(false);
    setIsSending(false);
    setIsProcessingFile(false);
    clearFileProcessingTimeout();
    setWorkflowStatusWithTimeout({
      type: 'error',
      message: eventData.message,
      workflowName: workflowName,
    }, 7000);
  }, [addMessage, setWorkflowStatusWithTimeout]);

  const clearFileProcessingTimeout = useCallback(() => {
    if (fileProcessingTimeoutRef.current) {
      clearTimeout(fileProcessingTimeoutRef.current);
      fileProcessingTimeoutRef.current = null;
    }
  }, []);

  const handleWorkflowEvent = useCallback((eventData: WorkflowEvent) => {
    logger.info('handleWorkflowEvent: Received SSE:', eventData);
    
    const currentConsultationId = getStoredConsultationId();
    if (eventData.consultation_id !== currentConsultationId) {
        logger.warn('SSE Event for different consultation ID received, ignoring.');
        return;
    }

    if (eventData.workflow_name === 'connection') {
      if (eventData.message?.includes('Connected to consultation')) {
        logger.info('SSE: Connection message processed.');
        setSseConnected(true);
        setIsReconnectingSse(false);
        const stageMatch = eventData.message.match(/Current stage: (\w+)/);
        if (stageMatch && stageMatch[1]) {
          setCurrentStage(stageMatch[1]);
          logger.info(`SSE: Current stage updated to: ${stageMatch[1]}`);
        }
        clearWorkflowStatus();
      } else if (eventData.message?.includes('timeout soon')) {
        logger.warn('SSE: Connection timeout warning received.');
        // Don't set a workflow status that blocks the UI
        // The connection will auto-reconnect
      }
      return; 
    }

    if (eventData.workflow_name === 'test_analysis') {
      if (eventData.event_type === 'WORKFLOW_START') {
        setIsProcessingFile(true);
        setWorkflowStatusWithTimeout({
          type: 'loading',
          message: eventData.message || 'Analyzing your test results...',
          workflowName: 'test_analysis'
        }, 0);
      } else if (eventData.event_type === 'WORKFLOW_COMPLETE') {
        if (eventData.message) {
          addMessage({
            id: Date.now().toString() + '-analysis-result',
            text: eventData.message,
            sender: 'assistant',
            timestamp: new Date(eventData.timestamp),
            stage: 'diagnosis_pending' 
          });
        }
        setIsProcessingFile(false);
        setIsLoading(false);
        setIsSending(false); 
        clearFileProcessingTimeout();
        setWorkflowStatusWithTimeout({
          type: 'success', 
          message: 'Test analysis complete.', 
          workflowName: 'test_analysis'
        });
      } else if (eventData.event_type === 'WORKFLOW_ERROR') {
        handleWorkflowError(eventData, 'test_analysis');
      }
      return;
    }

    if (eventData.workflow_name === 'test_recommendation') {
      if (eventData.event_type === 'WORKFLOW_START') {
        setIsLoading(true);
        setWorkflowStatusWithTimeout({
          type: 'loading',
          message: eventData.message || 'Generating test recommendations...',
          workflowName: 'test_recommendation'
        }, 0);
      } else if (eventData.event_type === 'WORKFLOW_COMPLETE') {
        if (eventData.message) {
          addMessage({
            id: Date.now().toString() + '-test-recommendation',
            text: eventData.message,
            sender: 'assistant',
            timestamp: new Date(eventData.timestamp),
            stage: 'awaiting_tests'
          });
        }
        setIsLoading(false);
        setIsSending(false);
        setCurrentStage('awaiting_tests');
        setShowRequisitionButton(true);
        setWorkflowStatusWithTimeout({
          type: 'success',
          message: 'Test recommendations ready.',
          workflowName: 'test_recommendation'
        });
      } else if (eventData.event_type === 'WORKFLOW_ERROR') {
        handleWorkflowError(eventData, 'test_recommendation');
      }
      return;
    }

    // Handle other workflows
    let statusType: WorkflowStatus['type'] = 'info';
    if (eventData.event_type === 'WORKFLOW_ERROR') statusType = 'error';
    else if (eventData.event_type === 'WORKFLOW_COMPLETE') statusType = 'success';
    else if (eventData.event_type === 'WORKFLOW_START' || eventData.event_type === 'WORKFLOW_PROGRESS') statusType = 'loading';

    if (eventData.event_type === 'WORKFLOW_START' || eventData.event_type === 'WORKFLOW_PROGRESS') {
      setIsLoading(true);
      setWorkflowStatusWithTimeout({
        type: statusType,
        message: eventData.message,
        workflowName: eventData.workflow_name,
      }, 0);
    } else if (eventData.event_type === 'WORKFLOW_COMPLETE') {
      setIsLoading(false);
      setIsSending(false); 

      if (eventData.message) { 
        addMessage({
            id: Date.now().toString() + '-workflow-' + eventData.workflow_name,
            text: eventData.message,
            sender: 'assistant', 
            timestamp: new Date(eventData.timestamp),
            stage: eventData.workflow_name 
        });
      }
      
      // Additional check for test_recommendation in generic handler
      if (eventData.workflow_name === 'test_recommendation') {
        setShowRequisitionButton(true);
        setCurrentStage('awaiting_tests');
      }
      
      setWorkflowStatusWithTimeout({
        type: statusType,
        message: eventData.message,
        workflowName: eventData.workflow_name,
      });
    } else if (eventData.event_type === 'WORKFLOW_ERROR') {
        handleWorkflowError(eventData, eventData.workflow_name);
    }
  }, [addMessage, clearWorkflowStatus, setWorkflowStatusWithTimeout, handleWorkflowError, clearFileProcessingTimeout]); 

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
  }, []);

  const handleSseOpen = useCallback(() => {
    logger.info('SSE connection opened callback triggered.');
    setSseConnected(true);
    setIsReconnectingSse(false);
    setWorkflowStatus(prev => {
        if (prev && (prev.message.includes('Reconnecting') || prev.message.includes('Connection issues') || prev.message.includes('Failed to connect'))) {
            return null;
        }
        return prev;
    });
  }, []);

  useEffect(() => {
    let isActive = true;
    
    if (consultationId && isActive) {
      logger.info(`Effect: Initializing SSE for consultation: ${consultationId}`);
      const stableHandleWorkflowEvent = (event: WorkflowEvent) => {
        if (isActive) handleWorkflowEvent(event);
      };
      const stableHandleSseError = (error: Event) => {
        if (isActive) handleSseError(error);
      };
      const stableHandleSseOpen = () => {
        if (isActive) handleSseOpen();
      };
      
      connectToEventStream(stableHandleWorkflowEvent, stableHandleSseError, stableHandleSseOpen);
    } else if (!consultationId) {
      disconnectEventStream();
      setSseConnected(false);
      setIsReconnectingSse(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('maisha_consultation_id');
      }
    }
    
    return () => {
      isActive = false;
      logger.info('Effect: Cleaning up SSE connection on unmount or consultationId change.');
      disconnectEventStream(); 
      setSseConnected(false);
      setIsReconnectingSse(false);
    };
  }, [consultationId]);

  const handleSendMessage = async (messageTextOverride?: string) => {
    const textToSend = messageTextOverride || inputMessage;
    if ((!textToSend.trim() && !selectedFile) || isSending || isProcessingFile) {
        logger.warn('handleSendMessage: Attempted to send while already sending or processing file.');
        return;
    }

    setIsSending(true);
    setIsLoading(true); 
    
    if (selectedFile) {
      setIsProcessingFile(true);
      setWorkflowStatusWithTimeout({ 
        type: 'loading', 
        message: 'Uploading your file...', 
      }, 0);
      fileProcessingTimeoutRef.current = setTimeout(() => {
        if (isProcessingFile) {
          setWorkflowStatusWithTimeout({
            type: 'info',
            message: 'Analysis is taking longer than usual. Please wait...',
            workflowName: 'test_analysis'
          }, 0);
        }
      }, 90000);
    } else {
      setWorkflowStatusWithTimeout({ type: 'loading', message: 'Sending message...' }, 0);
    }

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

      if (response._isBackgroundProcessing) {
        logger.info('handleSendMessage: Background processing signaled.');
        setIsSending(false);
        setWorkflowStatusWithTimeout({
            type: 'loading',
            message: response.next_steps || 'Processing your request...',
            workflowName: response.stage
        }, 0);
        return;
      }
      
      if (response.stage) {
        setCurrentStage(response.stage);
        setShowRequisitionButton(response.stage === 'awaiting_tests' || response.stage === 'test_recommendation_complete');
      }

      if (response.message) {
        addMessage({
          id: Date.now().toString() + '-ai',
          text: response.message,
          sender: 'assistant',
          stage: response.stage,
          next_steps: response.next_steps,
          timestamp: createTimestamp(),
        });
      }
      
      resetAfterSend();

    } catch (error: any) {
      logger.error('handleSendMessage: Error:', error);
      addMessage({
        id: Date.now().toString() + '-err-send',
        text: error.message || "Sorry, an error occurred. Please try again.",
        sender: 'system',
        timestamp: createTimestamp(),
      });
      setWorkflowStatusWithTimeout({ 
        type: 'error', 
        message: error.message || "Failed to send message." 
      });
      
      resetAfterSend(true);
    }
  };

  const resetAfterSend = (isError = false) => {
    setSelectedFile(null); 
    setFilePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
    setIsSending(false);
    setIsLoading(false);
    setIsProcessingFile(false);
    clearFileProcessingTimeout();
    if (!isError) clearWorkflowStatus();
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setWorkflowStatusWithTimeout({
          type: 'error', 
          message: `Invalid file type. Allowed: JPG, PNG, PDF, DOC(X)`
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setWorkflowStatusWithTimeout({
          type: 'error', 
          message: `File too large. Max size: ${MAX_FILE_SIZE_MB}MB`
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setSelectedFile(file);
      setFilePreview(file.name);
      clearWorkflowStatus();
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
    if (e.key === 'Enter' && !e.shiftKey && !isSending && !isProcessingFile) {
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
    resetAfterSend();
    clearWorkflowStatus();
    setShowRequisitionButton(false);
    setSseConnected(false);
    setIsReconnectingSse(false);
    logger.info('Chat has been reset.');
    onClose(); 
  };

  const handleGenerateRequisition = async () => {
    if (!consultationId) {
        setWorkflowStatusWithTimeout({
          type: 'error', 
          message: 'No active consultation for requisition.'
        });
      return;
    }
    setIsLoading(true);
    setWorkflowStatusWithTimeout({ 
      type: 'loading', 
      message: 'Fetching requisition data...'
    }, 0);
    
    try {
        const data: TestRequisitionData | null = await fetchRequisitionData();
        if (data) {
            logger.info('TestRequisitionData fetched:', data);
            setWorkflowStatusWithTimeout({
              type: 'success', 
              message: `Requisition for ${data.patient_name} ready.` 
            });
            generateRequisitionPDF(data);
        } else {
            setWorkflowStatusWithTimeout({
              type: 'info', 
              message: 'No requisition data available yet.'
            });
        }
    } catch (error: any) {
        logger.error('Error fetching requisition data:', error);
        setWorkflowStatusWithTimeout({
          type: 'error', 
          message: error.message || 'Could not fetch requisition data.'
        });
    } finally {
        setIsLoading(false);
    }
  };

  const generateRequisitionPDF = (data: TestRequisitionData) => {
    try {
      const pdf = new jsPDF();
      
      const primaryBlue: [number, number, number] = [37, 99, 235];
      const darkGray: [number, number, number] = [31, 41, 55];
      const mediumGray: [number, number, number] = [107, 114, 128];
      
      pdf.setFontSize(24);
      pdf.setTextColor(...primaryBlue);
      pdf.setFont('helvetica', 'bold');
      pdf.text('MAISHA CARE', 105, 25, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.setTextColor(...darkGray);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Medical Test Requisition', 105, 35, { align: 'center' });
      
      pdf.setDrawColor(...primaryBlue);
      pdf.setLineWidth(1);
      pdf.line(20, 40, 190, 40);
      
      const formattedDate = new Date(data.date_requested).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      let yPosition = 55;
      
      pdf.setFontSize(14);
      pdf.setTextColor(...darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PATIENT INFORMATION', 20, yPosition);
      
      pdf.setFillColor(249, 250, 251);
      pdf.rect(20, yPosition + 2, 170, 35, 'F');
      
      yPosition += 12;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      pdf.setTextColor(...darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Patient Name:', 25, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...mediumGray);
      pdf.text(data.patient_name, 70, yPosition);
      
      pdf.setTextColor(...darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Age:', 120, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...mediumGray);
      pdf.text(`${data.patient_age} years`, 135, yPosition);
      
      yPosition += 10;
      pdf.setTextColor(...darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Sex:', 25, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...mediumGray);
      pdf.text(data.patient_sex, 70, yPosition);
      
      pdf.setTextColor(...darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Date Requested:', 120, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...mediumGray);
      pdf.text(formattedDate, 120, yPosition + 8);
      
      yPosition += 25;
      
      pdf.setFontSize(14);
      pdf.setTextColor(...darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('REQUESTING PHYSICIAN', 20, yPosition);
      
      pdf.setFillColor(249, 250, 251);
      pdf.rect(20, yPosition + 2, 170, 20, 'F');
      
      yPosition += 12;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...mediumGray);
      pdf.text(data.requesting_physician, 25, yPosition);
      
      const priorityColor: [number, number, number] = data.priority === 'Urgent' ? [220, 38, 38] : [22, 163, 74];
      pdf.setFillColor(...priorityColor);
      pdf.roundedRect(140, yPosition - 5, 25, 8, 2, 2, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text(data.priority.toUpperCase(), 152.5, yPosition, { align: 'center' });
      
      yPosition += 25;
      
      pdf.setFontSize(14);
      pdf.setTextColor(...darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TESTS REQUESTED', 20, yPosition);
      
      yPosition += 10;
      
      data.tests_requested.forEach((test, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 30;
        }
        
        pdf.setFillColor(255, 255, 255);
        pdf.setDrawColor(229, 231, 235);
        pdf.rect(20, yPosition - 5, 170, 12, 'FD');
        
        pdf.setFillColor(...primaryBlue);
        pdf.rect(20, yPosition - 5, 3, 12, 'F');
        
        pdf.setFontSize(11);
        pdf.setTextColor(...darkGray);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${index + 1}.`, 28, yPosition + 2);
        
        pdf.setFont('helvetica', 'normal');
        pdf.text(test, 35, yPosition + 2);
        
        yPosition += 15;
      });
      
      yPosition += 10;
      
      if (data.clinical_notes) {
        if (yPosition > 220) {
          pdf.addPage();
          yPosition = 30;
        }
        
        pdf.setFontSize(14);
        pdf.setTextColor(...darkGray);
        pdf.setFont('helvetica', 'bold');
        pdf.text('CLINICAL NOTES', 20, yPosition);
        
        yPosition += 10;
        
        pdf.setFillColor(255, 251, 235);
        pdf.setDrawColor(245, 158, 11);
        pdf.rect(20, yPosition - 5, 170, 30, 'FD');
        
        pdf.setFillColor(245, 158, 11);
        pdf.rect(20, yPosition - 5, 3, 30, 'F');
        
        pdf.setFontSize(10);
        pdf.setTextColor(...darkGray);
        pdf.setFont('helvetica', 'italic');
        
        const splitNotes = pdf.splitTextToSize(data.clinical_notes, 160);
        pdf.text(splitNotes, 28, yPosition + 2);
        
        yPosition += 40;
      }
      
      const pageHeight = pdf.internal.pageSize.height;
      pdf.setFontSize(9);
      pdf.setTextColor(...mediumGray);
      pdf.setFont('helvetica', 'normal');
      
      pdf.setDrawColor(229, 231, 235);
      pdf.line(20, pageHeight - 30, 190, pageHeight - 30);
      
      pdf.text('This requisition was generated by Maisha Care AI', 105, pageHeight - 20, { align: 'center' });
      pdf.text('Please present this requisition to your healthcare provider or laboratory', 105, pageHeight - 12, { align: 'center' });
      pdf.text(`Generated on: ${formattedDate}`, 105, pageHeight - 4, { align: 'center' });
      
      const fileName = `Test_Requisition_${data.patient_name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      const pdfBlob = pdf.output('blob');
      
      if (pdfBlobUrlRef.current) {
        URL.revokeObjectURL(pdfBlobUrlRef.current);
      }
      
      setPdfBlob(pdfBlob);
      setPdfFileName(fileName);
      setShowPdfModal(true);
      
      setWorkflowStatusWithTimeout({
        type: 'success', 
        message: `Requisition PDF ready for ${data.patient_name}.`
      });
      
    } catch (error: any) {
      logger.error('Error generating PDF:', error);
      setWorkflowStatusWithTimeout({
        type: 'error', 
        message: error.message || 'Failed to generate PDF'
      });
    }
  };

  const downloadPdf = () => {
    if (pdfBlob && pdfFileName) {
      const url = URL.createObjectURL(pdfBlob);
      pdfBlobUrlRef.current = url;
      
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfFileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        if (pdfBlobUrlRef.current === url) {
          URL.revokeObjectURL(url);
          pdfBlobUrlRef.current = null;
        }
      }, 100);
      
      setWorkflowStatusWithTimeout({
        type: 'success',
        message: `PDF "${pdfFileName}" downloaded successfully.`
      });
      
      logger.info(`PDF downloaded: ${pdfFileName}`);
    }
  };

  const closePdfModal = () => {
    setShowPdfModal(false);
    
    const iframes = document.querySelectorAll('iframe[title="PDF Preview"]');
    iframes.forEach(iframe => {
      const src = (iframe as HTMLIFrameElement).src;
      if (src.startsWith('blob:')) {
        URL.revokeObjectURL(src);
      }
    });
    
    if (pdfBlobUrlRef.current) {
      URL.revokeObjectURL(pdfBlobUrlRef.current);
      pdfBlobUrlRef.current = null;
    }
    
    setPdfBlob(null);
    setPdfFileName('');
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      setIsRecording(true);
      addMessage({
        id: Date.now().toString(), 
        text: "[Voice recording started...]", 
        sender: 'system', 
        timestamp: createTimestamp()
      });
    } else {
      setIsRecording(false);
      try {
        await handleSendMessage("[Simulated Voice Message Transcription]");
      } catch (error) {
        setIsRecording(false);
        logger.error('Failed to send voice message:', error);
      }
    }
    logger.info(`Recording toggled: ${!isRecording}`);
  };
  
  const handleFinalizeConsultation = () => {
    const completionStages = ['Completed', 'treatment_plan_generated', 'diagnosis_complete'];
    if (completionStages.includes(currentStage || '')) {
        addMessage({
          id: Date.now().toString(), 
          text: "Consultation has been concluded. Thank you for using Maisha Care!", 
          sender: 'system', 
          timestamp: createTimestamp()
        });
        logger.info('Consultation concluded by user action or final stage reached.');
        if (typeof window !== 'undefined') {
            localStorage.removeItem('maisha_consultation_id');
        }
        setConsultationId(null); 
        onClose(); 
    } else {
        setWorkflowStatusWithTimeout({
          type: 'info', 
          message: 'The consultation is still in progress. Please wait for the AI to guide you to completion.'
        });
    }
  };

  useEffect(() => {
    return () => {
      clearFileProcessingTimeout();
      if (workflowStatusTimeoutRef.current) {
        clearTimeout(workflowStatusTimeoutRef.current);
      }
      if (pdfBlobUrlRef.current) {
        URL.revokeObjectURL(pdfBlobUrlRef.current);
      }
    };
  }, []);

  const isInputDisabled = isLoading || isSending || isProcessingFile;
  const canShowFileUpload = currentStage === 'awaiting_tests';
  const canShowFinalizeButton = ['Completed', 'treatment_plan_generated', 'diagnosis_complete'].includes(currentStage || '');

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-80px)] max-h-[750px] w-full max-w-3xl bg-background shadow-xl rounded-xl overflow-hidden font-jost antialiased">
        <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center shadow-md">
          <div>
            <h2 className="text-xl font-grotesk font-semibold">Maisha Care AI</h2>
            {currentStage && <p className="text-xs opacity-90 font-jost">Stage: <span className='font-semibold capitalize'>{currentStage.replace(/_/g, ' ')}</span></p>}
          </div>
          <div className='flex items-center gap-2'>
            {consultationId && (
              <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                sseConnected ? 'bg-green-500/20' : 'bg-amber-500/20'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  sseConnected ? 'bg-green-400' : 'bg-amber-400 animate-pulse'
                }`} />
                <span>{sseConnected ? 'Connected' : 'Connecting...'}</span>
              </div>
            )}
            {isReconnectingSse && (
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

      {showPdfModal && pdfBlob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Test Requisition Preview</h3>
              <button
                onClick={closePdfModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close preview"
              >
                <XCircle size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-4 bg-gray-50">
              <iframe
                src={URL.createObjectURL(pdfBlob)}
                className="w-full h-full min-h-[600px] border border-gray-200 rounded bg-white"
                title="PDF Preview"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600 flex items-center">
                <FileText size={16} className="mr-1" />
                {pdfFileName}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closePdfModal}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Close
                </button>
                <button
                  onClick={downloadPdf}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center gap-2"
                >
                  <DownloadCloud size={16} />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 