
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full p-4 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">
        Morning Brief Agent <span className="text-yellow-400">🌞</span>
      </h1>
    </header>
  );
};

export default Header;
