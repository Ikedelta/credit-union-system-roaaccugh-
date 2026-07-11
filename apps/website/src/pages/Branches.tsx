import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export function Branches() {
  const { getJSON } = useCMS();

  const branches = getJSON('branches_list', [
    {
      name: "HEAD OFFICE",
      location: "Agona Ahanta",
      contact: "0302 999 374",
      email: "info@roaaccugh.com",
      image: ""
    },
    {
      name: "AGONA AHANTA BRANCH",
      location: "Near Police Barrier",
      contact: "0256 111 557 / 031………",
      email: "agona@roaaccugh.com",
      image: ""
    },
    {
      name: "ASSIN FOSO",
      location: "Behind Mama Doris Drug Store",
      contact: "0256 111 552 / 0312 290 799",
      email: "assin@roaaccugh.com"
    },
    {
      name: "MANSO AMENFI",
      location: "Opposite PUMA Filling Station",
      contact: "0256 111 559 / 0312 290 818",
      email: ""
    },
    {
      name: "WASSA SIMPA BRANCH",
      location: "Near Total Filling Station",
      contact: "0256 111 551 / 0302 999 375",
      email: ""
    },
    {
      name: "NZEMA AIYINASE BRANCH",
      location: "Opposite Blameless Supermaket",
      contact: "0256 111 554 / 0312 294 679",
      email: ""
    }
  ]);

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
                <div style={{ height: '200px', width: '100%', overflow: 'hidden', background: '#f8fafc' }}>
                  {branch.image ? (
                    <img src={branch.image.startsWith('http') ? branch.image : `http://localhost:3000${branch.image}`} alt={branch.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      <MapPin size={48} opacity={0.2} />
                    </div>
                  )}
                </div>

                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                    {branch.name}
                  </h3>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <MapPin size={20} color="var(--secondary-color)" style={{ flexShrink: 0, marginTop: '3px' }} />
                    <span style={{ color: 'var(--text-color)', lineHeight: 1.5 }}>{branch.location}</span>
                  </div>
                  
                  {branch.contact && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Phone size={20} color="var(--secondary-color)" style={{ flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-color)' }}>{branch.contact}</span>
                    </div>
                  )}

                  {branch.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Mail size={20} color="var(--secondary-color)" style={{ flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-color)' }}>{branch.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </main>
    </>
  );
}
