import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';

const typeConfig: Record<string, { label: string; badgeClass: string; bg: string }> = {
  Loan:       { label: 'Loan', badgeClass: 'type-badge type-badge-loan',       bg: 'rgba(11, 63, 143, 0.04)' },
  Savings:    { label: 'Savings', badgeClass: 'type-badge type-badge-savings', bg: 'rgba(245, 158, 11, 0.04)' },
  Investment: { label: 'Investment', badgeClass: 'type-badge type-badge-investment', bg: 'rgba(11, 63, 143, 0.04)' },
};

export function Products() {
  const products = [
    { title: 'Prime Savings',       type: 'Investment', img: 'https://roaaccugh.com/assets/img/portfolio/ps.png' },
    { title: 'Member Savings',      type: 'Savings',    img: 'https://roaaccugh.com/assets/img/portfolio/ms.png' },
    { title: 'Smart Savings',       type: 'Savings',    img: 'https://roaaccugh.com/assets/img/portfolio/ss.png' },
    { title: 'Mbofora Daakye',      type: 'Savings',    img: 'https://roaaccugh.com/assets/img/portfolio/md.png' },
    { title: 'Rubber Power Loan',   type: 'Loan',       img: 'https://roaaccugh.com/assets/img/portfolio/RPL.jpg' },
    { title: 'Akatua Mpontu Loan',  type: 'Loan',       img: 'https://roaaccugh.com/assets/img/portfolio/AML.jpeg' },
    { title: 'Direct Sales Loan',   type: 'Loan',       img: 'https://roaaccugh.com/assets/img/portfolio/dsl.png' },
    { title: 'Short Term Loan',     type: 'Loan',       img: 'https://roaaccugh.com/assets/img/portfolio/stl.png' },
  ];

  return (
    <>
      <PageHeader 
        title="Our Products" 
        description="Feel free to patronize our varieties of tailored financial products designed for every stage of your life."
        badge="Products"
      />
      <main className="section container">
        <RevealOnScroll>
          <div style={{ marginBottom: '3rem' }}>
            <p className="eyebrow-label">Our Portfolio</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '0.75rem' }}>Products for Every Goal</h2>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <span className="type-badge type-badge-savings">Savings</span>
              <span className="type-badge type-badge-loan">Loan</span>
              <span className="type-badge type-badge-investment">Investment</span>
            </div>
          </div>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => {
            const config = typeConfig[product.type] || typeConfig.Savings;
            return (
              <RevealOnScroll key={i} delay={i * 0.08}>
                <div className="premium-card text-center" style={{ padding: '0', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', width: '100%', height: '220px', background: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={product.img} alt={product.title} style={{ width: '75%', height: '75%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                      <span className={config.badgeClass}>{config.label}</span>
                    </div>
                  </div>
                  <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '1.25rem', fontWeight: 800 }}>{product.title}</h3>
                    {product.type === 'Loan' ? (
                      <Link to="/apply-loan" className="btn btn-primary" style={{ width: '100%' }}>Apply Now</Link>
                    ) : (
                      <button className="btn btn-outline" style={{ width: '100%' }}>Learn More</button>
                    )}
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </main>
    </>
  );
}
