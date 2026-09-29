import { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function GlobalPopup() {
  const { get } = useCMS();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only show if enabled
    const isEnabled = get('popup_enabled', 'false') === 'true';
    if (!isEnabled) return;

    // Check if we've already shown it this session
    const hasSeenPopup = sessionStorage.getItem('hasSeenGlobalPopup');
    if (!hasSeenPopup) {
      // Slight delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('hasSeenGlobalPopup', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [get]);

  if (!isOpen) return null;

  const title = get('popup_title', 'Announcement');
  const description = get('popup_description', '');
  const image = get('popup_image', '');
  const btnText = get('popup_btn_text', '');
  const btnLink = get('popup_btn_link', '');

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(6px)', padding: '1rem', overflowY: 'auto'
    }}>
      <div style={{
        background: 'var(--bg-white)', width: '100%', maxWidth: '380px', borderRadius: '24px', margin: 'auto', overflow: 'hidden', boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)', border: '1px solid rgba(0,0,0,0.05)', position: 'relative', animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <button 
          onClick={() => setIsOpen(false)}
          style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)', color: '#334155', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, transition: 'all 0.2s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        {image && (
          <div style={{ padding: '4px 4px 0 4px' }}>
            <img src={image.startsWith('http') ? image : `http://localhost:3000${image}`} alt="Popup" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '20px' }} />
          </div>
        )}
        
        <div style={{ padding: '1.5rem' }}>
          {title && <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-color)', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3, paddingRight: image ? '0' : '2rem' }}>{title}</h3>}
          {description && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: btnText ? '1.5rem' : 0, whiteSpace: 'pre-wrap' }}>
              {description}
            </p>
          )}
          
          {btnText && btnLink && (
            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              {btnLink.startsWith('http') ? (
                <a href={btnLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', borderRadius: '12px', fontWeight: 600 }} onClick={() => setIsOpen(false)}>
                  {btnText}
                </a>
              ) : (
                <Link to={btnLink} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', borderRadius: '12px', fontWeight: 600 }} onClick={() => setIsOpen(false)}>
                  {btnText}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
