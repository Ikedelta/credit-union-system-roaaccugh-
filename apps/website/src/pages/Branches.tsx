import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { MapPin, Mail, Phone } from 'lucide-react';

export function Branches() {
  const branches = [
    {
      name: "HEAD OFFICE",
      location: "Agona Ahanta",
      email: "info@roaaccugh.com",
      phone: "0302 999 374",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "AGONA AHANTA BRANCH",
      location: "Near Police Barrier",
      email: "aa.branch@roaaccugh.com",
      phone: "0256 111 557 / 031………",
      image: "https://images.unsplash.com/photo-1578509374026-613d0527acbf?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "ASSIN FOSO",
      location: "Behind Mama Doris Drug Store",
      email: "af.branch@roaaccugh.com",
      phone: "0256 111 552 / 0312 290 799",
      image: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "MANSO AMENFI",
      location: "Opposite PUMA Filling Station",
      email: "ma.branch@roaaccugh.com",
      phone: "0256 111 559 / 0312 290 818",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "WASSA SIMPA BRANCH",
      location: "Near Total Filling Station",
      email: "ws.branch@roaaccugh.com",
      phone: "0256 111 551 / 0302 999 375",
      image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "NZEMA AIYINASE BRANCH",
      location: "Opposite Blameless Supermaket",
      email: "na.branch@roaaccugh.com",
      phone: "0256 111 554 / 0312 294 679",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <>
      <PageHeader 
        title="Our Branches" 
        description="Find a ROAACCU branch near you. We have a network of branches ready to serve you with excellence."
        bgImage="/slider3.jpg"
      />
      <main className="section container">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((branch, index) => (
            <RevealOnScroll key={index} delay={index * 0.1}>
              <div style={{ 
                background: 'var(--surface-color)', 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--border-radius-lg)', 
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'var(--transition)'
              }} className="branch-card hover:-translate-y-1 hover:shadow-md">
                
                <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                  <img src={branch.image} alt={branch.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                    {branch.name}
                  </h3>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <MapPin size={20} color="var(--secondary-color)" style={{ flexShrink: 0, marginTop: '3px' }} />
                    <span style={{ color: 'var(--text-color)', lineHeight: 1.5 }}>{branch.location}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Mail size={20} color="var(--secondary-color)" style={{ flexShrink: 0 }} />
                    <a href={`mailto:${branch.email}`} style={{ color: 'var(--text-color)', textDecoration: 'none' }}>{branch.email}</a>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Phone size={20} color="var(--secondary-color)" style={{ flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-color)' }}>{branch.phone}</span>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </main>
    </>
  );
}
