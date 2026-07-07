export function Events() {
  return (
    <main className="section container text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Upcoming Events</h2>
      <p className="card-text">Stay tuned for the latest events and updates from ROAACCU.</p>
      
      <div className="card" style={{ maxWidth: '600px', margin: '2rem auto', padding: '3rem' }}>
        <h3 style={{ color: 'var(--text-muted)' }}>No upcoming events currently scheduled.</h3>
        <p>Please check back later.</p>
      </div>
    </main>
  );
}
