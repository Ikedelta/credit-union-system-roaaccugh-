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
                      src={news.image.startsWith('http') ? news.image : `http://localhost:3000${news.image}`} 
                      alt={news.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                )}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600, marginBottom: '0.5rem' }}>
                    {news.date}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', lineHeight: 1.4, color: 'var(--text-color)' }}>
                    {news.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, flex: 1, marginBottom: '1.5rem' }}>
                    {news.content.length > 150 ? `${news.content.substring(0, 150)}...` : news.content}
                  </p>
                  <Link to={`/news/${news.id || i}`} className="btn btn-ghost" style={{ padding: 0, color: 'var(--secondary-color)', alignSelf: 'flex-start', display: 'inline-block', textDecoration: 'none' }}>
                    Read Full Story &rarr;
                  </Link>
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
