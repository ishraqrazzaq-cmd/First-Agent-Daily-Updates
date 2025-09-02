
import React from 'react';
import { Source } from '../types';

interface FooterProps {
  sources: Source[];
}

const Footer: React.FC<FooterProps> = ({ sources }) => {
  if (sources.length === 0) {
    return null;
  }

  return (
    <footer className="w-full max-w-2xl mt-8 text-xs text-slate-500 text-left bg-slate-100/50 rounded-lg p-4">
      <h3 className="font-semibold mb-2 text-slate-600">Information Sources:</h3>
      <ul className="list-disc list-inside space-y-1">
        {sources.map((source, index) => (
          <li key={index}>
            <a 
              href={source.uri} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline break-all"
              title={source.title}
            >
              {source.title || source.uri}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-center text-slate-400">Powered by Google Search and Gemini.</p>
    </footer>
  );
};

export default Footer;
