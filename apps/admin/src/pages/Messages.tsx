import React, { useEffect, useState } from 'react';
import { MessageSquare, Mail, Phone, Trash2 } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';
import axios from 'axios';
import { format } from 'date-fns';

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get('/api/admin/messages');
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen message="Loading messages..." />;

  return (
    <div>
      <h2 className="page-title">Contact Messages</h2>
      
      <div className="dashboard-widgets">
        {messages.map(msg => (
          <div key={msg.id} className="widget glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ marginBottom: '0.25rem' }}>{msg.subject}</h3>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  From: <strong>{msg.name}</strong> ({msg.email})
                </div>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {format(new Date(msg.createdAt), 'MMM dd, yyyy h:mm a')}
              </div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', whiteSpace: 'pre-wrap' }}>
              {msg.message}
            </div>
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="widget glass-panel" style={{ textAlign: 'center' }}>
            <p>No messages found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
