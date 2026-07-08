import { Mail, Phone, MapPin, ArrowRight, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  setActiveModal: (modal: string | null) => void;
}

export function Footer({ setActiveModal }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8" style={{ paddingBottom: '3rem' }}>
          {/* Brand Column */}
          <div>
            <div className="logo" style={{ marginBottom: '1.25rem' }}>
              <img 
                src="/logo.png" 
                alt="ROAACCU Logo" 
                style={{ height: '44px', objectFit: 'contain', background: 'white', padding: '6px 10px', borderRadius: '10px' }} 
              />
            </div>
            <p style={{ color: 'rgba(148, 163, 184, 0.8)', marginBottom: '1.5rem', lineHeight: 1.8, fontSize: '0.9rem' }}>
              ROAA Co-operative Credit Union Ltd.<br/>
              <em style={{ color: 'var(--accent-gold)' }}>Me Daakye Anidaso.</em>
            </p>
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { icon: Globe,  href: '#', label: 'Website' },
              ].map(({ icon: Icon, href, label }) => (
                <a 
                  key={label} href={href} aria-label={label}
                  style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(148,163,184,0.8)', transition: 'all 0.3s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--grad-primary)'; (e.currentTarget as HTMLAnchorElement).style.color = 'white'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'transparent'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(148,163,184,0.8)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3>Quick Links</h3>
            {[
              { to: '/', label: 'Home' },
              { to: '/about', label: 'About' },
              { to: '/branches', label: 'Branches' },
              { to: '/services', label: 'Services' },
              { to: '/products', label: 'Products' },
              { to: '/faq', label: 'FAQ' },
              { to: '/contact', label: 'Contact' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="footer-link">
                <ArrowRight size={12} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
                {label}
              </Link>
            ))}
          </div>

          {/* Member Access */}
          <div>
            <h3>Member Access</h3>
            <button 
              onClick={() => setActiveModal('balance')} 
              className="footer-link" 
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.9rem', width: '100%', textAlign: 'left' }}
            >
              <ArrowRight size={12} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
              Check Balance
            </button>
            <button 
              onClick={() => setActiveModal('deposit')} 
              className="footer-link" 
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.9rem', width: '100%', textAlign: 'left', marginTop: 0 }}
            >
              <ArrowRight size={12} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
              Deposit Funds
            </button>
            {[
              { to: '/apply-loan', label: 'Apply for Loan' },
              { to: '/welfare', label: 'Join Welfare' },
              { to: '/join-now', label: 'Join Now' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="footer-link">
                <ArrowRight size={12} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                {label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h3>Contact Us</h3>
            <div className="footer-link" style={{ alignItems: 'flex-start' }}>
              <Mail size={16} style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '2px' }} />
              <span>roaaccugh@gmail.com</span>
            </div>
            <div className="footer-link">
              <Phone size={16} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
              <span>+233 262 671 616</span>
            </div>
            <div className="footer-link" style={{ alignItems: 'flex-start' }}>
              <MapPin size={16} style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '2px' }} />
              <span>Ghana, West Africa</span>
            </div>

            {/* CTA */}
            <Link 
              to="/join-now" 
              className="btn btn-primary" 
              style={{ marginTop: '1.5rem', width: '100%', fontSize: '0.85rem' }}
            >
              Join Today
            </Link>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} <strong>ROAACCU</strong> — ROAA Co-operative Credit Union Ltd. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
