import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaLock, FaSignOutAlt, FaBuilding, FaGraduationCap, FaPalette } from 'react-icons/fa';
import ThemeToggle from '../../components/ThemeToggle';
import { 
  sanitizeFormData, 
  secureFormSubmission, 
  RateLimiter 
} from '../../utils/security';
import config from '../../config';
import { Box, VStack, HStack, Text, Button, Heading, Input, Spinner, useToast, useColorModeValue, Divider } from '@chakra-ui/react';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout, accessToken, updateProfile, createProfile } = useAuth();
  const [message, setMessage] = useState({ text: '', type: '' });
  const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Initialize rate limiter for password change attempts
  const [rateLimiter] = useState(() => new RateLimiter(3, 300000)); // 3 attempts per 5 minutes

  // Student profile state
  const [studentProfile, setStudentProfile] = useState({
    fullName: user?.studentProfile?.fullName || '',
    university: user?.studentProfile?.university || '',
    major: user?.studentProfile?.major || '',
    graduationYear: user?.studentProfile?.graduationYear || '',
  });

  // Company profile state
  const [companyProfile, setCompanyProfile] = useState({
    companyName: user?.companyProfile?.companyName || '',
    industry: user?.companyProfile?.industry || '',
    website: user?.companyProfile?.website || '',
  });

  const pageBg = useColorModeValue('white', '#18181b');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardText = useColorModeValue('gray.800', 'white');
  const cardSubText = useColorModeValue('gray.600', 'gray.300');
  const cardBorder = useColorModeValue('gray.100', 'gray.700');

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (user.role === 'student') {
      setStudentProfile((prev) => ({ ...prev, [name]: value }));
    } else {
      setCompanyProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStudentProfileSubmit = async (e) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileMessage({ text: '', type: '' });
  
    try {
      const sanitizedData = sanitizeFormData({
        ...studentProfile,
        graduationYear: Number(studentProfile.graduationYear),
      });
  
      const result = await updateProfile(sanitizedData);
  
      // Update local state with the result
      setStudentProfile(result);
      
      // Save the full name for welcome message
      localStorage.setItem('name', result.fullName);
  
      setProfileMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setProfileMessage({ text: err.message || 'Failed to update profile', type: 'error' });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleCompanyProfileSubmit = async (e) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileMessage({ text: '', type: '' });
  
    try {
      const sanitizedData = sanitizeFormData(companyProfile);
      
      // Check if we need to create or update the profile
      const isUpdate = Boolean(user?.companyProfile);
      
      let result;
      if (isUpdate) {
        result = await updateProfile(sanitizedData);
      } else {
        // If no profile exists, we should use createProfile instead
        result = await createProfile(sanitizedData);
      }
  
      // Update local state with the result
      setCompanyProfile(result);
      
      // Save the company name for welcome message  
      localStorage.setItem('name', result.companyName);
  
      setProfileMessage({ 
        text: isUpdate ? 'Company profile updated successfully!' : 'Company profile created successfully!', 
        type: 'success' 
      });
    } catch (err) {
      setProfileMessage({ text: err.message || 'Failed to update company profile', type: 'error' });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    // Clear error message when user starts typing
    if (message.text) {
      setMessage({ text: '', type: '' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Check rate limiting
      if (!rateLimiter.isAllowed('password-change')) {
        setMessage({ 
          text: 'Too many password change attempts. Please wait 5 minutes before trying again.', 
          type: 'error' 
        });
        setIsLoading(false);
        return;
      }

      // Validate form data with security measures
      const validation = {
        oldPassword: { required: true },
        newPassword: { required: true, password: true },
        confirmPassword: { required: true }
      };

      const secureResult = secureFormSubmission(passwords, validation);
      
      if (!secureResult.isValid) {
        setMessage({ text: secureResult.errors[0], type: 'error' });
        setIsLoading(false);
        return;
      }

      // Additional validation
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
        setIsLoading(false);
        return;
      }

      if (passwords.oldPassword === passwords.newPassword) {
        setMessage({ text: 'New password must be different from the current password', type: 'error' });
        setIsLoading(false);
      return;
    }

      // Sanitize the data before sending
      const sanitizedData = sanitizeFormData({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      });

      // Make API request with proper structure
      const response = await fetch(`${config.API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          oldPassword: sanitizedData.oldPassword,
          newPassword: sanitizedData.newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setMessage({ text: 'Invalid credentials or old password', type: 'error' });
        } else {
        setMessage({ text: data.message || 'Failed to update password', type: 'error' });
        }
        // Reset rate limiter on failure
        rateLimiter.reset('password-change');
      } else {
        setMessage({ text: 'Password changed successfully', type: 'success' });
        // Clear form on success
        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        // Reset rate limiter on success
        rateLimiter.reset('password-change');
      }
    } catch (err) {
      console.error('Password change error:', err);
      setMessage({ text: 'Network error. Please check your connection and try again.', type: 'error' });
      // Reset rate limiter on error
      rateLimiter.reset('password-change');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box minH="100vh" bg={pageBg} py={10} px={2}>
      <Box maxW="2xl" mx="auto" bg={cardBg} borderRadius="2xl" boxShadow="2xl" p={8}>
        <Heading size="xl" mb={6} color={cardText} textAlign="center">
          Settings
        </Heading>        <div className="settings-content">
          <Box 
            className="settings-card" 
            style={{ 
              background: cardBg, 
              color: cardText,
              border: `1px solid ${cardBorder}`
            }}
          >
            <h2 className="settings-card-header">
              <FaUser /> Profile Information
            </h2>
            {user ? (
              <div className="profile-info-content">
                <div className="user-type-badge">
                  {user.role === 'student' ? <><FaGraduationCap /> Student Account</> : <><FaBuilding /> Company Account</>}
                </div>              <div className="info-grid">
                  <div className="info-item">
                    <strong>📧 Email:</strong>
                    <span>{user.email}</span>
                  </div>
                  {user.role === 'student' && user.studentProfile ? (                    <>
                      <div className="info-item"><strong>📝 Full Name:</strong> <span>{user.studentProfile.fullName}</span></div>
                      <div className="info-item"><strong>🏫 University:</strong> <span>{user.studentProfile.university}</span></div>
                      <div className="info-item"><strong>📚 Major:</strong> <span>{user.studentProfile.major}</span></div>
                      <div className="info-item"><strong>🎓 Graduation Year:</strong> <span>{user.studentProfile.graduationYear}</span></div>
                    </>
                  ) : user.role === 'company' && user.companyProfile ? (                    <>
                      <div className="info-item"><strong>🏢 Company Name:</strong> <span>{user.companyProfile.companyName}</span></div>
                      <div className="info-item"><strong>🏭 Industry:</strong> <span>{user.companyProfile.industry}</span></div>
                      <div className="info-item"><strong>🌐 Website:</strong> <span>{user.companyProfile.website}</span></div>
                    </>
                  ) : null}
                </div>
              </div>            ) : (
              <p>Please log in to view your profile information.</p>
            )}
          </Box>

          {user?.role === 'student' && (
            <Box 
              className="settings-card" 
              style={{ 
                background: cardBg, 
                color: cardText,
                border: `1px solid ${cardBorder}`
              }}
            >
              <h2 className="settings-card-header">
                <FaGraduationCap /> Edit Student Profile
              </h2>
              <form className="settings-form" onSubmit={handleStudentProfileSubmit}>                <div className="form-group">
                  <label>📝 Full Name</label>
                  <input type="text" name="fullName" value={studentProfile.fullName} onChange={handleProfileChange} disabled={isProfileLoading} />
                </div>
                <div className="form-group">
                  <label>🏫 University</label>
                  <input type="text" name="university" value={studentProfile.university} onChange={handleProfileChange} disabled={isProfileLoading} />
                </div>
                <div className="form-group">
                  <label>📚 Major</label>
                  <input type="text" name="major" value={studentProfile.major} onChange={handleProfileChange} disabled={isProfileLoading} />
                </div>
                <div className="form-group">
                  <label>🎓 Graduation Year</label>
                  <input type="number" name="graduationYear" value={studentProfile.graduationYear} onChange={handleProfileChange} disabled={isProfileLoading} />
                </div>
                {profileMessage.text && (
                  <div className={`message ${profileMessage.type}`}>
                    {profileMessage.text}
                  </div>
                )}                <button type="submit" className="btn-primary" disabled={isProfileLoading}>
                  {isProfileLoading ? 'Updating Profile...' : 'Update Profile'}
                </button>
              </form>
            </Box>
          )}

          {user?.role === 'company' && (
            <Box 
              className="settings-card" 
              style={{ 
                background: cardBg, 
                color: cardText,
                border: `1px solid ${cardBorder}`
              }}
            >
              <h2 className="settings-card-header">
                <FaBuilding /> Edit Company Profile
              </h2>
              <form className="settings-form" onSubmit={handleCompanyProfileSubmit}>                <div className="form-group">
                  <label>🏢 Company Name</label>
                  <input type="text" name="companyName" value={companyProfile.companyName} onChange={handleProfileChange} disabled={isProfileLoading} />
                </div>
                <div className="form-group">
                  <label>🏭 Industry</label>
                  <input type="text" name="industry" value={companyProfile.industry} onChange={handleProfileChange} disabled={isProfileLoading} />
                </div>
                <div className="form-group">
                  <label>🌐 Website</label>
                  <input type="url" name="website" value={companyProfile.website} onChange={handleProfileChange} disabled={isProfileLoading} />
                </div>
                {profileMessage.text && (
                  <div className={`message ${profileMessage.type}`}>
                    {profileMessage.text}
                  </div>
                )}                <button type="submit" className="btn-primary" disabled={isProfileLoading}>
                  {isProfileLoading ? 'Updating Profile...' : 'Update Company Profile'}
                </button>
              </form>
            </Box>
          )}

          <Box 
            className="settings-card" 
            style={{ 
              background: cardBg, 
              color: cardText,
              border: `1px solid ${cardBorder}`
            }}
          >
            <h2 className="settings-card-header">
              <FaLock /> Change Password
            </h2>
            <form className="settings-form" onSubmit={handlePasswordSubmit}>              <div className="form-group">
                <label>🔐 Current Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwords.oldPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  required
                  disabled={isLoading}
                  maxLength={128}
                  autoComplete="current-password"
                />
              </div>              <div className="form-group">
                <label>🆕 New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password (min. 8 characters)"
                  required
                  disabled={isLoading}
                  maxLength={128}
                  autoComplete="new-password"
                />                <small style={{ 
                  color: '#667eea', 
                  fontSize: '0.85rem', 
                  marginTop: '6px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  🔒 Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.
                </small>
              </div>              <div className="form-group">
                <label>✅ Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  required
                  disabled={isLoading}
                  maxLength={128}
                  autoComplete="new-password"
                />
              </div>
              {message.text && (
                <div className={`message ${message.type}`}>
                  {message.text}
                </div>
              )}              <button 
                type="submit" 
                className="btn-primary"
                disabled={isLoading}              >
                {isLoading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </Box>

          {/* Theme Toggle Section */}
          <Box 
            className="settings-card" 
            style={{ 
              background: cardBg, 
              color: cardText,
              border: `1px solid ${cardBorder}`
            }}
          >
            <h2 className="settings-card-header">
              <FaPalette /> Appearance
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              <p style={{ 
                color: cardSubText, 
                margin: 0,
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                Switch between light and dark modes to customize your viewing experience.
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: useColorModeValue('#f8fafc', '#2d3748'),
                borderRadius: '12px',
                border: `1px solid ${cardBorder}`
              }}>
                <span style={{ color: cardText, fontWeight: '600' }}>Theme:</span>
                <ThemeToggle />
              </div>
            </div>
          </Box>

          <Box 
            className="settings-card" 
            style={{ 
              background: cardBg, 
              color: cardText,
              border: `1px solid ${cardBorder}`
            }}
          >
            <h2 className="settings-card-header">
              <FaSignOutAlt /> Account Actions
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              alignItems: 'flex-start'
            }}>
              <Box style={{
                background: useColorModeValue(
                  'linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%)',
                  'linear-gradient(135deg, #4a1a1a 0%, #6b2e2e 100%)'
                ),
                padding: '1.5rem',
                borderRadius: '16px',
                border: useColorModeValue(
                  '1px solid rgba(229, 62, 62, 0.2)',
                  '1px solid rgba(220, 38, 38, 0.3)'
                ),
                width: '100%',
                maxWidth: '400px'
              }}>
                <h4 style={{ 
                  color: useColorModeValue('#c53030', '#fca5a5'), 
                  fontWeight: '700',
                  marginBottom: '0.75rem',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  ⚠️ Logout
                </h4>
                <p style={{ 
                  color: useColorModeValue('#c53030', '#f87171'), 
                  fontSize: '14px',
                  lineHeight: '1.6',
                  margin: '0 0 1rem 0',
                  fontWeight: '500'
                }}>
                  You will be signed out of your account and redirected to the login page.
                </p>
                <button onClick={handleLogout} className="btn-danger">
                  🚪 Logout
                </button>
              </Box>
            </div>
          </Box>
        </div>
      </Box>
    </Box>
  );
};

export default SettingsPage;