import { useEffect } from 'react';
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
    item.id?.toString() === id || index.toString() === id
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (newsItem) {
      // Update page title
      document.title = `${newsItem.title} | ROAACCU News`;

      // Helper function to set or create meta tags
      const setMetaTag = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      // Set Open Graph tags for social sharing
      setMetaTag('og:title', newsItem.title);
      setMetaTag('og:description', newsItem.content.substring(0, 150) + '...');
      if (newsItem.image) {
        setMetaTag('og:image', newsItem.image);
        setMetaTag('twitter:image', newsItem.image);
      }

      // Cleanup when unmounting
      return () => {
        document.title = 'ROAACCU | Republic of Accra Credit Union';
        setMetaTag('og:title', 'ROAACCU | Republic of Accra Credit Union');
        setMetaTag('og:description', 'Welcome to the Republic of Accra Credit Union');
        setMetaTag('og:image', 'https://roaaccugh.com/assets/img/roaaccu-logo.png'); // Default logo
      };
    }
  }, [newsItem]);

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
    return url.startsWith('http') ? url : (url.startsWith('/uploads') ? `http://localhost:3000${url}` : url);
  };

  return (
    <>
      <PageHeader 
        title={newsItem.title || "News Update"} 
        description={newsItem.date || ""}
        bgImage={newsItem.image || "/slider1.jpg"}
      />
      
      <main className="section container" style={{ maxWidth: '900px', margin: '0 auto', paddingTop: 'clamp(1.5rem, 5vw, 3rem)', paddingLeft: 'clamp(1.75rem, 6vw, 4rem)', paddingRight: 'clamp(1.75rem, 6vw, 4rem)' }}>
        
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
          <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', lineHeight: 1.3, color: 'var(--secondary-color)', marginBottom: '1.5rem', wordBreak: 'break-word' }}>
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
        <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)', lineHeight: 1.8, color: 'var(--text-color)', marginBottom: '3rem', wordBreak: 'break-word' }}>
          {newsItem.content.split('\n').map((paragraph: string, idx: number) => (
            <p key={idx} style={{ marginBottom: '1.5rem' }}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Share Section */}
        <section style={{ marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
          <span style={{ fontWeight: 600, color: 'var(--secondary-color)' }}>Share this article:</span>
          
          {/* WhatsApp */}
          <a 
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(newsItem.title || 'News Update')} ${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
            target="_blank" rel="noopener noreferrer"
            className="share-btn"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: '#25D366', color: 'white', textDecoration: 'none', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            title="Share on WhatsApp"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.015c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
          </a>
          
          {/* X (Twitter) */}
          <a 
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(newsItem.title || 'News Update')}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
            target="_blank" rel="noopener noreferrer"
            className="share-btn"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: '#000000', color: 'white', textDecoration: 'none', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            title="Share on X (Twitter)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>

          {/* Facebook */}
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
            target="_blank" rel="noopener noreferrer"
            className="share-btn"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: '#1877F2', color: 'white', textDecoration: 'none', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            title="Share on Facebook"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>

          {/* Instagram / System Share */}
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: newsItem.title || 'News Update',
                  url: window.location.href
                }).catch(console.error);
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard! You can paste it on Instagram.");
              }
            }}
            className="share-btn"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: 'white', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            title="Share via Instagram or other apps"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </button>

          {/* Copy Link */}
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }}
            className="share-btn"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-slate)', color: 'var(--text-color)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#e2e8f0'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'var(--bg-slate)'; }}
            title="Copy Link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
        </section>

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
                  <ExternalLink size={20} style={{ flexShrink: 0 }} />
                  <span style={{ wordBreak: 'break-word' }}>{link.label || link.url}</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
