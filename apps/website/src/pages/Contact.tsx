import { MapPin, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <>
      <PageHeader 
        title="Contact Us" 
        description="We are always here to help. Reach out to us for any inquiries or support." 
        bgImage="/slider2.jpg"
      />
      <main className="section container">
        <div className="grid md:grid-cols-2 gap-8" style={{ marginBottom: '3rem' }}>
          <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div>
              <p className="eyebrow-label">Get In Touch</p>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0' }}>We're here to help</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="card-icon" style={{ marginBottom: 0, flexShrink: 0 }}><MapPin size={20} /></div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>Head Office</p>
                <p className="card-text" style={{ fontSize: '0.9rem' }}>GPS: WH-0010-3904, Agona Ahanta, W/R</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="card-icon" style={{ marginBottom: 0, flexShrink: 0 }}><Mail size={20} /></div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>Email Us</p>
                <a href="mailto:roaaccugh@gmail.com" className="card-text" style={{ fontSize: '0.9rem' }}>roaaccugh@gmail.com</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="card-icon" style={{ marginBottom: 0, flexShrink: 0 }}><Phone size={20} /></div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>Call Us</p>
                <p className="card-text" style={{ fontSize: '0.9rem' }}>+233 248 735 558 / +233 256 111 555</p>
              </div>
            </div>
          </div>
          
          <div className="premium-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>Send Us a Message</h3>
            <form onSubmit={handleSubmit}>
              {status === 'success' && <div style={{ padding: '0.875rem 1rem', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>✓ Message sent successfully!</div>}
              {status === 'error' && <div style={{ padding: '0.875rem 1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>Failed to send. Please try again.</div>}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input type="text" name="name" className="form-control" placeholder="John Doe" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" name="email" className="form-control" placeholder="you@example.com" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input type="text" name="subject" className="form-control" placeholder="How can we help?" required />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea name="message" className="form-control" placeholder="Tell us more..." style={{ minHeight: '130px' }} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6685.527081079046!2d-1.9697251362918713!3d4.89975284526037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfe7851c6cff1513%3A0xb6f8941911dc6de3!2sROAACCU!5e0!3m2!1sen!2sgh!4v1695387942467!5m2!1sen!2sgh" 
          style={{ border: 0, width: '100%', height: '360px', borderRadius: 'var(--border-radius-xl)', display: 'block', marginTop: '2rem' }} 
          loading="lazy" 
          title="Google Maps Location of ROAACCU"
        ></iframe>
      </main>
    </>
  );
}
