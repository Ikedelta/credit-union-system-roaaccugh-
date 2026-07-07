import { X } from 'lucide-react';

interface ModalsProps {
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
}

export function Modals({ activeModal, setActiveModal }: ModalsProps) {
  if (!activeModal) return null;

  return (
    <div className="modal-overlay" onClick={() => setActiveModal(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ margin: 0, color: 'var(--primary-color)' }}>
            {activeModal === 'balance' ? 'Check Account Balance' : 'Make a Deposit'}
          </h3>
          <button className="modal-close" onClick={() => setActiveModal(null)}><X size={24} /></button>
        </div>
        <div className="modal-body">
          {activeModal === 'balance' ? (
            <form onSubmit={(e) => { e.preventDefault(); alert("Balance Check functionality triggered."); setActiveModal(null); }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Account No.</label>
                <input type="text" className="form-control" placeholder="Enter Account Number" required />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>PIN</label>
                <input type="password" className="form-control" placeholder="Enter PIN" required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Check Balance</button>
            </form>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); alert("Deposit functionality triggered."); setActiveModal(null); }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Account No.</label>
                <input type="text" className="form-control" placeholder="Enter Account Number" required />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Amount (GHS)</label>
                <input type="number" className="form-control" placeholder="Enter Amount" required />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Product</label>
                <select className="form-control" required>
                  <option value="shares">Shares</option>
                  <option value="savings">Savings</option>
                  <option value="susu">Susu</option>
                  <option value="loans">Loans</option>
                  <option value="investments">Investments</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Proceed with Deposit</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
