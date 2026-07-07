import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';

export function Team() {
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
        title="Board of Directors"
        description="The governance body entrusted with steering ROAACCU's vision and financial integrity."
      />
      <main className="section container">

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

      </main>
    </>
  );
}
