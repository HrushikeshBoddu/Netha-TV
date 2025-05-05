import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles/main.css';
import './styles/animations.css';
import './styles/colors.css';
import Home from './pages/Home';  // Add your page components like Home, About, etc.
import About from './pages/About';  // Example additional page
import Events from './pages/Events';
import Posts from './pages/Posts';
import Vlogs from './pages/Vlogs';
import ContactForm from './pages/ContactForm';


function App() {
  return (
    <Router> {/* Wrap the entire app with Router */}
      <div className="app">
        <Navbar />
        <main className="main-content">
          {/* Define Routes for different pages */}
          <Routes>
            <Route path="/" element={<Home />} /> {/* Home Page Route */}
            <Route path="/about" element={<About />} /> 
            <Route path="/Events" element={<Events />} /> 
            <Route path="/Posts" element={<Posts />} /> 
            <Route path="/Vlogs" element={<Vlogs />} /> 
            <Route path="/contact" element={<ContactForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
