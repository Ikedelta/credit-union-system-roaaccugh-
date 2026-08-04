import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { useCMS } from '../context/CMSContext';
import { Download, FileText } from 'lucide-react';

export function OperationalPolicy() {
  const { get } = useCMS();

  const opPolicyText = get('operational_policy_text', 'Our Operational Policy provides the framework for the day-to-day operations of ROAACCU. Please download the complete document to read the details.');
  const opPolicyDoc = get('operational_policy_doc', '');

  return (
    <>
      <PageHeader 
        title="Operational Policy" 
        description="Understanding the policies that govern the day-to-day operations of ROAACCU."
        badge="Governance"
        bgImage="/slider2.jpg"
      />
      
      <main className="section container">
        <RevealOnScroll>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* Premium Header Block */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.7)', 
              backdropFilter: 'blur(20px)', 
              borderRadius: '24px', 
              padding: '3rem 2rem', 
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <FileText size={36} />
              </div>
              <h2 style={{ fontSize: '2.5rem', margin: 0, letterSpacing: '-0.5px' }}>ROAACCU Operational Policy</h2>
              
              <div 
                style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', whiteSpace: 'pre-wrap' }}
                dangerouslySetInnerHTML={{ __html: opPolicyText }}
              />

              {opPolicyDoc && (
                <div style={{ marginTop: '1rem' }}>
                  <a href={opPolicyDoc} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', gap: '0.75rem', padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '50px', boxShadow: '0 10px 25px rgba(0, 114, 54, 0.25)', transition: 'all 0.3s', fontWeight: 600 }}>
                    <Download size={22} />
                    Download Official Document
                  </a>
                </div>
              )}
            </div>

            {/* Immersive Document Viewer */}
            {opPolicyDoc && (
              <div style={{ 
                borderRadius: '24px', 
                overflow: 'hidden', 
                background: '#f8fafc', 
                boxShadow: '0 20px 50px rgba(0,0,0,0.15)', 
                border: '1px solid var(--border-color)',
              }}>
                <div style={{ 
                  background: 'var(--bg-white)', 
                  padding: '1.25rem 2rem', 
                  borderBottom: '1px solid var(--border-color)', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#ff5f56', boxShadow: 'inset 0 0 4px rgba(0,0,0,0.1)' }} />
                      <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#ffbd2e', boxShadow: 'inset 0 0 4px rgba(0,0,0,0.1)' }} />
                      <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#27c93f', boxShadow: 'inset 0 0 4px rgba(0,0,0,0.1)' }} />
                    </div>
                    <span style={{ marginLeft: '1rem', fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Document Viewer</span>
                  </div>
                </div>
                <iframe 
                  loading="lazy"
                  src={opPolicyDoc.toLowerCase().match(/\.(doc|docx)$/) ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(opPolicyDoc)}` : `${opPolicyDoc}${opPolicyDoc.includes('#') ? '&' : '#'}toolbar=0&navpanes=0`} 
                  width="100%" 
                  style={{ height: '85vh', minHeight: '800px', border: 'none', display: 'block', background: '#e2e8f0' }} 
                  title="Operational Policy Document" 
                />
              </div>
            )}
            
          </div>
        </RevealOnScroll>
      </main>
    </>
  );
}
