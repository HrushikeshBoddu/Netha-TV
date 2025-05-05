import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { color, motion } from 'framer-motion';
import { fetchNewVlogs, fetchEvents, fetchPosts } from '../api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { Container, Row, Col, Carousel, Alert, Button, Offcanvas } from 'react-bootstrap';
import { FiX, FiYoutube } from 'react-icons/fi';
import '../styles/Home.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Modal from '../components/Modal'; // make sure this component exists


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
  const [posts, setPosts] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedVlog, setSelectedVlog] = useState(null);
  const [firstPost, setFirstPost] = useState(null);




  const handleCardClick = (item) => {
    console.log("Card clicked:", item);
    setSelectedVideo(item.url);
    setShowVideoModal(true);
  };

  function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }


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

        // ✅ Set posts
        console.log("📥 postsRes.data:", postsRes.data);
        setPosts(postsRes.data);

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
          setVlogs(fetchedVlogs);
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
            setFirstPostImage(encodeURI(fullPath));
            setFirstPost(postsRes.data[0]); // ✅ Set full post object for later use
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
            <a
  href="https://www.youtube.com/@NETHATV9?sub_confirmation=1"
  target="_blank"
  rel="noopener noreferrer"
  style={{ textDecoration: 'none' }} // optional: removes underline
>
  <Button variant="danger" size="lg" className="mb-3">
    Subscribe Now
  </Button>
</a>
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
              onClick={() => handleCardClick(firstPost)} // 👈 Add this to open video
              style={{
                height: '65vh',
                width: '100%',
                backgroundImage: firstPostImage ? `url(${firstPostImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: firstPostImage ? 'transparent' : '#f0f0f0',
                cursor: 'pointer'
              }}
            >
              <Container>
                <Row>
                  <Col lg={8}>
                    <h1 className="display-4 fw-bold mb-4 text-white">
                      {/* {firstPost?.title || ''} */}
                    </h1>
                    <p className="lead text-white">
                      {/* {firstPost?.content?.slice(0, 100) || ''} */}
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
              onClick={() => setSelectedEvent(events[0])} // 👈 Add click to play video
              style={{
                height: '65vh',
                width: '100%',
                backgroundImage: firstEventImage ? `url("${encodeURI(firstEventImage)}")` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: firstEventImage ? 'transparent' : '#f0f0f0',
                cursor: 'pointer' // 👈 Optional for UX
              }}
            >
              <Container>
                <Row>
                  <Col lg={8}>
                    <h1 className="display-4 fw-bold mb-4 text-white">
                      {/* 🎉 Upcoming Event */}
                    </h1>
                    <p className="lead text-white">
                      {/* Get ready for something exciting — happening soon! */}
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
              onClick={() => setSelectedVlog(vlogs[0])} // 👈 Add this to open video
              style={{
                height: '65vh',
                width: '100%',
                backgroundImage: firstVlogImage ? `url("${firstVlogImage}")` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: firstVlogImage ? 'transparent' : '#f0f0f0',
                cursor: 'pointer' // 👈 Optional UX improvement
              }}
            >
              <Container>
                <Row>
                  <Col lg={8}>
                    <h1 className="display-4 fw-bold mb-4 text-white">
                      {/* 🎥 Exclusive Vlog */}
                    </h1>
                    <p className="lead text-white">
                      {/* Dive into our latest vlog feature right here. */}
                    </p>
                  </Col>
                </Row>
              </Container>
            </div>
          </Carousel.Item>


        </Carousel>
      </section>

      {/* Trending Vlogs Section - Exactly 4 items */}
      <section id="trending" className="section trending-section py-5">
        <Container>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-4 d-flex align-items-center Trend-Head"
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
                        <div
                          className="placeholder-thumbnail mb-3"
                          style={{
                            width: '100%',
                            height: '200px',
                            backgroundColor: '#ddd',
                          }}
                        ></div>
                        <h5 className="card-title">{vlog.title}</h5>
                      </div>
                    </div>
                  ) : index === 3 ? (
                    <div
                      className="card h-100 shadow-sm"
                      onClick={() => setSelectedVlog(vlog)} // ✅ opens video modal
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className="card-img-top"
                        style={{ height: '200px', overflow: 'hidden' }}
                      >
                        <Slider
                          dots={false}
                          arrows={false}
                          infinite={true}
                          speed={1000}
                          slidesToShow={1}
                          slidesToScroll={1}
                          autoplay={true}
                          autoplaySpeed={2000}
                          fade={true}
                          beforeChange={(oldIndex, newIndex) => setCurrentSlideIndex(newIndex)}
                        >
                          {events.slice(0, 9).map((slideEvent) => (
                            <div key={slideEvent.id}>
                              <img
                                src={`http://127.0.0.1:8000/${slideEvent.banner_path?.replace(/\\/g, '/')}`}
                                alt={slideEvent.title}
                                style={{
                                  width: '100%',
                                  height: '200px',
                                  objectFit: 'cover',
                                  display: 'block',
                                  border: 0,
                                }}
                              />
                            </div>
                          ))}
                        </Slider>
                      </div>
                      <div className="card-body" style={{ minHeight: '80px' }}>
                        <h5
                          className="card-title"
                          style={{
                            fontSize: '1rem',
                            lineHeight: '1.3rem',
                            height: '2.6rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            whiteSpace: 'normal',
                          }}
                        >
                          {events[currentSlideIndex]?.title || 'Upcoming Event'}
                        </h5>
                      </div>
                    </div>
                  ) : (
                    <Card
                      item={vlog}
                      type="vlog"
                      showDescription={false}
                      imageStyle={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                      }}
                      onClick={() => setSelectedVlog(vlog)} // ✅ opens video modal
                    />
                  )}
                </motion.div>
              </Col>
            ))}
          </Row>

          {/* Video Modal for Vlogs */}
          <Modal
            isOpen={!!selectedVlog}
            onClose={() => setSelectedVlog(null)}
            size="xl"
            centered
          >
            {selectedVlog && selectedVlog.url ? (
              <div className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 style={{ color: 'black' }}>{selectedVlog.title}</h3>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedVlog(null)}
                    aria-label="Close"
                  />
                </div>
                <div className="ratio ratio-16x9 mb-3">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractVideoId(selectedVlog.url)}?autoplay=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={selectedVlog.title}
                    style={{ borderRadius: '8px', width: '100%', height: '100%' }}
                  ></iframe>
                </div>
              </div>
            ) : null}
          </Modal>

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
                    <h4 className="mb-2"></h4>
                    <p className="mb-0">
                      Support community-driven media and unlock exclusive stories that uplift and empower.
                    </p>
                  </Col>
                  <Col md={4} className="text-md-end mt-3 mt-md-0">
                    <Link to="/about">
                      <Button variant="outline-light" style={{ marginLeft: '150px' }}>Learn More</Button>
                    </Link>
                  </Col>
                </Row>
              </div>
            </motion.div>
          )}
        </Container>
      </section>



      {/* Upcoming Events Section */}
      {/* <section className="section events-section py-5 bg-dark">
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
      </section> */}


      <section className="section events-preview py-3 all-preview">
        <Container>
          <h2 className="mb-4" style={{ color: "black" }}>More About Netha TV</h2>
          <Row className="g-4">
            {Array.isArray(events) &&
              [...events]
                .filter(event => event.banner_path)
                .sort(
                  (a, b) =>
                    new Date(b.created_at || b.schedule || b.date) -
                    new Date(a.created_at || a.schedule || a.date)
                )
                .slice(0, 4)
                .map((event, index) => (
                  <Col key={event.id || index} xs={12} sm={6} lg={3}>
                    <div
                      className="event-image-card"
                      onClick={() => setSelectedEvent(event)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        style={{
                          height: '350px',
                          width: '100%',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={`http://127.0.0.1:8000/${event.banner_path.replace(/\\/g, '/')}`}
                          alt={event.title || 'Event Image'}
                          className="img-fluid shadow-sm"
                          style={{
                            height: '100%',
                            width: '100%',
                            // objectFit: 'cover',
                            borderRadius: '0px',
                          }}
                        />
                      </div>


                    </div>
                  </Col>
                ))}
          </Row>
        </Container>

        {/* Modal for video playback */}
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          size="xl"
          centered
        >
          {selectedEvent && selectedEvent.url ? (
            <div className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 style={{ color: 'black' }}>{selectedEvent.title}</h3>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedEvent(null)}
                  aria-label="Close"
                />
              </div>
              <div className="ratio ratio-16x9 mb-3">
                <iframe
                  src={`https://www.youtube.com/embed/${extractVideoId(selectedEvent.url)}?autoplay=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedEvent.title}
                  style={{ borderRadius: '8px', width: '100%', height: '100%' }}
                ></iframe>
              </div>
            </div>
          ) : null}
        </Modal>
      </section>



      <section className="section posts-preview py-3 all-preview">
        <Container>
          {Array.isArray(posts) && posts.length > 0 ? (
            <Row className="g-4">
              {posts
                .filter(post => post && post.banner_path)
                .sort((a, b) => {
                  const dateA = new Date(a.created_at || a.date || 0);
                  const dateB = new Date(b.created_at || b.date || 0);
                  return dateB - dateA;
                })
                .slice(0, 4)
                .map((post, index) => (
                  <Col key={post.id || index} xs={12} sm={6} lg={3}>
                    <div
                      className="post-image-card"
                      onClick={() => setSelectedPost(post)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={`http://127.0.0.1:8000/${post.banner_path.replace(/\\/g, '/')}`}
                        alt={post.title || 'Blog Post'}
                        className="img-fluid shadow-sm"
                        style={{
                          height: '350px',
                          width: '100%',
                          // objectFit: 'contain',
                        }}
                      />
                    </div>
                  </Col>
                ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No blog posts available.</p>
            </div>
          )}
        </Container>

        {/* Modal for Post Video */}
        <Modal
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          size="xl"
          centered
        >
          {selectedPost && selectedPost.url ? (
            <div className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 style={{ color: 'black' }}>{selectedPost.title}</h3>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedPost(null)}
                  aria-label="Close"
                />
              </div>
              <div className="ratio ratio-16x9 mb-3">
                <iframe
                  src={`https://www.youtube.com/embed/${extractVideoId(selectedPost.url)}?autoplay=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedPost.title}
                  style={{ borderRadius: '8px', width: '100%', height: '100%' }}
                ></iframe>
              </div>
            </div>
          ) : null}
        </Modal>
      </section>




      <section className="section vlogs-preview py-3 all-preview">
        <Container>
          <Row className="g-4">
            {Array.isArray(vlogs) &&
              [...vlogs]
                .sort(
                  (a, b) =>
                    new Date(b.created_at || b.date || 0) -
                    new Date(a.created_at || a.date || 0)
                )
                .slice(0, 4)
                .map((vlog, index) => (
                  <Col key={vlog.id || index} xs={12} sm={6} lg={3}>
                    <div
                      className="vlog-image-card"
                      onClick={() => setSelectedVlog(vlog)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={`http://127.0.0.1:8000/${vlog.banner_path?.replace(/\\/g, '/')}`}
                        alt={vlog.title || 'Vlog Image'}
                        className="img-fluid shadow-sm"
                        style={{
                          height: '350px',
                          width: '100%',
                          // objectFit: 'cover',
                        }}
                      />
                    </div>
                  </Col>
                ))}
          </Row>
        </Container>

        {/* Modal for Vlog Video */}
        <Modal
          isOpen={!!selectedVlog}
          onClose={() => setSelectedVlog(null)}
          size="xl"
          centered
        >
          {selectedVlog && selectedVlog.url ? (
            <div className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 style={{ color: 'black' }}>{selectedVlog.title}</h3>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedVlog(null)}
                  aria-label="Close"
                />
              </div>
              <div className="ratio ratio-16x9 mb-3">
                <iframe
                  src={`https://www.youtube.com/embed/${extractVideoId(selectedVlog.url)}?autoplay=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedVlog.title}
                  style={{ borderRadius: '8px', width: '100%', height: '100%' }}
                ></iframe>
              </div>
            </div>
          ) : null}
        </Modal>
      </section>



      <Modal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        size="xl"
        centered
      >
        {selectedVideo && (
          <div className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 style={{ color: 'black' }}>Now Playing</h3>
              <button
                type="button"
                className="btn-close"
                onClick={() => setSelectedVideo(null)}
                aria-label="Close"
              />
            </div>
            <div className="ratio ratio-16x9 mb-3">
              <iframe
                src={`https://www.youtube.com/embed/${extractVideoId(selectedVideo)}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Selected Video"
                style={{ borderRadius: '8px', width: '100%', height: '100%' }}
              ></iframe>
            </div>
          </div>
        )}
      </Modal>

    </div>



  );
};


export default Home;