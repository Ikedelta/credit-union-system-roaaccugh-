import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { useCMS } from '../context/CMSContext';
import { Award, Star } from 'lucide-react';

export function Awards() {
  const { getJSON } = useCMS();
  
  // Format: [{ id: '1', title: 'Best Credit Union 2023', image: 'url', description: 'desc' }]
  const awards = getJSON<any[]>('photo_gallery', []);

  return (
    <>
      <PageHeader 
        title="Our Awards & Recognitions" 
        description="Celebrating our commitment to excellence, community service, and financial empowerment."
        badge="Media"
        bgImage="/slider3.jpg"
      />
      
      <main className="section container" style={{ paddingBottom: '6rem' }}>
        <RevealOnScroll>
          <div className="text-center" style={{ marginBottom: '4rem', maxWidth: '800px', margin: '0 auto 4rem auto' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)',
              color: '#fff',
              marginBottom: '1.5rem',
              boxShadow: '0 10px 25px rgba(253, 185, 49, 0.4)'
            }}>
              <Award size={40} />
            </div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>A Legacy of Excellence</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8 }}>
              At ROAACCU, we don't just strive for financial success; we aim to uplift our community. 
              These awards represent the trust, hard work, and dedication of our members and staff.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
          {awards.length === 0 ? (
             <div className="card text-center" style={{ padding: '4rem 2rem', background: 'var(--bg-white)', borderRadius: '24px', boxShadow: 'var(--shadow-md)' }}>
               <Star size={48} style={{ color: '#FFD700', margin: '0 auto 1rem auto', opacity: 0.5 }} />
               <h3 style={{ color: 'var(--text-muted)' }}>Awards will be updated soon!</h3>
             </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {awards.map((award, index) => {
                if (!award) return null;
                const isString = typeof award === 'string';
                const id = isString ? index : (award.id || index);
                const image = isString ? award : award.image;
                const title = isString ? 'Credit Union Award' : (award.title || 'Excellence Award');
                const description = isString ? '' : award.description;

                return (
                <div 
                  key={id} 
                  className="card" 
                  style={{ 
                    padding: 0, 
                    overflow: 'hidden', 
                    borderRadius: '24px',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
                    border: '1px solid rgba(0,0,0,0.02)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.05)';
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    {image ? (
                      <img 
                        src={image} 
                        alt={title} 
                        style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '300px', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Award size={48} style={{ color: '#cbd5e1' }} />
                      </div>
                    )}
                    <div style={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      right: 0, 
                      height: '100px', 
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' 
                    }}></div>
                    <div style={{ 
                      position: 'absolute', 
                      top: '1.5rem', 
                      right: '1.5rem',
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      padding: '0.5rem',
                      borderRadius: '50%',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                    }}>
                      <Star size={20} fill="#FFD700" color="#FFD700" />
                    </div>
                  </div>
                  <div style={{ padding: '2rem' }}>
                    <h3 style={{ 
                      fontSize: '1.35rem', 
                      marginBottom: '1rem', 
                      color: 'var(--primary-color)',
                      fontWeight: 700,
                      lineHeight: 1.3
                    }}>
                      {title}
                    </h3>
                    {description && (
                      <p style={{ 
                        color: 'var(--text-secondary)', 
                        fontSize: '1rem', 
                        lineHeight: 1.7,
                        margin: 0 
                      }}>
                        {description}
                      </p>
                    )}
                  </div>
                </div>
              )})}
            </div>
          )}
        </RevealOnScroll>
      </main>
    </>
  );
}
