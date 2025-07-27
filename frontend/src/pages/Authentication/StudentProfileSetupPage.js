import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/Footer';
import './LoginPage.css';
import { 
  sanitizeFormData, 
  secureFormSubmission 
} from '../../utils/security';

const StudentProfileSetupPage = () => {
  const navigate = useNavigate();
  const { createProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    university: '',
    major: '',
    graduationYear: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Validate form data with security measures
      const validation = {
        fullName: { required: true, length: { min: 1, max: 100 } },
        university: { required: true, length: { min: 1, max: 100 } },
        major: { required: true, length: { min: 1, max: 100 } },
        graduationYear: { required: true }
      };

      const secureResult = secureFormSubmission(formData, validation);
      
      if (!secureResult.isValid) {
        setError(secureResult.errors[0]);
      setIsLoading(false);
      return;
    }

      // Additional validation
      if (!formData.fullName.trim() || !formData.university.trim() || !formData.major.trim()) {
        setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    const year = Number(formData.graduationYear);
      const currentYear = new Date().getFullYear();
      
      if (isNaN(year) || year < 1900 || year > currentYear + 10) {
        setError(`Graduation year must be between 1900 and ${currentYear + 10}`);
      setIsLoading(false);
      return;
    }

      // Sanitize the data before sending
      const sanitizedData = sanitizeFormData({
        fullName: formData.fullName,
        university: formData.university,
        major: formData.major,
        graduationYear: year
      });

      // Create student profile using the centralized function
      // Add a small delay to ensure token is properly set after login
      await new Promise(resolve => setTimeout(resolve, 100));
      const result = await createProfile(sanitizedData);
      
      // Save the full name for welcome message
      localStorage.setItem('name', result.fullName || sanitizedData.fullName);
      
      setSuccess('Profile created successfully!');
      setTimeout(() => {
        navigate('/home');
      }, 800);
    } catch (err) {
      console.error('Profile setup error:', err);
      
      if (err.message) {
        setError(err.message);
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your connection and try again.');
      } else {
        setError('Failed to set up profile. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
            <h1 className="login-title">Set Up Your Student Profile</h1>
            <p className="login-subtitle">Complete your information to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                maxLength={100}
                required
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="university">University *</label>
              <input
                type="text"
                id="university"
                name="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="Enter your university"
                maxLength={100}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="major">Major *</label>
              <input
                type="text"
                id="major"
                name="major"
                value={formData.major}
                onChange={handleChange}
                placeholder="Enter your major"
                maxLength={100}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="graduationYear">Graduation Year *</label>
              <input
                type="number"
                id="graduationYear"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                placeholder="e.g. 2025"
                min={1900}
                max={new Date().getFullYear() + 10}
                required
                disabled={isLoading}
              />
              <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '4px' }}>
                Enter the year you expect to graduate
              </small>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading && <span className="loading-spinner"></span>}
              {isLoading ? 'Creating Profile...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StudentProfileSetupPage;
