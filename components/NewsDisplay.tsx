
import React from 'react';
import { NewsArticle } from '../types';

interface NewsDisplayProps {
  news: NewsArticle[];
}

const NewsDisplay: React.FC<NewsDisplayProps> = ({ news }) => {
  return (
    <section className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 text-left w-full">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Top Headlines</h2>
      <ul className="space-y-4">
        {news.map((article, index) => (
          <li key={index} className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-lg text-slate-800">{article.headline}</h3>
            <p className="text-slate-600">{article.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NewsDisplay;
