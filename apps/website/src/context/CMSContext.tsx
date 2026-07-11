import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface CMSContent {
  [key: string]: string;
}

interface CMSContextType {
  content: CMSContent;
  loading: boolean;
  get: (key: string, defaultValue?: string) => string;
  getJSON: <T>(key: string, defaultValue?: T) => T;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<CMSContent>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get('/api/content');
        // The API now returns a map directly
        setContent(res.data);
      } catch (err) {
        console.error("Failed to fetch CMS content:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, []);

  const get = (key: string, defaultValue: string = '') => {
    return content[key] || defaultValue;
  };

  const getJSON = <T,>(key: string, defaultValue?: T): T => {
    try {
      if (content[key]) {
        return JSON.parse(content[key]) as T;
      }
    } catch (e) {
      console.error(`Failed to parse JSON for CMS key: ${key}`);
    }
    return defaultValue as T;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', background: 'var(--bg-color, #ffffff)' }}>
         <div style={{ width: '50px', height: '50px', border: '4px solid rgba(28, 16, 94, 0.1)', borderTop: '4px solid var(--primary-color, #1c105e)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
         <p style={{ marginTop: '1rem', color: 'var(--primary-color)', fontWeight: 500, fontFamily: 'inherit' }}>Loading...</p>
         <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <CMSContext.Provider value={{ content, loading, get, getJSON }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
