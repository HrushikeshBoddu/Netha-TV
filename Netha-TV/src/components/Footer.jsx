import { FaGithub, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand Info */}
        <div className="footer-brand">
          <h3>Netha - TV</h3>
          <p>Discover what's trending worldwide</p>
        </div>

        {/* Navigation Links */}
        <div className="footer-links">
          <div className="link-group">
            <h4>Explore</h4>
            <a href="#">Trending</a>
            <a href="#">Live</a>
            <a href="#">Events</a>
          </div>
          <div className="link-group">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
          <div className="link-group">
            <h4>Legal</h4>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Cookies</a>
          </div>
        </div>

        {/* Social Icons */}
        <div className="social-links">
          <a href="#" aria-label="GitHub"><FaGithub /></a>
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="YouTube"><FaYoutube /></a>
        </div>
      </div>

      <div className="copyright">
        &copy; {new Date().getFullYear()} Ultra Trend. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
