import { Phone, Zap, Banknote, Building2, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';

const iconColors = ['', 'gold'];

export function Services() {
  const services: { title: string; desc: string; icon: LucideIcon }[] = [
    { title: 'USSD *889*55#', desc: 'Check your account balance and deposit into your account anywhere, anytime.', icon: Phone },
    { title: 'Mobile Money', desc: 'Seamlessly deposit, withdraw & send funds across all major networks.', icon: Zap },
    { title: 'Ezwich', desc: 'Enjoy reliable and convenient ezwich services at all our branches.', icon: Banknote },
    { title: 'Cheque Clearing', desc: 'Fast and secure clearing for all cheques bearing your name.', icon: Building2 },
    { title: 'Cheque Account', desc: 'Make payments efficiently and securely using our customized cheques.', icon: ShieldCheck },
    { title: 'ATM Services', desc: '24/7 ATM access for all members providing round-the-clock convenience.', icon: Banknote },
  ];

  return (
    <>
      <PageHeader 
        title="Our Services" 
        description="Enjoy countless financial services designed specifically for your convenience and business growth."
        badge="What We Offer"
      />
      <main className="section container">
        <RevealOnScroll>
          <div style={{ marginBottom: '3rem' }}>
            <p className="eyebrow-label">What We Offer</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '0.75rem' }}>Financial Services Built for You</h2>
            <p className="card-text" style={{ maxWidth: '520px', fontSize: '1rem' }}>Modern, accessible, and reliable services to simplify your financial life.</p>
          </div>
        </RevealOnScroll>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, i) => (
          <RevealOnScroll key={i} delay={i * 0.07}>
              <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className={`card-icon ${iconColors[i % iconColors.length]}`} style={{ marginBottom: '1.5rem' }}>
                  <service.icon size={24} />
                </div>
                <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>{service.title}</h3>
                <p className="card-text" style={{ flex: 1, fontSize: '0.95rem', lineHeight: 1.65 }}>{service.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </main>
    </>
  );
}
