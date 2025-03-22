import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { supabase } from './lib/supabase';
import type  User  from '@supabase/supabase-js';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
import AppRoutes from './routes';
import { Auth } from './components/Auth';

// Theme Context Setup
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
  // Theme state management
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);

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

  // Authentication state management
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: { user: User | null } | null } }) => {
      setUser(session?.user ?? null);
    });

    interface AuthStateChangePayload {
      event: string;
      session: {
        user: User | null;
      } | null;
    }

    interface AuthSubscription {
      unsubscribe: () => void;
    }

    const { data: { subscription } }: { data: { subscription: AuthSubscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthStateChangePayload['event'], session: AuthStateChangePayload['session']) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Router>
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-150">
          {user ? (
            <>
              <Header />
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
                  <AppRoutes />
                </main>
              </div>
              <Footer />
            </>
          ) : (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
              <Auth />
            </div>
          )}
        </div>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;