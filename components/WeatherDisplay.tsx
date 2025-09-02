
import React from 'react';
import { Weather } from '../types';

interface WeatherDisplayProps {
  weather: Weather;
}

const WeatherIcon: React.FC<{ condition: string }> = ({ condition }) => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) return <span role="img" aria-label="sun" className="text-5xl">☀️</span>;
  if (lowerCondition.includes('cloud')) return <span role="img" aria-label="cloud" className="text-5xl">☁️</span>;
  if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) return <span role="img" aria-label="rain" className="text-5xl">🌧️</span>;
  if (lowerCondition.includes('snow')) return <span role="img" aria-label="snow" className="text-5xl">❄️</span>;
  if (lowerCondition.includes('storm')) return <span role="img" aria-label="storm" className="text-5xl">⛈️</span>;
  return <span role="img" aria-label="partly cloudy" className="text-5xl">⛅️</span>;
};

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather }) => {
  return (
    <section className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 text-left w-full">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Today's Weather</h2>
      <div className="flex items-center space-x-6">
        <div className="flex-shrink-0">
          <WeatherIcon condition={weather.condition} />
        </div>
        <div>
          <p className="text-3xl font-bold text-slate-800">{weather.temperature}</p>
          <p className="text-lg text-slate-600">{weather.condition}</p>
          <p className="text-sm text-slate-500">{weather.location}</p>
        </div>
      </div>
    </section>
  );
};

export default WeatherDisplay;
