import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchNewVlogs, fetchEvents, fetchPosts } from '../api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { Container, Row, Col, Carousel, Alert, Button, Offcanvas } from 'react-bootstrap';
import { FiX, FiYoutube } from 'react-icons/fi';
import '../styles/Home.css';

const Home = () => {
  const [vlogs, setVlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [showAd, setShowAd] = useState(true);
  const [adClosed, setAdClosed] = useState(false);
  const [firstEventImage, setFirstEventImage] = useState('');
  const [firstPostImage, setFirstPostImage] = useState('');
  const [firstVlogImage, setFirstVlogImage] = useState('');


  // Always show exactly 4 trending items
  const trendingVlogs = vlogs.slice(0, 4);

  useEffect(() => {
    const subscribeTimer = setTimeout(() => {
      const hasSubscribed = localStorage.getItem('yt_subscribed');
      if (!hasSubscribed) {
        setShowSubscribe(true);
      }
    }, 5000);

    return () => clearTimeout(subscribeTimer);
  }, []);

  useEffect(() => {
    const adTimer = setTimeout(() => {
      if (!sessionStorage.getItem('ad_shown')) {
        setShowAd(true);
        sessionStorage.setItem('ad_shown', 'true');
      }
    }, 3000);

    return () => clearTimeout(adTimer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [vlogsRes, eventsRes, postsRes] = await Promise.all([
          fetchNewVlogs(),
          fetchEvents(),
          fetchPosts()
        ]);
        console.log("📸 banner path from post:", postsRes.data[0].banner_path);
        // Ensure we get at least 4 vlogs (pad with empty data if needed)
        const fetchedVlogs = vlogsRes.data;
        if (fetchedVlogs.length < 4) {
          const placeholderCount = 4 - fetchedVlogs.length;
          const placeholders = Array(placeholderCount).fill({
            id: `placeholder-${Date.now()}-${Math.random()}`,
            isPlaceholder: true,
            title: "Coming Soon",
            thumbnail: "",
            description: "New content arriving shortly"
          });
          setVlogs([...fetchedVlogs, ...placeholders]);
        } else {
          setVlogs(fetchedVlogs.slice(0, 4));
        }

        setEvents(eventsRes.data);

        // ✅ Correct: Set the first event image
        if (eventsRes.data && eventsRes.data.length > 0) {
          console.log("🐯 first event image path raw:", eventsRes.data[0].banner_path);
          const eventImageFullPath = `http://127.0.0.1:8000/${eventsRes.data[0].banner_path.replace(/\\/g, '/')}`;
          console.log("🐯 final event image full URL:", eventImageFullPath);
          setFirstEventImage(eventImageFullPath);

        }

        // ✅ Correct: Set the first post image
        if (postsRes.data && postsRes.data.length > 0) {
          const bannerPath = postsRes.data[0].banner_path;
          if (bannerPath) {
            const fullPath = `http://127.0.0.1:8000/${bannerPath.replace(/\\/g, '/')}`;
            console.log("✅ Final full post image URL:", fullPath);
            setFirstPostImage(encodeURI(fullPath));
          }
        }

        // ✅ Correct: Set the first vlog image
        if (fetchedVlogs.length > 0) {
          const vlogBanner = fetchedVlogs[0].banner_path;
          if (vlogBanner) {
            const vlogFullPath = `http://127.0.0.1:8000/${vlogBanner.replace(/\\/g, '/')}`;
            console.log("🎬 Final vlog banner full URL:", vlogFullPath);
            setFirstVlogImage(encodeURI(vlogFullPath));
          }
        }


      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);




  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  const handleSubscribe = () => {
    localStorage.setItem('yt_subscribed', 'true');
    setShowSubscribe(false);
    window.open('https://youtube.com/subscribe', '_blank');
  };

  const handleAdClose = () => {
    setShowAd(false);
    setAdClosed(true);
  };

  if (loading) return <Loader />;
  if (error) return (
    <Container className="my-5">
      <Alert variant="danger" className="text-center">
        Error loading content: {error}
        <Button
          variant="link"
          className="p-0 ms-2"
          onClick={() => window.location.reload()}
        >
          Try again
        </Button>
      </Alert>
    </Container>
  );

  return (
    <div className="home-page">
      {/* YouTube Subscribe Popup */}
      <Offcanvas
        show={showSubscribe}
        onHide={() => setShowSubscribe(false)}
        placement="bottom"
        className="subscribe-popup"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="d-flex align-items-center">
            <FiYoutube className="me-2" size={24} color="red" />
            Subscribe to our Channel
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-flex flex-column align-items-center">
            <p className="text-center mb-4">
              Never miss our latest videos! Subscribe to our YouTube channel for weekly updates.
            </p>
            <Button
              variant="danger"
              size="lg"
              onClick={handleSubscribe}
              className="mb-3"
            >
              Subscribe Now
            </Button>
            <small className="text-muted">
              You can unsubscribe anytime
            </small>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Advertisement Banner */}
      {/* {showAd && !adClosed && (
        <div className="ad-banner">
          <Container>
            <div className="ad-content d-flex justify-content-between align-items-center">
              <div>
                <span className="badge bg-warning text-dark me-2 mt-5">AD</span>
                <span>Special Offer: 50% off first month with code <strong>NETHE50</strong></span>
              </div>
              <Button
                variant="link"
                className="p-0 text-light mt-5"
                onClick={handleAdClose}
              >
                <FiX size={20} />
              </Button>
            </div>
          </Container>
        </div>
      )} */}

      {/* Hero Section */}
      <section className="hero-carousel">
        <Carousel
          indicators={true}
          controls={false}
          interval={1500}
          className="hero-carousel-container"
        >
          {/* Slide 1 - First Event Image */}
          {/* Slide 1 - First Post Image */}
          <Carousel.Item>
            <div
              className="hero-slide d-flex align-items-center"
              style={{
                height: '65vh',
                width: '100%',
                backgroundImage: firstPostImage ? `url(${firstPostImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: firstPostImage ? 'transparent' : '#f0f0f0'
              }}
            >
              <Container>
                <Row>
                  <Col lg={8}>
                    <h1 className="display-4 fw-bold mb-4 text-white">
                      Latest Post Feature
                    </h1>
                    <p className="lead text-white">
                      Catch the latest blog update right here.
                    </p>
                  </Col>
                </Row>
              </Container>
            </div>
          </Carousel.Item>


          {/* Slide 2 */}
          <Carousel.Item>
            <div
              className="hero-slide d-flex align-items-center"
              style={{
                height: '65vh',
                width: '100%',
                backgroundImage: firstEventImage ? `url("${encodeURI(firstEventImage)}")` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: firstEventImage ? 'transparent' : '#f0f0f0'
              }}
            >
              <Container>
                <Row>
                  <Col lg={8}>
                    <h1 className="display-4 fw-bold mb-4 text-white">
                      🎉 Upcoming Event
                    </h1>
                    <p className="lead text-white">
                      Get ready for something exciting — happening soon!
                    </p>
                  </Col>
                </Row>
              </Container>
            </div>
          </Carousel.Item>



          {/* Slide 3 - First Vlog Image */}
          <Carousel.Item>
            <div
              className="hero-slide d-flex align-items-center"
              style={{
                height: '65vh',
                width: '100%',
                backgroundImage: firstVlogImage ? `url("${firstVlogImage}")` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: firstVlogImage ? 'transparent' : '#f0f0f0'
              }}
            >
              <Container>
                <Row>
                  <Col lg={8}>
                    <h1 className="display-4 fw-bold mb-4 text-white">
                      🎥 Exclusive Vlog
                    </h1>
                    <p className="lead text-white">
                      Dive into our latest vlog feature right here.
                    </p>
                  </Col>
                </Row>
              </Container>
            </div>
          </Carousel.Item>

        </Carousel>
      </section>

      {/* Trending Vlogs Section - Exactly 4 items */}
      <section className="section trending-section py-5">
        <Container>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-4 d-flex align-items-center"
          >
            <span className="me-2">🔥</span> Trending Now
          </motion.h2>

          <Row className="g-4">
            {trendingVlogs.map((vlog, index) => (
              <Col key={vlog.id} xs={12} sm={6} lg={3}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                >
                  {vlog.isPlaceholder ? (
                    <div className="card placeholder-card h-100">
                      <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
                        <div className="placeholder-thumbnail mb-3"></div>
                        <h5 className="card-title">{vlog.title}</h5>
                      </div>
                    </div>
                  ) : (
                    <Card
                      item={vlog}
                      type="vlog"
                      showDescription={false}
                    />
                  )}
                </motion.div>
              </Col>
            ))}
          </Row>

          {/* Inline Ad */}
          {!adClosed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-5 mb-4"
            >
              <div className="promo-card p-4 rounded-3 bg-dark">
                <Row className="align-items-center">
                  <Col md={8}>
                    <h4 className="mb-2">Upgrade to Premium</h4>
                    <p className="mb-0">
                      Enjoy ad-free experience and exclusive content with our premium membership.
                    </p>
                  </Col>
                  <Col md={4} className="text-md-end mt-3 mt-md-0">
                    <Button variant="outline-light">
                      Learn More
                    </Button>
                  </Col>
                </Row>
              </div>
            </motion.div>
          )}
        </Container>
      </section>

      {/* Upcoming Events Section */}
      <section className="section events-section py-5 bg-dark">
        <Container>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mb-4 d-flex align-items-center"
          >
            <span className="me-2">🎉</span> Upcoming Events
          </motion.h2>

          {events.length > 0 ? (
            <Carousel activeIndex={activeIndex} onSelect={handleSelect} indicators={false}>
              {events.slice(0, 3).map((event, index) => (
                <Carousel.Item key={event.id}>
                  <Row className="justify-content-center">
                    <Col lg={8}>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 1.3 + index * 0.1 }}
                      >
                        <Card
                          item={event}
                          type="event"
                          className="mx-auto"
                          style={{ maxWidth: '600px' }}
                        />
                      </motion.div>
                    </Col>
                  </Row>
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <Alert variant="info" className="text-center">
              No upcoming events scheduled. Check back later!
            </Alert>
          )}
        </Container>
      </section>
    </div>
  );
};

export default Home;