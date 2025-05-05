import { useEffect, useState } from 'react';
import { fetchAllVlogs } from '../api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import VlogPlayer from '../components/VlogPlayer';
import { Container, Row, Col, Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { FiSearch, FiFilm, FiX } from 'react-icons/fi';
import 'bootstrap/dist/css/bootstrap.min.css';

const Vlogs = () => {
  const [vlogs, setVlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVlog, setSelectedVlog] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchVlogsData = async () => {
      try {
        setLoading(true);
        const res = await fetchAllVlogs();
        console.log("Fetched Vlogs:", res.data);
        setVlogs(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVlogsData();
  }, []);

  const handleVlogClick = (vlog) => {
    setSelectedVlog(vlog);
  };

  const filteredVlogs = vlogs.filter(vlog => {
    // Filter by category
    if (filter !== 'all' && vlog.category !== filter) return false;
    
    // Filter by search query
    if (searchQuery && !vlog.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const clearFilters = () => {
    setFilter('all');
    setSearchQuery('');
  };

  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Loader />
    </Container>
  );

  if (error) return (
    <Container className="mt-5">
      <Alert variant="danger" className="text-center">
        <Alert.Heading>Oops! Something went wrong</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Alert>
    </Container>
  );

  return (
    <Container fluid className="vlogs-page py-4 px-lg-5 mt-5">
      <Row className="mb-4">
        <Col>
          <h1 className="display-4 text-center mb-3" style={{color:'black'}}>Explore Our Vlogs</h1>
          <p className="lead text-center text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)', color:'#f2f2f2'}}>
            Discover the latest stories, tutorials, and adventures
          </p>
        </Col>
      </Row>

      {/* Search and Filter Section */}
      <Row className="mb-4 justify-content-center">
        <Col lg={8}>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FiSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search vlogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button 
                variant="outline-secondary" 
                onClick={() => setSearchQuery('')}
              >
                <FiX />
              </Button>
            )}
          </InputGroup>
        </Col>
      </Row>

      {/* Vlogs Grid */}
      {filteredVlogs.length > 0 ? (
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {filteredVlogs.map((vlog) => (
            <Col key={vlog.id}>
              <Card
                item={vlog}
                type="vlog"
                onClick={handleVlogClick}
                useBuiltInModal={false} 
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Row className="mt-5">
          <Col className="text-center">
            <div className="p-5 bg-light rounded-3">
              <FiFilm size={48} className="text-muted mb-3" />
              <h3 className="mt-3">No vlogs found</h3>
              <p className="text-muted">
                {searchQuery 
                  ? `No results for "${searchQuery}"`
                  : 'Try changing your filters'}
              </p>
              <Button 
                variant="outline-primary" 
                onClick={clearFilters}
                className="mt-2"
              >
                Show all vlogs
              </Button>
            </div>
          </Col>
        </Row>
      )}

      {/* Vlog Player Modal */}
      <Modal 
        isOpen={!!selectedVlog} 
        onClose={() => setSelectedVlog(null)}
        size="xl"
        centered
      >
        {selectedVlog && (
          <div className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 style={{color:'black'}}>{selectedVlog.title}</h3>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setSelectedVlog(null)}
                aria-label="Close"
                style={{marginBottom:'20px', color:'black'}}
              />
            </div>
            <div className="ratio ratio-16x9 mb-3">
              <VlogPlayer vlog={selectedVlog} />
            </div>
            <div className="mt-3">
              {/* <p>{selectedVlog.description}</p> */}
              <div className="d-flex flex-wrap gap-2">
                {selectedVlog.tags?.map(tag => (
                  <span key={tag} className="badge bg-secondary">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Container>
  );
};

export default Vlogs;