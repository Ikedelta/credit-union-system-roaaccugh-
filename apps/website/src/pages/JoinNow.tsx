import { useState } from 'react';
import { ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';

export function JoinNow() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      
      const response = await fetch('http://localhost:3000/api/join', {
        method: 'POST',
        body: formData,
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
        title="Join ROAACCU" 
        description="Become a member today and unlock a world of financial opportunities and growth." 
      />
      <main className="section container">
        <RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }} className="split-layout">
            
            {/* Sticky Sidebar - Left Column */}
            <div className="split-sidebar">
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>Join the ROAACCU Family</h2>
                <p className="card-text" style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
                  Unlock a world of financial opportunities. By joining us, you aren't just opening an account—you are becoming a shareholder in a thriving co-operative.
                </p>

                <img 
                  src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Happy ROAACCU Members" 
                  style={{ width: '100%', borderRadius: 'var(--border-radius-xl)', boxShadow: 'var(--shadow-md)', marginBottom: '2.5rem', objectFit: 'cover', maxHeight: '240px' }} 
                />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2.5rem' }}>
                  <div className="flex gap-4">
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--secondary-color)', padding: '1rem', borderRadius: '12px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShieldCheck size={28} /></div>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', color: 'var(--primary-color)' }}>Secure Deposits</h4>
                      <p className="card-text" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>Your savings are protected with top-tier security standards and encrypted infrastructure.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div style={{ background: 'rgba(11, 63, 143, 0.1)', color: 'var(--primary-color)', padding: '1rem', borderRadius: '12px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={28} /></div>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', color: 'var(--primary-color)' }}>Fast Processing</h4>
                      <p className="card-text" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>Membership approval is seamlessly processed and typically completed within 24 hours.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '12px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle size={28} /></div>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', color: 'var(--primary-color)' }}>Instant Loan Eligibility</h4>
                      <p className="card-text" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>Start building your financial credit immediately to secure future loans for your business.</p>
                    </div>
                  </div>
                </div>
            </div>

            {/* Form Area - Right Column */}
            <div className="split-form">
              <div className="premium-card">
                <form onSubmit={handleSubmit}>
                  {status === 'success' && <div style={{ padding: '1rem', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={20} /> Membership application submitted successfully!</div>}
                  {status === 'error' && <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '1.5rem' }}>Failed to submit application. Please try again.</div>}
                  
                  <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid rgba(11, 63, 143, 0.1)', fontSize: '1.2rem' }}>1. Personal Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input type="text" name="firstName" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input type="text" name="lastName" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mobile Number</label>
                      <input type="tel" name="telNo" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Marital Status</label>
                      <select name="maritalStatus" className="form-control" required>
                        <option value="">Select Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input type="date" name="dateOfBirth" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Occupation</label>
                      <input type="text" name="occupation" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Town / Location</label>
                      <input type="text" name="residentialAddress" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input type="email" name="email" className="form-control" required />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginTop: '0.5rem' }}>
                    <label className="form-label">Postal Address</label>
                    <textarea name="postalAddress" className="form-control" style={{ minHeight: '100px' }} required></textarea>
                  </div>

                  <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', marginTop: '3rem', paddingBottom: '0.75rem', borderBottom: '2px solid rgba(11, 63, 143, 0.1)', fontSize: '1.2rem' }}>2. Beneficiaries</h3>
                  
                  <div className="grid md:grid-cols-3 gap-5" style={{ marginBottom: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Beneficiary 1 Name</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Relationship</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Share (%)</label>
                      <input type="number" className="form-control" required />
                    </div>
                  </div>

                  <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', marginTop: '3rem', paddingBottom: '0.75rem', borderBottom: '2px solid rgba(11, 63, 143, 0.1)', fontSize: '1.2rem' }}>3. Identification</h3>
                  
                  <div className="form-group">
                    <label className="form-label">Ghana Card Number</label>
                    <input type="text" className="form-control" required />
                  </div>
                  <div className="grid md:grid-cols-2 gap-5" style={{ marginTop: '0.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Upload Card (Front)</label>
                      <div style={{ border: '2px dashed rgba(11, 63, 143, 0.2)', padding: '2rem', borderRadius: '12px', textAlign: 'center', backgroundColor: '#f8fafc', transition: 'var(--transition)' }}>
                        <input type="file" name="ghanaCardFront" style={{ width: '100%' }} accept=".jpg,.png,.jpeg,.webp" required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Upload Card (Back)</label>
                      <div style={{ border: '2px dashed rgba(11, 63, 143, 0.2)', padding: '2rem', borderRadius: '12px', textAlign: 'center', backgroundColor: '#f8fafc', transition: 'var(--transition)' }}>
                        <input type="file" name="ghanaCardBack" style={{ width: '100%' }} accept=".jpg,.png,.jpeg,.webp" required />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1rem' }} disabled={status === 'loading'}>
                    {status === 'loading' ? 'Submitting Application...' : 'Submit Membership Application'}
                  </button>
                  <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={16} style={{ color: 'var(--primary-light)' }} />
                    Your information is securely encrypted and strictly confidential.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </main>
    </>
  );
}
