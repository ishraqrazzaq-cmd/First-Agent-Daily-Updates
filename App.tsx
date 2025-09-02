
import React, { useState, useCallback } from 'react';
import { getMorningBriefing } from './services/geminiService';
import { BriefingData } from './types';
import Header from './components/Header';
import WeatherDisplay from './components/WeatherDisplay';
import NewsDisplay from './components/NewsDisplay';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';

const App: React.FC = () => {
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchBriefing = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setBriefing(null);

    try {
      const data = await getMorningBriefing();
      setBriefing(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Check the console for details.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-yellow-100 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center">
        <div className="w-full max-w-2xl text-center">
          {!briefing && !isLoading && !error && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-700 mb-4">Ready for your daily update?</h2>
              <p className="text-slate-600 mb-6">Click the button below to get the latest weather and top news headlines, curated just for you.</p>
              <button
                onClick={handleFetchBriefing}
                disabled={isLoading}
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
              >
                Get My Morning Briefing
              </button>
            </div>
          )}

          {isLoading && <LoadingSpinner />}
          {error && <ErrorDisplay message={error} onRetry={handleFetchBriefing} />}
          
          {briefing && (
            <div className="space-y-8 animate-fade-in-up">
              <WeatherDisplay weather={briefing.weather} />
              <NewsDisplay news={briefing.news} />
              <Footer sources={briefing.sources} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
