import { useState, useEffect } from 'react';
import { X, Menu, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  setActiveModal: (modal: string | null) => void;
}

export function Navbar({ setActiveModal: _setActiveModal }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const toggleDropdown = (name: string, e: React.MouseEvent) => {
    if (window.innerWidth <= 1024) {
      e.preventDefault();
      setActiveDropdown(activeDropdown === name ? null : name);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <div className="header-wrapper">
        <header className="header modern-header">
          <div className="container flex justify-between items-center" style={{ width: '100%' }}>
            <Link to="/" className="logo" style={{ color: 'var(--secondary-color)', zIndex: 1001 }}>
              <img src="/logo.png" alt="ROAACCU Logo" style={{ height: '48px', objectFit: 'contain' }} />
            </Link>

            <button 
              className="mobile-menu-btn" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
              <Link to="/" className="nav-link">Home</Link>
              <div className={`dropdown ${activeDropdown === 'about' ? 'open' : ''}`}>
                <div className="nav-link dropdown-toggle" onClick={(e) => toggleDropdown('about', e)}>
                  About <ChevronDown size={16} className={`dropdown-icon ${activeDropdown === 'about' ? 'rotate' : ''}`} />
                </div>
                <div className="dropdown-content">
                  <Link to="/about" className="nav-link">About Us</Link>
                  <Link to="/board-and-management" className="nav-link">Leadership</Link>
                  <Link to="/branches" className="nav-link">Branches</Link>
                  <Link to="/faq" className="nav-link">FAQ</Link>
                </div>
              </div>
              <Link to="/services" className="nav-link">Services</Link>
              <Link to="/products" className="nav-link">Products</Link>
              
              <div className={`dropdown ${activeDropdown === 'gallery' ? 'open' : ''}`}>
                <div className="nav-link dropdown-toggle" onClick={(e) => toggleDropdown('gallery', e)}>
                  Media <ChevronDown size={16} className={`dropdown-icon ${activeDropdown === 'gallery' ? 'rotate' : ''}`} />
                </div>
                <div className="dropdown-content">
                  <Link to="/bylaw" className="nav-link">By Law</Link>
                  <Link to="/operational-policy" className="nav-link">Operational Policy</Link>
                  <Link to="/photo-gallery" className="nav-link">Photo Gallery</Link>
                  <Link to="/videos" className="nav-link">Videos</Link>
                  <Link to="/organogram" className="nav-link">Organogram</Link>
                  <Link to="/events" className="nav-link">Events</Link>
                  <Link to="/agm" className="nav-link">AGM Report</Link>
                </div>
              </div>

              <Link to="/news" className="nav-link">News & Blog</Link>
              
              <div className={`dropdown ${activeDropdown === 'member' ? 'open' : ''}`}>
                <div className="nav-link dropdown-toggle" onClick={(e) => toggleDropdown('member', e)}>
                  Shareholder <ChevronDown size={16} className={`dropdown-icon ${activeDropdown === 'member' ? 'rotate' : ''}`} />
                </div>
                <div className="dropdown-content">
                  <Link to="/apply-loan" className="nav-link">Apply Loan</Link>
                  <Link to="/welfare" className="nav-link">Welfare</Link>
                </div>
              </div>

              <Link to="/contact" className="nav-link">Contact</Link>
              
              <div className="nav-actions flex items-center gap-4" style={{ marginLeft: 'auto' }}>
                <Link to="/join-now" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', borderRadius: '100px', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px', fontWeight: 600 }}>Join Now</Link>
              </div>
            </nav>
          </div>
        </header>
      </div>
    </>
  );
}
