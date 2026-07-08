import React, { useState } from 'react';
import axios from 'axios';
import { Send, Loader2 } from 'lucide-react';

const Sms: React.FC = () => {
  const [recipientsStr, setRecipientsStr] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    // Split comma-separated string into array of numbers
    const recipients = recipientsStr.split(',').map(r => r.trim()).filter(r => r.length > 0);
    
    if (recipients.length === 0) {
      setResult("Please enter at least one valid recipient.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('/api/admin/sms/send', { recipients, message });
      setResult(res.data.message || "Messages sent successfully!");
      setRecipientsStr('');
      setMessage('');
    } catch (err) {
      console.error(err);
      setResult("Failed to send messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="page-title">Send SMS Broadcast</h2>
      
      <div className="dashboard-widgets" style={{ maxWidth: '600px' }}>
        <div className="widget glass-panel">
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            Use this tool to send SMS broadcasts to members. Enter comma-separated phone numbers below.
          </p>
          
          {result && (
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
              {result}
            </div>
          )}

          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Recipients (Comma-separated)</label>
              <textarea 
                rows={3} 
                value={recipientsStr} 
                onChange={e => setRecipientsStr(e.target.value)} 
                placeholder="e.g., +233201234567, 0241234567"
                required 
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Message</label>
              <textarea 
                rows={5} 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
                placeholder="Type your message here..."
                required 
              />
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {message.length} characters
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? <Loader2 size={18} className="spinner" /> : <Send size={18} />}
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sms;
