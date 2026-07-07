import { PageHeader } from '../components/PageHeader';

export function Welfare() {
  return (
    <>
      <PageHeader
        title="Welfare Application"
        description="Join the ROAACCU welfare scheme for a secure future."
        badge="Welfare"
      />
      <main className="section container">
        <div className="premium-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <form onSubmit={(e) => { e.preventDefault(); alert("Welfare Application submitted!"); }}>
          
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Personal Information</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Account Number</label>
              <input type="number" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Contact</label>
              <input type="text" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Marital Status</label>
              <input type="text" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Occupation</label>
              <input type="text" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Town / Location</label>
              <input type="text" className="form-control" required />
            </div>
          </div>

          <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', marginTop: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Personal Identification</h3>
          
          <div className="form-group">
            <label className="form-label">Your Ghana Card Number</label>
            <input type="text" className="form-control" required />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Upload Card (Front)</label>
              <input type="file" className="form-control" accept=".jpg,.png,.jpeg,.webp" required />
            </div>
            <div className="form-group">
              <label className="form-label">Upload Card (Back)</label>
              <input type="file" className="form-control" accept=".jpg,.png,.jpeg,.webp" required />
            </div>
          </div>

          <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', marginTop: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Beneficiary Details</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Beneficiary's Name</label>
              <input type="text" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Beneficiary's Ghana Card Number</label>
              <input type="text" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Upload Beneficiary Card (Front)</label>
              <input type="file" className="form-control" accept=".jpg,.png,.jpeg,.webp" required />
            </div>
            <div className="form-group">
              <label className="form-label">Upload Beneficiary Card (Back)</label>
              <input type="file" className="form-control" accept=".jpg,.png,.jpeg,.webp" required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>Apply for Welfare</button>
        </form>
        </div>
      </main>
    </>
  );
}
