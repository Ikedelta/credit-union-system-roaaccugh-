import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { useCMS } from '../context/CMSContext';
import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, ChevronRight } from 'lucide-react';

export function Agm() {
  const { getJSON } = useCMS();
  const [activePreview, setActivePreview] = useState<string | null>(null);
  
  // Format: [{ id: '1', year: '2023', title: '2023 Annual General Meeting Report', pdfUrl: 'https://...', summary: '...' }]
  const agmReports = getJSON<any[]>('agm_reports', []);

  // Auto-select first report on load
  useEffect(() => {
    if (agmReports.length > 0 && !activePreview) {
      setActivePreview(agmReports[0].id || null);
    }
  }, [agmReports, activePreview]);

  const activeReport = agmReports.find(r => r.id === activePreview);

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
          <div style={{ width: '100%' }}>
            {agmReports.length === 0 ? (
               <div className="card text-center" style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
                 <h3 style={{ color: 'var(--text-muted)' }}>No AGM reports available yet.</h3>
                 <p>Please check back later.</p>
               </div>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'minmax(280px, 1fr) 2.5fr', 
                gap: '2rem',
                alignItems: 'start'
              }} className="agm-dual-pane">
                <style>{`
                  @media (max-width: 992px) {
                    .agm-dual-pane {
                      grid-template-columns: 1fr !important;
                    }
                  }
                  .agm-sidebar-item {
                    transition: all 0.2s ease;
                  }
                  .agm-sidebar-item:hover {
                    transform: translateX(5px);
                  }
                `}</style>
                
                {/* Left Sidebar (List of Reports) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '100px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  <h3 style={{ marginBottom: '0.5rem', fontSize: '1.4rem', borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.5rem', display: 'inline-block' }}>Available Reports</h3>
                  
                  {agmReports.map((report, index) => {
                    const isActive = activePreview === report.id;
                    return (
                      <div 
                        key={report.id || index} 
                        className="agm-sidebar-item"
                        onClick={() => setActivePreview(report.id)}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          padding: '1.25rem 1.5rem', 
                          background: isActive ? 'var(--primary-color)' : '#fff',
                          color: isActive ? '#fff' : 'var(--text-color)',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          border: isActive ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
                          boxShadow: isActive ? '0 10px 20px rgba(0, 114, 54, 0.2)' : '0 2px 5px rgba(0,0,0,0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <h4 style={{ margin: 0, fontSize: '1.1rem', color: isActive ? '#fff' : 'var(--text-color)' }}>{report.title || `${report.year} AGM Report`}</h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', opacity: isActive ? 0.9 : 0.7 }}>
                            <Calendar size={14} />
                            <span>Year: {report.year}</span>
                          </div>
                        </div>
                        <ChevronRight size={20} style={{ opacity: isActive ? 1 : 0.4 }} />
                      </div>
                    );
                  })}
                </div>

                {/* Right Pane (Document Viewer) */}
                <div style={{ 
                  borderRadius: '24px', 
                  overflow: 'hidden', 
                  background: '#fff', 
                  boxShadow: '0 20px 50px rgba(0,0,0,0.1)', 
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {activeReport ? (
                    <>
                      <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                          <div>
                            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem' }}>{activeReport.title || `${activeReport.year} AGM Report`}</h2>
                            {activeReport.summary && (
                              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '600px' }}>{activeReport.summary}</p>
                            )}
                          </div>
                          {activeReport.pdfUrl && (
                            <a href={activeReport.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', borderRadius: '50px', padding: '0.75rem 1.5rem' }}>
                              <Download size={18} />
                              Download PDF
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {activeReport.pdfUrl ? (
                        <div style={{ background: '#e2e8f0', position: 'relative' }}>
                          <div style={{ 
                            background: 'var(--bg-slate)', 
                            padding: '1rem 1.5rem', 
                            borderBottom: '1px solid var(--border-color)', 
                            display: 'flex', 
                            alignItems: 'center'
                          }}>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56', boxShadow: 'inset 0 0 4px rgba(0,0,0,0.1)' }} />
                              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e', boxShadow: 'inset 0 0 4px rgba(0,0,0,0.1)' }} />
                              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f', boxShadow: 'inset 0 0 4px rgba(0,0,0,0.1)' }} />
                            </div>
                            <span style={{ marginLeft: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Document Viewer</span>
                          </div>
                          <iframe 
                            loading="lazy" 
                            src={activeReport.pdfUrl.toLowerCase().match(/\.(doc|docx)$/) ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(activeReport.pdfUrl)}` : `${activeReport.pdfUrl}${activeReport.pdfUrl.includes('#') ? '&' : '#'}toolbar=0&navpanes=0`} 
                            width="100%" 
                            style={{ height: '75vh', minHeight: '600px', border: 'none', display: 'block' }} 
                            title={`${activeReport.year} AGM Report Preview`} 
                          />
                        </div>
                      ) : (
                        <div style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          <FileText size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
                          <p>No document attached to this report.</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <p>Select a report from the sidebar to view it here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </RevealOnScroll>
      </main>
    </>
  );
}
