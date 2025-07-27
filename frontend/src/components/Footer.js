import React, { useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send the email to your backend
      console.log('Newsletter subscription:', email);
      setIsSubscribed(true);
      setEmail('');
      // Reset the success message after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Fursa</h3>
          <p>Fursa connects talented students with amazing internship opportunities. Our platform makes it easy to find and apply for internships that match your skills and career goals.</p>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul className="footer-links">
            <li><a href="mailto:support@fursa.com">support@fursa.com</a></li>
            <li><a href="tel:+966599008660">+966 59 900 8660</a></li>
            <li>123 Tech Street, Digital City</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <p>Connect with us on social media for the latest updates and opportunities.</p>
          <div className="social-links">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <span>LinkedIn</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <span>Twitter</span>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Fursa. All rights reserved. | <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a></p>
      </div>
    </footer>
  );
};

export default Footer;