'use client'
import React from 'react';
import { IoWarningOutline } from "react-icons/io5";

type ErrorDisplayProps = {
    message?: string;
};

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
    if (!message) return null;

    return (
        <div className="flex gap-1 items-center ml-3 mt-1 text-color1">
            <IoWarningOutline className="w-4 h-4" />
            <span className="text-[14px]">{message}</span>
        </div>
    );
};

export default ErrorDisplay;