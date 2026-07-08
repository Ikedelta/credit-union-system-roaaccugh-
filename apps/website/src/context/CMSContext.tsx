import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface CMSContent {
  [key: string]: string;
}

interface CMSContextType {
  content: CMSContent;
  loading: boolean;
  get: (key: string, defaultValue?: string) => string;
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

  return (
    <CMSContext.Provider value={{ content, loading, get }}>
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
