import { ShieldCheck, Target, Globe } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { useCMS } from '../context/CMSContext';

export function About() {
  const { get, getJSON } = useCMS();

  const coreValues = getJSON('about_core_values', [
    { title: 'FAIRNESS', desc: 'Impartial and just treatment in all dealings.' },
    { title: 'ACCESSIBILITY', desc: 'Accessible in wider areas in the country.' },
    { title: 'RELIABILITY', desc: 'Trustworthy and diligent performance.' },
    { title: 'MEMBER-FOCUS', desc: 'Tailored to member needs and satisfaction.' }
  ]);

  return (
    <>
      <PageHeader 
        title="About ROAACCU" 
        description="Learn about our history, our mission, and the core values that drive us to serve the Road Officers and Allies community."
        bgImage="/slider2.jpg"
      />
      <main className="section container" style={{ paddingLeft: 'clamp(1.75rem, 6vw, 4rem)', paddingRight: 'clamp(1.75rem, 6vw, 4rem)' }}>
      
      <div className="grid lg:grid-cols-2 gap-12 items-stretch" style={{ marginBottom: '4rem' }}>
        <RevealOnScroll direction="right">
          <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '350px' }}>
            {/* Main large image stretching to fill the block, leaving room for the overlap */}
            <img 
              src={get('about_image_1', 'https://roaaccugh.com/assets/img/roaaccu4.jpg')} 
              alt="Corporate Team" 
              style={{ position: 'absolute', top: 0, left: 0, width: '90%', height: '85%', objectFit: 'cover', borderRadius: 'var(--border-radius-xl)', boxShadow: 'var(--shadow-lg)' }} 
            />
            
            {/* Overlapping smaller image filling the bottom right */}
            <img 
              src={get('about_image_2', 'https://roaaccugh.com/assets/img/roaaccu4.jpg')} 
              alt="Our Work" 
              style={{ position: 'absolute', bottom: '0', right: '0', width: '55%', height: '55%', objectFit: 'cover', borderRadius: 'var(--border-radius-xl)', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '10px solid var(--bg-white)', transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-15px) scale(1.03)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
            />
            
            {/* Decorative element behind the images */}
            <div style={{ position: 'absolute', top: '-15px', left: '-15px', width: '30%', height: '30%', background: 'var(--primary-color)', borderRadius: 'var(--border-radius-xl)', zIndex: -1, opacity: 0.1 }}></div>
          </div>
        </RevealOnScroll>
        <RevealOnScroll direction="left" delay={0.2}>
          <div>
            <p className="eyebrow-label">Our History</p>
            <h2 style={{ textAlign: 'left', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '1.25rem' }}>Built by the community,<br/>for the community.</h2>
            <p className="card-text" style={{ margin: '0 0 1.25rem', lineHeight: 1.8 }}>
              {get("about_text", "ROAA Co-operative Credit Union Ltd. (ROAACCU) was established in November 2011 through the initiative of the National Executive Council (NEC) of the Rubber Outgrowers and Agents Association (ROAA) under the Management of an Interim Management Board instituted by the NEC, with Mr. Kwame Awuah Asante as Chairman. Mr. Rexford N. Norvieku-Tekpetey was the first hired staff to see to the realization of the Association’s dream.")}
            </p>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '1.5rem 0 0.5rem', color: 'var(--primary-color)' }}>Affiliation</h3>
            <p className="card-text" style={{ lineHeight: 1.8 }}>
              In April 2013, ROAACCU was affiliated to the Ghana Co-operatives Credit Unions Association (CUA) Limited, an apex body of all Credit Unions in Ghana and got registered with the Department of Co-operatives (DOC) in November, 2013. ROAACCU then became a full-fledged member of the Credit Unions movement in Ghana. ROAACCU was the first Co-operative Credit Union in Ghana involved in the National Livelihood Empowerment Against Poverty (LEAP) Program in the Wassa Amenfi Central District, Western Region.
            </p>
            <p style={{ marginTop: '2rem', fontWeight: 700, fontSize: '1.1rem', color: 'var(--secondary-color)' }}>ROAACCU! Me Daakye Anidaso…</p>
          </div>
        </RevealOnScroll>
      </div>
      
      <RevealOnScroll delay={0.1}>
        <div className="about-panels">
          <div style={{ padding: '2.5rem 2rem' }}>
            <div className="card-icon" style={{ marginBottom: '1.5rem' }}><Target size={22} /></div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary-color)' }}>Vision</h3>
            <p className="card-text" style={{ fontSize: '0.925rem', lineHeight: 1.75 }}>
              {get('about_vision', 'We seek to become the preferred Financial Co-operative Credit Union in Ghana.')}
            </p>
          </div>
          <div style={{ padding: '2.5rem 2rem' }}>
            <div className="card-icon" style={{ marginBottom: '1.5rem' }}><ShieldCheck size={22} /></div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary-color)' }}>Mission</h3>
            <p className="card-text" style={{ fontSize: '0.925rem', lineHeight: 1.75 }}>
              {get('about_mission', 'ROAACCU exists as a Financial Co-operative Credit Union, providing prompt and member-centered financial and competitive services to help improve members living conditions.')}
            </p>
          </div>
          <div style={{ padding: '2.5rem 2rem', background: 'var(--primary-color)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Globe size={20} color="white" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--secondary-color)' }}>Core Values</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {coreValues.map((v: any, index: number) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--secondary-color)', flexShrink: 0, marginTop: '6px' }} />
                  <div><strong>{v.title}:</strong> {v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </RevealOnScroll>

      {/* Branches Section */}
      <div style={{ marginTop: '5rem', padding: '3rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <RevealOnScroll>
          <div className="text-center" style={{ marginBottom: '3.5rem' }}>
            <p className="eyebrow-label">Our Network</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '1rem' }}>Our Branches</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              We serve our community through our head office and a growing network of modern, fully-equipped branches across the Western and Central Regions.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getJSON('branches_list', [
            { name: 'Agona Ahanta', location: 'Head Office', contact: '', manager: '' },
            { name: 'Manso Amenfi', location: 'Branch Office', contact: '', manager: '' },
            { name: 'Wassa Simpa', location: 'Branch Office', contact: '', manager: '' },
            { name: 'Nzema Aiyinase', location: 'Branch Office', contact: '', manager: '' },
            { name: 'Assin Foso', location: 'Branch Office', contact: '', manager: '' }
          ]).map((branch: any, i: number) => (
            <RevealOnScroll key={i} delay={i * 0.1}>
              <div className="branch-card" style={{ background: 'var(--bg-white)', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', padding: '1.5rem', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{branch.name}</h3>
                <p style={{ color: 'var(--text-color)', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem' }}>{branch.location}</p>
                {branch.contact && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>📞 {branch.contact}</p>}
                {branch.manager && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>👤 {branch.manager}</p>}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>

      </main>
    </>
  );
}
