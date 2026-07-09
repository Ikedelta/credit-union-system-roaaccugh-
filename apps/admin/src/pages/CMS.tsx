import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Save, Loader2, Plus, Trash2, Image as ImageIcon, UploadCloud } from 'lucide-react';

interface ContentItem {
  key: string;
  value: string;
  type: string;
}

const CMS: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImageFor, setUploadingImageFor] = useState<{key: string, index: number} | null>(null);

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

  const handleJsonChange = (key: string, parsedValue: any) => {
    handleChange(key, JSON.stringify(parsedValue));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !uploadingImageFor) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    const { key, index } = uploadingImageFor;
    const item = content.find(i => i.key === key);
    if (!item) return;

    try {
      const res = await axios.post('/api/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = res.data.url;
      
      const parsed = JSON.parse(item.value);
      parsed[index].image = imageUrl;
      handleJsonChange(key, parsed);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image');
    } finally {
      setUploadingImageFor(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const renderGeneralFields = () => {
    const generalKeys = ['home_hero_title', 'home_hero_subtitle', 'about_text', 'contact_email', 'contact_phone', 'contact_address', 'footer_text', 'stats_members', 'stats_branches', 'stats_assets', 'stats_years'];
    const fields = content.filter(item => generalKeys.includes(item.key));
    
    return fields.map(item => (
      <div key={item.key} className="widget glass-panel" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', textTransform: 'capitalize' }}>
          {item.key.replace(/_/g, ' ')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {item.type === 'TEXT' && (item.key.includes('text') || item.key.includes('subtitle')) ? (
            <textarea 
              rows={4} 
              value={item.value} 
              onChange={(e) => handleChange(item.key, e.target.value)} 
            />
          ) : (
            <input 
              type="text" 
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
    ));
  };

  const renderSlidesEditor = () => {
    const slideItem = content.find(c => c.key === 'home_slides');
    if (!slideItem) return <p>No slides found. Run seed script.</p>;

    let slides: any[] = [];
    try { slides = JSON.parse(slideItem.value); } catch(e) {}

    const addSlide = () => {
      const newSlide = { id: Date.now(), image: '', eyebrow: '', title: '', subtitle: '' };
      handleJsonChange('home_slides', [...slides, newSlide]);
    };

    const removeSlide = (index: number) => {
      const newSlides = [...slides];
      newSlides.splice(index, 1);
      handleJsonChange('home_slides', newSlides);
    };

    const updateSlide = (index: number, field: string, value: string) => {
      const newSlides = [...slides];
      newSlides[index][field] = value;
      handleJsonChange('home_slides', newSlides);
    };

    return (
      <div className="widget glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Home Sliders</h3>
          <button className="btn btn-secondary" onClick={addSlide}>
            <Plus size={16} /> Add Slide
          </button>
        </div>
        
        {slides.map((slide, index) => (
          <div key={slide.id || index} style={{ border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h4>Slide {index + 1}</h4>
              <button className="btn btn-ghost" style={{ color: 'red', padding: '0.5rem' }} onClick={() => removeSlide(index)}>
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div style={{ gridColumn: '1 / -1' }}>
                <label>Image</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {slide.image && <img src={slide.image.startsWith('http') ? slide.image : `http://localhost:3000${slide.image}`} alt="Preview" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />}
                  <input type="text" value={slide.image || ''} onChange={(e) => updateSlide(index, 'image', e.target.value)} placeholder="Image URL or upload..." style={{ flex: 1 }} />
                  <button className="btn btn-secondary" onClick={() => { setUploadingImageFor({key: 'home_slides', index}); fileInputRef.current?.click(); }}>
                    <UploadCloud size={16} /> Upload
                  </button>
                </div>
              </div>
              <div>
                <label>Eyebrow Text</label>
                <input type="text" value={slide.eyebrow || ''} onChange={(e) => updateSlide(index, 'eyebrow', e.target.value)} />
              </div>
              <div>
                <label>Title</label>
                <input type="text" value={slide.title || ''} onChange={(e) => updateSlide(index, 'title', e.target.value)} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label>Subtitle</label>
                <textarea rows={3} value={slide.subtitle || ''} onChange={(e) => updateSlide(index, 'subtitle', e.target.value)} />
              </div>
            </div>
          </div>
        ))}

        <button 
          className="btn btn-primary" 
          onClick={() => handleUpdate(slideItem)}
          disabled={savingKey === slideItem.key}
        >
          {savingKey === slideItem.key ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
          Save Sliders
        </button>
      </div>
    );
  };

  const renderSocialLinks = () => {
    const socialItem = content.find(c => c.key === 'social_links');
    if (!socialItem) return <p>No social links found. Run seed script.</p>;

    let links: any[] = [];
    try { links = JSON.parse(socialItem.value); } catch(e) {}

    const addLink = () => {
      handleJsonChange('social_links', [...links, { platform: '', url: '' }]);
    };

    const removeLink = (index: number) => {
      const newLinks = [...links];
      newLinks.splice(index, 1);
      handleJsonChange('social_links', newLinks);
    };

    const updateLink = (index: number, field: string, value: string) => {
      const newLinks = [...links];
      newLinks[index][field] = value;
      handleJsonChange('social_links', newLinks);
    };

    return (
      <div className="widget glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Social Media Links</h3>
          <button className="btn btn-secondary" onClick={addLink}>
            <Plus size={16} /> Add Link
          </button>
        </div>
        
        {links.map((link, index) => (
          <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label>Platform (e.g. Facebook, Twitter)</label>
              <input type="text" value={link.platform || ''} onChange={(e) => updateLink(index, 'platform', e.target.value)} />
            </div>
            <div style={{ flex: 2 }}>
              <label>URL</label>
              <input type="text" value={link.url || ''} onChange={(e) => updateLink(index, 'url', e.target.value)} />
            </div>
            <button className="btn btn-ghost" style={{ color: 'red', height: '42px' }} onClick={() => removeLink(index)}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        <button 
          className="btn btn-primary" 
          onClick={() => handleUpdate(socialItem)}
          disabled={savingKey === socialItem.key}
          style={{ marginTop: '1rem' }}
        >
          {savingKey === socialItem.key ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
          Save Social Links
        </button>
      </div>
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="page-title">Website Content (CMS)</h2>
      
      {/* Hidden file input for uploads */}
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button className={`btn ${activeTab === 'general' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('general')}>General Info</button>
        <button className={`btn ${activeTab === 'sliders' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('sliders')}>Home Sliders</button>
        <button className={`btn ${activeTab === 'social' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('social')}>Social Links</button>
      </div>

      <div className="dashboard-widgets">
        {activeTab === 'general' && renderGeneralFields()}
        {activeTab === 'sliders' && renderSlidesEditor()}
        {activeTab === 'social' && renderSocialLinks()}
      </div>
    </div>
  );
};

export default CMS;
