import { motion } from 'framer-motion';
import TeamMember from '../components/TeamMember';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';

const About = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Putta Rushi Krishna Netha',
      role: 'Founder & Director',
      bio: 'Founder of Netha TV and Online Studio 9 TV, passionate photographer and community leader',
      detailedBio: `My name is Putta Rushi Krishna Netha, born on 19th August 1980. My professional journey began in 2004 when I started my career as a photographer, a field that I am deeply passionate about and continue to pursue with my dedicated team to this day. However, my career took various interesting turns along the way. From 1999 to 2001, I worked as an office assistant at ETV News in Somajiguda, Hyderabad. I then moved on to Ramoji Film City, where I served as Section Incharge, before transitioning into a new chapter of my career at TV9. From 2009 to 2016, I worked as an Investigative Journalist, which expanded my understanding of media and its power to influence positive change in society.

      Despite my career in journalism and media, I never left my true passion—photography. Since 2014, I have been working as a professional photographer, capturing stories through the lens with the help of my talented team.

      In 2017, I started Netha TV, a YouTube channel dedicated to the development and empowerment of our Padmashali community. This channel has become my passion project, where I interview community members, share valuable insights, and work towards the overall growth and unity of the Padmashali people.`,
      image: '/assets/images/team1.jpg',
      skills: ['Photography', 'Journalism', 'Community Engagement'],
      social: {
        twitter: 'https://twitter.com/netha_media',
        linkedin: '#'
      }
    }
  ];

  const companyStats = [
    { value: '2017', label: 'Year of Establishment' },
    { value: '100+', label: 'Community Interviews' },
    { value: '2', label: 'Media Platforms' },
    { value: '10K+', label: 'YouTube Subscribers' }
  ];

  return (
    <motion.div id='About'
      className="about-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="about-hero py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <motion.h1
                className="display-4 fw-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="gradient-text">About Netha-TV</span>
              </motion.h1>
              <motion.p
                className="lead"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{color:'black'}}
              >
                Welcome to Netha TV and Online Studio 9 TV – platforms built to uplift and empower the Padmashali community through media and storytelling.
              </motion.p>
            </Col>
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <img style={{height:'150px', width:'150px', marginLeft:'350px', borderRadius: '50%',padding:'5px'}}
                  src="./src/media/Netha_logo.png"
                  alt="Netha-TV platform" 
                  className="img-fluid shadow"
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
                <h2 className="fw-bold mb-4" style={{color:'black'}}>Our Mission & Vision</h2>
                <p className="lead mb-4" style={{color:'black'}}>
                  We are committed to uplifting the Padmashali community by providing educational, cultural, and developmental content through our platforms.
                </p>
                <p style={{color:'black'}}>
                  We aim to connect, inform, and inspire individuals in the community through meaningful interviews, media exposure, and social impact projects.
                </p>
                <ul className="list-unstyled" style={{color:'black'}}>
                  <li className="mb-2"><i className="bi bi-check-circle-fill me-2" style={{ color: '#6c5ce7' }}></i> Community-centric content</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill me-2" style={{ color: '#6c5ce7' }}></i> Employment & collaboration opportunities</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill me-2" style={{ color: '#6c5ce7' }}></i> Showcasing achievements within the Padmashali community</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill me-2" style={{ color: '#6c5ce7' }}></i> Promoting culture and heritage</li>
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
                  {/* <Card.Img 
                    variant="top" 
                    src="/assets/images/mission.jpg" 
                    alt="Our Mission" 
                    className="img-fluid"
                  /> */}
                  <Card.Body style={{ backgroundColor: '#6c5ce7', color: 'white' }}>
                    <Card.Text>
                      "Strengthening the Padmashali community through storytelling, empowerment, and shared success."
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
      <section className="team-section py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className="text-center fw-bold mb-5" style={{color:'black'}}>Meet The Founder</h2>
            <p className="text-center lead mb-5" style={{color:'black'}}>
              Behind Netha TV and Online Studio 9 TV is a dedicated individual striving to elevate the voices of the Padmashali community.
            </p>
            <Row>
              {teamMembers.map((member, index) => (
                <Col lg={4} md={6} key={member.id} className="mb-4" style={{color:'black'}}>
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
            <h2 className="text-center fw-bold mb-5" style={{color:'black'}}>Our Core Values</h2>
            <Row>
              <Col md={3} sm={6} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <div className="icon-box rounded-circle mb-3 mx-auto" style={{ backgroundColor: '#6c5ce7', color: 'white' }}>
                      <i className="bi bi-lightbulb fs-3"></i>
                    </div>
                    <Card.Title>Empowerment</Card.Title>
                    <Card.Text>
                      We empower individuals and communities through knowledge and storytelling.
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
                    <Card.Title>Unity</Card.Title>
                    <Card.Text>
                      We believe in bringing people together for collective growth and success.
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
                    <Card.Title>Dedication</Card.Title>
                    <Card.Text>
                      Our commitment to the community drives everything we do.
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
                      We are passionate about media, storytelling, and community growth.
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
            <h2 className="fw-bold mb-4">Connect With Us</h2>
            <p className="lead mb-4">
              <strong>Name:</strong> Putta Rushi Krishna Netha<br />
              <strong>Phone:</strong> 9666660270, 9030022556<br />
              <strong>Email:</strong> nethamediavision@gmail.com, rushikrishna@gmail.com<br />
              <strong>Twitter:</strong> @netha_media | <strong>Facebook:</strong> NETHAMEDIAVISION09<br />
              <strong>YouTube:</strong> @NETHAMEDIA, @onlinestudio9tv<br />
              <strong>Follow Us:</strong> Facebook - OSNineTV | Twitter - @onlinestudio9tv
            </p>
          </motion.div>
        </Container>
      </section>
    </motion.div>
  );
};

export default About;
