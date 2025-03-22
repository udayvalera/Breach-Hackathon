import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MoonIcon, SunIcon } from 'lucide-react';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
import AppRoutes from './routes';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => null,
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check local storage first
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) return saved;
    
    // Then check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    // Update document root class and local storage
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Router>
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-150">
          <Header>
            <button 
              className="p-2 rounded-full hover:bg-accent"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? 
                <SunIcon className="h-5 w-5" /> : 
                <MoonIcon className="h-5 w-5" />
              }
            </button>
          </Header>
          
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            
            <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
              <AppRoutes />
            </main>
          </div>
          
          <Footer />
        </div>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;