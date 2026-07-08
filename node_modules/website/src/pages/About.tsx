import { ShieldCheck, Target, Globe } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { useCMS } from '../context/CMSContext';

export function About() {
  const { get } = useCMS();

  const teamMembers = [
    { name: "Mr. Joseph Appiah", role: "Chairman", img: "https://roaaccugh.com/assets/img/team/joe.jpg" },
    { name: "Mr. Ebenezer Oppong", role: "Vice Chairman", img: "https://roaaccugh.com/assets/img/team/eben.jpg" },
    { name: "Mrs. Ethel Quandoh", role: "Secretary", img: "https://roaaccugh.com/assets/img/team/ethel.jpg" },
    { name: "Mr. Anthony K. Adiaba", role: "Treasurer", img: "https://roaaccugh.com/assets/img/team/adiaba.jpg" },
    { name: "Mr. Emmanuel B. Tsibuah(Esq)", role: "Member", img: "https://roaaccugh.com/assets/img/team/law.JPG" }
  ];

  return (
    <>
      <PageHeader 
        title="About ROAACCU" 
        description="Learn about our history, our mission, and the core values that drive us to serve the Road Officers and Allies community."
        bgImage="/slider2.jpg"
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
              {get("about_text", "ROAA Co-operative Credit Union Ltd. (ROAACCU) was established in November 2011 through the initiative of the National Executive Council (NEC) of the Rubber Outgrowers and Agents Association (ROAA) under the Management of an Interim Management Board instituted by the NEC, with Mr. Kwame Awuah Asante as Chairman. Mr. Rexford N. Norvieku-Tekpetey was the first hired staff to see to the realization of the Association’s dream.")}
            </p>
            <p className="card-text" style={{ marginBottom: '1.25rem', lineHeight: 1.8 }}>
              It was formed to primarily take care of the extra credit facilities requested by the Association’s members (farmers) and later, its common bond was opened to embrace the community.
            </p>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '1.5rem 0 0.5rem', color: 'var(--primary-color)' }}>Affiliation</h3>
            <p className="card-text" style={{ lineHeight: 1.8 }}>
              In April 2013, ROAACCU was affiliated to the Ghana Co-operatives Credit Unions Association (CUA) Limited, an apex body of all Credit Unions in Ghana and got registered with the Department of Co-operatives (DOC) in November, 2013. ROAACCU then became a full-fledged member of the Credit Unions movement in Ghana. ROAACCU was the first Co-operative Credit Union in Ghana involved in the National Livelihood Empowerment Against Poverty (LEAP) Program in the Wassa Amenfi Central District, Western Region.
            </p>
            <p className="card-text" style={{ marginTop: '1.25rem', lineHeight: 1.8 }}>
              ROAACCU has its head office at Agona Ahanta with five (5) networked branches in Agona Ahanta, Manso Amenfi, Wassa Simpa, Nzema Aiyinase (all in the Western Region) and Assin Foso (in the Central Region) with a total assets of over 100 million Ghana cedis.
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
            <p className="card-text" style={{ fontSize: '0.925rem', lineHeight: 1.75 }}>We seek to become the preferred Financial Co-operative Credit Union in Ghana.</p>
          </div>
          <div style={{ padding: '2.5rem 2rem' }}>
            <div className="card-icon" style={{ marginBottom: '1.5rem' }}><ShieldCheck size={22} /></div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary-color)' }}>Mission</h3>
            <p className="card-text" style={{ fontSize: '0.925rem', lineHeight: 1.75 }}>ROAACCU exists as a Financial Co-operative Credit Union, providing prompt and member-centered financial and competitive services to help improve members' living conditions.</p>
          </div>
          <div style={{ padding: '2.5rem 2rem', background: 'var(--primary-color)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Globe size={20} color="white" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--secondary-color)' }}>Core Values</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { title: 'FAIRNESS', desc: 'Impartial and just treatment in all dealings.' },
                { title: 'ACCESSIBILITY', desc: 'Accessible in wider areas in the country.' },
                { title: 'RELIABILITY', desc: 'Trustworthy and diligent performance.' },
                { title: 'MEMBER-FOCUS', desc: 'Tailored to member needs and satisfaction.' }
              ].map(v => (
                <div key={v.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
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
          {[
            { name: 'Agona Ahanta', type: 'Head Office', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600&h=400' },
            { name: 'Manso Amenfi', type: 'Branch Office', img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600&h=400' },
            { name: 'Wassa Simpa', type: 'Branch Office', img: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=600&h=400' },
            { name: 'Nzema Aiyinase', type: 'Branch Office', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=600&h=400' },
            { name: 'Assin Foso', type: 'Branch Office', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600&h=400' }
          ].map((branch, i) => (
            <RevealOnScroll key={i} delay={i * 0.1}>
              <div className="branch-card" style={{ background: 'var(--bg-white)', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img src={branch.img} alt={branch.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{branch.name}</h3>
                  <p style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 600 }}>{branch.type}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '5rem' }}>
        {/* Intro */}
        <RevealOnScroll>
          <div style={{ maxWidth: '640px', marginBottom: '3.5rem' }}>
            <p className="eyebrow-label">Leadership</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', lineHeight: 1.15, marginBottom: '1rem' }}>
              Guided by experience.<br />Driven by service.
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1rem' }}>
              Our Board of Directors brings decades of leadership in co-operative finance, agriculture, and community development to ensure every member's interests are protected.
            </p>
          </div>
        </RevealOnScroll>

        {/* Team Grid */}
        <div className="team-modern-grid">
          {teamMembers.map((member, i) => (
            <RevealOnScroll key={i} delay={i * 0.08}>
              <div className="team-card">
                <div className="team-card-image">
                  <img src={member.img} alt={member.name} />
                </div>
                <div className="team-card-info">
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
      </main>
    </>
  );
}
