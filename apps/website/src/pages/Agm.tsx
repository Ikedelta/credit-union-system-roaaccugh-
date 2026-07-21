import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { useCMS } from '../context/CMSContext';
import { FileText, Download, Calendar } from 'lucide-react';

export function Agm() {
  const { getJSON } = useCMS();
  
  // Format: [{ id: '1', year: '2023', title: '2023 Annual General Meeting Report', pdfUrl: 'https://...', summary: '...' }]
  const agmReports = getJSON<any[]>('agm_reports', []);

  return (
    <>
      <PageHeader 
        title="AGM Reports" 
        description="Access our Annual General Meeting reports and stay informed about our progress."
        badge="Media"
        bgImage="/slider1.jpg"
      />
      
      <main className="section container">
        <RevealOnScroll>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {agmReports.length === 0 ? (
               <div className="card text-center" style={{ padding: '4rem 2rem' }}>
                 <h3 style={{ color: 'var(--text-muted)' }}>No AGM reports available yet.</h3>
                 <p>Please check back later.</p>
               </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {agmReports.map((report, index) => (
                  <div key={report.id || index} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                          <FileText size={24} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.3rem', margin: '0 0 0.25rem 0' }}>{report.title || `${report.year} AGM Report`}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <Calendar size={14} />
                            <span>Year: {report.year}</span>
                          </div>
                        </div>
                      </div>
                      
                      {report.pdfUrl && (
                        <a href={report.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                          <Download size={16} />
                          Download PDF
                        </a>
                      )}
                    </div>
                    
                    {report.summary && (
                      <div style={{ marginTop: '0.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', color: 'var(--text-color)' }}>
                        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>{report.summary}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </RevealOnScroll>
      </main>
    </>
  );
}
