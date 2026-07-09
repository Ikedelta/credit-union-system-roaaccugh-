import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';

export function Welfare() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      
      const response = await fetch('/api/welfare', {
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
        title="Welfare Benefits" 
        description="Comprehensive support designed to provide peace of mind and financial security for you and your family."
        badge="Welfare"
        bgImage="/slider1.jpg"
      />
      <main className="section container">
        <div className="premium-card form-wizard-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <form onSubmit={handleSubmit}>
          
          {status === 'success' && <div style={{ padding: '1rem', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600 }}>✓ Application submitted successfully! We will contact you soon.</div>}
          {status === 'error' && <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600 }}>Failed to submit application. Please try again.</div>}
          
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Personal Information</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Account Number</label>
              <input type="number" name="accountNumber" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" name="name" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Contact</label>
              <input type="text" name="contact" className="form-control" required />
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
          </div>

          <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', marginTop: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Personal Identification</h3>
          
          <div className="form-group">
            <label className="form-label">Your Ghana Card Number</label>
            <input type="text" name="ghanaCardNumber" className="form-control" required />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Upload Card (Front)</label>
              <input type="file" name="ghanaCardFront" className="form-control" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} accept=".jpg,.png,.jpeg,.webp" required />
            </div>
            <div className="form-group">
              <label className="form-label">Upload Card (Back)</label>
              <input type="file" name="ghanaCardBack" className="form-control" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} accept=".jpg,.png,.jpeg,.webp" required />
            </div>
          </div>

          <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', marginTop: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Beneficiary Details</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Beneficiary's Name</label>
              <input type="text" name="beneficiaryName" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Beneficiary's Ghana Card Number</label>
              <input type="text" name="beneficiaryGhanaCard" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Upload Beneficiary Card (Front)</label>
              <input type="file" name="beneficiaryCardFront" className="form-control" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} accept=".jpg,.png,.jpeg,.webp" required />
            </div>
            <div className="form-group">
              <label className="form-label">Upload Beneficiary Card (Back)</label>
              <input type="file" name="beneficiaryCardBack" className="form-control" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} accept=".jpg,.png,.jpeg,.webp" required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }} disabled={status === 'loading'}>
            {status === 'loading' ? 'Submitting...' : 'Apply for Welfare'}
          </button>
        </form>
        </div>
      </main>
    </>
  );
}
