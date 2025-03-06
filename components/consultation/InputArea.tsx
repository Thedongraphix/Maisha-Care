import React from 'react';
import { Paperclip, Send, Mic, Image } from 'lucide-react';

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
  const isDisabled = isSubmitting || isFinalizing;
  
  return (
    <div className="border-t border-gray-200 p-3 sm:p-4 bg-white shadow-sm">
      {consultationType === 'text' ? (
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <label className="cursor-pointer text-gray-400 hover:text-color1 transition-colors p-2 rounded-full hover:bg-gray-100">
              <Paperclip className="w-5 h-5" />
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileUpload}
                ref={fileInputRef}
                multiple
                disabled={isDisabled}
              />
            </label>
            <label className="cursor-pointer text-gray-400 hover:text-color1 transition-colors p-2 rounded-full hover:bg-gray-100" aria-label="Upload image">
              {/* This is a Lucide icon, not an HTML img element */}
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image className="w-5 h-5" />
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileUpload}
                accept="image/*"
                disabled={isDisabled}
              />
            </label>
          </div>
          
          <div className="flex-1 relative bg-gray-50 rounded-full overflow-hidden border border-gray-200 focus-within:border-color1 focus-within:ring-2 focus-within:ring-color1/20 transition-all">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Message Dr. Stacy..."
              className="w-full px-4 py-2.5 bg-transparent text-gray-800 
                text-sm sm:text-base focus:outline-none placeholder:text-gray-400"
              onKeyDown={handleKeyPress}
              disabled={isDisabled}
            />
            
            <button 
              onClick={sendMessage}
              disabled={!inputText.trim() || isDisabled}
              className={`absolute right-1 top-1/2 -translate-y-1/2 bg-color1 text-white p-2 rounded-full 
                hover:bg-color1/90 transition-all duration-150 
                hover:shadow-md ${
                !inputText.trim() || isDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center px-4 py-6">
          <button
            onClick={toggleRecording}
            disabled={isDisabled}
            className={`${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-color1 hover:bg-color1/90'
            } text-white p-5 rounded-full 
            hover:shadow-lg transition-all duration-300 
            disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Mic className="w-7 h-7" />
          </button>
          <p className="mt-3 text-sm text-gray-500 font-medium">
            {isRecording ? 'Recording... Tap to stop' : 'Tap to start recording'}
          </p>
        </div>
      )}
    </div>
  );
};

export default InputArea;