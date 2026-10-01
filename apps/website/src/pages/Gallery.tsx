import { useLocation } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import { PageHeader } from '../components/PageHeader';

export function Gallery() {
  const { get } = useCMS();
    const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code') || 'General';

  const images = [
    "/slider1.webp",
    "/slider2.webp",
    "/slider3.webp",
    "/slider1.webp",
    "/slider2.webp",
    "/slider3.webp"
  ];

  return (
    <>
      <PageHeader 
        title={`${code} Gallery`} 
        description={`A collection of moments from our ${code} archives.`}
        bgImage={get('bg_gallery', '/slider2.webp')}
      />
      <main className="section container text-center" style={{ minHeight: '60vh' }}>
      
      <div className="grid md:grid-cols-3 gap-6" style={{ marginTop: '3rem' }}>
        {images.map((url, i) => (
          <div key={i} className="card" style={{ padding: '0', overflow: 'hidden', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9' }}>
            <img loading="lazy" decoding="async" src={url} alt={`Gallery item ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </div>
    </main>
    </>
  );
}
