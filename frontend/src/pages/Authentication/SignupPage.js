import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';
import { 
  sanitizeFormData, 
  secureFormSubmission, 
  RateLimiter 
} from '../../utils/security';

const SignupPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize rate limiter for signup attempts
  const [rateLimiter] = useState(() => new RateLimiter(3, 600000)); // 3 attempts per 10 minutes

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
      if (!rateLimiter.isAllowed('signup')) {
        setError('Too many signup attempts. Please wait 10 minutes before trying again.');
        setIsLoading(false);
        return;
      }

      // Validate form data with security measures
      const validation = {
        email: { required: true, email: true },
        password: { required: true, password: true },
        confirmPassword: { required: true },
        role: { required: true }
      };

      const secureResult = secureFormSubmission(formData, validation);
      
      if (!secureResult.isValid) {
        setError(secureResult.errors[0]);
        setIsLoading(false);
        return;
      }

      // Additional validation
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      // Validate role
      if (!['student', 'company'].includes(formData.role)) {
        setError('Please select a valid role');
        setIsLoading(false);
        return;
      }

      // Sanitize the data before sending
      const sanitizedData = sanitizeFormData({
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      setError('');
      // Registration API call with loading state and error handling
      try {
        await register(sanitizedData);
        // Reset rate limiter on successful registration
        rateLimiter.reset('signup');
        // Redirect directly to login page
        navigate('/login');
      } catch (err) {
        setError(err.message || 'Registration failed');
      }
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
          <h1 className="login-title">Create Account</h1>
          <p className="login-subtitle">Join Fursa today and start your journey</p>
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
              placeholder="Create a password (min. 8 characters)"
              required
              disabled={isLoading}
              maxLength={128}
              autoComplete="new-password"
            />
            <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '4px' }}>
              Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
              maxLength={128}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">I am a</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="company">Company</option>
            </select>
          </div>

          <button
            type="submit"
            className="signup-btn"
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <div className="login-links">
          <p>
            Already have an account?{' '}
            <a href="/login" className="signup-link">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;