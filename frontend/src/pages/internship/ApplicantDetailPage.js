import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import config from '../../config';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Heading,
  Badge,
  Spinner,
  SimpleGrid,
  useToast,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';

const ApplicantDetailPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { user, accessToken, refresh } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const toast = useToast();

  // Color mode values for dark mode support
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardText = useColorModeValue('gray.800', 'white');
  const cardSubText = useColorModeValue('gray.600', 'gray.300');
  const cardSubtleText = useColorModeValue('gray.500', 'gray.400');
  const cardBorder = useColorModeValue('gray.200', '#23232b');
  const infoBgBlue = useColorModeValue('blue.50', 'blue.900');
  const infoBgGreen = useColorModeValue('green.50', 'green.900');
  const infoBgPurple = useColorModeValue('purple.50', 'purple.900');
  const infoBgOrange = useColorModeValue('orange.50', 'orange.900');
  const infoBg = useColorModeValue('gray.50', 'gray.700');
  const pageBg = useColorModeValue('gray.50', '#18181b');

  useEffect(() => {
    const fetchApplicationDetails = async (retryCount = 0) => {
      console.log('ApplicantDetailPage: Starting fetchApplicationDetails');
      console.log('ApplicantDetailPage: applicationId =', applicationId);
      console.log('ApplicantDetailPage: user =', user);
      console.log('ApplicantDetailPage: accessToken =', accessToken ? 'present' : 'missing');
      
      if (!user || !['company', 'student'].includes(user.role)) {
        console.log('ApplicantDetailPage: User is not authorized, setting error');
        setError('Only companies and students can view application details.');
        setLoading(false);
        return;
      }    try {
      setLoading(true);
      setError('');
      
      // Use the new unified role-aware applications endpoint
      const url = `${config.API_URL}/applications/${applicationId}`;
      
      console.log('ApplicantDetailPage: Fetching from URL:', url);
      console.log('ApplicantDetailPage: User role:', user.role);
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('ApplicantDetailPage: Response status:', response.status);
        console.log('ApplicantDetailPage: Response ok:', response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.log('ApplicantDetailPage: Error response body:', errorText);
          
          if (response.status === 401) {
            // Try to refresh token if this is the first retry
            if (retryCount === 0) {
              console.log('ApplicantDetailPage: Token expired, attempting refresh...');
              try {
                await refresh();
                console.log('ApplicantDetailPage: Token refreshed, retrying request...');
                // Retry the request with the new token
                return fetchApplicationDetails(retryCount + 1);
              } catch (refreshError) {
                console.error('ApplicantDetailPage: Token refresh failed:', refreshError);
                setError('Session expired. Please log in again.');
                navigate('/login');
                return;
              }
            } else {
              console.log('ApplicantDetailPage: 401 Unauthorized');
              setError('Authentication failed. Please log in again.');
              navigate('/login');
              return;
            }
          } else if (response.status === 403) {
            console.log('ApplicantDetailPage: 403 Forbidden');
            setError('You are not authorized to view this application.');
            return;
          } else if (response.status === 404) {
            console.log('ApplicantDetailPage: 404 Not Found');
            setError(`Application not found. URL: ${url}, Application ID: ${applicationId}`);
            return;
          } else {
            console.log('ApplicantDetailPage: Other error status:', response.status);
            setError(`Failed to fetch application details. Status: ${response.status}, Response: ${errorText}`);
            return;
          }
        }        const data = await response.json();
        console.log('ApplicantDetailPage: Received data:', data);
        
        // Handle new nested response structure { application, student, internship }
        if (data.application && data.student && data.internship) {
          console.log('ApplicantDetailPage: Using new nested structure');
          // Create a flattened application object with nested references
          const applicationData = {
            ...data.application,
            student: data.student,
            internship: data.internship
          };
          setApplication(applicationData);
        } else if (data.id && (data.studentId || data.internshipId)) {
          console.log('ApplicantDetailPage: Using legacy flat structure');
          // Legacy structure - data is the application directly
          setApplication(data);
          
          // Fetch internship details if missing
          if (data && !data.internship && data.internshipId) {
            try {
              const internshipRes = await fetch(`${config.API_URL}/internships/${data.internshipId}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
              });
              if (internshipRes.ok) {
                const internshipData = await internshipRes.json();
                setApplication(prev => ({ ...prev, internship: internshipData }));
              }
            } catch (e) {
              console.error('Failed to fetch internship details:', e);
            }
          }
        } else {
          console.error('ApplicantDetailPage: Unexpected data structure:', data);
          setError('Unexpected response format from server.');
          return;
        }
      } catch (err) {
        console.error('ApplicantDetailPage: Error fetching application details:', err);
        setError('Network error. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    if (applicationId && accessToken) {
      console.log('ApplicantDetailPage: Conditions met, calling fetchApplicationDetails');
      fetchApplicationDetails();
    } else {
      console.log('ApplicantDetailPage: Conditions not met - applicationId:', applicationId, 'accessToken:', !!accessToken);
    }
  }, [applicationId, accessToken, user, navigate, refresh]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'green';
      case 'rejected':
        return 'red';
      case 'submitted':
      case 'in review':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return '✅';
      case 'rejected':
        return '❌';
      case 'submitted':
      case 'in review':
        return '⏳';
      default:
        return '📋';
    }
  };  const handleViewResume = async (applicationId, retryCount = 0) => {
    if (!applicationId) return;
    
    // Use the new unified role-aware file endpoint
    const fileUrl = `${config.API_URL}/applications/${applicationId}/file?type=resume`;

    try {
      const response = await fetch(fileUrl, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      
      if (response.ok) {
        const disposition = response.headers.get('Content-Disposition');
        let filename = 'resume.pdf';
        if (disposition && disposition.indexOf('filename=') !== -1) {
          filename = disposition.split('filename=')[1].replace(/"/g, '');
        }
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        toast({
          title: 'Resume Downloaded',
          description: 'Resume has been downloaded successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else if (response.status === 401 && retryCount === 0) {
        // Try to refresh token and retry
        try {
          await refresh();
          return handleViewResume(applicationId, 1);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          navigate('/login');
          return;
        }
      } else {
        const errorText = await response.text();
        toast({
          title: 'Download Failed',
          description: errorText || 'Failed to download resume.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Network error while downloading resume. Please check your connection and try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleViewCoverLetter = async (applicationId, retryCount = 0) => {
    if (!applicationId) return;
    
    // Use the new unified role-aware file endpoint
    const fileUrl = `${config.API_URL}/applications/${applicationId}/file?type=cover-letter`;

    try {
      const response = await fetch(fileUrl, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      
      if (response.ok) {
        const disposition = response.headers.get('Content-Disposition');
        let filename = 'cover_letter.pdf';
        if (disposition && disposition.indexOf('filename=') !== -1) {
          filename = disposition.split('filename=')[1].replace(/"/g, '');
        }
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        toast({
          title: 'Cover Letter Downloaded',
          description: 'Cover letter has been downloaded successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else if (response.status === 401 && retryCount === 0) {
        // Try to refresh token and retry
        try {
          await refresh();
          return handleViewCoverLetter(applicationId, 1);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          navigate('/login');
          return;
        }
      } else {
        const errorText = await response.text();
        toast({
          title: 'Download Failed',
          description: errorText || 'Failed to download cover letter.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Network error while downloading cover letter. Please check your connection and try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    console.log('ApplicantDetailPage: Starting status update');
    console.log('ApplicantDetailPage: applicationId =', applicationId);
    console.log('ApplicantDetailPage: newStatus =', newStatus);
    console.log('ApplicantDetailPage: user role =', user?.role);
    
    // Additional authorization check for companies only
    if (user?.role !== 'company') {
      console.log('ApplicantDetailPage: User is not a company, cannot update status');
      toast({
        title: 'Unauthorized',
        description: 'Only companies can update application status.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }    try {
      // Use generic endpoint for status updates
      const url = `${config.API_URL}/applications/${applicationId}/status`;
      console.log('ApplicantDetailPage: Updating status at URL:', url);
      
      const requestBody = { status: newStatus };
      console.log('ApplicantDetailPage: Request body:', requestBody);

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('ApplicantDetailPage: Status update response status:', response.status);
      console.log('ApplicantDetailPage: Status update response ok:', response.ok);

      if (response.ok) {
        console.log('ApplicantDetailPage: Status update successful');
        setApplication(prev => ({ ...prev, status: newStatus }));
        toast({
          title: 'Status Updated Successfully',
          description: `Application status has been updated to ${newStatus}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorText = await response.text();
        console.error('ApplicantDetailPage: Status update failed:', response.status, errorText);
        
        let errorMessage = 'Failed to update application status.';
        
        if (response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (response.status === 403) {
          errorMessage = 'You are not authorized to update this application status.';
        } else if (response.status === 404) {
          errorMessage = 'Application not found.';
        } else if (response.status === 400) {
          errorMessage = 'Invalid status value provided.';
        } else {
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            errorMessage = `Server error (${response.status}): ${errorText}`;
          }
        }
        
        toast({
          title: 'Update Failed',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('ApplicantDetailPage: Network error during status update:', error);
      toast({
        title: 'Update Failed',
        description: 'Network error while updating status. Please check your connection and try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Check if user can update status (only companies can update application status)
  const canUpdateStatus = user?.role === 'company';

  // File download function
  const downloadFile = async (applicationId, fileType) => {
    if (!user || user.role !== 'company') {
      toast({
        title: 'Unauthorized',
        description: 'Only companies can download application files.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      console.log(`Downloading ${fileType} for application ${applicationId}`);
      
      const response = await fetch(`${config.API_URL}/applications/${applicationId}/file?type=${fileType}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileType}_${applicationId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: 'Download Started',
          description: `${fileType} download has started.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else if (response.status === 401) {
        // Try token refresh
        try {
          const newToken = await refresh();
          const retryResponse = await fetch(`${config.API_URL}/applications/${applicationId}/file?type=${fileType}`, {
            headers: {
              'Authorization': `Bearer ${newToken}`,
            },
          });
          
          if (retryResponse.ok) {
            const blob = await retryResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${fileType}_${applicationId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          } else {
            throw new Error('File download failed after token refresh');
          }
        } catch (refreshError) {
          console.error('Token refresh failed during file download:', refreshError);
          toast({
            title: 'Download Failed',
            description: 'Authentication failed. Please log in again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } else if (response.status === 403) {
        toast({
          title: 'Access Denied',
          description: 'You are not authorized to download this file.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (response.status === 404) {
        toast({
          title: 'File Not Found',
          description: 'The requested file was not found.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Download Failed',
          description: 'Unable to download file. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('File download error:', error);
      toast({
        title: 'Download Error',
        description: 'An error occurred while downloading the file.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box py={12}>
        <VStack spacing={8} maxW="6xl" mx="auto">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" />
            <Text color="gray.600" fontSize="lg">Loading application details...</Text>
          </VStack>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box py={12}>
        <VStack spacing={8} maxW="4xl" mx="auto">
          <Box 
            bg="white" 
            borderRadius="2xl" 
            p={8} 
            textAlign="center"
            boxShadow="0 4px 24px rgba(44,62,80,0.13)"
            borderLeft="8px solid"
            borderLeftColor="red.500"
          >
            <VStack spacing={6}>
              <Box 
                w={20} 
                h={20} 
                bgGradient="linear(to-br, red.400, red.600)" 
                borderRadius="full" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                boxShadow="xl"
              >
                <Text fontSize="3xl">⚠️</Text>
              </Box>
              <Heading size="lg" color="gray.800">Oops! Something went wrong</Heading>
              <Text color="gray.600" fontSize="lg">{error}</Text>
              <Button
                colorScheme="blue"
                size="lg"
                px={8}
                py={4}
                fontSize="lg"
                fontWeight="semibold"
                boxShadow="lg"
                _hover={{ 
                  boxShadow: 'xl',
                  transform: 'translateY(-1px)'
                }}
                transition="all 0.3s ease"
                onClick={() => navigate(-1)}
              >
                ← Go Back
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  }

  if (!application) {
    return (
      <Box py={12} bg={pageBg}>
        <VStack spacing={8} maxW="4xl" mx="auto">
          <Box 
            bg={cardBg}
            borderRadius="2xl" 
            p={8} 
            textAlign="center"
            boxShadow="0 4px 24px rgba(44,62,80,0.13)"
          >
            <VStack spacing={6}>
              <Box 
                w={20} 
                h={20} 
                bg={infoBg}
                borderRadius="full" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
              >
                <Text fontSize="3xl">📋</Text>
              </Box>
              <Heading size="lg" color={cardText}>Application Not Found</Heading>
              <Text color={cardSubText} fontSize="lg">The application you're looking for doesn't exist or has been removed.</Text>
              <Button
                colorScheme="blue"
                size="lg"
                px={8}
                py={4}
                fontSize="lg"
                fontWeight="semibold"
                boxShadow="lg"
                _hover={{ 
                  boxShadow: 'xl',
                  transform: 'translateY(-1px)'
                }}
                transition="all 0.3s ease"
                onClick={() => navigate(-1)}
              >
                ← Go Back
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    );  }

  // Debug logging for the current application structure
  console.log('ApplicantDetailPage: Final application object before render:', application);
  console.log('ApplicantDetailPage: Application.student:', application?.student);
  console.log('ApplicantDetailPage: Application.internship:', application?.internship);
  console.log('ApplicantDetailPage: Application.studentId:', application?.studentId);
  console.log('ApplicantDetailPage: Application.internshipId:', application?.internshipId);

  return (
    <Box py={12} bg={pageBg}>
      <VStack spacing={8} maxW="6xl" mx="auto">
        {/* Header */}
        <VStack spacing={6} w="full">
          <HStack justify="space-between" w="full">
            <Button
              leftIcon={<Text fontSize="2xl">←</Text>}
              variant="outline"
              colorScheme="blue"
              size="lg"
              px={8}
              py={4}
              fontSize="xl"
              fontWeight="bold"
              borderWidth={2}
              onClick={() => navigate(-1)}
              _hover={{ 
                bg: infoBgBlue, 
                transform: 'translateX(-4px)',
                boxShadow: 'lg'
              }}
              transition="all 0.3s ease"
            >
              {user?.role === 'company' ? 'Back to Applicants' : 'Back to Applications'}
            </Button>
            <Badge 
              colorScheme={getStatusColor(application.status)} 
              variant="subtle" 
              px={6} 
              py={3} 
              borderRadius="full"
              fontSize="lg"
              fontWeight="bold"
            >
              {getStatusIcon(application.status)} {application.status || 'Pending'}
            </Badge>
          </HStack>
        </VStack>

        {/* Main Content */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} w="full">
          {/* Left Column - Student Information */}
          <VStack spacing={6} align="stretch">
            {/* Student Profile Card */}
            <Box 
              bg={cardBg}
              borderRadius="2xl" 
              p={8} 
              w="full"
              boxShadow="lg"
              borderWidth={1}
              borderColor={cardBorder}
            >
              <VStack spacing={6} align="stretch">
                <HStack spacing={4} align="flex-start">
                  <Box 
                    w={20} 
                    h={20} 
                    bgGradient="linear(to-br, blue.500, purple.600)" 
                    borderRadius="full" 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                    boxShadow="xl"
                  >
                    <Text fontSize="3xl" fontWeight="bold" color="white">
                      {(application.student?.fullName || 'U').charAt(0).toUpperCase()}
                    </Text>
                  </Box>
                  <VStack align="flex-start" spacing={2}>
                    <Heading size="lg" color="blue.700">
                      {application.student?.fullName || 'Unknown Student'}
                    </Heading>
                    <Text color={cardSubText} fontSize="lg">
                      {application.student?.university || 'University not specified'}
                    </Text>
                    <Text color={cardSubtleText} fontSize="md">
                      Student ID: {application.student?.id || application.studentId || 'N/A'}
                    </Text>
                  </VStack>
                </HStack>

                <Divider />

                {/* Student Details Grid */}
                <SimpleGrid columns={2} spacing={4}>
                  <Box bg={infoBgBlue} borderRadius="xl" p={4}>
                    <VStack align="flex-start" spacing={2}>                      <Text fontSize="sm" color={cardSubtleText} fontWeight="medium">Email</Text>
                      <Text color={cardText} fontWeight="semibold">
                        {application.student?.email || 'Not provided'}
                      </Text>
                    </VStack>
                  </Box>
                  <Box bg={infoBgGreen} borderRadius="xl" p={4}>
                    <VStack align="flex-start" spacing={2}>
                      <Text fontSize="sm" color={cardSubtleText} fontWeight="medium">Major</Text>
                      <Text color={cardText} fontWeight="semibold">
                        {application.student?.major || 'Not specified'}
                      </Text>
                    </VStack>
                  </Box>
                  <Box bg={infoBgPurple} borderRadius="xl" p={4}>
                    <VStack align="flex-start" spacing={2}>
                      <Text fontSize="sm" color={cardSubtleText} fontWeight="medium">Graduation Year</Text>
                      <Text color={cardText} fontWeight="semibold">
                        {application.student?.graduationYear || 'Not specified'}
                      </Text>
                    </VStack>
                  </Box>
                  {application.student?.gpa && (
                    <Box bg={infoBgOrange} borderRadius="xl" p={4}>
                      <VStack align="flex-start" spacing={2}>
                        <Text fontSize="sm" color={cardSubtleText} fontWeight="medium">GPA</Text>
                        <Text color={cardText} fontWeight="semibold">
                          {application.student.gpa}
                        </Text>
                      </VStack>
                    </Box>
                  )}
                </SimpleGrid>
              </VStack>
            </Box>

            {/* Documents Card */}
            <Box 
              bg={cardBg}
              borderRadius="2xl" 
              p={8} 
              w="full"
              boxShadow="lg"
              borderWidth={1}
              borderColor={cardBorder}
            >
              <VStack spacing={6} align="stretch">
                <Heading size="md" color={cardText}>📄 Documents</Heading>
                <VStack spacing={4} align="stretch">
                  {application.resumePath ? (
                    <Button
                      leftIcon={<Text>📄</Text>}
                      colorScheme="blue"
                      variant="outline"
                      size="lg"
                      onClick={() => downloadFile(application.id, 'resume')}
                      _hover={{ bg: infoBgBlue }}
                      w="full"
                    >
                      Download Resume
                    </Button>
                  ) : (
                    <Box bg={infoBg} borderRadius="xl" p={4} textAlign="center">
                      <Text color={cardSubtleText}>No resume uploaded</Text>
                    </Box>
                  )}
                  
                  {application.coverLetterPath ? (
                    <Button
                      leftIcon={<Text>📝</Text>}
                      colorScheme="green"
                      variant="outline"
                      size="lg"
                      onClick={() => downloadFile(application.id, 'coverLetter')}
                      _hover={{ bg: infoBgGreen }}
                      w="full"
                    >
                      Download Cover Letter
                    </Button>
                  ) : (
                    <Box bg={infoBg} borderRadius="xl" p={4} textAlign="center">
                      <Text color={cardSubtleText}>No cover letter uploaded</Text>
                    </Box>
                  )}
                </VStack>
              </VStack>
            </Box>
          </VStack>

          {/* Right Column - Application & Internship Information */}
          <VStack spacing={6} align="stretch">
            {/* Application Details Card */}
            <Box 
              bg={cardBg}
              borderRadius="2xl" 
              p={8} 
              w="full"
              boxShadow="lg"
              borderWidth={1}
              borderColor={cardBorder}
            >
              <VStack spacing={6} align="stretch">
                <Heading size="md" color={cardText}>📋 Application Details</Heading>
                
                <SimpleGrid columns={1} spacing={4}>
                  <Box bg={infoBgPurple} borderRadius="xl" p={4}>
                    <VStack align="flex-start" spacing={2}>
                      <Text fontSize="sm" color={cardSubtleText} fontWeight="medium">Application ID</Text>
                      <Text color={cardText} fontWeight="semibold">#{application.id}</Text>
                    </VStack>
                  </Box>
                  
                  <Box bg={infoBgBlue} borderRadius="xl" p={4}>
                    <VStack align="flex-start" spacing={2}>
                      <Text fontSize="sm" color={cardSubtleText} fontWeight="medium">Applied Date</Text>
                      <Text color={cardText} fontWeight="semibold">
                        {new Date(application.appliedAt).toLocaleDateString()} at {new Date(application.appliedAt).toLocaleTimeString()}
                      </Text>
                    </VStack>
                  </Box>
                  
                  <Box bg={infoBgGreen} borderRadius="xl" p={4}>
                    <VStack align="flex-start" spacing={2}>
                      <Text fontSize="sm" color={cardSubtleText} fontWeight="medium">Last Updated</Text>
                      <Text color={cardText} fontWeight="semibold">
                        {new Date(application.updatedAt).toLocaleDateString()} at {new Date(application.updatedAt).toLocaleTimeString()}
                      </Text>
                    </VStack>
                  </Box>
                </SimpleGrid>
              </VStack>
            </Box>

            {/* Internship Details Card */}
            <Box 
              bg={cardBg}
              borderRadius="2xl" 
              p={8} 
              w="full"
              boxShadow="lg"
              borderWidth={1}
              borderColor={cardBorder}
            >
              <VStack spacing={6} align="stretch">
                <Heading size="md" color={cardText}>💼 Internship Details</Heading>
                
                <VStack spacing={4} align="stretch">
                  <Box bg={infoBgOrange} borderRadius="xl" p={4}>
                    <VStack align="flex-start" spacing={2}>
                      <Text fontSize="sm" color={cardSubtleText} fontWeight="medium">Position</Text>
                      <Text color={cardText} fontWeight="semibold" fontSize="lg">
                        {application.internship?.title || 'Unknown Position'}
                      </Text>
                    </VStack>
                  </Box>
                  
                  <Box bg={infoBgBlue} borderRadius="xl" p={4}>
                    <VStack align="flex-start" spacing={2}>
                      <Text fontSize="sm" color={cardSubtleText} fontWeight="medium">Location</Text>
                      <Text color={cardText} fontWeight="semibold">
                        {application.internship?.location || 'Not specified'}
                      </Text>
                    </VStack>
                  </Box>
                  
                  <Box bg={infoBgGreen} borderRadius="xl" p={4}>
                    <VStack align="flex-start" spacing={2}>                      <Text fontSize="sm" color={cardSubtleText} fontWeight="medium">Internship ID</Text>
                      <Text color={cardText} fontWeight="semibold">#{application.internship?.id || application.internshipId || 'N/A'}</Text>
                    </VStack>
                  </Box>
                </VStack>
              </VStack>
            </Box>

            {/* Status Update Card - Only show for companies */}
            {canUpdateStatus && (
              <Box 
                bg={cardBg}
                borderRadius="2xl" 
                p={8} 
                w="full"
                boxShadow="lg"
                borderWidth={1}
                borderColor={cardBorder}
              >
                <VStack spacing={6} align="stretch">
                  <Heading size="md" color={cardText}>⚡ Update Status</Heading>
                  
                  <VStack spacing={3} align="stretch">
                    <Button
                      colorScheme="yellow"
                      variant="outline"
                      size="lg"
                      onClick={() => handleUpdateStatus('IN_REVIEW')}
                      isDisabled={application.status === 'IN_REVIEW'}
                      _hover={{ bg: infoBg }}
                    >
                      ⏳ Mark as In Review
                    </Button>
                    
                    <Button
                      colorScheme="green"
                      variant="outline"
                      size="lg"
                      onClick={() => handleUpdateStatus('ACCEPTED')}
                      isDisabled={application.status === 'ACCEPTED'}
                      _hover={{ bg: infoBg }}
                    >
                      ✅ Accept Application
                    </Button>
                    
                    <Button
                      colorScheme="red"
                      variant="outline"
                      size="lg"
                      onClick={() => handleUpdateStatus('REJECTED')}
                      isDisabled={application.status === 'REJECTED'}
                      _hover={{ bg: infoBg }}
                    >
                      ❌ Reject Application
                    </Button>
                  </VStack>
                </VStack>
              </Box>
            )}
          </VStack>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default ApplicantDetailPage;