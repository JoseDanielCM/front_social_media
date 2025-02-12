import React, { useState, useEffect } from 'react';

function BtnTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <button
      className="dark:bg-slate-200 px-4 py-2 rounded hover:bg-slate-300 bg-red-600 dark:text-white"
      onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
    >
      BtnTheme
    </button>
  );
}

export default BtnTheme;
