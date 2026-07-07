import { ShieldCheck, Target, Globe } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';

export function About() {
  return (
    <>
      <PageHeader 
        title="About ROAACCU" 
        description="Me Daakye Anidaso. We are your preferred Financial Co-operative Credit Union in Ghana." 
      />
      <main className="section container">
      
      <div className="grid lg:grid-cols-2 gap-12 items-center" style={{ marginBottom: '4rem' }}>
        <RevealOnScroll direction="right">
          <div>
            <img 
              src="https://roaaccugh.com/assets/img/roaaccu4.jpg" 
              alt="Corporate Team" 
              style={{ width: '100%', borderRadius: 'var(--border-radius-xl)', boxShadow: 'var(--shadow-lg)', display: 'block' }} 
            />
          </div>
        </RevealOnScroll>
        <RevealOnScroll direction="left" delay={0.2}>
          <div>
            <p className="eyebrow-label">Our History</p>
            <h2 style={{ textAlign: 'left', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '1.25rem' }}>Built by the community,<br/>for the community.</h2>
            <p className="card-text" style={{ margin: '0 0 1.25rem', lineHeight: 1.8 }}>
              ROAA Co-operative Credit Union Ltd. (ROAACCU) was established in November 2011 through the initiative of the National Executive Council (NEC) of the Rubber Outgrowers and Agents Association (ROAA).
            </p>
            <p className="card-text" style={{ marginBottom: '1.25rem', lineHeight: 1.8 }}>
              It was formed to primarily take care of the extra credit facilities requested by the Association's members (farmers) and later, its common bond was opened to embrace the entire community.
            </p>
            <p className="card-text" style={{ lineHeight: 1.8 }}>
              Providing prompt and member-centered financial and competitive services to help improve members' living conditions.
            </p>
          </div>
        </RevealOnScroll>
      </div>
      
      <RevealOnScroll delay={0.1}>
        <div className="about-panels">
          <div style={{ padding: '2.5rem 2rem' }}>
            <div className="card-icon" style={{ marginBottom: '1.5rem' }}><Target size={22} /></div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary-color)' }}>Our Vision</h3>
            <p className="card-text" style={{ fontSize: '0.925rem', lineHeight: 1.75 }}>To become the preferred Financial Co-operative Credit Union in Ghana.</p>
          </div>
          <div style={{ padding: '2.5rem 2rem' }}>
            <div className="card-icon" style={{ marginBottom: '1.5rem' }}><ShieldCheck size={22} /></div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary-color)' }}>Our Mission</h3>
            <p className="card-text" style={{ fontSize: '0.925rem', lineHeight: 1.75 }}>Providing prompt and member-centered financial services to improve members' living conditions.</p>
          </div>
          <div style={{ padding: '2.5rem 2rem', background: 'var(--primary-color)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Globe size={20} color="white" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--secondary-color)' }}>Core Values — F.A.R.M</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {['Fairness', 'Accessibility', 'Reliability', 'Member-Focus'].map(v => (
                <div key={v} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', fontWeight: 600 }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--secondary-color)', flexShrink: 0 }} />
                  {v}
                </div>
              ))}
            </div>
          </div>
        </div>
      </RevealOnScroll>
      </main>
    </>
  );
}
