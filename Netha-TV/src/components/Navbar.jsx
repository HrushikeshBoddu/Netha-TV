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

const Navbar = () => {
  const location = useLocation();
  
  const links = [
    { path: '/', icon: <FiHome />, label: 'Home' },
    { path: '/posts', icon: <FiClock />, label: 'Posts' },
    { path: '/events', icon: <FiCalendar />, label: 'Events' },
    { path: '/vlogs', icon: <FiFilm />, label: 'Vlogs' },
    { path: '/about', icon: <FiInfo />, label: 'About' }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="navbar navbar-expand-lg fixed-top"
      style={{
        background: 'rgba(26, 26, 46, 0.9)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <FiTrendingUp className="logo-icon me-2" />
          <span className="logo-text">Netha - TV</span>
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
        
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            {links.map((link) => (
              <li className="nav-item" key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link d-flex align-items-center ${location.pathname === link.path ? 'active' : ''}`}
                  style={{ gap: '8px' }}
                >
                  {link.icon}
                  <span>{link.label}</span>
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