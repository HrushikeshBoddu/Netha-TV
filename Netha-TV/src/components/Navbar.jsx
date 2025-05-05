import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiClock,
  FiCalendar,
  FiFilm,
  FiInfo,
  FiTrendingUp
} from 'react-icons/fi';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import logo from '../media/Netha_logo.png';

const Navbar = () => {
  const location = useLocation();

  const links = [
    { path: '/', icon: <FiHome />, label: 'Home' },
    { path: '/posts', icon: <FiClock />, label: 'Posts' },
    { path: '/events', icon: <FiCalendar />, label: 'Events' },
    { path: '/vlogs', icon: <FiFilm />, label: 'Vlogs' },
    { path: '/about', icon: <FiInfo />, label: 'About' },
    { path: '/contact', icon: <FiInfo />, label: 'Contact' }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.1 }}
      className="navbar navbar-expand-lg fixed-top"
      style={{
        background: '#ece9f9',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="container-fluid">

        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Netha TV Logo" className="logo-icon me-2" style={{ height: '50px', width: 'auto' }} />
        </Link>


        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ color: 'var(--accent)' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav" >
          <ul className="navbar-nav d-flex align-items-center" style={{ gap: '26px' }}>
            {links.map((link) => (
              <li className="nav-item" key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link d-flex align-items-center ${location.pathname === link.path ? 'active' : ''}`}
                  style={{ gap: '8px' }}
                >
                  {link.icon}
                  <span style={{ color: 'black' }}>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;