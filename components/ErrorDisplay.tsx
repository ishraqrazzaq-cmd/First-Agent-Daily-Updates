
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-100/80 backdrop-blur-sm border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-lg relative" role="alert">
      <strong className="font-bold">Oh no! </strong>
      <span className="block sm:inline">{message}</span>
      <div className="mt-4 text-center">
        <button
          onClick={onRetry}
          className="bg-red-600 text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
