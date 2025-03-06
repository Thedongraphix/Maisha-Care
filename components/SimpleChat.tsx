'use client';

import { useState, useRef, useEffect } from 'react';
import { sendMessageToAPI } from '@/services/chatService';
import { resetChatState } from '@/utils/consultationUtils';

export default function SimpleChat() {
  const [messages, setMessages] = useState<Array<{
    id: number;
    text: string;
    sender: 'user' | 'assistant';
  }>>([
    {
      id: 1,
      text: "Hello! I'm Dr. Stacy, your Maisha Care AI assistant. How can I help you today?",
      sender: 'assistant'
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user' as const
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Add thinking indicator
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Thinking...",
        sender: 'assistant'
      }]);
      
      // Get existing consultation ID if available
      const consultationId = localStorage.getItem('maisha_consultation_id');
      
      // Send to API
      const response = await sendMessageToAPI(inputMessage, consultationId);
      
      // Store consultation ID if we got one
      if (response.consultation_id) {
        localStorage.setItem('maisha_consultation_id', response.consultation_id);
      }
      
      // Remove thinking indicator and add real response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.text !== "Thinking...");
        return [...filtered, {
          id: Date.now() + 2,
          text: response.message,
          sender: 'assistant'
        }];
      });
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove thinking indicator and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.text !== "Thinking...");
        return [...filtered, {
          id: Date.now() + 3,
          text: "Sorry, I encountered an error. Please try again.",
          sender: 'assistant'
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Function to handle starting a new chat
  const handleResetChat = () => {
    // Clear consultation ID from localStorage
    resetChatState();
    
    // Reset the chat UI
    setMessages([
      {
        id: Date.now(),
        text: "Hello! I'm Dr. Stacy, your Maisha Care AI assistant. How can I help you today?",
        sender: 'assistant'
      }
    ]);
    
    // Reset the input
    setInputMessage('');
    setIsLoading(false);
  };
  
  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Maisha Care Chat</h2>
          <p className="text-sm">Simple chat interface</p>
        </div>
        <button 
          onClick={handleResetChat}
          className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm transition-colors"
        >
          New Chat
        </button>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map(message => (
          <div 
            key={message.id}
            className={`mb-4 ${
              message.sender === 'user' 
                ? 'ml-auto bg-blue-500 text-white' 
                : 'mr-auto bg-gray-200 text-gray-800'
            } rounded-lg p-3 max-w-[80%]`}
          >
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="border-t p-4 flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg disabled:bg-blue-300"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
} 