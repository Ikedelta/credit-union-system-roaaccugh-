import { Mail, Phone, MapPin, ArrowRight, Globe } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';

interface FooterProps {
  setActiveModal: (modal: string | null) => void;
}

export function Footer({ setActiveModal: _setActiveModal }: FooterProps) {
  const { get, getJSON } = useCMS();

  const socialLinks = getJSON<{platform: string, url: string}[]>('social_links', []);

  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return FaFacebook;
      case 'twitter': 
      case 'x': return FaTwitter;
      case 'instagram': return FaInstagram;
      case 'linkedin': return FaLinkedin;
      case 'youtube': return FaYoutube;
      default: return Globe;
    }
  };

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
              {get('footer_text', 'Building sustainable wealth together.')}
            </p>
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {socialLinks.map(({ platform, url }) => {
                const Icon = getIcon(platform);
                return (
                  <a 
                    key={platform} href={url} aria-label={platform}
                    style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(148,163,184,0.8)', transition: 'all 0.3s ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--grad-primary)'; (e.currentTarget as HTMLAnchorElement).style.color = 'white'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'transparent'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(148,163,184,0.8)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
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
              <span>{get('contact_email', 'info@roaaccugh.com')}</span>
            </div>
            <div className="footer-link">
              <Phone size={16} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
              <span>{get('contact_phone', '+233 24 123 4567')}</span>
            </div>
            <div className="footer-link" style={{ alignItems: 'flex-start' }}>
              <MapPin size={16} style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '2px' }} />
              <span>{get('contact_address', 'Western Region, Ghana')}</span>
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
