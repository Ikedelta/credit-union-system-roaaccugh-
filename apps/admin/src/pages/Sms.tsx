import React, { useState } from 'react';
import axios from 'axios';
import { Send, Loader2 } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

const Sms: React.FC = () => {
  const [targetGroup, setTargetGroup] = useState<string>('MANUAL');
  const [recipientsStr, setRecipientsStr] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [sendResults, setSendResults] = useState<{ recipient: string; status: string; arkeselResponse?: string }[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/api/admin/sms');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLogsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchLogs();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setSendResults([]);

    try {
      if (targetGroup === 'MANUAL') {
        const recipients = recipientsStr.split(',').map(r => r.trim()).filter(r => r.length > 0);
        if (recipients.length === 0) {
          setResult("Please enter at least one valid recipient.");
          setLoading(false);
          return;
        }
        const res = await axios.post('/api/admin/sms/send', { recipients, message });
        setResult(res.data.message || "Messages sent successfully!");
        setSendResults(res.data.results || []);
      } else {
        const res = await axios.post('/api/admin/sms/broadcast', { targetGroup, message });
        setResult(res.data.message || "Broadcast sent successfully!");
        setSendResults(res.data.results || []);
      }
      
      setRecipientsStr('');
      setMessage('');
      fetchLogs();
    } catch (err: any) {
      console.error(err);
      setResult(err.response?.data?.error || "Failed to send messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="page-title">Send SMS Broadcast</h2>
      
      <div className="dashboard-widgets" style={{ alignItems: 'start' }}>
        {/* Left Column: Send SMS Form */}
        <div className="widget glass-panel">
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            Use this tool to send SMS broadcasts to members or specific groups.
          </p>
          
          {result && (
            <div style={{ padding: '1rem', background: sendResults.some(r => r.status === 'FAILED') ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.1)', color: sendResults.some(r => r.status === 'FAILED') ? 'var(--danger)' : 'var(--success)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
              <strong>{result}</strong>
              {sendResults.length > 0 && (
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', fontSize: '0.85rem', maxHeight: '150px', overflowY: 'auto' }}>
                  {sendResults.map((r, i) => (
                    <li key={i} style={{ color: r.status === 'SENT' ? 'var(--success)' : 'var(--danger)' }}>
                      {r.recipient} — <strong>{r.status}</strong>{r.arkeselResponse ? ` (${r.arkeselResponse})` : ''}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Target Group</label>
              <select 
                className="form-control" 
                value={targetGroup} 
                onChange={(e) => setTargetGroup(e.target.value)}
              >
                <option value="MANUAL">Manual Entry (Comma-separated)</option>
                <option value="MEMBERS">All Members</option>
                <option value="ADMINS">All Admins / Staff</option>
                <option value="LOAN_APPLICANTS">All Loan Applicants</option>
              </select>
            </div>

            {targetGroup === 'MANUAL' && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Recipients (Comma-separated)</label>
                <textarea 
                  rows={3} 
                  value={recipientsStr} 
                  onChange={e => setRecipientsStr(e.target.value)} 
                  placeholder="e.g., +233201234567, 0241234567"
                  required={targetGroup === 'MANUAL'}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', resize: 'vertical' }}
                />
              </div>
            )}
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Message</label>
              <textarea 
                rows={5} 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
                placeholder="Type your message here..."
                required 
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', resize: 'vertical' }}
              />
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {message.length} characters
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ alignSelf: 'flex-start' }}
            >
              {loading ? <Loader2 size={18} className="spinner" /> : <Send size={18} />}
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Right Column: Recent Messages Table */}
        <div className="widget glass-panel">
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Recent Messages</h3>
          {logsLoading ? (
            <LoadingScreen message="Loading logs..." />
          ) : logs.length === 0 ? (
            <p className="text-secondary">No SMS messages sent yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Recipient</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Message Snippet</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log: any) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.85rem' }}>{new Date(log.createdAt).toLocaleString()}</td>
                      <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.85rem' }}>{log.recipient}</td>
                      <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.85rem', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.message}</td>
                      <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.85rem' }}>
                        <span className={`status-badge ${log.status.toLowerCase()}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sms;
