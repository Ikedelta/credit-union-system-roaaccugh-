import { useState, useRef } from 'react';
import { ShieldCheck, Clock, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';

export function JoinNow() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [step, setStep] = useState(1);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }

    setStatus('loading');
    
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      
      const response = await fetch('/api/join', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
        setStep(1);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const nextStep = () => {
    if (formRef.current) {
      if (formRef.current.checkValidity()) {
        setStep(s => Math.min(3, s + 1));
      } else {
        formRef.current.reportValidity();
      }
    }
  };

  const prevStep = () => {
    setStep(s => Math.max(1, s - 1));
  };

  return (
    <>
      <PageHeader 
        title="Join ROAACCU" 
        description="Become a member today and unlock a world of financial opportunities and growth." 
        bgImage="/slider2.jpg"
      />
      <main className="section container">
        <RevealOnScroll>
          <div className="split-layout">
            
            {/* Sticky Sidebar - Left Column */}
            <div className="split-sidebar">
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>Join the ROAACCU Family</h2>
                <p className="card-text" style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
                  Unlock a world of financial opportunities. By joining us, you aren't just opening an account—you are becoming a shareholder in a thriving co-operative.
                </p>

                <div className="premium-card" style={{ padding: '2rem', background: '#f8fafc', borderColor: 'rgba(28, 16, 94, 0.05)', boxShadow: 'none' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Why Choose ROAACCU?</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="flex gap-4">
                      <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--secondary-color)', padding: '0.8rem', borderRadius: '12px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShieldCheck size={24} /></div>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem', color: 'var(--primary-color)' }}>Secure Deposits</h4>
                        <p className="card-text" style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>Your savings are protected with top-tier security standards and encrypted infrastructure.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div style={{ background: 'rgba(28, 16, 94, 0.1)', color: 'var(--primary-color)', padding: '0.8rem', borderRadius: '12px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={24} /></div>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem', color: 'var(--primary-color)' }}>Fast Processing</h4>
                        <p className="card-text" style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>Membership approval is seamlessly processed and typically completed within 24 hours.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.8rem', borderRadius: '12px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle size={24} /></div>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem', color: 'var(--primary-color)' }}>Instant Loan Eligibility</h4>
                        <p className="card-text" style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>Start building your financial credit immediately to secure future loans for your business.</p>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

            {/* Form Area - Right Column */}
            <div className="split-form">
              <div className="premium-card form-wizard-card">
                
                {/* Wizard Header Progress */}
                <div className="wizard-header">
                  <div className="wizard-progress-track">
                    <div className="wizard-progress-fill" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
                  </div>
                  {[1, 2, 3].map((num) => (
                    <div key={num} className={`wizard-step-indicator ${step === num ? 'active' : ''} ${step > num ? 'completed' : ''}`}>
                      <div className="wizard-step-circle">
                        {step > num ? <CheckCircle size={20} /> : num}
                      </div>
                      <span className="wizard-step-label">
                        {num === 1 ? 'Personal' : num === 2 ? 'Beneficiaries' : 'Identity'}
                      </span>
                    </div>
                  ))}
                </div>

                <form ref={formRef} onSubmit={handleSubmit}>
                  {status === 'success' && <div style={{ padding: '1rem', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={20} /> Membership application submitted successfully!</div>}
                  {status === 'error' && <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '1.5rem' }}>Failed to submit application. Please try again.</div>}
                  
                  {/* STEP 1: Personal Info */}
                  <div style={{ display: step === 1 ? 'block' : 'none' }} className="wizard-step-content premium-card">
                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', fontSize: '1.4rem' }}>Personal Information</h3>
                    <div className="form-grid form-grid-2">
                      <div className="form-group">
                        <label className="form-label">First Name</label>
                        <input type="text" name="firstName" className="form-control" placeholder="Kofi" required={step === 1} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Last Name</label>
                        <input type="text" name="lastName" className="form-control" placeholder="Asante" required={step === 1} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Mobile Number</label>
                        <input type="tel" name="telNo" className="form-control" required={step === 1} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Marital Status</label>
                        <select name="maritalStatus" className="form-control" required={step === 1}>
                          <option value="">Select Status</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Date of Birth</label>
                        <input type="date" name="dateOfBirth" className="form-control" required={step === 1} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Occupation</label>
                        <input type="text" name="occupation" className="form-control" required={step === 1} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Town / Location</label>
                        <input type="text" name="residentialAddress" className="form-control" required={step === 1} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" name="email" className="form-control" required={step === 1} />
                      </div>
                    </div>
                    <div className="form-group form-group-full">
                      <label className="form-label">Postal Address</label>
                      <textarea name="postalAddress" className="form-control" style={{ minHeight: '100px' }} required={step === 1}></textarea>
                    </div>
                  </div>

                  {/* STEP 2: Beneficiaries */}
                  <div style={{ display: step === 2 ? 'block' : 'none' }} className="wizard-step-content premium-card">
                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', fontSize: '1.4rem' }}>Beneficiaries</h3>
                    <div className="form-grid form-grid-2" style={{ marginBottom: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Beneficiary 1 Name</label>
                        <input type="text" name="beneficiary1Name" className="form-control" placeholder="Kofi Asante" required={step === 2} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Relationship</label>
                        <input type="text" name="beneficiary1Rel" className="form-control" required={step === 2} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Share (%)</label>
                        <input type="number" name="beneficiary1Share" className="form-control" required={step === 2} />
                      </div>
                    </div>
                  </div>

                  {/* STEP 3: Identification */}
                  <div style={{ display: step === 3 ? 'block' : 'none' }} className="wizard-step-content premium-card">
                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', fontSize: '1.4rem' }}>Identification</h3>
                    <div className="form-group">
                      <label className="form-label">Ghana Card Number</label>
                      <input type="text" name="ghanaCardNo" className="form-control" required={step === 3} />
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <ShieldCheck size={16} style={{ color: 'var(--primary-light)' }} />
                      Your information is securely encrypted and strictly confidential.
                    </p>
                  </div>

                  {/* Navigation Actions */}
                  <div className="wizard-actions">
                    <button 
                      type="button" 
                      className="btn btn-ghost" 
                      onClick={prevStep} 
                      style={{ visibility: step > 1 ? 'visible' : 'hidden', gap: '0.5rem' }}
                    >
                      <ArrowLeft size={18} /> Back
                    </button>
                    
                    {step < 3 ? (
                      <button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={nextStep}
                        style={{ gap: '0.5rem' }}
                      >
                        Next Step <ArrowRight size={18} />
                      </button>
                    ) : (
                      <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={status === 'loading'}
                        style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
                      >
                        {status === 'loading' ? 'Submitting...' : 'Complete Application'}
                      </button>
                    )}
                  </div>
                  
                </form>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </main>
    </>
  );
}
