import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import config from '../../config';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  Spinner,
  Flex,
  Badge,
  HStack,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaClock, FaBuilding, FaCheckCircle } from 'react-icons/fa';

const ApplyInternshipForm = () => {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, accessToken, refresh } = useAuth();
  const toast = useToast();

  // Color mode values for dark mode support
  const bgGradient = useColorModeValue(
    'linear(to-br, #f8fafc, #e2e8f0)', 
    'linear(to-br, #1a202c, #2d3748)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.600');
  const titleColor = useColorModeValue('gray.700', 'white');
  const textColor = useColorModeValue('gray.500', 'gray.300');
  const errorCardBg = useColorModeValue('white', 'gray.800');
  const loadingTextColor = useColorModeValue('gray.600', 'gray.400');
  
  // Internship details card colors
  const internshipCardBg = useColorModeValue('blue.50', 'blue.900');
  const internshipCardBorder = useColorModeValue('blue.200', 'blue.700');
  const internshipTitleColor = useColorModeValue('blue.700', 'blue.200');
  const internshipTextColor = useColorModeValue('blue.600', 'blue.300');
  const internshipDescColor = useColorModeValue('gray.700', 'gray.200');
  
  // Success card colors
  const successCardBg = useColorModeValue('green.50', 'green.900');
  const successCardBorder = useColorModeValue('green.200', 'green.700');
  const successTextColor = useColorModeValue('green.700', 'green.200');
  
  // Upload zone colors
  const uploadBg = useColorModeValue('gray.50', 'gray.700');
  const uploadBorder = useColorModeValue('gray.300', 'gray.600');
  const uploadHoverBg = useColorModeValue('blue.50', 'blue.900');
  const uploadActiveBg = useColorModeValue('blue.100', 'blue.800');
  const fileSelectedColor = useColorModeValue('green.600', 'green.300');

  // State variables
  const [internship, setInternship] = useState(location.state?.internship || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [dragActive, setDragActive] = useState({ resume: false, coverLetter: false });
  
  const fetchInternship = useCallback(async () => {
    try {
      const response = await fetch(`${config.API_URL}/internships/${internshipId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInternship(data);
      } else {
        throw new Error('Failed to fetch internship details');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [internshipId, accessToken]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      setError('Only students can apply for internships.');
      return;
    }

    // Try to get internship data from location state first
    if (location.state && location.state.internship) {
      setInternship(location.state.internship);
      setLoading(false);
      return;
    }

    // If no state data, fetch from API
    if (internshipId && accessToken) {
      setLoading(true);
      fetchInternship();
    }
  }, [user, internshipId, accessToken, fetchInternship, location.state, navigate]);

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.includes('pdf') && !file.type.includes('doc') && !file.type.includes('docx')) {
        setError('Resume must be a PDF, DOC, or DOCX file');
        setResume(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Resume file size must be less than 10MB');
        setResume(null);
        return;
      }
      setResume(file);
      setError('');
    }
  };

  const handleCoverLetterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.includes('pdf') && !file.type.includes('doc') && !file.type.includes('docx')) {
        setError('Cover letter must be a PDF, DOC, or DOCX file');
        setCoverLetter(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Cover letter file size must be less than 10MB');
        setCoverLetter(null);
        return;
      }
      setCoverLetter(file);
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
  };

  const handleApply = async () => {
    console.log('🚀 handleApply called');
    console.log('User:', user);
    console.log('User role:', user?.role);
    console.log('Access token exists:', !!accessToken);
    console.log('Internship:', internship);
    
    if (!user || user.role !== 'student') {
      console.log('❌ User validation failed');
      setError('Only students can apply for internships.');
      return;
    }

    console.log('✅ Starting application submission...');
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('internshipId', internship.id);
      console.log('📝 Added internshipId to FormData:', internship.id);
      
      if (resume) {
        formData.append('resume', resume);
        console.log('📄 Added resume to FormData:', resume.name);
      }
      if (coverLetter) {
        formData.append('coverLetter', coverLetter);
        console.log('📄 Added cover letter to FormData:', coverLetter.name);
      }
      
      const apiUrl = `${config.API_URL}/applications`;
      console.log('🌐 Making API call to:', apiUrl);
      console.log('🔑 Authorization header:', `Bearer ${accessToken?.substring(0, 20)}...`);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      console.log('📡 API Response status:', response.status);
      console.log('📡 API Response:', response);

      if (response.status === 201) {
        console.log('✅ Application submitted successfully!');
        setSuccess(true);
        toast({
          title: 'Application Submitted!',
          description: 'Your application has been submitted successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setTimeout(() => {
          navigate('/internships');
        }, 2000);
      } else if (response.status === 400) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || 'Invalid request data. Please check your information and try again.';
        if (errorMessage === 'Already applied to this internship') {
          setAlreadyApplied(true);
          setError('');
        } else {
          setError(errorMessage);
        }
      } else if (response.status === 401) {
        try {
          const newAccessToken = await refresh();
          const retryFormData = new FormData();
          retryFormData.append('internshipId', internship.id);
          if (resume) {
            retryFormData.append('resume', resume);
          }
          if (coverLetter) {
            retryFormData.append('coverLetter', coverLetter);
          }
          const retryResponse = await fetch(`${config.API_URL}/applications`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${newAccessToken}`,
            },
            body: retryFormData,
          });
          if (retryResponse.status === 201) {
            setSuccess(true);
            toast({
              title: 'Application Submitted!',
              description: 'Your application has been submitted successfully.',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
            setTimeout(() => {
              navigate('/internships');
            }, 2000);
          } else if (retryResponse.status === 400) {
            const errorData = await retryResponse.json().catch(() => ({}));
            const errorMessage = errorData.message || errorData.error || 'Invalid request data. Please check your information and try again.';
            if (errorMessage === 'Already applied to this internship') {
              setAlreadyApplied(true);
              setError('');
            } else {
              setError(errorMessage);
            }
          } else {
            setError('Authentication failed. Please log in again.');
            navigate('/login');
          }
        } catch (refreshError) {
          setError('Authentication failed. Please log in again.');
          navigate('/login');
        }
      } else if (response.status === 403) {
        setError('Only students can apply to internships.');
      } else if (response.status === 404) {
        setError('Internship not found.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || 'Server error occurred. Please try again later.';
        setError(errorMessage);
      }
    } catch (err) {
      console.error('❌ Network error occurred:', err);
      console.error('Error details:', err.message);
      setError('Network error. Please check your connection and try again.');
    } finally {
      console.log('🏁 handleApply finished, setting loading to false');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/internships');
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="80vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text fontSize="xl" color={loadingTextColor}>Loading internship details...</Text>
        </VStack>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" minH="80vh">
        <VStack spacing={6} textAlign="center" bg={errorCardBg} p={12} borderRadius="2xl" boxShadow="xl">
          <Text fontSize="3xl">⚠️</Text>
          <Heading size="lg" color="red.500">Oops! Something went wrong</Heading>
          <Text color={textColor} maxW="md">{error}</Text>
          <Button colorScheme="blue" onClick={() => navigate('/internships')}>
            ← Back to Internships
          </Button>
        </VStack>
      </Flex>
    );
  }

  if (!internship) {
    return (
      <Flex justify="center" align="center" minH="80vh">
        <VStack spacing={6} textAlign="center" bg={errorCardBg} p={12} borderRadius="2xl" boxShadow="xl">
          <Text fontSize="3xl">📋</Text>
          <Heading size="lg" color={titleColor}>Internship Not Found</Heading>
          <Text color={textColor} maxW="md">The internship you're looking for doesn't exist or has been removed.</Text>
          <Button colorScheme="blue" onClick={() => navigate('/internships')}>
            ← Back to Internships
          </Button>
        </VStack>
      </Flex>
    );
  }

  return (
    <>
      {/* CSS animations and responsive styles */}
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

      <Box 
        maxW="1400px" 
        mx="auto" 
        p={{ base: 6, md: 8 }}
        minH="100vh"
        bgGradient={bgGradient}
      >
        {/* Header */}
        <Box 
          className="fade-in"
          textAlign="center" 
          mb={12}
          p={{ base: 8, md: 10 }}
          bg={cardBg}
          borderRadius="24px"
          backdropFilter="blur(10px)"
          boxShadow="xl"
          border="1px solid"
          borderColor={cardBorder}
        >
          <Heading 
            className="header-title"
            as="h1" 
            size="3xl" 
            fontWeight="900" 
            bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
            bgClip="text"
            mb={5}
            letterSpacing="-0.02em"
          >
            🚀 Apply for Internship
          </Heading>
          <Text 
            className="header-description"
            fontSize={{ base: "lg", md: "xl" }}
            color={textColor}
            maxW="700px"
            mx="auto"
            lineHeight="1.6"
            fontWeight="500"
          >
            Submit your application and take the next step in your career journey
          </Text>
        </Box>

        <Box 
          className="grid-responsive"
          display="grid"
          gridTemplateColumns={{ base: "1fr", lg: "1fr 400px" }}
          gap={{ base: 8, lg: 10 }}
          alignItems="start"
        >
          {/* Main Form Content */}
          <Box
            className="form-container"
            bg={cardBg}
            borderRadius="24px"
            p={{ base: 6, md: 10 }}
            boxShadow="xl"
            border="1px solid"
            borderColor={cardBorder}
            position="relative"
            overflow="hidden"
          >
            {/* Decorative gradient overlay */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              height="6px"
              bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
            />

            {success ? (
              <VStack spacing={6} textAlign="center" py={8}>
                <Box fontSize="4xl">🎉</Box>
                <Heading size="lg" color={successTextColor}>Application Submitted!</Heading>
                <Text color={successTextColor}>Your application has been submitted successfully. Redirecting...</Text>
              </VStack>
            ) : (
              <VStack spacing={8} align="stretch">
                {/* Resume Upload */}
                <Box>
                  <Text
                    fontWeight="700"
                    color={internshipTitleColor}
                    fontSize="xl"
                    mb={3}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    📄 Resume/CV (Optional)
                  </Text>
                  <Box
                    position="relative"
                    border="2px dashed"
                    borderColor={dragActive.resume ? "blue.400" : uploadBorder}
                    borderRadius="16px"
                    p={6}
                    textAlign="center"
                    bg={dragActive.resume ? uploadActiveBg : uploadBg}
                    cursor="pointer"
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{ bg: uploadHoverBg, borderColor: "blue.300" }}
                    transform={dragActive.resume ? "scale(1.02)" : "scale(1)"}
                    boxShadow={dragActive.resume ? "0 8px 24px rgba(102, 126, 234, 0.15)" : "0 4px 12px rgba(0, 0, 0, 0.05)"}
                    onDragEnter={(e) => handleDragEnter(e, 'resume')}
                    onDragLeave={(e) => handleDragLeave(e, 'resume')}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, 'resume')}
                    onClick={() => document.getElementById('resume-upload').click()}
                  >
                    <VStack spacing={3}>
                      <Box 
                        fontSize="3rem"
                        transform={dragActive.resume ? "scale(1.1)" : "scale(1)"}
                        transition="transform 0.3s ease"
                      >
                        {dragActive.resume ? '⬇️' : (resume ? '✅' : '📁')}
                      </Box>
                      <Text color={textColor} fontSize="sm" fontWeight="600">
                        {dragActive.resume 
                          ? 'Drop your resume here!' 
                          : resume 
                            ? `Selected: ${resume.name}` 
                            : 'Click to upload or drag and drop your resume'}
                      </Text>
                      <Text fontSize="xs" color={textColor}>
                        PDF, DOC, DOCX up to 10MB
                      </Text>
                    </VStack>
                    <input
                      id="resume-upload"
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
                  </Box>
                </Box>

                {/* Cover Letter Upload */}
                <Box>
                  <Text
                    fontWeight="700"
                    color={internshipTitleColor}
                    fontSize="xl"
                    mb={3}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    📝 Cover Letter (Optional)
                  </Text>
                  <Box
                    position="relative"
                    border="2px dashed"
                    borderColor={dragActive.coverLetter ? "blue.400" : uploadBorder}
                    borderRadius="16px"
                    p={6}
                    textAlign="center"
                    bg={dragActive.coverLetter ? uploadActiveBg : uploadBg}
                    cursor="pointer"
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{ bg: uploadHoverBg, borderColor: "blue.300" }}
                    transform={dragActive.coverLetter ? "scale(1.02)" : "scale(1)"}
                    boxShadow={dragActive.coverLetter ? "0 8px 24px rgba(102, 126, 234, 0.15)" : "0 4px 12px rgba(0, 0, 0, 0.05)"}
                    onDragEnter={(e) => handleDragEnter(e, 'coverLetter')}
                    onDragLeave={(e) => handleDragLeave(e, 'coverLetter')}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, 'coverLetter')}
                    onClick={() => document.getElementById('cover-letter-upload').click()}
                  >
                    <VStack spacing={3}>
                      <Box 
                        fontSize="3rem"
                        transform={dragActive.coverLetter ? "scale(1.1)" : "scale(1)"}
                        transition="transform 0.3s ease"
                      >
                        {dragActive.coverLetter ? '⬇️' : (coverLetter ? '✅' : '📋')}
                      </Box>
                      <Text color={textColor} fontSize="sm" fontWeight="600">
                        {dragActive.coverLetter 
                          ? 'Drop your cover letter here!' 
                          : coverLetter 
                            ? `Selected: ${coverLetter.name}` 
                            : 'Click to upload or drag and drop your cover letter'}
                      </Text>
                      <Text fontSize="xs" color={textColor}>
                        PDF, DOC, DOCX up to 10MB
                      </Text>
                    </VStack>
                    <input
                      id="cover-letter-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCoverLetterChange}
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
                  </Box>
                </Box>

                {/* Error Message */}
                {error && (
                  <Box 
                    color="red.700" 
                    bg="red.50" 
                    borderRadius="16px" 
                    p={5} 
                    textAlign="center" 
                    fontWeight="700"
                    border="2px solid"
                    borderColor="red.200"
                    fontSize="sm"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={3}
                  >
                    <Text fontSize="xl">⚠️</Text>
                    {error}
                  </Box>
                )}

                {/* Action Buttons */}
                <HStack spacing={4} flexWrap="wrap">
                  <Button
                    onClick={handleApply}
                    isLoading={loading}
                    loadingText="Submitting..."
                    size="lg"
                    flex="1"
                    bgGradient="linear(to-r, blue.400, teal.400)"
                    color="white"
                    _hover={{
                      bgGradient: 'linear(to-r, blue.500, teal.500)',
                      boxShadow: 'lg',
                      transform: 'translateY(-1px)'
                    }}
                    transition="all 0.3s ease"
                    disabled={loading}
                    minW="200px"
                  >
                    {loading ? (
                      <>⏳ Submitting Application...</>
                    ) : (
                      <>🚀 Submit Application</>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleCancel}
                    size="lg"
                    variant="outline"
                    colorScheme="gray"
                    flex="1"
                    minW="160px"
                    _hover={{
                      bg: useColorModeValue('gray.50', 'gray.700'),
                      transform: 'translateY(-1px)'
                    }}
                    transition="all 0.3s ease"
                  >
                    ← Cancel
                  </Button>
                </HStack>
              </VStack>
            )}
          </Box>

          {/* Sidebar */}
          <VStack spacing={6}>
            {/* Internship Details Card */}
            <Box
              bg={cardBg}
              borderRadius="24px"
              p={8}
              boxShadow="xl"
              border="1px solid"
              borderColor={cardBorder}
              position="relative"
              overflow="hidden"
              w="full"
            >
              {/* Company Logo Placeholder */}
              <Box
                position="absolute"
                top={5}
                right={5}
                w="50px"
                h="50px"
                bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                borderRadius="12px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontSize="xl"
                fontWeight="bold"
              >
                {(internship.company?.companyName || internship.companyName || 'C').charAt(0)}
              </Box>

              <Box pr="70px" mb={6}>
                <Heading 
                  size="lg" 
                  fontWeight="800" 
                  bgGradient="linear(135deg, #2d3748 0%, #4a5568 100%)"
                  bgClip="text"
                  mb={2}
                  lineHeight="1.3"
                >
                  {internship.title}
                </Heading>
                <Text 
                  color={internshipTextColor} 
                  fontWeight="700"
                  fontSize="md"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Icon as={FaBuilding} />
                  {internship.company?.companyName || internship.companyName || 'Unknown Company'}
                </Text>
              </Box>

              <VStack spacing={4} align="stretch">
                <HStack spacing={3} flexWrap="wrap">
                  <Badge 
                    colorScheme="teal" 
                    variant="subtle" 
                    px={3}
                    py={1}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Icon as={FaMapMarkerAlt} boxSize={3} />
                    {internship.location}
                  </Badge>
                  <Badge 
                    colorScheme="orange" 
                    variant="subtle" 
                    px={3}
                    py={1}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Icon as={FaClock} boxSize={3} />
                    {internship.duration}
                  </Badge>
                </HStack>

                <Text color={internshipDescColor} lineHeight="1.6" fontSize="sm">
                  {internship.description}
                </Text>
                
                <Box
                  bg={useColorModeValue('red.50', 'red.900')}
                  p={3}
                  borderRadius="12px"
                  border="1px solid"
                  borderColor={useColorModeValue('red.200', 'red.700')}
                >
                  <Text 
                    color={useColorModeValue('red.700', 'red.200')}
                    fontSize="sm" 
                    fontWeight="700"
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    ⏰ Deadline: {new Date(internship.applicationDeadline).toLocaleDateString()}
                  </Text>
                </Box>
              </VStack>
            </Box>

            {/* Application Tips Card */}
            <Box
              bg={useColorModeValue('orange.50', 'orange.900')}
              borderRadius="24px"
              p={8}
              border="1px solid"
              borderColor={useColorModeValue('orange.200', 'orange.700')}
              boxShadow="md"
              w="full"
            >
              <Heading 
                size="md" 
                color={useColorModeValue('orange.700', 'orange.200')} 
                fontWeight="800"
                mb={5}
                display="flex"
                alignItems="center"
                gap={2}
              >
                💡 Application Tips
              </Heading>
              <VStack spacing={3} align="start">
                <Text color={useColorModeValue('orange.700', 'orange.200')} fontSize="sm" lineHeight="1.6" fontWeight="600">
                  • Ensure your resume is up-to-date and highlights relevant skills
                </Text>
                <Text color={useColorModeValue('orange.700', 'orange.200')} fontSize="sm" lineHeight="1.6" fontWeight="600">
                  • Write a compelling cover letter explaining your interest
                </Text>
                <Text color={useColorModeValue('orange.700', 'orange.200')} fontSize="sm" lineHeight="1.6" fontWeight="600">
                  • Double-check all information before submitting
                </Text>
                <Text color={useColorModeValue('orange.700', 'orange.200')} fontSize="sm" lineHeight="1.6" fontWeight="600">
                  • Track your application status in your dashboard
                </Text>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Box>

      {/* Already Applied Modal */}
      <Modal isOpen={alreadyApplied} onClose={() => setAlreadyApplied(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Already Applied</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center">
            <Text fontSize="lg" color={titleColor}>
              You've already applied to this internship!<br />
              We'll keep you updated on your application status.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" w="100%" onClick={() => { setAlreadyApplied(false); navigate('/internships'); }}>
              Back to Internships
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ApplyInternshipForm;
