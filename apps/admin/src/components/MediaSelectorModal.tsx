import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Link as LinkIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface MediaSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  onUploadClick: () => void;
}

const MediaSelectorModal: React.FC<MediaSelectorModalProps> = ({ isOpen, onClose, onSelect, onUploadClick }) => {
  const [activeTab, setActiveTab] = useState<'library' | 'upload' | 'link'>('library');
  const [mediaFiles, setMediaFiles] = useState<{name: string, url: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [linkInput, setLinkInput] = useState('');

  useEffect(() => {
    if (isOpen && activeTab === 'library') {
      fetchMedia();
    }
  }, [isOpen, activeTab]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from('cms-media').list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (error) throw error;

      if (data) {
        // Filter out folders and empty files if any
        const files = data.filter(file => file.name !== '.emptyFolderPlaceholder');
        
        const fileUrls = files.map(file => {
          const { data: urlData } = supabase.storage.from('cms-media').getPublicUrl(file.name);
          return { name: file.name, url: urlData.publicUrl };
        });
        
        setMediaFiles(fileUrls);
      }
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'var(--bg-white)', width: '90%', maxWidth: '700px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
        
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Select Media</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
          <button 
            style={{ flex: 1, padding: '1rem', background: 'none', border: 'none', borderBottom: activeTab === 'library' ? '2px solid var(--primary-color)' : '2px solid transparent', color: activeTab === 'library' ? 'var(--primary-color)' : 'var(--text-color)', fontWeight: activeTab === 'library' ? 600 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} 
            onClick={() => setActiveTab('library')}
          >
            <ImageIcon size={18} /> Media Library
          </button>
          <button 
            style={{ flex: 1, padding: '1rem', background: 'none', border: 'none', borderBottom: activeTab === 'upload' ? '2px solid var(--primary-color)' : '2px solid transparent', color: activeTab === 'upload' ? 'var(--primary-color)' : 'var(--text-color)', fontWeight: activeTab === 'upload' ? 600 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} 
            onClick={() => setActiveTab('upload')}
          >
            <UploadCloud size={18} /> Upload New
          </button>
          <button 
            style={{ flex: 1, padding: '1rem', background: 'none', border: 'none', borderBottom: activeTab === 'link' ? '2px solid var(--primary-color)' : '2px solid transparent', color: activeTab === 'link' ? 'var(--primary-color)' : 'var(--text-color)', fontWeight: activeTab === 'link' ? 600 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} 
            onClick={() => setActiveTab('link')}
          >
            <LinkIcon size={18} /> Provide Link
          </button>
        </div>

        <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
          {activeTab === 'library' && (
            <div>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                  <Loader2 size={32} className="spinner" style={{ color: 'var(--primary-color)' }} />
                </div>
              ) : mediaFiles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <ImageIcon size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                  <p>No media files found in the library.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                  {mediaFiles.map((file, i) => (
                    <div 
                      key={i} 
                      onClick={() => onSelect(file.url)}
                      style={{ cursor: 'pointer', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '2px solid transparent', position: 'relative' }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                    >
                      <img src={file.url} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem', textAlign: 'center' }}>
              <UploadCloud size={64} style={{ color: 'var(--primary-color)', marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '1rem' }}>Upload from your device</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Select an image file from your computer to upload to the CMS.</p>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  onUploadClick();
                }}
              >
                Browse Files
              </button>
            </div>
          )}

          {activeTab === 'link' && (
            <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem 0' }}>
              <label className="form-label">External Image URL</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="https://example.com/image.jpg" 
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                style={{ marginBottom: '1.5rem' }}
              />
              <button 
                className="btn btn-primary" 
                disabled={!linkInput}
                onClick={() => {
                  if (linkInput) onSelect(linkInput);
                }}
                style={{ alignSelf: 'flex-start' }}
              >
                Use this Link
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MediaSelectorModal;
