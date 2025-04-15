import { useEffect, useState } from 'react';
import { fetchEvents, fetchLiveSessions } from '../api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import EventDetail from '../components/EventDetail';
import EmptyState from '../components/EmptyState';
import { FiClock, FiCalendar, FiVideo } from 'react-icons/fi';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import '../styles/main.css';
import '../styles/Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setError(null);
        setLoadingEvents(true);
        const [eventsRes, livesRes] = await Promise.all([
          fetchEvents(),
          fetchLiveSessions(),
        ]);

        // Just tag them with a source field
        const eventList = (eventsRes.data || []).map(e => ({ ...e, _source: 'event' }));
        const liveList = (livesRes.data || []).map(l => ({ ...l, _source: 'live' }));

        setEvents(eventList);
        setLiveSessions(liveList);
      } catch (err) {
        setError(err.message || 'Failed to load data. Please try again later.');
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchAllData();
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleClearHistory = async () => {
    try {
      setIsClearing(true);
      setShowClearModal(false);
    } catch (err) {
      setError(err.message || 'Failed to clear history. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  const getDate = (e) => new Date(e.start_time || e.date || e.created_at || 0);
  const upcomingCombined = [...liveSessions, ...events]
    .filter(Boolean)
    .sort((a, b) => getDate(b) - getDate(a));

  const updatedUpcoming = upcomingCombined.slice(0, 6);
  const pastHistory = upcomingCombined.slice(6);

  const getIcon = (source) => {
    if (source === 'live') return <FiVideo color="#d9534f" title="Live" />;
    if (source === 'event') return <FiCalendar color="#0275d8" title="Event" />;
    return null;
  };

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          <h4>Error Loading Events</h4>
          <p>{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="events-page py-4 mt-4">
      {/* Upcoming Events */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">
            <FiCalendar className="me-2" />
            Upcoming Events
          </h2>
        </div>

        {loadingEvents ? (
          <div className="text-center py-5">
            <Loader />
            <p className="mt-3">Loading upcoming events...</p>
          </div>
        ) : updatedUpcoming.length > 0 ? (
          <Row xs={1} md={2} lg={3} className="g-4">
            {updatedUpcoming.map((event, index) => (
              <Col key={`${event.id || index}`}>
                <div className="position-relative">
                  <Card
                    item={event}
                    onClick={() => handleEventClick(event)}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'white',
                    borderRadius: '50%',
                    padding: '6px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    zIndex: 1
                  }}>
                    {getIcon(event._source)}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <EmptyState
            icon={<FiCalendar size={48} />}
            message="No upcoming events"
            subtext="Check back later for new events"
          />
        )}
      </section>

      {/* Past History */}
      {pastHistory.length > 0 && (
        <section className="mt-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">
              <FiClock className="me-2" />
              Past History
            </h2>
          </div>
          <Row xs={1} md={2} lg={3} className="g-4">
            {pastHistory.map((event, index) => (
              <Col key={`past-${event.id || index}`}>
                <div className="position-relative">
                  <Card
                    item={event}
                    onClick={() => handleEventClick(event)}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'white',
                    borderRadius: '50%',
                    padding: '6px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    zIndex: 1
                  }}>
                    {getIcon(event._source)}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </section>
      )}
    </Container>
  );
};

export default Events;
