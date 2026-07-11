import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import { PageHeader } from '../components/PageHeader';
import { ArrowLeft, ExternalLink, Calendar } from 'lucide-react';

export function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getJSON } = useCMS();

  // Get all news items
  const newsItems: any[] = getJSON('news_list', []);

  // Find the news item either by ID or fallback to array index
  const newsItem: any = newsItems.find((item: any, index: number) => 
    item.id === id || index.toString() === id
  );

  if (!newsItem) {
    return (
      <main className="section container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Article Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>We couldn't find the news article you are looking for.</p>
        <Link to="/news" className="btn btn-primary">
          <ArrowLeft size={18} /> Back to News
        </Link>
      </main>
    );
  }

  // Helper to format URLs
  const formatImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `http://localhost:3000${url}`;
  };

  return (
    <>
      <PageHeader 
        title={newsItem.title || "News Update"} 
        description={newsItem.date || ""}
        bgImage={newsItem.image || "/slider1.jpg"}
      />
      
      <main className="section container" style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '3rem' }}>
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/news')} 
          className="btn btn-ghost" 
          style={{ padding: 0, marginBottom: '2rem', color: 'var(--primary-color)' }}
        >
          <ArrowLeft size={18} /> Back to News
        </button>

        {/* Article Header */}
        <header style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', fontWeight: 600, marginBottom: '1rem' }}>
            <Calendar size={18} />
            <span>{newsItem.date}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.2, color: 'var(--secondary-color)', marginBottom: '1.5rem' }}>
            {newsItem.title}
          </h1>
        </header>

        {/* Main Image */}
        {newsItem.image && (
          <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', marginBottom: '3rem', boxShadow: 'var(--shadow-md)' }}>
            <img 
              src={formatImageUrl(newsItem.image)} 
              alt={newsItem.title} 
              style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        {/* Main Content */}
        <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-color)', marginBottom: '4rem' }}>
          {newsItem.content.split('\n').map((paragraph: string, idx: number) => (
            <p key={idx} style={{ marginBottom: '1.5rem' }}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Image Gallery */}
        {newsItem.gallery && newsItem.gallery.length > 0 && (
          <section style={{ marginBottom: '4rem', borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '2rem', color: 'var(--secondary-color)' }}>Image Gallery</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsItem.gallery.map((img: string, idx: number) => (
                <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', aspectRatio: '4/3' }}>
                  <img 
                    src={formatImageUrl(img)} 
                    alt={`Gallery ${idx + 1}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reference Links */}
        {newsItem.links && newsItem.links.length > 0 && (
          <section style={{ marginBottom: '4rem', borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--secondary-color)' }}>References & External Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {newsItem.links.map((link: any, idx: number) => (
                <a 
                  key={idx} 
                  href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    padding: '1.25rem', 
                    background: 'var(--bg-white)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '8px',
                    color: 'var(--primary-color)',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary-color)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <ExternalLink size={20} />
                  <span>{link.label || link.url}</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
