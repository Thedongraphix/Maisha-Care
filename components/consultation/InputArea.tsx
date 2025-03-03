import React from 'react';
import { Paperclip, Send, Mic } from 'lucide-react';

interface InputAreaProps {
  consultationType: string;
  inputText: string;
  setInputText: (text: string) => void;
  sendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  toggleRecording: () => void;
  isRecording: boolean;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isSubmitting: boolean;
  isFinalizing: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({
  consultationType,
  inputText,
  setInputText,
  sendMessage,
  handleKeyPress,
  toggleRecording,
  isRecording,
  handleFileUpload,
  fileInputRef,
  isSubmitting,
  isFinalizing
}) => {
  return (
    <div className="border-t border-gray-100 p-3 sm:p-4 bg-white">
      {consultationType === 'text' ? (
        <div className="flex items-center gap-2">
          <label className="cursor-pointer text-gray-500 hover:text-color1 transition-colors p-2">
            <Paperclip className="w-5 h-5" />
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileUpload}
              ref={fileInputRef}
              multiple
            />
          </label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 
            text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-color1/30 
            focus:border-transparent placeholder:text-gray-400"
            onKeyDown={handleKeyPress}
            disabled={isSubmitting || isFinalizing}
          />
          <button 
            onClick={sendMessage}
            disabled={!inputText.trim() || isSubmitting || isFinalizing}
            className={`bg-color1 text-white p-2.5 rounded-full 
            hover:bg-color1/90 transition-all duration-300 
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:shadow-lg hover:shadow-color1/25 ${
              !inputText.trim() || isSubmitting || isFinalizing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            onClick={toggleRecording}
            disabled={isSubmitting || isFinalizing}
            className={`${
              isRecording ? 'bg-red-500' : 'bg-color1'
            } text-white p-4 rounded-full 
            hover:shadow-lg transition-all duration-300 
            disabled:opacity-50 disabled:cursor-not-allowed ${
              isSubmitting || isFinalizing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Mic className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default InputArea;