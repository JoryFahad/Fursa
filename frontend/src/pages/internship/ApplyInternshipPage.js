import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext'; // TODO: Will be used when backend is ready

const ApplyInternshipPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // const { user, accessToken } = useAuth(); // TODO: Will be used when backend is ready
  
  const [internship, setInternship] = useState(null);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState({ resume: false, coverLetter: false });

  // TODO: Fetch internship details when component mounts
  useEffect(() => {
    const fetchInternship = async () => {
      try {
        // Check if we have internship data from navigation state first
        if (location.state && location.state.internship) {
          console.log('Using internship data from navigation state:', location.state.internship);
          setInternship(location.state.internship);
          return;
        }
        
        // Fallback to mock data if no state data is available
        // TODO: Create a public endpoint for students to view internship details
        console.log('No navigation state found, using mock data for ID:', id);
        const mockInternship = {
          id: id,
          title: 'Software Engineering Intern',
          description: 'Join our dynamic team and work on cutting-edge projects.',
          location: 'Riyadh, Saudi Arabia',
          companyName: 'TechCorp Saudi',
          duration: '3 months',
          applicationDeadline: '2025-07-15T00:00:00.000Z'
        };
        
        setInternship(mockInternship);
      } catch (err) {
        setError('Failed to load internship details');
        console.error('Error fetching internship:', err);
      }
    };

    if (id) {
      fetchInternship();
    }
  }, [id, location.state]);  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.includes('pdf') && !file.type.includes('doc') && !file.type.includes('docx')) {
        setError('Resume must be a PDF, DOC, or DOCX file');
        setResume(null);
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Resume file size must be less than 5MB');
        setResume(null);
        return;
      }      setResume(file);
      setError('');
    }
  };
  const handleCoverLetterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.includes('pdf') && !file.type.includes('doc') && !file.type.includes('docx')) {
        setError('Cover letter must be a PDF, DOC, or DOCX file');
        setCoverLetter(null);
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Cover letter file size must be less than 5MB');
        setCoverLetter(null);
        return;
      }      setCoverLetter(file);
      setError('');
    }
  };

  // Enhanced drag and drop handlers
  const handleDragEnter = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: true }));
  };

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      if (type === 'resume') {
        handleResumeChange({ target: { files } });
      } else {
        handleCoverLetterChange({ target: { files } });
      }
    }
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!resume || !coverLetter) {
      const missingFiles = [];
      if (!resume) missingFiles.push('resume');
      if (!coverLetter) missingFiles.push('cover letter');
      setError(`Please upload ${missingFiles.join(' and ')}`);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Mock application submission since the backend API is not ready
      // TODO: Implement real API call when backend is ready
      setTimeout(() => {
        setSuccess('Application submitted successfully!');
        setLoading(false);
        
        // Reset form
        setResume(null);
        setCoverLetter(null);
        
        // Navigate back after 2 seconds
        setTimeout(() => {
          navigate('/internships');
        }, 2000);
      }, 2000);    } catch (err) {
      console.error('Application submission error:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
      setLoading(false);
    }
  };
  const handleCancel = () => {
    navigate('/internships');
  };

  if (!internship) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '20px',
        fontWeight: '600'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
          <div>Loading internship details...</div>
        </div>
      </div>
    );
  }  return (
    <div style={{ 
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: '32px 24px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #fdf4ff 100%)'
    }}>
      {/* Add CSS animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in {
          animation: slideInUp 0.6s ease-out;
        }
        
        @media (max-width: 1024px) {
          .grid-responsive {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
        
        @media (max-width: 768px) {
          .header-title {
            font-size: 2.5rem !important;
          }
          .header-description {
            font-size: 1.1rem !important;
          }
          .form-container {
            padding: 24px !important;
          }
        }
      `}</style>
      
      {/* Header */}
      <div className="fade-in" style={{ 
        textAlign: 'center', 
        marginBottom: '48px',
        padding: '40px 20px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h1 className="header-title" style={{ 
          fontSize: '3.5rem', 
          fontWeight: '900', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '20px',
          letterSpacing: '-0.02em'
        }}>
          🚀 Apply for Internship
        </h1>
        <p className="header-description" style={{ 
          fontSize: '1.3rem', 
          color: '#4a5568',
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: '1.6',
          fontWeight: '500'
        }}>
          Submit your application and take the next step in your career journey
        </p>
      </div>

      <div className="grid-responsive" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '40px',
        alignItems: 'start'
      }}>{/* Main Content */}
        <div className="form-container" style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(44, 62, 80, 0.1)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative gradient overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }} />

          <form onSubmit={handleSubmit}>            {/* Resume Upload */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                marginBottom: '12px',
                fontWeight: '700',
                color: '#3730a3',
                fontSize: '1.2rem',
                letterSpacing: '0.01em',
              }}>
                <span role="img" aria-label="resume" style={{ marginRight: '8px' }}>📄</span>
                Resume/CV *
              </label>
              <div 
                style={{
                  position: 'relative',
                  border: dragActive.resume 
                    ? '2px solid #667eea' 
                    : '2px dashed #c7d2fe',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  background: dragActive.resume 
                    ? 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)'
                    : 'linear-gradient(135deg, #f0f9ff 0%, #fdf4ff 100%)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  transform: dragActive.resume ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: dragActive.resume 
                    ? '0 8px 24px rgba(102, 126, 234, 0.15)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}
                onDragEnter={(e) => handleDragEnter(e, 'resume')}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={(e) => handleDragLeave(e, 'resume')}
                onDrop={(e) => handleDrop(e, 'resume')}
              >                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '12px',
                  transform: dragActive.resume ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.3s ease'
                }}>
                  {dragActive.resume ? '⬇️' : '📁'}
                </div>
                <p style={{
                  fontSize: '16px',
                  color: '#4a5568',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {dragActive.resume 
                    ? 'Drop your resume here!' 
                    : 'Drag & drop your resume here, or click to browse'}
                </p>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#718096', 
                  margin: '0'
                }}>
                  Accepted formats: PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>              {resume && (
                <div style={{
                  marginTop: '16px',
                  padding: '20px',
                  background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
                  borderRadius: '16px',
                  border: '2px solid #28a745',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  animation: 'slideInUp 0.4s ease-out'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    📄
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      fontSize: '16px', 
                      color: '#155724', 
                      fontWeight: '700',
                      margin: '0 0 4px 0'
                    }}>
                      Resume uploaded successfully!
                    </p>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#155724', 
                      margin: '0 0 4px 0'
                    }}>
                      {resume.name}
                    </p>
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#6c757d', 
                      margin: '0'
                    }}>
                      {(resume.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <div style={{ fontSize: '24px' }}>✅</div>
                </div>
              )}
            </div>            {/* Cover Letter Upload */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                marginBottom: '12px',
                fontWeight: '700',
                color: '#3730a3',
                fontSize: '1.2rem',
                letterSpacing: '0.01em',
              }}>
                <span role="img" aria-label="cover letter" style={{ marginRight: '8px' }}>📝</span>
                Cover Letter *
              </label>
              <div 
                style={{
                  position: 'relative',
                  border: dragActive.coverLetter 
                    ? '2px solid #667eea' 
                    : '2px dashed #c7d2fe',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  background: dragActive.coverLetter 
                    ? 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)'
                    : 'linear-gradient(135deg, #f0f9ff 0%, #fdf4ff 100%)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  transform: dragActive.coverLetter ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: dragActive.coverLetter 
                    ? '0 8px 24px rgba(102, 126, 234, 0.15)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}
                onDragEnter={(e) => handleDragEnter(e, 'coverLetter')}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={(e) => handleDragLeave(e, 'coverLetter')}
                onDrop={(e) => handleDrop(e, 'coverLetter')}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"                  onChange={handleCoverLetterChange}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '12px',
                  transform: dragActive.coverLetter ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.3s ease'
                }}>
                  {dragActive.coverLetter ? '⬇️' : '📋'}
                </div>
                <p style={{
                  fontSize: '16px',
                  color: '#4a5568',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {dragActive.coverLetter 
                    ? 'Drop your cover letter here!' 
                    : 'Drag & drop your cover letter here, or click to browse'}
                </p>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#718096', 
                  margin: '0'
                }}>
                  Accepted formats: PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>              {coverLetter && (
                <div style={{
                  marginTop: '16px',
                  padding: '20px',
                  background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
                  borderRadius: '16px',
                  border: '2px solid #28a745',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  animation: 'slideInUp 0.4s ease-out'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    📝
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      fontSize: '16px', 
                      color: '#155724', 
                      fontWeight: '700',
                      margin: '0 0 4px 0'
                    }}>
                      Cover letter uploaded successfully!
                    </p>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#155724', 
                      margin: '0 0 4px 0'
                    }}>
                      {coverLetter.name}
                    </p>
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#6c757d', 
                      margin: '0'
                    }}>
                      {(coverLetter.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <div style={{ fontSize: '24px' }}>✅</div>
                </div>
              )}            </div>

            {/* Error Message */}
            {error && (
              <div style={{ 
                color: '#721c24', 
                background: 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)', 
                borderRadius: '16px', 
                padding: '20px', 
                marginBottom: '24px', 
                textAlign: 'center', 
                fontWeight: '700',
                border: '2px solid #dc3545',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '24px' }}>⚠️</span>
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div style={{ 
                color: '#155724', 
                background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)', 
                borderRadius: '16px', 
                padding: '20px', 
                marginBottom: '24px', 
                textAlign: 'center', 
                fontWeight: '700',
                border: '2px solid #28a745',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '24px' }}>🎉</span>
                {success}
              </div>
            )}            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '32px', flexWrap: 'wrap' }}>
              <button
                type="submit"
                disabled={loading || !resume || !coverLetter}
                style={{ 
                  padding: '14px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: (loading || !resume || !coverLetter) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: '14px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '200px',
                  background: (loading || !resume || !coverLetter) 
                    ? 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  opacity: (loading || !resume || !coverLetter) ? 0.7 : 1,
                  boxShadow: (loading || !resume || !coverLetter) 
                    ? '0 2px 8px rgba(0, 0, 0, 0.1)'
                    : '0 4px 12px rgba(102, 126, 234, 0.3)',
                  flex: '1'
                }}
                onMouseEnter={(e) => {
                  if (!(loading || !resume || !coverLetter)) {
                    e.target.style.transform = 'translateY(-2px) scale(1.02)';
                    e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!(loading || !resume || !coverLetter)) {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <span style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }}>⏳</span>
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <span style={{ marginRight: '8px' }}>🚀</span>
                    Submit Application
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: '14px 28px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: '14px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '160px',
                  background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                  color: '#2d3748',
                  border: '2px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  flex: '1'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%)';
                  e.target.style.transform = 'translateY(-2px) scale(1.02)';
                  e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)';
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
              >
                <span style={{ marginRight: '8px' }}>←</span>
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Internship Details Card */}
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 20px 40px rgba(44, 62, 80, 0.1)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            position: 'relative',
            overflow: 'hidden'
          }}>            {/* Company Logo Placeholder */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              {(internship.companyName || internship.company?.companyName || 'C').charAt(0)}
            </div>

            <div style={{ paddingRight: '70px', marginBottom: '24px' }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '800', 
                background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '8px',
                lineHeight: '1.3'
              }}>
                {internship.title}
              </h3>
              <p style={{ 
                color: '#667eea', 
                fontWeight: '700',
                fontSize: '16px',
                margin: '0'
              }}>
                🏢 {internship.companyName || internship.company?.companyName || 'Unknown Company'}
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                <span style={{ 
                  background: 'linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%)', 
                  color: '#234e52', 
                  padding: '8px 16px', 
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '700',
                  border: '1px solid rgba(34, 78, 82, 0.1)'
                }}>
                  📍 {internship.location}
                </span>
                <span style={{ 
                  background: 'linear-gradient(135deg, #fef5e7 0%, #fed7aa 100%)', 
                  color: '#c05621', 
                  padding: '8px 16px', 
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '700',
                  border: '1px solid rgba(192, 86, 33, 0.1)'
                }}>
                  🕒 {internship.duration}
                </span>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%)',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(229, 62, 62, 0.1)'
              }}>
                <p style={{ 
                  color: '#c53030', 
                  fontSize: '14px', 
                  fontWeight: '700',
                  margin: '0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>⏰</span>
                  Deadline: {new Date(internship.applicationDeadline).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Application Tips Card */}
          <div style={{
            background: 'linear-gradient(135deg, #fef5e7 0%, #fed7aa 100%)',
            borderRadius: '24px',
            padding: '32px',
            border: '1px solid rgba(192, 86, 33, 0.2)',
            boxShadow: '0 8px 24px rgba(192, 86, 33, 0.1)'
          }}>
            <h4 style={{ 
              color: '#c05621', 
              fontWeight: '800',
              marginBottom: '20px',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              💡 Application Tips
            </h4>
            <ul style={{ 
              color: '#c05621', 
              fontSize: '14px',
              lineHeight: '1.7',
              margin: '0',
              paddingLeft: '20px',
              fontWeight: '600'
            }}>
              <li style={{ marginBottom: '8px' }}>Ensure your resume is up-to-date and highlights relevant skills</li>
              <li style={{ marginBottom: '8px' }}>Write a compelling cover letter explaining why you're interested in this position</li>
              <li style={{ marginBottom: '8px' }}>Double-check all information before submitting</li>              <li>You can track your application status in your dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyInternshipPage; 