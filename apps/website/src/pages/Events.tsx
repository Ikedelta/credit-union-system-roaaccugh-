import { PageHeader } from '../components/PageHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { useCMS } from '../context/CMSContext';
import { Calendar, MapPin, Clock } from 'lucide-react';

export function Events() {
  const { getJSON } = useCMS();
  
  // Format: [{ id: '1', title: 'Annual Dinner', date: 'Dec 15, 2024', time: '6:00 PM', location: 'Main Hall', description: '...' }]
  const events = getJSON<any[]>('events_list', []);

  return (
    <>
      <PageHeader 
        title="Upcoming Events" 
        description="Stay tuned for the latest events and updates from ROAACCU."
        badge="Media"
        bgImage="/slider2.jpg"
      />
      
      <main className="section container">
        <RevealOnScroll>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {events.length === 0 ? (
               <div className="card text-center" style={{ padding: '4rem 2rem' }}>
                 <h3 style={{ color: 'var(--text-muted)' }}>No upcoming events currently scheduled.</h3>
                 <p>Please check back later.</p>
               </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {events.map((eventItem, index) => (
                  <div key={eventItem.id || index} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', margin: 0 }}>{eventItem.title || 'Untitled Event'}</h3>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                      {eventItem.date && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={16} />
                          <span>{eventItem.date}</span>
                        </div>
                      )}
                      {eventItem.time && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={16} />
                          <span>{eventItem.time}</span>
                        </div>
                      )}
                      {eventItem.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <MapPin size={16} />
                          <span>{eventItem.location}</span>
                        </div>
                      )}
                    </div>
                    
                    {eventItem.description && (
                      <p style={{ margin: 0, marginTop: '0.5rem', lineHeight: 1.6, color: 'var(--text-color)' }}>
                        {eventItem.description}
                      </p>
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
