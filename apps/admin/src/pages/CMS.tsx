import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Save, Loader2 } from 'lucide-react';

interface ContentItem {
  key: string;
  value: string;
  type: string;
}

const CMS: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await axios.get('/api/admin/content');
      setContent(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (item: ContentItem) => {
    setSavingKey(item.key);
    try {
      await axios.put(`/api/admin/content/${item.key}`, { value: item.value, type: item.type });
      alert("Updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update content");
    } finally {
      setSavingKey(null);
    }
  };

  const handleChange = (key: string, value: string) => {
    setContent(content.map(item => item.key === key ? { ...item, value } : item));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="page-title">Website Content (CMS)</h2>
      
      <div className="dashboard-widgets">
        {content.map(item => (
          <div key={item.key} className="widget glass-panel">
            <h3 style={{ marginBottom: '1rem', textTransform: 'capitalize' }}>
              {item.key.replace(/_/g, ' ')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {item.type === 'TEXT' || item.key.includes('title') ? (
                <input 
                  type="text" 
                  value={item.value} 
                  onChange={(e) => handleChange(item.key, e.target.value)} 
                />
              ) : (
                <textarea 
                  rows={4} 
                  value={item.value} 
                  onChange={(e) => handleChange(item.key, e.target.value)} 
                />
              )}
              <button 
                className="btn btn-primary" 
                style={{ alignSelf: 'flex-start' }}
                onClick={() => handleUpdate(item)}
                disabled={savingKey === item.key}
              >
                {savingKey === item.key ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
                {savingKey === item.key ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ))}

        {content.length === 0 && (
          <div className="widget glass-panel">
            <p>No content available to edit. Run the database seed script to populate defaults.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CMS;
