import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { useCMS } from '../context/CMSContext';

export function PhotoGallery() {
  const { getJSON } = useCMS();
  
  // Format: [{ id: '1', title: 'AGM 2023', image: 'url', description: 'desc' }]
  const photos = getJSON<any[]>('photo_gallery', []);

  return (
    <>
      <PageHeader 
        title="Photo Gallery" 
        description="Explore moments and memories from our community events and gatherings."
        badge="Media"
        bgImage="/slider1.jpg"
      />
      
      <main className="section container">
        <RevealOnScroll>
          {photos.length === 0 ? (
             <div className="card text-center" style={{ padding: '4rem 2rem' }}>
               <h3 style={{ color: 'var(--text-muted)' }}>More photos coming soon!</h3>
             </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {photos.map((photo, index) => (
                <div key={photo.id || index} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  {photo.image ? (
                    <img 
                      src={photo.image} 
                      alt={photo.title || 'Gallery image'} 
                      style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '250px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'var(--text-muted)' }}>No Image</span>
                    </div>
                  )}
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{photo.title || 'Untitled'}</h3>
                    {photo.description && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>{photo.description}</p>
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
