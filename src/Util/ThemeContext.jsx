import { createContext, useContext, useEffect, useState } from 'react';

// 1. Crear el contexto
const ThemeContext = createContext();

// 2. Crear el provider que manejará el estado del tema
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// 3. Crear un hook para consumir el tema fácilmente
export function useTheme() {
    return useContext(ThemeContext);
}
