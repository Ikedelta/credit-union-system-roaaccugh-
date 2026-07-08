import { ArrowRight, ShieldCheck, TrendingUp, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { useCMS } from '../context/CMSContext';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export function Home() {
  const { get } = useCMS();

  const slides = [
    {
      id: 1,
      image: "/slider1.jpg",
      eyebrow: "Me Daakye Anidaso",
      title: get("home_hero_title", "Your Future Starts Here"),
      subtitle: get("home_hero_subtitle", "Ghana's trusted financial co-operative — built by members, for members. Join over 11,000 people growing together."),
    },
    {
      id: 2,
      image: "/slider2.jpg",
      eyebrow: "Save. Borrow. Grow.",
      title: "Savings That Work As Hard As You Do",
      subtitle: "High-yield savings accounts and low-interest loans designed around your real life goals — not a bank's bottom line.",
    },
    {
      id: 3,
      image: "/slider3.jpg",
      eyebrow: "Business & Personal Loans",
      title: "Capital When Opportunity Knocks",
      subtitle: "Fast-approval loans from GHS 1,000 to GHS 500,000. Competitive rates, flexible terms, local decisions.",
    }
  ];

  return (
    <main className="hero-page">

      {/* ── Hero ── */}
      <section className="hero-section">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          speed={1200}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="hero-swiper"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              {/* Background */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }} />
              {/* Overlay — deeper on left, fades right */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(105deg, rgba(28, 16, 94, 0.95) 0%, rgba(28, 16, 94, 0.6) 55%, rgba(28, 16, 94, 0.2) 100%)',
              }} />

              {/* Content */}
              <div className="container hero-slide-container" style={{ alignItems: 'stretch' }}>
                <div className="hero-slide-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: '60px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p className="hero-slide-eyebrow">
                      {slide.eyebrow}
                    </p>
                    <h1 className="hero-slide-title">
                      {slide.title}
                    </h1>
                    <p className="hero-slide-subtitle" style={{ marginBottom: '2rem' }}>
                      {slide.subtitle}
                    </p>
                  </div>
                  {/* Invisible spacer buttons to reserve exact space in the slide */}
                  <div className="hero-cta" style={{ visibility: 'hidden', pointerEvents: 'none' }}>
                    <Link to="/join-now" className="btn btn-secondary">
                      Become a Member <ArrowRight size={16} />
                    </Link>
                    <Link to="/about" className="btn btn-ghost">
                      Our Story
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Static Buttons Overlay (outside the slider so they don't fade) */}
        <div className="container hero-slide-container" style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none', alignItems: 'stretch' }}>
          <div className="hero-slide-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: '60px' }}>
            <div style={{ flex: 1 }}></div>
            <div className="hero-cta" style={{ pointerEvents: 'auto' }}>
              <Link to="/join-now" className="btn btn-secondary animate-pulse-secondary">
                Become a Member <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="btn btn-ghost">
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section style={{ background: 'var(--primary-color)' }}>
        <div className="container">
          <div className="stats-strip">
            <div className="stat-strip-item">
              <span className="stat-strip-number">11,880</span>
              <span className="stat-strip-label">Members</span>
            </div>
            <div className="stat-strip-divider" />
            <div className="stat-strip-item">
              <span className="stat-strip-number">5</span>
              <span className="stat-strip-label">Branches</span>
            </div>
            <div className="stat-strip-divider" />
            <div className="stat-strip-item">
              <span className="stat-strip-number">GHS 72.2M+</span>
              <span className="stat-strip-label">Total Assets</span>
            </div>
            <div className="stat-strip-divider" />
            <div className="stat-strip-item">
              <span className="stat-strip-number">10+</span>
              <span className="stat-strip-label">Years of Service</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Split ── */}
      <section className="section">
        <div className="container">
          <div className="home-split">
            <RevealOnScroll direction="right">
              <div className="home-split-image" style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(1rem, 5vw, 3rem)' }}>
                <img
                  src="/logo.png"
                  alt="ROAACCU Logo"
                  style={{ objectFit: 'contain', width: '100%', height: '100%', maxHeight: '400px' }}
                />
                <div className="home-split-badge">
                  <strong>Est. 2014</strong>
                  <span>Registered Co-operative</span>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll direction="left" delay={0.15}>
              <div className="home-split-content">
                <p className="eyebrow-label">About ROAACCU</p>
                <h2>Built on trust.<br />Driven by community.</h2>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, margin: '1.5rem 0 2rem', fontSize: '1.05rem' }}>
                  ROAACCU — Road Officers' and Allies' Co-operative Credit Union — is a member-owned financial institution serving Ghanaians with integrity since 2014. We exist to improve our members' financial wellbeing, not to generate profit for shareholders.
                </p>
                <div className="about-features">
                  <div className="about-feature">
                    <ShieldCheck size={20} color="var(--secondary-color)" />
                    <span>Bank of Ghana Licensed</span>
                  </div>
                  <div className="about-feature">
                    <TrendingUp size={20} color="var(--secondary-color)" />
                    <span>Competitive Interest Rates</span>
                  </div>
                  <div className="about-feature">
                    <Users size={20} color="var(--secondary-color)" />
                    <span>Member-Owned & Governed</span>
                  </div>
                </div>
                <Link to="/about" className="btn btn-primary" style={{ marginTop: '2rem' }}>
                  Learn About Us <ChevronRight size={16} />
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ── Services Row ── */}
      <section style={{ background: '#f8f9fc', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container section">
          <RevealOnScroll>
            <div className="services-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem', marginBottom: '4rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p className="eyebrow-label">What We Offer</p>
                <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em', color: 'var(--primary-dark)' }}>
                  Financial tools built for real life.
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '650px', lineHeight: 1.7 }}>
                  Explore our comprehensive suite of products meticulously designed to support your daily needs, grow your savings, and secure your financial future.
                </p>
              </div>
              <Link to="/services" className="btn btn-primary" style={{ padding: '0.85rem 2.5rem', borderRadius: '100px', fontSize: '1.05rem', fontWeight: 600 }}>
                View All Services <ArrowRight size={16} />
              </Link>
            </div>
          </RevealOnScroll>

          <div className="services-row">
            <RevealOnScroll delay={0.05}>
              <Link to="/products" className="service-card">
                <div className="service-card-icon" style={{ background: 'rgba(28, 16, 94, 0.1)', color: 'var(--primary-color)' }}>
                  <TrendingUp size={24} />
                </div>
                <h3>Savings Accounts</h3>
                <p>Susu, Voluntary, Fixed Deposit, Kids' Club — earn while you save with our tiered interest programs.</p>
                <span className="service-card-link">Explore <ArrowRight size={14} /></span>
              </Link>
            </RevealOnScroll>

            <RevealOnScroll delay={0.12}>
              <Link to="/products" className="service-card">
                <div className="service-card-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <ShieldCheck size={24} />
                </div>
                <h3>Loan Products</h3>
                <p>Personal, business, and emergency loans with fast approvals, minimal paperwork, and fair rates.</p>
                <span className="service-card-link">Explore <ArrowRight size={14} /></span>
              </Link>
            </RevealOnScroll>

            <RevealOnScroll delay={0.19}>
              <Link to="/welfare" className="service-card">
                <div className="service-card-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--secondary-color)' }}>
                  <Users size={24} />
                </div>
                <h3>Welfare Support</h3>
                <p>Death benefits, medical support, and social welfare packages that care for members beyond banking.</p>
                <span className="service-card-link">Explore <ArrowRight size={14} /></span>
              </Link>
            </RevealOnScroll>

            <RevealOnScroll delay={0.26}>
              <Link to="/services" className="service-card">
                <div className="service-card-icon" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>
                  <ShieldCheck size={24} />
                </div>
                <h3>Digital Access</h3>
                <p>Check balances, initiate transfers, and access your account via USSD, Ezwich, and ATM 24/7.</p>
                <span className="service-card-link">Explore <ArrowRight size={14} /></span>
              </Link>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="home-cta-section" style={{ position: 'relative', padding: 'clamp(3rem, 8vw, 6rem) 0', backgroundImage: 'url(/slider2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', marginTop: '0' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(28, 16, 94, 0.92)' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <RevealOnScroll>
            <h2 style={{ color: '#fff', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              Join ROAACCU today.<br />
              <span style={{ color: 'var(--secondary-color)' }}>Your money should work for you.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem', lineHeight: 1.7, maxWidth: '640px', margin: '0 auto 2.5rem' }}>
              Membership takes less than 5 minutes. Start with as little as GHS 50 and unlock access to savings, loans, and comprehensive welfare benefits designed for your peace of mind.
            </p>
            <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }} className="cta-button-group">
              <Link to="/join-now" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', justifyContent: 'center', minWidth: '200px' }}>
                Open Membership <ArrowRight size={18} />
              </Link>
              <Link to="/apply-loan" className="btn btn-ghost" style={{ padding: '1rem 2rem', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', border: '2px solid rgba(255,255,255,0.3)', background: 'transparent', justifyContent: 'center', minWidth: '200px' }}>
                Apply for a Loan
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

    </main>
  );
}
