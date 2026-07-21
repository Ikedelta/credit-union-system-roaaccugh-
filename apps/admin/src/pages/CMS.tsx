import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Save, Loader2, Plus, Trash2, UploadCloud, Link as LinkIcon, Globe } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaGithub } from 'react-icons/fa';
import LoadingScreen from '../components/LoadingScreen';
import MediaSelectorModal from '../components/MediaSelectorModal';
import { supabase } from '../utils/supabase';
import { v4 as uuidv4 } from 'uuid';

const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'facebook': return FaFacebook;
    case 'twitter': 
    case 'x': return FaTwitter;
    case 'instagram': return FaInstagram;
    case 'linkedin': return FaLinkedin;
    case 'youtube': return FaYoutube;
    case 'github': return FaGithub;
    default: return Globe;
  }
};

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
  const [uploadingImageFor, setUploadingImageFor] = useState<{key: string, index?: number, field?: string} | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

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
    const item = getItem(key, index !== undefined ? 'JSON' : 'IMAGE', index !== undefined ? '[]' : '');
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('cms-media')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from('cms-media')
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;
      
      if (index !== undefined && field) {
        const parsed = JSON.parse(item.value);
        parsed[index][field] = imageUrl;
        handleJsonChange(key, parsed);
      } else {
        handleChange(key, imageUrl, 'IMAGE');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload image. Ensure Supabase is configured and the image is not too large.');
    } finally {
      setUploadingImageFor(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleMediaSelect = (url: string) => {
    if (!uploadingImageFor) return;
    const { key, index, field } = uploadingImageFor;
    const item = getItem(key, index !== undefined ? 'JSON' : 'IMAGE', index !== undefined ? '[]' : '');
    
    if (index !== undefined && field) {
      const parsed = JSON.parse(item.value);
      parsed[index][field] = url;
      handleJsonChange(key, parsed);
    } else {
      handleChange(key, url, 'IMAGE');
    }
    setIsMediaModalOpen(false);
    setUploadingImageFor(null);
  };

  const renderListEditor = (key: string, title: string, template: any, fields: {name: string, label: string, type: string}[]) => {
    const item = getItem(key, 'JSON', '[]');
    let list: any[] = [];
    try { list = JSON.parse(item.value); } catch(e) {}

    const addListItem = () => handleJsonChange(key, [...list, { ...template, id: Date.now().toString() }]);
    const removeListItem = (index: number) => {
      const newList = [...list];
      newList.splice(index, 1);
      handleJsonChange(key, newList);
    };
    const updateListItem = (index: number, field: string, value: any) => {
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
              <strong style={{ color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'capitalize' }}>
                {key === 'social_links' && listItem.platform ? React.createElement(getSocialIcon(listItem.platform), { size: 18 }) : null}
                {key === 'social_links' && listItem.platform ? listItem.platform : `Item #${index + 1}`}
              </strong>
              <button className="btn btn-ghost" style={{ color: 'red', padding: '0.4rem', height: 'auto', minHeight: 'unset' }} onClick={() => removeListItem(index)} title="Remove Item">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {fields.map(f => (
                <div key={f.name} style={{ gridColumn: f.type === 'textarea' || f.type === 'image' || f.type === 'image_list' || f.type === 'link_list' ? '1 / -1' : 'auto' }}>
                  <label className="form-label">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea rows={6} className="form-control" value={listItem[f.name] || ''} onChange={(e) => updateListItem(index, f.name, e.target.value)} />
                  ) : f.type === 'image' ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                      {listItem[f.name] && <img src={listItem[f.name].startsWith('http') ? listItem[f.name] : (listItem[f.name].startsWith('/uploads') ? `http://localhost:3000${listItem[f.name]}` : listItem[f.name])} alt="Preview" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />}
                      <div style={{ display: 'flex', flex: '1 1 250px', gap: '0.5rem' }}>
                        <input type="text" className="form-control" value={listItem[f.name] || ''} onChange={(e) => updateListItem(index, f.name, e.target.value)} placeholder="Image URL or click Upload..." style={{ flex: 1, minWidth: 0 }} />
                        <button className="btn btn-secondary" onClick={() => { setUploadingImageFor({key, index, field: f.name}); setIsMediaModalOpen(true); }} style={{ whiteSpace: 'nowrap' }}>
                          <UploadCloud size={16} /> Upload
                        </button>
                      </div>
                    </div>
                  ) : f.type === 'image_list' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                      {(listItem[f.name] || []).map((imgUrl: string, imgIndex: number) => (
                        <div key={imgIndex} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          {imgUrl && <img src={imgUrl.startsWith('http') ? imgUrl : (imgUrl.startsWith('/uploads') ? `http://localhost:3000${imgUrl}` : imgUrl)} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                          <input type="text" placeholder="Image URL" className="form-control" value={imgUrl || ''} onChange={(e) => {
                            const newImages = [...(listItem[f.name] || [])];
                            newImages[imgIndex] = e.target.value;
                            updateListItem(index, f.name, newImages);
                          }} />
                          <button className="btn btn-ghost" style={{color: 'red', padding: '0.4rem'}} onClick={() => {
                            const newImages = [...(listItem[f.name] || [])];
                            newImages.splice(imgIndex, 1);
                            updateListItem(index, f.name, newImages);
                          }}><Trash2 size={16} /></button>
                        </div>
                      ))}
                      <button className="btn btn-secondary" style={{ alignSelf: 'flex-start' }} onClick={() => {
                        const newImages = [...(listItem[f.name] || []), ''];
                        updateListItem(index, f.name, newImages);
                      }}>+ Add Image</button>
                    </div>
                  ) : f.type === 'link_list' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                      {(listItem[f.name] || []).map((link: any, linkIndex: number) => (
                        <div key={linkIndex} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <input type="text" placeholder="Link Label" className="form-control" value={link.label || ''} style={{ flex: 1, minWidth: '150px' }} onChange={(e) => {
                            const newLinks = [...(listItem[f.name] || [])];
                            newLinks[linkIndex] = { ...newLinks[linkIndex], label: e.target.value };
                            updateListItem(index, f.name, newLinks);
                          }} />
                          <input type="text" placeholder="URL" className="form-control" value={link.url || ''} style={{ flex: 2, minWidth: '200px' }} onChange={(e) => {
                            const newLinks = [...(listItem[f.name] || [])];
                            newLinks[linkIndex] = { ...newLinks[linkIndex], url: e.target.value };
                            updateListItem(index, f.name, newLinks);
                          }} />
                          <button className="btn btn-ghost" style={{color: 'red', padding: '0.4rem'}} onClick={() => {
                            const newLinks = [...(listItem[f.name] || [])];
                            newLinks.splice(linkIndex, 1);
                            updateListItem(index, f.name, newLinks);
                          }}><Trash2 size={16} /></button>
                        </div>
                      ))}
                      <button className="btn btn-secondary" style={{ alignSelf: 'flex-start' }} onClick={() => {
                        const newLinks = [...(listItem[f.name] || []), { label: '', url: '' }];
                        updateListItem(index, f.name, newLinks);
                      }}>+ Add Link</button>
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
    const fieldsToRender = ['established_year', 'established_subtitle', 'about_logo', 'contact_email', 'contact_phone', 'contact_address', 'footer_text', 'stats_members', 'stats_branches', 'stats_assets', 'stats_years'];
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
        
        {renderListEditor('home_features', 'Homepage Features (Bullet Points)', { icon: 'ShieldCheck', text: 'New Feature' }, [
          { name: 'icon', label: 'Lucide Icon Name (e.g., ShieldCheck, TrendingUp, Users)', type: 'text' },
          { name: 'text', label: 'Feature Text', type: 'text' }
        ])}
      </>
    );
  };

  const renderAboutTab = () => {
    const textItem = getItem('about_text');
    const missionItem = getItem('about_mission');
    const visionItem = getItem('about_vision');
    const aboutImage1Item = getItem('about_image_1', 'IMAGE', 'https://roaaccugh.com/assets/img/roaaccu4.jpg');
    const aboutImage2Item = getItem('about_image_2', 'IMAGE', 'https://roaaccugh.com/assets/img/roaaccu4.jpg');
    
    return (
      <>
        <div className="widget glass-panel" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>About Us Text</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="form-label">About Us Side Image 1 (Left/Top)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                {aboutImage1Item.value && <img src={aboutImage1Item.value} alt="Preview" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />}
                <div style={{ display: 'flex', flex: '1 1 250px', gap: '0.5rem' }}>
                  <input type="text" className="form-control" value={aboutImage1Item.value} onChange={(e) => handleChange('about_image_1', e.target.value, 'IMAGE')} placeholder="Image URL or click Upload..." style={{ flex: 1, minWidth: 0 }} />
                  <button className="btn btn-secondary" onClick={() => { setUploadingImageFor({key: 'about_image_1'}); setIsMediaModalOpen(true); }} style={{ whiteSpace: 'nowrap' }}>
                    <UploadCloud size={16} /> Upload
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className="form-label">About Us Side Image 2 (Right/Bottom)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                {aboutImage2Item.value && <img src={aboutImage2Item.value} alt="Preview" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />}
                <div style={{ display: 'flex', flex: '1 1 250px', gap: '0.5rem' }}>
                  <input type="text" className="form-control" value={aboutImage2Item.value} onChange={(e) => handleChange('about_image_2', e.target.value, 'IMAGE')} placeholder="Image URL or click Upload..." style={{ flex: 1, minWidth: 0 }} />
                  <button className="btn btn-secondary" onClick={() => { setUploadingImageFor({key: 'about_image_2'}); setIsMediaModalOpen(true); }} style={{ whiteSpace: 'nowrap' }}>
                    <UploadCloud size={16} /> Upload
                  </button>
                </div>
              </div>
            </div>
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
              <button className="btn btn-primary" onClick={() => { handleUpdate(textItem); handleUpdate(missionItem); handleUpdate(visionItem); handleUpdate(aboutImage1Item); handleUpdate(aboutImage2Item); }}>
                <Save size={18} /> Save About Texts & Images
              </button>
            </div>
          </div>
        </div>

        {renderListEditor('about_core_values', 'Core Values', { title: '', desc: '' }, [
          { name: 'title', label: 'Value Title', type: 'text' },
          { name: 'desc', label: 'Value Description', type: 'text' }
        ])}

        {renderListEditor('board_of_directors', 'Board of Directors', { name: '', role: '', image: '' }, [
          { name: 'image', label: 'Profile Picture', type: 'image' },
          { name: 'name', label: 'Full Name', type: 'text' },
          { name: 'role', label: 'Position / Role', type: 'text' }
        ])}

        {renderListEditor('supervisory_committee', 'Supervisory Committee', { name: '', role: '', image: '' }, [
          { name: 'image', label: 'Profile Picture', type: 'image' },
          { name: 'name', label: 'Full Name', type: 'text' },
          { name: 'role', label: 'Position / Role', type: 'text' }
        ])}

        {renderListEditor('management_team', 'Management Team', { name: '', role: '', image: '' }, [
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
    return renderListEditor('branches_list', 'Branches', { name: '', location: '', contact: '', email: '', image: '' }, [
      { name: 'image', label: 'Branch Image', type: 'image' },
      { name: 'name', label: 'Branch Name', type: 'text' },
      { name: 'location', label: 'Physical Location', type: 'text' },
      { name: 'contact', label: 'Contact Phone', type: 'text' },
      { name: 'email', label: 'Email Address (Optional)', type: 'email' }
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

  const renderServicesTab = () => {
    return renderListEditor('services_list', 'Services Page Items', { title: '', desc: '', icon: 'Phone' }, [
      { name: 'icon', label: 'Lucide Icon Name (e.g., Phone, Zap, Banknote, Building2, ShieldCheck)', type: 'text' },
      { name: 'title', label: 'Service Title', type: 'text' },
      { name: 'desc', label: 'Service Description', type: 'textarea' }
    ]);
  };

  const renderNewsTab = () => {
    return (
      <>
        {renderListEditor('alert_ticker', 'Alert Ticker', { text: '' }, [
          { name: 'text', label: 'Alert Message', type: 'text' }
        ])}
        {renderListEditor('news_list', 'News & Blog', { id: Date.now().toString(), title: '', date: '', image: '', content: '', gallery: [], links: [] }, [
          { name: 'image', label: 'Thumbnail / Main Image', type: 'image' },
          { name: 'title', label: 'Headline Title', type: 'text' },
          { name: 'date', label: 'Date', type: 'text' },
          { name: 'content', label: 'Article Content (Full details)', type: 'textarea' },
          { name: 'gallery', label: 'Additional Gallery Images', type: 'image_list' },
          { name: 'links', label: 'Reference Links', type: 'link_list' }
        ])}
      </>
    );
  };

  const renderAutomatedMessagesTab = () => {
    const loanStatusItem = getItem('sms_template_loan_status', 'TEXT', 'Hello {name}, your ROAACCU loan application status has been updated to: {status}.');
    const loanSubmissionItem = getItem('sms_template_loan_submission', 'TEXT', 'Hello {name}, your ROAACCU loan application has been received and is currently under review. We will notify you when the status changes.');
    const adminWelcomeSmsItem = getItem('sms_template_admin_welcome', 'TEXT', 'Hello {name}, your ROAACCU Admin account has been created. Check your email for login details.');
    const adminWelcomeEmailItem = getItem('email_template_admin_welcome', 'TEXT', 'Hello {name},\n\nYour admin account has been created successfully.\n\nRole: {role}\nEmail: {email}\nPassword: {password}\n\nPlease login and change your password immediately.');

    return (
      <div className="widget glass-panel" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Automated Messages</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Configure the automated SMS and Email messages sent by the system. Use placeholders exactly as shown.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="form-label">Loan Status Update</label>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Variables: {"{name}"}, {"{status}"}</p>
            <textarea rows={3} className="form-control" value={loanStatusItem.value} onChange={(e) => handleChange('sms_template_loan_status', e.target.value)} />
            <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => handleUpdate(loanStatusItem)} disabled={savingKey === 'sms_template_loan_status'}>
              {savingKey === 'sms_template_loan_status' ? <Loader2 size={18} className="spinner" /> : <Save size={18} />} Save
            </button>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
          <div>
            <label className="form-label">Loan Application Received</label>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Variables: {"{name}"}</p>
            <textarea rows={3} className="form-control" value={loanSubmissionItem.value} onChange={(e) => handleChange('sms_template_loan_submission', e.target.value)} />
            <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => handleUpdate(loanSubmissionItem)} disabled={savingKey === 'sms_template_loan_submission'}>
              {savingKey === 'sms_template_loan_submission' ? <Loader2 size={18} className="spinner" /> : <Save size={18} />} Save
            </button>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
          <div>
            <label className="form-label">Admin Welcome Message (SMS)</label>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Variables: {"{name}"}</p>
            <textarea rows={3} className="form-control" value={adminWelcomeSmsItem.value} onChange={(e) => handleChange('sms_template_admin_welcome', e.target.value)} />
            <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => handleUpdate(adminWelcomeSmsItem)} disabled={savingKey === 'sms_template_admin_welcome'}>
              {savingKey === 'sms_template_admin_welcome' ? <Loader2 size={18} className="spinner" /> : <Save size={18} />} Save
            </button>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
          <div>
            <label className="form-label">Admin Welcome Message (Email)</label>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Variables: {"{name}"}, {"{role}"}, {"{email}"}, {"{password}"}</p>
            <textarea rows={5} className="form-control" value={adminWelcomeEmailItem.value} onChange={(e) => handleChange('email_template_admin_welcome', e.target.value)} />
            <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => handleUpdate(adminWelcomeEmailItem)} disabled={savingKey === 'email_template_admin_welcome'}>
              {savingKey === 'email_template_admin_welcome' ? <Loader2 size={18} className="spinner" /> : <Save size={18} />} Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderMediaCenterTab = () => {
    const bylawTextItem = getItem('bylaw_text', 'TEXT');
    const bylawPdfItem = getItem('bylaw_pdf', 'TEXT');
    const organogramImageItem = getItem('organogram_image', 'TEXT');
    const organogramDescItem = getItem('organogram_desc', 'TEXT');

    return (
      <div className="widget glass-panel" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Media Center Content</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="form-label">By-Laws Text</label>
            <textarea rows={5} className="form-control" value={bylawTextItem.value} onChange={(e) => handleChange('bylaw_text', e.target.value)} />
            <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => handleUpdate(bylawTextItem)} disabled={savingKey === 'bylaw_text'}>
              {savingKey === 'bylaw_text' ? <Loader2 size={18} className="spinner" /> : <Save size={18} />} Save By-Laws
            </button>
          </div>
          <div>
            <label className="form-label">By-Laws PDF Link</label>
            <input type="text" className="form-control" placeholder="https://..." value={bylawPdfItem.value} onChange={(e) => handleChange('bylaw_pdf', e.target.value)} />
            <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => handleUpdate(bylawPdfItem)} disabled={savingKey === 'bylaw_pdf'}>
              {savingKey === 'bylaw_pdf' ? <Loader2 size={18} className="spinner" /> : <Save size={18} />} Save PDF Link
            </button>
          </div>
          <div>
            <label className="form-label">Organogram Image URL</label>
            <input type="text" className="form-control" placeholder="https://..." value={organogramImageItem.value} onChange={(e) => handleChange('organogram_image', e.target.value)} />
            <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => handleUpdate(organogramImageItem)} disabled={savingKey === 'organogram_image'}>
              {savingKey === 'organogram_image' ? <Loader2 size={18} className="spinner" /> : <Save size={18} />} Save Organogram Image
            </button>
          </div>
          <div>
            <label className="form-label">Organogram Description</label>
            <textarea rows={3} className="form-control" value={organogramDescItem.value} onChange={(e) => handleChange('organogram_desc', e.target.value)} />
            <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => handleUpdate(organogramDescItem)} disabled={savingKey === 'organogram_desc'}>
              {savingKey === 'organogram_desc' ? <Loader2 size={18} className="spinner" /> : <Save size={18} />} Save Description
            </button>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '2rem 0' }} />

        {renderListEditor('photo_gallery', 'Photo Gallery', { id: Date.now().toString(), title: '', image: '', description: '' }, [
          { name: 'image', label: 'Gallery Image', type: 'image' },
          { name: 'title', label: 'Image Title', type: 'text' },
          { name: 'description', label: 'Image Description', type: 'textarea' }
        ])}

        {renderListEditor('video_gallery', 'Video Gallery', { id: Date.now().toString(), title: '', url: '', description: '' }, [
          { name: 'url', label: 'Video URL (YouTube/Vimeo)', type: 'text' },
          { name: 'title', label: 'Video Title', type: 'text' },
          { name: 'description', label: 'Video Description', type: 'textarea' }
        ])}

        {renderListEditor('agm_reports', 'AGM Reports', { id: Date.now().toString(), year: '', title: '', pdfUrl: '', summary: '' }, [
          { name: 'year', label: 'Year (e.g., 2023)', type: 'text' },
          { name: 'title', label: 'Report Title', type: 'text' },
          { name: 'pdfUrl', label: 'PDF URL Link', type: 'text' },
          { name: 'summary', label: 'Summary', type: 'textarea' }
        ])}

        {renderListEditor('events_list', 'Upcoming Events', { id: Date.now().toString(), title: '', date: '', time: '', location: '', description: '' }, [
          { name: 'title', label: 'Event Title', type: 'text' },
          { name: 'date', label: 'Date (e.g., Dec 15, 2024)', type: 'text' },
          { name: 'time', label: 'Time (e.g., 6:00 PM)', type: 'text' },
          { name: 'location', label: 'Location', type: 'text' },
          { name: 'description', label: 'Event Description', type: 'textarea' }
        ])}
      </div>
    );
  };

  if (loading) return <LoadingScreen message="Loading CMS data..." />;

  return (
    <div>
      <h2 className="page-title">Website Content (CMS)</h2>
      
      {/* Hidden file input for uploads */}
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />

      <MediaSelectorModal 
        isOpen={isMediaModalOpen} 
        onClose={() => {
          setIsMediaModalOpen(false);
          setUploadingImageFor(null);
        }}
        onSelect={handleMediaSelect}
        onUploadClick={() => {
          setIsMediaModalOpen(false);
          fileInputRef.current?.click();
        }}
      />

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button className={`btn ${activeTab === 'general' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('general')}>General</button>
        <button className={`btn ${activeTab === 'home' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('home')}>Home</button>
        <button className={`btn ${activeTab === 'about' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('about')}>About Us</button>
        <button className={`btn ${activeTab === 'news' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('news')}>News & Alerts</button>
        <button className={`btn ${activeTab === 'faqs' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('faqs')}>FAQs</button>
        <button className={`btn ${activeTab === 'branches' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('branches')}>Branches</button>
        <button className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('products')}>Products</button>
        <button className={`btn ${activeTab === 'services' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('services')}>Services</button>
        <button className={`btn ${activeTab === 'media' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('media')}>Media Center</button>
        <button className={`btn ${activeTab === 'automated_messages' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('automated_messages')}>Automated Messages</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {activeTab === 'general' && renderGeneralFields()}
        {activeTab === 'home' && renderHomeTab()}
        {activeTab === 'about' && renderAboutTab()}
        {activeTab === 'news' && renderNewsTab()}
        {activeTab === 'faqs' && renderFaqsTab()}
        {activeTab === 'branches' && renderBranchesTab()}
        {activeTab === 'products' && renderProductsTab()}
        {activeTab === 'services' && renderServicesTab()}
        {activeTab === 'media' && renderMediaCenterTab()}
        {activeTab === 'automated_messages' && renderAutomatedMessagesTab()}
      </div>
    </div>
  );
};

export default CMS;
