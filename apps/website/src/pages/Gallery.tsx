import { useLocation } from 'react-router-dom';

export function Gallery() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code') || 'General';

  const images = [
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80"
  ];

  return (
    <main className="section container text-center" style={{ minHeight: '60vh' }}>
      <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem', textTransform: 'uppercase' }}>
        {code} Gallery
      </h2>
      <p className="card-text">A collection of moments from our {code} archives.</p>
      
      <div className="grid md:grid-cols-3 gap-6" style={{ marginTop: '3rem' }}>
        {images.map((url, i) => (
          <div key={i} className="card" style={{ padding: '0', overflow: 'hidden', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9' }}>
            <img src={url} alt={`Gallery item ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </div>
    </main>
  );
}
