import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { useCMS } from '../context/CMSContext';

\n  const { get } = useCMS();
    const organogramImage = get('organogram_image', '');
  const organogramDesc = get('organogram_desc', 'Explore the structural hierarchy of ROAACCU, illustrating the relationships between our various departments, management team, and board of directors.');

  return (
    <>
      <PageHeader 
        title="Organogram" 
        description="Our Organizational Structure"
        badge="About Us"
        bgImage={get('bg_organogram', '/slider2.webp')}
      />
      
      <main className="section container text-center">
        <RevealOnScroll>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: 1.7 }}>
              {organogramDesc}
            </p>

            {organogramImage ? (
              <div className="card" style={{ padding: '2rem', display: 'inline-block', width: '100%' }}>
                <img 
                  src={organogramImage} 
                  alt="ROAACCU Organogram" 
                  style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} 
                />
              </div>
            ) : (
              <div className="card text-center" style={{ padding: '4rem 2rem' }}>
                <h3 style={{ color: 'var(--text-muted)' }}>Organogram is currently being updated.</h3>
                <p>Please check back later.</p>
              </div>
            )}
          </div>
        </RevealOnScroll>
      </main>
    </>
  );
}
