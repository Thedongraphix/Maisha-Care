import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  // Calculate percentage based on progress out of 5
  const percentage = Math.round((progress / 5) * 100);
  
  return (
    <div className="bg-white p-3 border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-2">
        <span className="text-sm text-gray-600">Consultation Progress</span>
        <span className="text-sm font-medium bg-gradient-to-r from-color1 to-color4 bg-clip-text text-transparent">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mt-2 overflow-hidden">
        <motion.div 
          className="bg-gradient-to-r from-color1 to-color4 h-2 rounded-full"
          initial={{ width: `${(progress - 1) * 20}%` }}
          animate={{ width: `${progress * 20}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        ></motion.div>
      </div>
    </div>
  );
};

export default ProgressBar;