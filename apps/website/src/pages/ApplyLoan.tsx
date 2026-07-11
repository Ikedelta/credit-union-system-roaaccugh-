import { useState, useRef } from 'react';
import { ShieldCheck, CalendarCheck, TrendingDown, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';

export function ApplyLoan() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [step, setStep] = useState(1);
  const formRef = useRef<HTMLFormElement>(null);

  const nextStep = () => {
    if (formRef.current) {
      const inputs = Array.from(formRef.current.querySelectorAll(`input[required]:not([disabled]), select[required]:not([disabled]), textarea[required]:not([disabled])`)) as HTMLInputElement[];
      const currentStepInputs = inputs.filter(input => input.closest('.wizard-step-content[style*="display: block"]'));
      
      let isValid = true;
      currentStepInputs.forEach(input => {
        if (!input.checkValidity()) {
          input.reportValidity();
          isValid = false;
        }
      });
      if (isValid) setStep(s => Math.min(3, s + 1));
    }
  };

  const prevStep = () => {
    setStep(s => Math.max(1, s - 1));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const response = await fetch('/api/loan', {
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
        title="Apply for a Loan"
        description="Experience flexible repayment terms and low-interest rates designed to help you succeed."
        badge="Member Loans"
        bgImage="/slider3.jpg"
      />
      <main className="section container">
        <RevealOnScroll>
          <div className="split-layout">

            {/* ── Left Sidebar ── */}
            <div className="split-sidebar">
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                Empower Your Goals
              </h2>
              <p className="card-text" style={{ marginBottom: '2rem', fontSize: '1.1rem', lineHeight: 1.7 }}>
                Whether you're expanding a business, building a home, or dealing with an emergency,
                we provide tailored financial support to get you there.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div className="card-icon" style={{ width: '48px', height: '48px', flexShrink: 0, marginBottom: 0, borderRadius: '14px' }}>
                    <TrendingDown size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Low Interest Rates</h4>
                    <p className="card-text" style={{ fontSize: '0.9rem' }}>Enjoy some of the most competitive rates available in the region.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div className="card-icon emerald" style={{ width: '48px', height: '48px', flexShrink: 0, marginBottom: 0, borderRadius: '14px' }}>
                    <CalendarCheck size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Flexible Repayments</h4>
                    <p className="card-text" style={{ fontSize: '0.9rem' }}>We structure your payment plan around your cash flow and capabilities.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div className="card-icon gold" style={{ width: '48px', height: '48px', flexShrink: 0, marginBottom: 0, borderRadius: '14px' }}>
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>No Hidden Fees</h4>
                    <p className="card-text" style={{ fontSize: '0.9rem' }}>Total transparency in every agreement with no surprise charges.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Form ── */}
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
                        {num === 1 ? 'Personal' : num === 2 ? 'Loan Details' : 'Identity'}
                      </span>
                    </div>
                  ))}
                </div>

                <form ref={formRef} onSubmit={handleSubmit}>

                  {status === 'success' && (
                    <div style={{ padding: '1rem', background: '#dcfce7', color: '#166534', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle size={20} /> Loan application submitted successfully!
                    </div>
                  )}
                  {status === 'error' && (
                    <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '12px', marginBottom: '1.5rem' }}>
                      Failed to submit loan application. Please try again.
                    </div>
                  )}

                  {/* Section 1 */}
                  <div style={{ display: step === 1 ? 'block' : 'none' }} className="wizard-step-content">
                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', fontSize: '1.4rem' }}>Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Account Number</label>
                      <input type="number" name="accountNumber" className="form-control" required={step === 1} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input type="text" name="fullName" className="form-control" required={step === 1} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Contact Number</label>
                      <input type="text" name="telNo" className="form-control" required={step === 1} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Marital Status</label>
                      <input type="text" name="maritalStatus" className="form-control" required={step === 1} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Occupation</label>
                      <input type="text" name="occupation" className="form-control" required={step === 1} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Town / Location</label>
                      <input type="text" name="townLocation" className="form-control" required={step === 1} />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">GPS Address</label>
                      <input type="text" name="gpsAddress" className="form-control" required={step === 1} />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label className="form-label">Direction to House</label>
                    <textarea name="directionToHouse" className="form-control" style={{ minHeight: '80px' }} required={step === 1}></textarea>
                    </div>
                    
                    <div className="wizard-actions" style={{ justifyContent: 'flex-end' }}>
                      <button type="button" className="btn btn-primary" onClick={nextStep}>
                        Next Step <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div style={{ display: step === 2 ? 'block' : 'none' }} className="wizard-step-content">
                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', fontSize: '1.4rem' }}>Loan Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Loan Amount (GHS)</label>
                      <input type="number" name="amount" className="form-control" required={step === 2} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Duration (in months)</label>
                      <input type="number" name="durationMonths" className="form-control" required={step === 2} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Monthly Payment Capability</label>
                      <input type="number" name="monthlyPayment" className="form-control" required={step === 2} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">When do you need it?</label>
                      <input type="date" name="dateNeeded" className="form-control" required={step === 2} />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label className="form-label">Purpose of the Loan</label>
                    <textarea name="purpose" className="form-control" style={{ minHeight: '80px' }} required={step === 2}></textarea>
                    </div>
                    
                    <div className="wizard-actions">
                      <button type="button" className="btn btn-outline" onClick={prevStep}>
                        <ArrowLeft size={16} /> Previous
                      </button>
                      <button type="button" className="btn btn-primary" onClick={nextStep}>
                        Next Step <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div style={{ display: step === 3 ? 'block' : 'none' }} className="wizard-step-content">
                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', fontSize: '1.4rem' }}>Identification</h3>
                    <div className="form-group">
                      <label className="form-label">Ghana Card Number</label>
                      <input type="text" name="ghanaCardNumber" className="form-control" required={step === 3} />
                    </div>


                    <div className="wizard-actions">
                      <button type="button" className="btn btn-outline" onClick={prevStep} disabled={status === 'loading'}>
                        <ArrowLeft size={16} /> Previous
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
                        {status === 'loading' ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </div>
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
