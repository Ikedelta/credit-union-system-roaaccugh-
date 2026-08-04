import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Link as LinkIcon, Image as ImageIcon, Loader2, CheckCircle2, FileText } from 'lucide-react';
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
  const [hoveredFile, setHoveredFile] = useState<string | null>(null);

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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: '1rem', boxSizing: 'border-box' }}>
      <style>{`
        .media-modal-container {
          width: 100%;
          max-width: 800px;
          border-radius: 16px;
          max-height: calc(100dvh - 2rem);
        }
        .media-modal-header {
          padding: 1rem 1.25rem;
        }
        .media-modal-tabs {
          padding: 0.75rem 1.25rem;
          gap: 0.5rem;
        }
        .media-modal-tab-btn {
          padding: 0.5rem 1rem;
          font-size: 1rem;
        }
        .media-modal-content {
          padding: 1.25rem;
        }
        .media-modal-grid {
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 1rem;
        }
        
        @media (max-width: 600px) {
          .media-modal-container {
            border-radius: 12px;
            max-height: calc(100dvh - 1rem);
          }
          .media-modal-header {
            padding: 0.75rem 1rem;
          }
          .media-modal-tabs {
            padding: 0.5rem 0.5rem;
            gap: 0.25rem;
          }
          .media-modal-tab-btn {
            padding: 0.4rem 0.5rem;
            font-size: 0.85rem;
          }
          .media-modal-content {
            padding: 1rem;
          }
          .media-modal-grid {
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
            gap: 0.5rem;
          }
          .media-modal-upload-area {
            min-height: 200px !important;
            padding: 1.5rem 1rem !important;
          }
          .media-modal-upload-icon {
            width: 60px !important;
            height: 60px !important;
            margin-bottom: 1rem !important;
          }
        }
      `}</style>

      <div className="media-modal-container" style={{ background: 'var(--bg-white)', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div className="media-modal-header" style={{ borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-color)' }}>Select Media</h2>
          <button onClick={onClose} style={{ background: 'var(--bg-slate)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = 'var(--text-color)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-slate)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
            <X size={18} />
          </button>
        </div>

        {/* Tabs - Pill style for responsiveness */}
        <div className="media-modal-tabs" style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', borderBottom: '1px solid var(--border-color)', background: '#f8fafc', flexShrink: 0, WebkitOverflowScrolling: 'touch' }}>
          <button 
            className="media-modal-tab-btn"
            style={{ flex: '1 1 auto', minWidth: 'max-content', background: activeTab === 'library' ? 'var(--primary-color)' : 'transparent', border: 'none', borderRadius: '8px', color: activeTab === 'library' ? '#fff' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }} 
            onClick={() => setActiveTab('library')}
            onMouseEnter={(e) => { if(activeTab !== 'library') e.currentTarget.style.background = '#e2e8f0'; }}
            onMouseLeave={(e) => { if(activeTab !== 'library') e.currentTarget.style.background = 'transparent'; }}
          >
            <ImageIcon size={18} /> Media Library
          </button>
          <button 
            className="media-modal-tab-btn"
            style={{ flex: '1 1 auto', minWidth: 'max-content', background: activeTab === 'upload' ? 'var(--primary-color)' : 'transparent', border: 'none', borderRadius: '8px', color: activeTab === 'upload' ? '#fff' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }} 
            onClick={() => setActiveTab('upload')}
            onMouseEnter={(e) => { if(activeTab !== 'upload') e.currentTarget.style.background = '#e2e8f0'; }}
            onMouseLeave={(e) => { if(activeTab !== 'upload') e.currentTarget.style.background = 'transparent'; }}
          >
            <UploadCloud size={18} /> Upload New
          </button>
          <button 
            className="media-modal-tab-btn"
            style={{ flex: '1 1 auto', minWidth: 'max-content', background: activeTab === 'link' ? 'var(--primary-color)' : 'transparent', border: 'none', borderRadius: '8px', color: activeTab === 'link' ? '#fff' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }} 
            onClick={() => setActiveTab('link')}
            onMouseEnter={(e) => { if(activeTab !== 'link') e.currentTarget.style.background = '#e2e8f0'; }}
            onMouseLeave={(e) => { if(activeTab !== 'link') e.currentTarget.style.background = 'transparent'; }}
          >
            <LinkIcon size={18} /> Provide Link
          </button>
        </div>

        {/* Content Area */}
        <div className="media-modal-content" style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'library' && (
            <div>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                  <Loader2 size={36} className="spinner" style={{ color: 'var(--primary-color)' }} />
                </div>
              ) : mediaFiles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)', background: '#f8fafc', borderRadius: '12px' }}>
                  <ImageIcon size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>No media files found.</p>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Upload some files first to see them here.</p>
                </div>
              ) : (
                <div className="media-modal-grid" style={{ display: 'grid' }}>
                  {mediaFiles.map((file, i) => (
                    <div 
                      key={i} 
                      onClick={() => onSelect(file.url)}
                      style={{ 
                        cursor: 'pointer', 
                        aspectRatio: '1', 
                        borderRadius: '12px', 
                        overflow: 'hidden', 
                        position: 'relative',
                        boxShadow: hoveredFile === file.url ? '0 10px 25px -5px rgba(0,0,0,0.15), 0 0 0 3px var(--primary-color)' : '0 1px 3px rgba(0,0,0,0.1)',
                        transform: hoveredFile === file.url ? 'translateY(-2px)' : 'none',
                        transition: 'all 0.2s ease-out'
                      }}
                      onMouseEnter={() => setHoveredFile(file.url)}
                      onMouseLeave={() => setHoveredFile(null)}
                    >
                      {file.name.toLowerCase().match(/\.(pdf|doc|docx)$/) ? (
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.5rem', boxSizing: 'border-box' }}>
                          <FileText size={40} style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }} />
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', wordBreak: 'break-all', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{file.name}</span>
                        </div>
                      ) : (
                        <img loading="lazy" src={file.url} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                      
                      {/* Hover Overlay */}
                      <div style={{
                        position: 'absolute',
                        top: 0, left: 0, width: '100%', height: '100%',
                        background: hoveredFile === file.url ? 'rgba(0,0,0,0.2)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s'
                      }}>
                        {hoveredFile === file.url && (
                          <div style={{ background: 'var(--primary-color)', color: 'white', padding: '0.5rem', borderRadius: '50%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            <CheckCircle2 size={24} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div 
              className="media-modal-upload-area"
              style={{ 
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                padding: '2.5rem 1rem', textAlign: 'center', background: '#f8fafc', 
                border: '2px dashed var(--primary-color)', borderRadius: '16px',
                cursor: 'pointer', transition: 'all 0.2s', minHeight: '300px'
              }}
              onClick={() => onUploadClick()}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = 'var(--secondary-color)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = 'var(--primary-color)'; }}
            >
              <div className="media-modal-upload-icon" style={{ width: '80px', height: '80px', background: 'rgba(0, 114, 54, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <UploadCloud size={40} style={{ color: 'var(--primary-color)' }} />
              </div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', color: 'var(--text-color)' }}>Click here to upload</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0', maxWidth: '300px', fontSize: '0.9rem' }}>Select an image or document file from your computer or mobile device to upload directly to the CMS.</p>
            </div>
          )}

          {activeTab === 'link' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 600 }}>External Image URL</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="https://example.com/beautiful-image.jpg" 
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
                />
              </div>
              
              {/* Image Preview Area */}
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                {linkInput ? (
                  <img 
                    loading="lazy"
                    src={linkInput} 
                    alt="URL Preview" 
                    style={{ maxWidth: '100%', maxHeight: '250px', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<p style="color:var(--text-muted)">Invalid image URL or image failed to load.</p>';
                    }}
                  />
                ) : (
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>Image preview will appear here</p>
                )}
              </div>

              <button 
                className="btn btn-primary" 
                disabled={!linkInput}
                onClick={() => {
                  if (linkInput) onSelect(linkInput);
                }}
                style={{ alignSelf: 'flex-end', padding: '0.75rem 2rem', fontSize: '1rem', width: '100%' }}
              >
                Use this Image Link
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MediaSelectorModal;
