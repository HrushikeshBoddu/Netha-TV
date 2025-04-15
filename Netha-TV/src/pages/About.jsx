import { motion } from 'framer-motion';
import TeamMember from '../components/TeamMember';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';

const About = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Founder & CEO',
      bio: 'Visionary leader with 10+ years in tech and media',
      detailedBio: 'Alex founded Netha-TV after recognizing the need for a unified platform for trending content. With a background in computer science and digital media, he has led multiple successful startups in the streaming space.',
      image: '/assets/images/team1.jpg',
      skills: ['Strategic Planning', 'Leadership', 'Product Development'],
      social: {
        twitter: '#',
        linkedin: '#'
      }
    },
    {
      id: 2,
      name: 'Sarah Williams',
      role: 'Creative Director',
      bio: 'Design expert with a passion for visual storytelling',
      detailedBio: 'Sarah brings 8 years of UX/UI design experience from top media companies. She oversees all visual aspects of Netha-TV, ensuring an engaging and intuitive user experience.',
      image: '/assets/images/team2.jpg',
      skills: ['UI/UX Design', 'Branding', 'Motion Graphics'],
      social: {
        twitter: '#',
        linkedin: '#'
      }
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Lead Developer',
      bio: 'Full-stack wizard who makes the magic happen',
      detailedBio: 'Michael leads our engineering team with expertise in React, Node.js, and cloud infrastructure. He previously worked at major tech companies optimizing streaming platforms.',
      image: '/assets/images/team3.jpg',
      skills: ['React', 'Node.js', 'AWS', 'API Development'],
      social: {
        twitter: '#',
        linkedin: '#'
      }
    }
  ];

  const companyStats = [
    { value: '10M+', label: 'Monthly Active Users' },
    { value: '500K+', label: 'Content Creators' },
    { value: '24/7', label: 'Content Updates' },
    { value: '100+', label: 'Countries Supported' }
  ];

  return (
    <motion.div 
      className="about-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="about-hero py-5" style={{ backgroundColor: '' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <motion.h1
                className="display-4 fw-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                About <span className="gradient-text">Netha-TV</span>
              </motion.h1>
              <motion.p
                className="lead"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                We're revolutionizing how you discover and engage with trending content worldwide.
              </motion.p>
            </Col>
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <img 
                  src="/assets/images/about-hero.jpg" 
                  alt="Netha-TV platform" 
                  className="img-fluid rounded shadow"
                />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Mission Section */}
      <section className="about-mission py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="order-md-1 order-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="fw-bold mb-4">Our Mission & Vision</h2>
                <p className="lead mb-4">
                  At Netha-TV, we're passionate about bringing you the most engaging, 
                  relevant, and exciting content from around the world.
                </p>
                <p>
                  Our platform curates the best trending videos, live sessions, and events in one place,
                  powered by intelligent algorithms and human curation to ensure quality and relevance.
                </p>
                <ul className="list-unstyled">
                  <li className="mb-2"><i className="bi bi-check-circle-fill me-2" style={{ color: '#6c5ce7' }}></i> Personalized content discovery</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill me-2" style={{ color: '#6c5ce7' }}></i> Real-time trend analysis</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill me-2" style={{ color: '#6c5ce7' }}></i> Creator-friendly platform</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill me-2" style={{ color: '#6c5ce7' }}></i> Cross-platform accessibility</li>
                </ul>
              </motion.div>
            </Col>
            <Col md={6} className="order-md-2 order-1 mb-4 mb-md-0">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="border-0 shadow-lg">
                  <Card.Img 
                    variant="top" 
                    src="/assets/images/mission.jpg" 
                    alt="Our Mission" 
                    className="img-fluid"
                  />
                  <Card.Body style={{ backgroundColor: '#6c5ce7', color: 'white' }}>
                    <Card.Text>
                      "To connect people with content that inspires, educates, and entertains - anywhere, anytime."
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Stats Section - Custom Background */}
      <section className="company-stats py-5" style={{ backgroundColor: '#2d3436', color: 'white' }}>
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-center mb-5">By The Numbers</h2>
            <Row className="text-center">
              {companyStats.map((stat, index) => (
                <Col md={3} sm={6} key={index} className="mb-4 mb-md-0">
                  <div className="p-3">
                    <h3 className="display-4" style={{ color: '#6c5ce7' }}>{stat.value}</h3>
                    <p className="mb-0">{stat.label}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>
      
      {/* Team Section - Custom Background */}
      <section className="team-section py-5" style={{ backgroundColor: '' }}>
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className="text-center fw-bold mb-5">Meet The Team</h2>
            <p className="text-center lead mb-5">
              Our diverse team of innovators, creators, and technologists are passionate about
              delivering the best content discovery experience.
            </p>
            <Row>
              {teamMembers.map((member, index) => (
                <Col lg={4} md={6} key={member.id} className="mb-4">
                  <TeamMember 
                    member={member}
                    delay={0.8 + (index * 0.1)}
                  />
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>
      
      {/* Values Section */}
      <section className="values-section py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <h2 className="text-center fw-bold mb-5">Our Core Values</h2>
            <Row>
              <Col md={3} sm={6} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <div className="icon-box rounded-circle mb-3 mx-auto" style={{ backgroundColor: '#6c5ce7', color: 'white' }}>
                      <i className="bi bi-lightbulb fs-3"></i>
                    </div>
                    <Card.Title>Innovation</Card.Title>
                    <Card.Text>
                      We constantly push boundaries to deliver cutting-edge content discovery.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} sm={6} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <div className="icon-box rounded-circle mb-3 mx-auto" style={{ backgroundColor: '#6c5ce7', color: 'white' }}>
                      <i className="bi bi-people fs-3"></i>
                    </div>
                    <Card.Title>Community</Card.Title>
                    <Card.Text>
                      We build platforms that connect creators with their audiences meaningfully.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} sm={6} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <div className="icon-box rounded-circle mb-3 mx-auto" style={{ backgroundColor: '#6c5ce7', color: 'white' }}>
                      <i className="bi bi-shield-check fs-3"></i>
                    </div>
                    <Card.Title>Integrity</Card.Title>
                    <Card.Text>
                      We maintain transparency and ethical standards in all our operations.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} sm={6} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <div className="icon-box rounded-circle mb-3 mx-auto" style={{ backgroundColor: '#6c5ce7', color: 'white' }}>
                      <i className="bi bi-heart fs-3"></i>
                    </div>
                    <Card.Title>Passion</Card.Title>
                    <Card.Text>
                      We love what we do, and it shows in every feature we build.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section py-5" style={{ backgroundColor: '#6c5ce7', color: 'white' }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="text-center"
          >
            <h2 className="fw-bold mb-4">Ready to Experience Netha-TV?</h2>
            <p className="lead mb-4">Join millions of users discovering amazing content every day.</p>
            <button className="btn btn-light btn-lg px-4 me-2">Sign Up Free</button>
          </motion.div>
        </Container>
      </section>
    </motion.div>
  );
};

export default About;