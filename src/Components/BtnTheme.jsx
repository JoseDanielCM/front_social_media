import React from 'react';
import { useTheme } from '../Util/ThemeContext';

function BtnTheme() {
  const { theme, setTheme } = useTheme();

  return (
    <button
        className={`absolute top-4 right-4 px-4 py-2 rounded transition-colors 
          ${theme === 'dark' ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' : 'bg-amber-600 text-white hover:bg-amber-700'}`}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
      </button>
  );
}

export default BtnTheme;
