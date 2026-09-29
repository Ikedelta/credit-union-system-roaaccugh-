import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { useCMS } from '../context/CMSContext';
import { Award, Star } from 'lucide-react';

export function Awards() {
  const { get, getJSON } = useCMS();
      
  // Format: [{ id: '1', title: 'Best Credit Union 2023', image: 'url', description: 'desc' }]
  const awards = getJSON<any[]>('photo_gallery', []);

  return (
    <>
      <PageHeader 
        title="Our Awards & Recognitions" 
        description="Celebrating our commitment to excellence, community service, and financial empowerment."
        badge="Media"
        bgImage={get('bg_awards', '/slider3.webp')}
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
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
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
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    background: 'var(--bg-white)',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: '140px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
                  }}
                >
                  <div style={{ position: 'relative', width: '140px', height: '100%', flexShrink: 0 }}>
                    {image ? (
                      <img 
                        src={image} 
                        alt={title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Award size={32} style={{ color: 'var(--text-muted)' }} />
                      </div>
                    )}
                    <div style={{ 
                      position: 'absolute', 
                      top: '0.5rem', 
                      left: '0.5rem',
                      background: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(4px)',
                      padding: '0.35rem',
                      borderRadius: '50%',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      <Star size={14} fill="#FDB931" color="#FDB931" />
                    </div>
                  </div>
                  
                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
                    <h3 style={{ 
                      fontSize: '1.05rem', 
                      marginBottom: description ? '0.35rem' : '0', 
                      color: 'var(--text-color)',
                      fontWeight: 700,
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textTransform: 'capitalize'
                    }}>
                      {title.toLowerCase()}
                    </h3>
                    {description && (
                      <p style={{ 
                        color: 'var(--text-secondary)', 
                        fontSize: '0.85rem', 
                        lineHeight: 1.5,
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
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
