import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  sanitizeFormData, 
  secureFormSubmission, 
  RateLimiter 
} from '../../utils/security';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize rate limiter for login attempts
  const [rateLimiter] = useState(() => new RateLimiter(5, 300000)); // 5 attempts per 5 minutes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check rate limiting
      if (!rateLimiter.isAllowed('login')) {
        setError('Too many login attempts. Please wait 5 minutes before trying again.');
      setIsLoading(false);
      return;
    }

      // Validate form data with security measures
      const validation = {
        email: { required: true, email: true },
        password: { required: true }
      };

      const secureResult = secureFormSubmission(formData, validation);
      
      if (!secureResult.isValid) {
        setError(secureResult.errors[0]);
      setIsLoading(false);
      return;
    }

      // Sanitize the data before sending
      const sanitizedData = sanitizeFormData(formData);

      await login(sanitizedData);
      
      // Get user from localStorage (set by AuthContext)
      const user = JSON.parse(localStorage.getItem('user'));
      const name = localStorage.getItem('name'); // Always use the saved name
      console.log('LoginPage user after login:', user, name);
      
      if (user) {
        if (user.role === 'student' && (!name || name === 'null')) {
          navigate('/setup-student-profile');
        } else if (user.role === 'company' && (!name || name === 'null')) {
          navigate('/setup-company-profile');
        } else {
          navigate('/home');
        }
      } else {
        setError('Login failed: user info missing.');
      }
      
      // Reset rate limiter on successful login
      rateLimiter.reset('login');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      // Reset rate limiter on failure
      rateLimiter.reset('login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Floating background elements */}
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-text">Fursa</span>
            <span className="logo-dot">.</span>
          </div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to continue to Fursa</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              disabled={isLoading}
              maxLength={255}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              maxLength={128}
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading && <span className="loading-spinner"></span>}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="login-links">
          <p>
            Don't have an account?{' '}
            <a href="/signup" className="signup-link">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;