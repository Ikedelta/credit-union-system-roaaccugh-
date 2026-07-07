import { useState } from 'react';
import { ShieldCheck, CalendarCheck, TrendingDown, CheckCircle } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';

export function ApplyLoan() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const response = await fetch('http://localhost:3000/api/loan', {
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
              <div className="premium-card">
                <form onSubmit={handleSubmit}>

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
                  <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--border-color)' }}>
                    1. Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Account Number</label>
                      <input type="number" name="accountNumber" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input type="text" name="fullName" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Contact Number</label>
                      <input type="text" name="telNo" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Marital Status</label>
                      <input type="text" name="maritalStatus" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Occupation</label>
                      <input type="text" name="occupation" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Town / Location</label>
                      <input type="text" name="townLocation" className="form-control" required />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">GPS Address</label>
                      <input type="text" name="gpsAddress" className="form-control" required />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label className="form-label">Direction to House</label>
                    <textarea name="directionToHouse" className="form-control" style={{ minHeight: '80px' }} required></textarea>
                  </div>

                  {/* Section 2 */}
                  <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', marginTop: '2.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--border-color)' }}>
                    2. Loan Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Loan Amount (GHS)</label>
                      <input type="number" name="amount" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Duration (in months)</label>
                      <input type="number" name="durationMonths" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Monthly Payment Capability</label>
                      <input type="number" name="monthlyPayment" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">When do you need it?</label>
                      <input type="date" name="dateNeeded" className="form-control" />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label className="form-label">Purpose of the Loan</label>
                    <textarea name="purpose" className="form-control" style={{ minHeight: '80px' }} required></textarea>
                  </div>

                  {/* Section 3 */}
                  <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', marginTop: '2.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--border-color)' }}>
                    3. Identification
                  </h3>
                  <div className="form-group">
                    <label className="form-label">Ghana Card Number</label>
                    <input type="text" name="ghanaCardNumber" className="form-control" required />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4" style={{ marginTop: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Upload Card (Front)</label>
                      <div style={{ border: '2px dashed #cbd5e1', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                        <input type="file" name="ghanaCardFront" style={{ width: '100%' }} accept=".jpg,.png,.jpeg,.webp" required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Upload Card (Back)</label>
                      <div style={{ border: '2px dashed #cbd5e1', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                        <input type="file" name="ghanaCardBack" style={{ width: '100%' }} accept=".jpg,.png,.jpeg,.webp" required />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '2rem' }}
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Submitting...' : 'Submit Loan Application'}
                  </button>

                </form>
              </div>
            </div>

          </div>
        </RevealOnScroll>
      </main>
    </>
  );
}
