import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Save, Loader2, Plus, Trash2, UploadCloud } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

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
  const [uploadingImageFor, setUploadingImageFor] = useState<{key: string, index: number, field: string} | null>(null);

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

  const getItem = (key: string, defaultType = 'TEXT', defaultValue = '') => {
    return content.find(c => c.key === key) || { key, value: defaultValue, type: defaultType };
  };

  const handleUpdate = async (item: ContentItem) => {
    setSavingKey(item.key);
    try {
      await axios.put(`/api/admin/content/${item.key}`, { value: item.value, type: item.type });
      if (!content.find(c => c.key === item.key)) {
        setContent([...content, item]);
      }
      alert("Updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update content");
    } finally {
      setSavingKey(null);
    }
  };

  const handleChange = (key: string, value: string, type = 'TEXT') => {
    const exists = content.find(item => item.key === key);
    if (exists) {
      setContent(content.map(item => item.key === key ? { ...item, value } : item));
    } else {
      setContent([...content, { key, value, type }]);
    }
  };

  const handleJsonChange = (key: string, parsedValue: any) => {
    handleChange(key, JSON.stringify(parsedValue), 'JSON');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !uploadingImageFor) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    const { key, index, field } = uploadingImageFor;
    const item = getItem(key, 'JSON', '[]');
    
    try {
      const res = await axios.post('/api/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = res.data.url;
      
      const parsed = JSON.parse(item.value);
      parsed[index][field] = imageUrl;
      handleJsonChange(key, parsed);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image. Ensure Supabase is configured and the image is not too large.');
    } finally {
      setUploadingImageFor(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const renderListEditor = (key: string, title: string, template: any, fields: {name: string, label: string, type: string}[]) => {
    const item = getItem(key, 'JSON', '[]');
    let list: any[] = [];
    try { list = JSON.parse(item.value); } catch(e) {}

    const addListItem = () => handleJsonChange(key, [...list, { ...template, id: Date.now() }]);
    const removeListItem = (index: number) => {
      const newList = [...list];
      newList.splice(index, 1);
      handleJsonChange(key, newList);
    };
    const updateListItem = (index: number, field: string, value: string) => {
      const newList = [...list];
      newList[index][field] = value;
      handleJsonChange(key, newList);
    };

    return (
      <div className="widget glass-panel" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={addListItem}>
              <Plus size={16} /> Add Item
            </button>
            <button className="btn btn-primary" onClick={() => handleUpdate(item)} disabled={savingKey === item.key}>
              {savingKey === item.key ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
              Save {title}
            </button>
          </div>
        </div>
        
        {list.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No items added yet. Click "Add Item" to start.</p>
        )}

        {list.map((listItem, index) => (
          <div key={listItem.id || index} style={{ border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', background: 'var(--bg-white)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <strong style={{ color: 'var(--primary-color)' }}>Item #{index + 1}</strong>
              <button className="btn btn-ghost" style={{ color: 'red', padding: '0.4rem', height: 'auto', minHeight: 'unset' }} onClick={() => removeListItem(index)} title="Remove Item">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {fields.map(f => (
                <div key={f.name} style={{ gridColumn: f.type === 'textarea' || f.type === 'image' ? '1 / -1' : 'auto' }}>
                  <label className="form-label">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea rows={3} className="form-control" value={listItem[f.name] || ''} onChange={(e) => updateListItem(index, f.name, e.target.value)} />
                  ) : f.type === 'image' ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                      {listItem[f.name] && <img src={listItem[f.name].startsWith('http') ? listItem[f.name] : `http://localhost:3000${listItem[f.name]}`} alt="Preview" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />}
                      <div style={{ display: 'flex', flex: '1 1 250px', gap: '0.5rem' }}>
                        <input type="text" className="form-control" value={listItem[f.name] || ''} onChange={(e) => updateListItem(index, f.name, e.target.value)} placeholder="Image URL or click Upload..." style={{ flex: 1, minWidth: 0 }} />
                        <button className="btn btn-secondary" onClick={() => { setUploadingImageFor({key, index, field: f.name}); fileInputRef.current?.click(); }} style={{ whiteSpace: 'nowrap' }}>
                          <UploadCloud size={16} /> Upload
                        </button>
                      </div>
                    </div>
                  ) : (
                    <input type="text" className="form-control" value={listItem[f.name] || ''} onChange={(e) => updateListItem(index, f.name, e.target.value)} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderGeneralFields = () => {
    const fieldsToRender = ['contact_email', 'contact_phone', 'contact_address', 'footer_text', 'stats_members', 'stats_branches', 'stats_assets', 'stats_years'];
    return (
      <>
        {fieldsToRender.map(key => {
          const item = getItem(key);
          return (
            <div key={key} className="widget glass-panel" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input type="text" className="form-control" value={item.value} onChange={(e) => handleChange(key, e.target.value)} />
                <button className="btn btn-primary" onClick={() => handleUpdate(item)} disabled={savingKey === key}>
                  {savingKey === key ? <Loader2 size={18} className="spinner" /> : <Save size={18} />} Save
                </button>
              </div>
            </div>
          );
        })}
        {renderListEditor('social_links', 'Social Media Links', { platform: '', url: '' }, [
          { name: 'platform', label: 'Platform Name', type: 'text' },
          { name: 'url', label: 'URL Profile Link', type: 'text' }
        ])}
      </>
    );
  };

  const renderHomeTab = () => {
    return (
      <>
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage the hero sliders that appear at the top of the homepage. You can add multiple slides, and they will automatically cycle through.
          </p>
        </div>
        {renderListEditor('home_slides', 'Home Sliders', { image: '', eyebrow: 'Welcome to ROAACCU', title: 'New Slide', subtitle: '' }, [
          { name: 'image', label: 'Background Image', type: 'image' },
          { name: 'eyebrow', label: 'Eyebrow Text (Small Top Text)', type: 'text' },
          { name: 'title', label: 'Main Title', type: 'text' },
          { name: 'subtitle', label: 'Subtitle / Description', type: 'textarea' },
        ])}
      </>
    );
  };

  const renderAboutTab = () => {
    const textItem = getItem('about_text');
    const missionItem = getItem('about_mission');
    const visionItem = getItem('about_vision');
    
    return (
      <>
        <div className="widget glass-panel" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>About Us Text</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="form-label">Main History / About Text</label>
              <textarea rows={6} className="form-control" value={textItem.value} onChange={(e) => handleChange('about_text', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Mission Statement</label>
              <textarea rows={3} className="form-control" value={missionItem.value} onChange={(e) => handleChange('about_mission', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Vision Statement</label>
              <textarea rows={3} className="form-control" value={visionItem.value} onChange={(e) => handleChange('about_vision', e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary" onClick={() => { handleUpdate(textItem); handleUpdate(missionItem); handleUpdate(visionItem); }}>
                <Save size={18} /> Save About Texts
              </button>
            </div>
          </div>
        </div>

        {renderListEditor('about_core_values', 'Core Values', { title: '', desc: '' }, [
          { name: 'title', label: 'Value Title', type: 'text' },
          { name: 'desc', label: 'Value Description', type: 'text' }
        ])}

        {renderListEditor('about_team', 'Executive Board / Team', { name: '', role: '', image: '' }, [
          { name: 'image', label: 'Profile Picture', type: 'image' },
          { name: 'name', label: 'Full Name', type: 'text' },
          { name: 'role', label: 'Position / Role', type: 'text' }
        ])}
      </>
    );
  };

  const renderFaqsTab = () => {
    return renderListEditor('faq_list', 'Frequently Asked Questions', { q: '', a: '' }, [
      { name: 'q', label: 'Question', type: 'text' },
      { name: 'a', label: 'Answer', type: 'textarea' }
    ]);
  };

  const renderBranchesTab = () => {
    return renderListEditor('branches_list', 'Branches', { name: '', location: '', contact: '', manager: '', image: '' }, [
      { name: 'image', label: 'Branch Image', type: 'image' },
      { name: 'name', label: 'Branch Name', type: 'text' },
      { name: 'location', label: 'Physical Location', type: 'text' },
      { name: 'contact', label: 'Contact Phone', type: 'text' },
      { name: 'manager', label: 'Manager Name (Optional)', type: 'text' }
    ]);
  };

  const renderProductsTab = () => {
    return renderListEditor('products_list', 'Products & Services', { title: '', desc: '', image: '', type: 'Savings', features: '' }, [
      { name: 'image', label: 'Service Image', type: 'image' },
      { name: 'title', label: 'Product Title', type: 'text' },
      { name: 'type', label: 'Type (Savings, Loan, Investment)', type: 'text' },
      { name: 'desc', label: 'Product Description', type: 'textarea' },
      { name: 'features', label: 'Features (Comma separated)', type: 'textarea' }
    ]);
  };

  if (loading) return <LoadingScreen message="Loading CMS data..." />;

  return (
    <div>
      <h2 className="page-title">Website Content (CMS)</h2>
      
      {/* Hidden file input for uploads */}
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button className={`btn ${activeTab === 'general' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('general')}>General</button>
        <button className={`btn ${activeTab === 'home' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('home')}>Home</button>
        <button className={`btn ${activeTab === 'about' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('about')}>About Us</button>
        <button className={`btn ${activeTab === 'faqs' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('faqs')}>FAQs</button>
        <button className={`btn ${activeTab === 'branches' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('branches')}>Branches</button>
        <button className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('products')}>Products/Services</button>
      </div>

      <div className="dashboard-widgets">
        {activeTab === 'general' && renderGeneralFields()}
        {activeTab === 'home' && renderHomeTab()}
        {activeTab === 'about' && renderAboutTab()}
        {activeTab === 'faqs' && renderFaqsTab()}
        {activeTab === 'branches' && renderBranchesTab()}
        {activeTab === 'products' && renderProductsTab()}
      </div>
    </div>
  );
};

export default CMS;
