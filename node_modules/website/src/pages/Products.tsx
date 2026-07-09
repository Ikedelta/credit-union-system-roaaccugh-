import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { useCMS } from '../context/CMSContext';

const typeConfig: Record<string, { label: string; badgeClass: string; bg: string }> = {
  Savings:    { label: 'Savings Account',    badgeClass: 'type-badge type-badge-savings',    bg: '#f8fafc' },
  Loan:       { label: 'Loan Product',       badgeClass: 'type-badge type-badge-loan',       bg: 'rgba(28, 16, 94, 0.03)' },
  Investment: { label: 'Investment',         badgeClass: 'type-badge type-badge-investment', bg: 'rgba(28, 16, 94, 0.05)' },
};

export function Products() {
  const [activeTab, setActiveTab] = useState<'All' | 'Savings' | 'Loan'>('All');
  const { getJSON } = useCMS();

  const products = getJSON('products_list', [
    { 
      id: 1,
      title: 'Prime Savings',       
      type: 'Investment', 
      image: 'https://roaaccugh.com/assets/img/portfolio/ps.png',
      desc: 'A premium high-yield investment account designed to grow your wealth steadily with highly competitive interest rates.',
      features: 'Premium interest rates, Flexible withdrawal terms, Dedicated account manager'
    },
    { 
      id: 2,
      title: 'Member Savings',      
      type: 'Savings',    
      image: 'https://roaaccugh.com/assets/img/portfolio/ms.png',
      desc: 'The foundation of your financial journey. A secure, accessible account that builds your regular savings habits while earning interest.',
      features: 'Low initial deposit, No monthly maintenance fees, Easy access to funds'
    },
    { 
      id: 5,
      title: 'Rubber Power Loan',   
      type: 'Loan',       
      image: 'https://roaaccugh.com/assets/img/portfolio/RPL.jpg',
      desc: 'Tailored agricultural financing specifically designed to empower rubber farmers to expand their outgrower operations.',
      features: 'Up to GHS 500k capital, Flexible seasonal repayment, Fast processing time'
    }
  ]);

  const filteredProducts = products.filter((p: any) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Savings') return p.type === 'Savings' || p.type === 'Investment';
    if (activeTab === 'Loan') return p.type === 'Loan';
    return true;
  });

  return (
    <>
      <PageHeader 
        title="Our Products" 
        description="Explore our comprehensive suite of tailored financial products designed to support your daily needs, grow your savings, and secure your future."
        badge="Products"
        bgImage="/slider1.jpg"
      />
      
      <main className="section container">
        
        {/* Tab Filters */}
        <RevealOnScroll>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4rem', textAlign: 'center' }}>
            <p className="eyebrow-label">Product Catalog</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', marginBottom: '2rem' }}>Solutions for every milestone</h2>
            
            <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '0.4rem', borderRadius: '100px', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {(['All', 'Savings', 'Loan'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '0.6rem 1.5rem',
                    borderRadius: '100px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: activeTab === tab ? 'var(--primary-color)' : 'transparent',
                    color: activeTab === tab ? 'white' : 'var(--text-muted)',
                    boxShadow: activeTab === tab ? '0 4px 12px rgba(28, 16, 94, 0.2)' : 'none'
                  }}
                >
                  {tab === 'All' ? 'All Products' : tab === 'Savings' ? 'Savings & Investments' : 'Loans & Credit'}
                </button>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product: any, i: number) => {
            const config = typeConfig[product.type] || typeConfig.Savings;
            const featuresList = (product.features || '').split(',').map((f: string) => f.trim()).filter(Boolean);
            
            return (
              <RevealOnScroll key={product.id || i} delay={(i % 3) * 0.1}>
                <div className="premium-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                  
                  {/* Image Area */}
                  <div style={{ position: 'relative', width: '100%', height: '220px', background: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <img src={product.image?.startsWith('http') ? product.image : `http://localhost:3000${product.image}`} alt={product.title} className="animate-float" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply', animationDuration: '4s' }} />
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                      <span className={config.badgeClass}>{config.label}</span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 800 }}>{product.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      {product.desc}
                    </p>

                    {/* Features List */}
                    <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {featuresList.map((feature: string, idx: number) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <CheckCircle2 size={16} color="var(--secondary-color)" style={{ marginTop: '3px', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Button anchored to bottom */}
                    <div style={{ marginTop: 'auto' }}>
                      {product.type === 'Loan' ? (
                        <Link to="/apply-loan" className="btn btn-primary" style={{ width: '100%' }}>
                          Apply for this Loan <ArrowRight size={16} />
                        </Link>
                      ) : (
                        <Link to="/join-now" className="btn btn-outline" style={{ width: '100%' }}>
                          Open Account <ArrowRight size={16} />
                        </Link>
                      )}
                    </div>
                  </div>

                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* Concluding CTA Banner */}
        <RevealOnScroll delay={0.2}>
          <div style={{ marginTop: '6rem', background: 'var(--grad-primary)', borderRadius: 'var(--border-radius-xl)', padding: 'clamp(2.5rem, 5vw, 4rem)', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ color: 'white', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '1rem' }}>Not sure which product is right for you?</h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
                Our financial advisors are here to help you navigate our offerings and find the exact fit for your personal or business goals.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn btn-secondary animate-pulse-secondary" style={{ padding: '0.8rem 2rem' }}>
                  Speak with an Advisor
                </Link>
                <Link to="/faq" className="btn btn-ghost" style={{ padding: '0.8rem 2rem' }}>
                  Read FAQs
                </Link>
              </div>
            </div>
            
            {/* Background design elements */}
            <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-50%', left: '-10%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
          </div>
        </RevealOnScroll>

      </main>
    </>
  );
}
