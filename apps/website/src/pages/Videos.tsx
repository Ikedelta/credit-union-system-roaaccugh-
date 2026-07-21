import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { useCMS } from '../context/CMSContext';

export function Videos() {
  const { getJSON } = useCMS();
  
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
        bgImage="/slider3.jpg"
      />
      
      <main className="section container">
        <RevealOnScroll>
          {videos.length === 0 ? (
             <div className="card text-center" style={{ padding: '4rem 2rem' }}>
               <h3 style={{ color: 'var(--text-muted)' }}>More videos coming soon!</h3>
             </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {videos.map((video, index) => (
                <div key={video.id || index} className="card" style={{ padding: 0, overflow: 'hidden' }}>
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
                    <div style={{ width: '100%', height: '300px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Invalid Video URL</span>
                    </div>
                  )}
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{video.title || 'Untitled Video'}</h3>
                    {video.description && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>{video.description}</p>
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
