
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-600 font-semibold">Brewing your morning brief...</p>
    </div>
  );
};

export default LoadingSpinner;
