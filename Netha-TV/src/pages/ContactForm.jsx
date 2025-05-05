import React, { useState } from 'react';
import '../styles/ContactForm.css';


const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSuccess(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <section style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: 'black' }}>Contact Us</h2>

      {success && (
        <p style={{ color: 'green', marginBottom: '20px' }}>
          ✅ Thank you for contacting Netha TV! We'll get back to you soon.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: 'black' }}>Name</label><br />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '5px' }}
          />
        </div>

        {/* Email Field */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: 'black' }}>Email</label><br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '5px' }}
          />
        </div>

        {/* Phone Field */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: 'black' }}>Phone</label><br />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '5px' }}
          />
        </div>


        {/* Subject Field */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: 'black' }}>Subject</label><br />
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '5px' }}
          />
        </div>

        {/* Message Field */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: 'black' }}>Message</label><br />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            style={{ width: '100%', padding: '8px', borderRadius: '5px' }}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}>
          Send Message
        </button>

        <a
          href="https://www.youtube.com/@NETHATV9?sub_confirmation=1"
          className="floating-youtube-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="pulse-ring"></div>
          <div className="icon">▶</div>
        </a>

      </form>
    </section>
  );
};

export default ContactForm;
