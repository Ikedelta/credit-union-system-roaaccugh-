import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { useCMS } from '../context/CMSContext';
import { Download, FileText } from 'lucide-react';

export function ByLaw() {
  const { get } = useCMS();

  const bylawText = get('bylaw_text', 'Our By-Laws govern the operations of ROAACCU and provide the framework for our cooperative principles. Please download the complete PDF to read the details.');
  const bylawPdf = get('bylaw_pdf', '');

  return (
    <>
      <PageHeader 
        title="By-Laws" 
        description="Understanding the rules and cooperative principles that govern ROAACCU."
        badge="Governance"
        bgImage="/slider2.jpg"
      />
      
      <main className="section container">
        <RevealOnScroll>
          <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(2rem, 5vw, 4rem)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                <FileText size={24} />
              </div>
              <h2 style={{ fontSize: '1.8rem', margin: 0 }}>ROAACCU By-Laws</h2>
            </div>
            
            <div 
              style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-color)', marginBottom: '3rem', whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{ __html: bylawText }}
            />

            {bylawPdf && (
              <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginBottom: '1rem' }}>Download Complete By-Laws</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Get a copy of the official By-Laws document in PDF format.</p>
                <a href={bylawPdf} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', gap: '0.5rem' }}>
                  <Download size={18} />
                  Download PDF
                </a>
              </div>
            )}
          </div>
        </RevealOnScroll>
      </main>
    </>
  );
}
