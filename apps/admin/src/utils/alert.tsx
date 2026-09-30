import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

let alertRoot: any = null;

const createContainer = () => {
  let div = document.getElementById('custom-alert-container');
  if (!div) {
    div = document.createElement('div');
    div.id = 'custom-alert-container';
    document.body.appendChild(div);
  }
  return div;
};

const CustomAlert = ({ message, type = 'success', onConfirm, isConfirm = false }: any) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!isConfirm) {
      const timer = setTimeout(() => {
        handleConfirm();
      }, 1500); // Auto-dismiss after 1.5 seconds
      return () => clearTimeout(timer);
    }
  }, [isConfirm]);

  const close = () => {
    setOpen(false);
    setTimeout(() => {
      alertRoot?.unmount();
      alertRoot = null;
      const div = document.getElementById('custom-alert-container');
      if (div) div.innerHTML = '';
    }, 300);
  };

  const handleConfirm = () => {
    onConfirm?.(true);
    close();
  };

  const handleCancel = () => {
    onConfirm?.(false);
    close();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', opacity: open ? 1 : 0, transition: 'opacity 0.3s', padding: '1rem', boxSizing: 'border-box' }}>
      <div style={{ background: '#fff', borderRadius: '24px', padding: '2.5rem 2rem', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', transform: open ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {type === 'success' ? (
            <div style={{ background: '#dcfce7', color: '#16a34a', padding: '1.25rem', borderRadius: '50%' }}>
              <CheckCircle2 size={36} />
            </div>
          ) : (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '1.25rem', borderRadius: '50%' }}>
              <AlertCircle size={36} />
            </div>
          )}
        </div>
        
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
          {isConfirm ? 'Are you sure?' : (type === 'success' ? 'Success!' : 'Notice')}
        </h3>
        <p style={{ color: '#64748b', marginBottom: '2.5rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', fontSize: '1rem' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {isConfirm ? (
            <>
              <button 
                style={{ flex: 1, padding: '0.875rem', borderRadius: '12px', background: '#f1f5f9', color: '#475569', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }} 
                onClick={handleCancel}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
              >
                Cancel
              </button>
              <button 
                style={{ flex: 1, padding: '0.875rem', borderRadius: '12px', background: '#ef4444', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }} 
                onClick={handleConfirm}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#dc2626'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#ef4444'; }}
              >
                Yes, proceed
              </button>
            </>
          ) : (
            <button 
              style={{ minWidth: '140px', padding: '0.875rem', borderRadius: '12px', background: type === 'success' ? '#16a34a' : '#ef4444', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }} 
              onClick={handleConfirm}
              onMouseEnter={(e) => { e.currentTarget.style.background = type === 'success' ? '#15803d' : '#dc2626'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = type === 'success' ? '#16a34a' : '#ef4444'; }}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const customAlert = (message: string, type: 'success' | 'error' = 'success') => {
  return new Promise<void>((resolve) => {
    const container = createContainer();
    if (!alertRoot) alertRoot = createRoot(container);
    alertRoot.render(<CustomAlert message={message} type={type} onConfirm={() => resolve()} />);
  });
};

export const customConfirm = (message: string) => {
  return new Promise<boolean>((resolve) => {
    const container = createContainer();
    if (!alertRoot) alertRoot = createRoot(container);
    alertRoot.render(<CustomAlert message={message} type="error" isConfirm={true} onConfirm={resolve} />);
  });
};
