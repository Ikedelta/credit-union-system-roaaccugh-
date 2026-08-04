import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { useCMS } from '../context/CMSContext';
import { Link } from 'react-router-dom';

export function NewsAndBlog() {
  const { getJSON } = useCMS();

  const newsItems = getJSON('news_list', [
    {
      title: "Annual General Meeting 2026",
      date: "August 15, 2026",
      image: "https://roaaccugh.com/assets/img/slider2.jpg",
      content: "Join us for our upcoming AGM where we will discuss the financial performance of the past year and outline our strategic goals for the future. All registered members are encouraged to attend."
    },
    {
      title: "New Mobile Banking Features",
      date: "July 2, 2026",
      image: "https://roaaccugh.com/assets/img/slider1.jpg",
      content: "We are excited to announce new features to our mobile banking app, including instant loan approvals and improved security measures."
    },
    {
      title: "Community Outreach Program",
      date: "June 10, 2026",
      image: "https://roaaccugh.com/assets/img/slider3.jpg",
      content: "ROAACCU recently partnered with local farmers to provide financial literacy training and subsidized farming equipment to help boost local agriculture."
    }
  ]);

  return (
    <>
      <PageHeader 
        title="News & Blog" 
        description="Stay updated with the latest announcements, community stories, and financial tips from ROAACCU."
        bgImage="/slider1.jpg"
      />
      <main className="section container">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ marginTop: '3rem' }}>
          {newsItems.map((news: any, i: number) => (
            <RevealOnScroll key={i} delay={i * 0.1}>
              <article className="news-card" style={{ background: 'var(--bg-white)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                {news.image && (
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img 
                      src={news.image.startsWith('http') ? news.image : (news.image.startsWith('/uploads') ? `http://localhost:3000${news.image}` : news.image)} 
                      alt={news.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                )}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600, marginBottom: '0.5rem' }}>
                    {news.date}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', lineHeight: 1.4, color: 'var(--secondary-color)' }}>
                    {news.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, flex: 1, marginBottom: '1.5rem' }}>
                    {news.content.length > 150 ? `${news.content.substring(0, 150)}...` : news.content}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <Link to={`/news/${news.id || i}`} className="btn btn-ghost" style={{ padding: 0, color: 'var(--secondary-color)', textDecoration: 'none', fontSize: '0.9rem' }}>
                      Read Full Story &rarr;
                    </Link>
                    
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {/* WhatsApp */}
                      <a 
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(news.title)} ${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/news/${news.id || i}` : '')}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: '#25D366', color: 'white', textDecoration: 'none' }}
                        title="Share on WhatsApp"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.015c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                      </a>
                      {/* X (Twitter) */}
                      <a 
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(news.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/news/${news.id || i}` : '')}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: '#000000', color: 'white', textDecoration: 'none' }}
                        title="Share on X"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      </a>
                      {/* Facebook */}
                      <a 
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/news/${news.id || i}` : '')}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: '#1877F2', color: 'white', textDecoration: 'none' }}
                        title="Share on Facebook"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </a>
                      {/* Copy Link */}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          const url = typeof window !== 'undefined' ? `${window.location.origin}/news/${news.id || i}` : '';
                          navigator.clipboard.writeText(url);
                          alert("Link copied!");
                        }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-slate)', color: 'var(--text-color)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                        title="Copy Link"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      </button>
                    </div>
                  </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
        {newsItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-white)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No News Available</h3>
            <p style={{ color: 'var(--text-muted)' }}>Check back later for updates and announcements.</p>
          </div>
        )}
      </main>
    </>
  );
}
