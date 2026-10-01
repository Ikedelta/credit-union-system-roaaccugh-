import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { useCMS } from '../context/CMSContext';
import { ZoomIn } from 'lucide-react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';

export function PhotoGallery() {
  const { get, getJSON } = useCMS();
      const [lightboxIndex, setLightboxIndex] = useState(-1);
  
  // Format: [{ id: '1', title: 'AGM 2023', image: 'url', description: 'desc' }]
  const photos = getJSON<any[]>('new_photo_gallery', []);

  // Map to lightbox format
  const lightboxSlides = photos.map(photo => ({
    src: photo.image || '',
    title: photo.title || '',
    description: photo.description || ''
  }));

  return (
    <>
      <PageHeader 
        title="Photo Gallery" 
        description="Explore moments and memories from our community events and gatherings in stunning detail."
        badge="Media"
        bgImage={get('bg_gallery', '/slider1.webp')}
      />
      
      <main className="section container" style={{ paddingBottom: '6rem' }}>
        <RevealOnScroll>
          {photos.length === 0 ? (
             <div className="card text-center" style={{ padding: '4rem 2rem', borderRadius: '24px' }}>
               <h3 style={{ color: 'var(--text-muted)' }}>More photos coming soon!</h3>
             </div>
          ) : (
            <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 1024: 3}}>
              <Masonry gutter="1.5rem">
                {photos.map((photo, index) => (
                  <div 
                    key={photo.id || index} 
                    style={{ 
                      position: 'relative', 
                      overflow: 'hidden', 
                      borderRadius: '16px',
                      cursor: 'pointer',
                      background: '#000',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}
                    className="group"
                    onClick={() => setLightboxIndex(index)}
                    onMouseEnter={(e) => {
                      const img = e.currentTarget.querySelector('img');
                      const overlay = e.currentTarget.querySelector('.overlay');
                      if (img) img.style.transform = 'scale(1.05)';
                      if (overlay) (overlay as HTMLElement).style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      const img = e.currentTarget.querySelector('img');
                      const overlay = e.currentTarget.querySelector('.overlay');
                      if (img) img.style.transform = 'scale(1)';
                      if (overlay) (overlay as HTMLElement).style.opacity = '0';
                    }}
                  >
                    {photo.image ? (
                      <img loading="lazy" decoding="async" 
                        src={photo.image} 
                        alt={photo.title || 'Gallery image'} 
                        style={{ 
                          width: '100%', 
                          display: 'block', 
                          objectFit: 'cover',
                          transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                        }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '250px', background: '#f1f5f9' }}></div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div 
                      className="overlay"
                      style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                        opacity: 0,
                        transition: 'opacity 0.4s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '2rem 1.5rem'
                      }}
                    >
                      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#fff', opacity: 0.8 }}>
                        <ZoomIn size={24} />
                      </div>
                      <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.25rem', fontWeight: 600 }}>
                        {photo.title || 'Untitled'}
                      </h3>
                      {photo.description && (
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {photo.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          )}
        </RevealOnScroll>
      </main>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={lightboxSlides}
        plugins={[Zoom, Captions]}
        carousel={{ finite: photos.length <= 1 }}
        captions={{ showToggle: true, descriptionTextAlign: 'center' }}
      />
    </>
  );
}
