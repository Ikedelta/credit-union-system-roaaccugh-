import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { useCMS } from '../context/CMSContext';

export function Videos() {
  const { get, getJSON } = useCMS();
      
  // Format: [{ id: '1', title: 'Video Title', url: 'https://youtube.com/embed/xyz', description: 'desc' }]
  const videos = getJSON<any[]>('video_gallery', []);

  // Helper to safely get embed URL if user pastes a standard youtube link
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url; // Assume it's already an embed link if none of the above
  };

  return (
    <>
      <PageHeader 
        title="Video Gallery" 
        description="Watch our latest updates, tutorials, and community highlights."
        badge="Media"
        bgImage={get('bg_videos', '/slider3.webp')}
      />
      
      <main className="section container">
        <RevealOnScroll>
          {videos.length === 0 ? (
             <div className="card text-center" style={{ padding: '4rem 2rem' }}>
               <h3 style={{ color: 'var(--text-muted)' }}>More videos coming soon!</h3>
             </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <div 
                  key={video.id || index} 
                  className="card" 
                  style={{ 
                    padding: 0, 
                    overflow: 'hidden', 
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    background: 'var(--bg-white)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
                  }}
                >
                  {video.url ? (
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', background: '#000' }}>
                      <iframe 
                        src={getEmbedUrl(video.url)} 
                        title={video.title || 'Video Player'}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: 'var(--bg-light)' }}>
                      <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Invalid Video URL</span>
                    </div>
                  )}
                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-color)', lineHeight: 1.4 }}>{video.title || 'Untitled Video'}</h3>
                    {video.description && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>{video.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </RevealOnScroll>
      </main>
    </>
  );
}
