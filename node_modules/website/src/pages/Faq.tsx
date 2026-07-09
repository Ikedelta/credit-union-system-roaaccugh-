import { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { useCMS } from '../context/CMSContext';

export function Faq() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const { getJSON } = useCMS();
  
  const faqs = getJSON('faq_list', [
    { q: "Is ROAACCU recognized by Bank of Ghana (BOG)?", a: "Yes. ROAACCU is affiliated to Ghana Co-operatives Credit Unions Association (CUA) and registered by Department of Co-operatives (DOC)." },
    { q: "Can I save with ROAACCU without acquiring the minimum shares?", a: "Yes. However, you have up to six months to acquire the minimum shares." },
    { q: "Is acquisition of shares compulsory?", a: "Yes. It makes you a full member of ROAACCU who will enjoy all the benefits entitled to a member." },
    { q: "Can I access my account balances on my phone?", a: "Yes. You can use our USSD code (*889*55#) with default pin 1234 to access your account balances." },
    { q: "Does ROAACCU provide SMS alerts on transactions?", a: "Yes. Members receive SMS alerts on all their transactions at NO cost." }
  ]);

  return (
    <>
      <PageHeader 
        title="Frequently Asked Questions" 
        description="Find clear and quick answers to the most common questions about our services, membership, and policies."
        badge="Help Center"
        bgImage="/slider3.jpg"
      />
      
      <main className="section container">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12" style={{ alignItems: 'start' }}>
          
          {/* FAQ Accordion List */}
          <div className="lg:col-span-8">
            <RevealOnScroll>
              <div style={{ marginBottom: '2.5rem' }}>
                <p className="eyebrow-label">General Questions</p>
                <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '1rem' }}>Everything you need to know.</h2>
              </div>
            </RevealOnScroll>

            <ul className="faq-list" style={{ maxWidth: '100%', margin: 0 }}>
              {faqs.map((faq, index) => (
                <RevealOnScroll key={index} delay={index * 0.1}>
                  <li 
                    className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                    style={{ 
                      background: 'var(--white)',
                      border: activeFaq === index ? '1.5px solid rgba(16, 110, 234, 0.3)' : '1.5px solid transparent',
                      boxShadow: activeFaq === index ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                      transform: activeFaq === index ? 'translateY(-2px)' : 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <button className="faq-question" onClick={() => setActiveFaq(activeFaq === index ? null : index)} style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ flex: 1, textAlign: 'left', lineHeight: 1.5 }}>
                        {faq.q}
                      </div>
                      <span style={{ 
                        width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: activeFaq === index ? 'var(--primary-color)' : 'rgba(16, 110, 234, 0.08)',
                        color: activeFaq === index ? 'white' : 'var(--primary-color)',
                        transition: 'var(--transition)', flexShrink: 0
                      }}>
                        {activeFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </span>
                    </button>
                    <div className="faq-answer">
                      <div style={{ padding: '0 1.5rem 1.25rem 1.5rem', color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                        {faq.a}
                      </div>
                    </div>
                  </li>
                </RevealOnScroll>
              ))}
            </ul>
          </div>

          {/* Contact CTA Sticky Card */}
          <div className="lg:col-span-4" style={{ position: 'sticky', top: '120px' }}>
            <RevealOnScroll delay={0.4}>
              <div className="premium-card" style={{ background: 'var(--grad-primary)', color: 'white', padding: '2.5rem 2rem', textAlign: 'center', borderRadius: 'var(--border-radius-xl)', boxShadow: 'var(--shadow-colored)' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', backdropFilter: 'blur(10px)' }}>
                  <MessageSquare size={32} style={{ color: 'var(--accent-gold)' }} />
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'white', fontWeight: 700 }}>Still have questions?</h3>
                <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '2rem', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  Can't find the answer you're looking for? Please chat with our friendly team.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Link to="/contact" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}>
                    Contact Support
                  </Link>
                  <a href="tel:+233262671616" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem' }}>
                    <Phone size={18} /> Call Us Directly
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>

        </div>
      </main>
    </>
  );
}
