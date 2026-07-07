import { ArrowRight, ShieldCheck, TrendingUp, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { RevealOnScroll } from '../components/RevealOnScroll';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export function Home() {
  const slides = [
    {
      id: 1,
      image: "/slider1.jpg",
      eyebrow: "Me Daakye Anidaso",
      title: "Your Future Starts Here",
      subtitle: "Ghana's trusted financial co-operative — built by members, for members. Join over 11,000 people growing together.",
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
              <div className="container hero-slide-container">
                <div className="hero-slide-content">
                  <p className="hero-slide-eyebrow">
                    {slide.eyebrow}
                  </p>
                  <h1 className="hero-slide-title">
                    {slide.title}
                  </h1>
                  <p className="hero-slide-subtitle">
                    {slide.subtitle}
                  </p>
                  <div className="hero-cta">
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
              <div className="home-split-image">
                <img
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                  alt="ROAACCU members in a financial meeting"
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
            <div className="services-header">
              <div>
                <p className="eyebrow-label">What We Offer</p>
                <h2>Financial tools<br />built for real life.</h2>
              </div>
              <Link to="/services" className="btn btn-outline">View All Services <ArrowRight size={15} /></Link>
            </div>
          </RevealOnScroll>

          <div className="services-row">
            <RevealOnScroll delay={0.05}>
              <Link to="/products" className="service-card">
                <div className="service-card-icon">
                  <TrendingUp size={22} />
                </div>
                <h3>Savings Accounts</h3>
                <p>Susu, Voluntary, Fixed Deposit, Kids' Club — earn while you save with our tiered interest programs.</p>
                <span className="service-card-link">Explore <ArrowRight size={14} /></span>
              </Link>
            </RevealOnScroll>

            <RevealOnScroll delay={0.12}>
              <Link to="/products" className="service-card">
                <div className="service-card-icon">
                  <ShieldCheck size={22} />
                </div>
                <h3>Loan Products</h3>
                <p>Personal, business, and emergency loans with fast approvals, minimal paperwork, and fair rates.</p>
                <span className="service-card-link">Explore <ArrowRight size={14} /></span>
              </Link>
            </RevealOnScroll>

            <RevealOnScroll delay={0.19}>
              <Link to="/welfare" className="service-card">
                <div className="service-card-icon">
                  <Users size={22} />
                </div>
                <h3>Welfare Support</h3>
                <p>Death benefits, medical support, and social welfare packages that care for members beyond banking.</p>
                <span className="service-card-link">Explore <ArrowRight size={14} /></span>
              </Link>
            </RevealOnScroll>

            <RevealOnScroll delay={0.26}>
              <Link to="/services" className="service-card">
                <div className="service-card-icon">
                  <ShieldCheck size={22} />
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
      <section className="home-cta-section">
        <div className="container">
          <div className="home-cta-inner">
            <RevealOnScroll>
              <div>
                <h2 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem' }}>
                  Join ROAACCU today.<br />
                  <span style={{ color: 'var(--secondary-color)' }}>Your money should work for you.</span>
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '480px' }}>
                  Membership takes less than 5 minutes. Start with as little as GHS 50 and unlock access to savings, loans, and welfare benefits.
                </p>
              </div>
              <div className="home-cta-actions">
                <Link to="/join-now" className="btn btn-secondary">
                  Open Membership <ArrowRight size={16} />
                </Link>
                <Link to="/apply-loan" className="btn btn-ghost">
                  Apply for a Loan
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

    </main>
  );
}
