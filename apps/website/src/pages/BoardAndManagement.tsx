import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { useCMS } from '../context/CMSContext';

export function BoardAndManagement() {
  const { getJSON } = useCMS();

  const teamMembers = getJSON('about_team', [
    { name: "Mr. Joseph Appiah", role: "Chairman", image: "https://roaaccugh.com/assets/img/team/joe.jpg" },
    { name: "Mr. Ebenezer Oppong", role: "Vice Chairman", image: "https://roaaccugh.com/assets/img/team/eben.jpg" },
    { name: "Mrs. Ethel Quandoh", role: "Secretary", image: "https://roaaccugh.com/assets/img/team/ethel.jpg" },
    { name: "Mr. Anthony K. Adiaba", role: "Treasurer", image: "https://roaaccugh.com/assets/img/team/adiaba.jpg" },
    { name: "Mr. Emmanuel B. Tsibuah(Esq)", role: "Member", image: "https://roaaccugh.com/assets/img/team/law.JPG" }
  ]);

  return (
    <>
      <PageHeader 
        title="Board & Management" 
        description="Meet the dedicated leaders guiding ROAACCU towards a brighter financial future for all members."
        bgImage="/slider3.jpg"
      />
      <main className="section container">
        <div style={{ marginTop: '2rem' }}>
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

          <div className="team-modern-grid">
            {teamMembers.map((member: any, i: number) => (
              <RevealOnScroll key={i} delay={i * 0.08}>
                <div className="team-card">
                  <div className="team-card-image">
                    <img src={member.image?.startsWith('http') ? member.image : `http://localhost:3000${member.image}`} alt={member.name} />
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
