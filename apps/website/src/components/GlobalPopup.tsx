import { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PopupData {
  id: string;
  title: string;
  description: string;
  image: string;
  btnText: string;
  btnLink: string;
  versionStr?: string;
}

export function GlobalPopup() {
  const { get } = useCMS();
  const [queue, setQueue] = useState<PopupData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const popupsToQueue: PopupData[] = [];

    // Popup 1
    const p1Enabled = get('popup_enabled', 'false') === 'true';
    if (p1Enabled) {
      const title = get('popup_title', 'Announcement');
      const desc = get('popup_description', '');
      const image = get('popup_image', '');
      const versionStr = `1-${title}-${image}-${desc?.substring(0, 30)}`;
      
      const seen1 = localStorage.getItem('seenGlobalPopupVersion_1');
      if (seen1 !== versionStr) {
        popupsToQueue.push({
          id: '1', title, description: desc, image,
          btnText: get('popup_btn_text', ''),
          btnLink: get('popup_btn_link', ''),
          versionStr
        });
      }
    }

    // Popup 2
    const p2Enabled = get('popup2_enabled', 'false') === 'true';
    if (p2Enabled) {
      const title = get('popup2_title', 'Second Announcement');
      const desc = get('popup2_description', '');
      const image = get('popup2_image', '');
      const versionStr = `2-${title}-${image}-${desc?.substring(0, 30)}`;
      
      const seen2 = localStorage.getItem('seenGlobalPopupVersion_2');
      if (seen2 !== versionStr) {
        popupsToQueue.push({
          id: '2', title, description: desc, image,
          btnText: get('popup2_btn_text', ''),
          btnLink: get('popup2_btn_link', ''),
          versionStr
        });
      }
    }

    setQueue(popupsToQueue);
    setCurrentIndex(0);

    if (popupsToQueue.length > 0) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        localStorage.setItem(`seenGlobalPopupVersion_${popupsToQueue[0].id}`, popupsToQueue[0].versionStr!);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [get]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < queue.length) {
        setCurrentIndex(nextIndex);
        setIsVisible(true);
        localStorage.setItem(`seenGlobalPopupVersion_${queue[nextIndex].id}`, queue[nextIndex].versionStr!);
      }
    }, 400); // 400ms gap between popups for smooth transition
  };

  if (!isVisible || queue.length === 0 || currentIndex >= queue.length) return null;

  const currentPopup = queue[currentIndex];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(6px)', padding: '1rem', overflowY: 'auto'
    }}>
      <div style={{
        background: 'var(--bg-white)', width: 'fit-content', minWidth: '300px', maxWidth: 'min(90vw, 600px)', borderRadius: '24px', margin: 'auto', overflow: 'hidden', boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)', border: '1px solid rgba(0,0,0,0.05)', position: 'relative', animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <button 
          onClick={handleClose}
          style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)', color: '#334155', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, transition: 'all 0.2s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        {currentPopup.image && (
          <div style={{ padding: '4px 4px 0 4px', display: 'flex', justifyContent: 'center' }}>
            <img src={currentPopup.image.startsWith('http') ? currentPopup.image : `http://localhost:3000${currentPopup.image}`} alt="Popup" style={{ maxWidth: '100%', height: 'auto', maxHeight: '75vh', objectFit: 'contain', borderRadius: '20px', display: 'block', margin: '0 auto' }} />
          </div>
        )}
        
        <div style={{ padding: '1.5rem' }}>
          {currentPopup.title && <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-color)', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3, paddingRight: currentPopup.image ? '0' : '2rem' }}>{currentPopup.title}</h3>}
          {currentPopup.description && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: currentPopup.btnText ? '1.5rem' : 0, whiteSpace: 'pre-wrap' }}>
              {currentPopup.description}
            </p>
          )}
          
          {currentPopup.btnText && currentPopup.btnLink && (
            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              {currentPopup.btnLink.startsWith('http') ? (
                <a href={currentPopup.btnLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', borderRadius: '12px', fontWeight: 600 }} onClick={handleClose}>
                  {currentPopup.btnText}
                </a>
              ) : (
                <Link to={currentPopup.btnLink} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', borderRadius: '12px', fontWeight: 600 }} onClick={handleClose}>
                  {currentPopup.btnText}
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
