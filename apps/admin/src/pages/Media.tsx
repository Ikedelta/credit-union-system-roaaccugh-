import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Trash2, Copy, Loader2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';
import { supabase } from '../utils/supabase';
import { v4 as uuidv4 } from 'uuid';

interface MediaFile {
  name: string;
  url: string;
  created_at: string;
}

const Media: React.FC = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/media');
      setFiles(res.data.files || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load media files.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    try {
      const filesToUpload = Array.from(e.target.files);
      let successCount = 0;

      for (const file of filesToUpload) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;

        const { error } = await supabase.storage
          .from('cms-media')
          .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (error) {
          console.error(`Failed to upload ${file.name}:`, error);
        } else {
          successCount++;
        }
      }

      if (successCount < filesToUpload.length) {
        alert(`Successfully uploaded ${successCount} out of ${filesToUpload.length} files.`);
      }
      
      fetchMedia(); // Refresh list after upload
    } catch (err) {
      console.error(err);
      alert('An error occurred during upload.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (filename: string) => {
    if (!window.confirm('Are you sure you want to delete this file? It may break images on your website if it is currently in use.')) return;
    
    try {
      await axios.delete(`/api/admin/media/${filename}`);
      setFiles(files.filter(f => f.name !== filename));
    } catch (err) {
      console.error(err);
      alert('Failed to delete file.');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  if (loading && files.length === 0) return <LoadingScreen message="Loading Media Library..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="page-title" style={{ margin: 0 }}>Media Library (cms-media)</h2>
        <div>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" multiple onChange={handleUpload} />
          <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 size={18} className="spinner" /> : <UploadCloud size={18} />}
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>

      {files.length === 0 && !loading ? (
        <div className="empty-state">
          <ImageIcon size={48} opacity={0.2} style={{ marginBottom: '1rem' }} />
          <h3>No media files found</h3>
          <p>Upload images to the `cms-media` bucket to use them across your website.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {files.map(file => (
            <div key={file.name} className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '180px', width: '100%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={file.url} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, wordBreak: 'break-all', margin: 0 }}>{file.name}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => copyToClipboard(file.url)}>
                    <Copy size={14} /> Copy URL
                  </button>
                  <button className="btn btn-ghost" style={{ color: 'red', padding: '0.4rem' }} onClick={() => handleDelete(file.name)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Media;
