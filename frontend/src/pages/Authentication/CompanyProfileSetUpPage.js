import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { useAuth } from '../../context/AuthContext';
import { 
  sanitizeFormData, 
  secureFormSubmission, 
  validateURL
} from '../../utils/security';

const CompanyProfileSetUpPage = () => {
  const navigate = useNavigate();
  const { createProfile } = useAuth();
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    website: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedProfile, setSavedProfile] = useState(null);

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
    setSuccess('');
    setIsLoading(true);

    try {
      // Validate form data with security measures
      const validation = {
        companyName: { required: true, length: { min: 1, max: 100 } },
        industry: { length: { min: 0, max: 100 } },
        website: { url: true, length: { min: 0, max: 200 } }
      };

      const secureResult = secureFormSubmission(formData, validation);
      
      if (!secureResult.isValid) {
        setError(secureResult.errors[0]);
        setIsLoading(false);
        return;
      }

      // Additional validation
      if (!formData.companyName.trim()) {
        setError('Company name is required');
        setIsLoading(false);
        return;
      }

      if (formData.website && !validateURL(formData.website)) {
        setError('Website must be a valid URL (e.g., https://example.com)');
        setIsLoading(false);
        return;
      }

      // Sanitize the data before sending
      const sanitizedData = sanitizeFormData(formData);

      // Create the exact request body as specified in the API
      const apiRequestBody = {
        companyName: sanitizedData.companyName,
        industry: sanitizedData.industry || null,
        website: sanitizedData.website || null
      };

      console.log('Creating company profile with data:', apiRequestBody);

      // Create company profile using the centralized function
      // Add a small delay to ensure token is properly set after login
      await new Promise(resolve => setTimeout(resolve, 100));
      const result = await createProfile(apiRequestBody);
      
      setSuccess('Profile created successfully!');
      setSavedProfile(result); // Save the returned profile
      
      // Save the company name for welcome message
      localStorage.setItem('name', result.companyName || sanitizedData.companyName);
        
      // Redirect to home after saving profile
      setTimeout(() => {
        navigate('/home');
      }, 800);
    } catch (err) {
      console.error('Profile setup error:', err);
      
      if (err.message) {
        setError(err.message);
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
            <h1 className="login-title">Set Up Your Company Profile</h1>
            <p className="login-subtitle">Complete your company information to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-group">
              <label htmlFor="companyName">Company Name *</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter your company name"
                maxLength={100}
                required
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="industry">Industry</label>
              <input
                type="text"
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="Enter your industry"
                maxLength={100}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="website">Website</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                maxLength={200}
                disabled={isLoading}
              />
              <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '4px' }}>
                Include http:// or https:// in the URL
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

          {savedProfile && (
            <div className="profile-info" style={{ marginTop: 24 }}>
              <h3>Saved Company Profile</h3>
              <div><strong>Company Name:</strong> {savedProfile.companyName}</div>
              <div><strong>Industry:</strong> {savedProfile.industry}</div>
              <div><strong>Website:</strong> {savedProfile.website}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyProfileSetUpPage;
