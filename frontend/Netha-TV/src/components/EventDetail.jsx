import { FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';

const EventDetail = ({ event }) => {
  return (
    <div className="event-detail">
      <div className="event-header">
        <h2>{event.title}</h2>
        <div className="event-meta">
          <span><FiCalendar /> {new Date(event.scheduled_time).toLocaleDateString()}</span>
          <span><FiClock /> {new Date(event.scheduled_time).toLocaleTimeString()}</span>
          <span><FiMapPin /> {event.location || 'Online Event'}</span>
        </div>
      </div>
      
      <div className="event-image">
        <img 
          src={event.banner_image || '/assets/images/default-event.jpg'} 
          alt={event.title}
        />
      </div>
      
      <div className="event-description">
        <h3>About This Event</h3>
        <p>{event.description}</p>
      </div>
      
      <div className="event-actions">
        <button className="btn primary">Get Tickets</button>
        <button className="btn secondary">Add to Calendar</button>
      </div>
    </div>
  );
};

export default EventDetail;