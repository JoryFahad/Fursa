import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
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
  Select,
  Divider,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight, FaSort, FaBriefcase } from 'react-icons/fa';

const InternshipApplicantsPage = () => {
  const { t } = useTranslation();
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const { user, accessToken, refresh, isLoading: authLoading } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const toast = useToast();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('appliedAt:desc'); // Default to newest applications first

  // Enhanced color mode values for beautiful styling
  const pageBg = useColorModeValue('gray.50', '#0f0f0f');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardText = useColorModeValue('gray.900', 'white');
  const cardSubText = useColorModeValue('gray.600', 'gray.300');
  const cardSubtleText = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const infoBgBlue = useColorModeValue('blue.50', 'blue.900');
  const infoBgGreen = useColorModeValue('green.50', 'green.900');

  const fetchApplicants = useCallback(async (page = 1, status = null, sort = 'appliedAt:desc', retryCount = 0) => {
    setLoading(true);
    setError('');

    try {
      // Debug logging
      console.log('InternshipApplicantsPage - Current user:', user);
      console.log('InternshipApplicantsPage - Access token:', accessToken ? 'Present' : 'Missing');
      console.log('InternshipApplicantsPage - Internship ID:', internshipId);
      console.log('InternshipApplicantsPage - User role:', user?.role);
      console.log('InternshipApplicantsPage - Retry count:', retryCount);

      // Check if user is authenticated
      if (!user) {
        console.log('InternshipApplicantsPage: No user found, redirecting to login');
        setError('User not authenticated. Please log in again.');
        navigate('/login');
        setLoading(false);
        return;
      }

      // Check if user is a company
      if (user.role !== 'company') {
        console.log('InternshipApplicantsPage: User is not a company, role:', user.role);
        setError(`Only companies can view applicants. Current user role: ${user.role}`);
        setLoading(false);
        return;
      }

      // Check if access token exists
      if (!accessToken) {
        console.log('InternshipApplicantsPage: No access token found, attempting refresh');
        try {
          const newToken = await refresh();
          console.log('InternshipApplicantsPage: Token refreshed successfully, new token:', newToken.substring(0, 20) + '...');
          // Retry the request with the new token
          return fetchApplicants(page, status, sort, retryCount);
        } catch (refreshError) {
          console.error('InternshipApplicantsPage: Token refresh failed:', refreshError);
          console.log('InternshipApplicantsPage: Redirecting to login due to refresh failure');
          setError('Authentication failed. Please log in again.');
          navigate('/login');
          setLoading(false);
          return;
        }
      }

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString()
      });
      
      // Add sort parameter - API expects format: field:direction
      if (sort && sort !== '') {
        params.append('sort', sort);
      }
      
      // Add status filter if provided
      if (status && status !== '') {
        params.append('status', status);
      }

      const url = `${config.API_URL}/internships/${internshipId}/applications?${params.toString()}`;
      console.log('InternshipApplicantsPage: Fetching from URL:', url);
      console.log('InternshipApplicantsPage: Query parameters:', params.toString());
      console.log('InternshipApplicantsPage - Sort parameter being used:', sort);
      console.log('InternshipApplicantsPage - Status filter being used:', status);
      
      // Track the current token to handle refresh properly
      let currentToken = accessToken;
      console.log('InternshipApplicantsPage: Using token:', currentToken.substring(0, 20) + '...');
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        
        if (response.status === 401) {
          console.log('InternshipApplicantsPage: 401 Unauthorized error');
          
          // Try to refresh token if this is the first retry
          if (retryCount === 0) {
            console.log('InternshipApplicantsPage: Token expired, attempting refresh...');
            try {
              const newToken = await refresh();
              console.log('InternshipApplicantsPage: Token refreshed, retrying request with new token:', newToken.substring(0, 20) + '...');
              
              // Retry the request with the new token
              const retryResponse = await fetch(url, {
                headers: {
                  'Authorization': `Bearer ${newToken}`,
                  'Content-Type': 'application/json',
                },
              });
              
              if (!retryResponse.ok) {
                const retryErrorText = await retryResponse.text();
                console.error('Retry failed:', retryResponse.status, retryErrorText);
                
                if (retryResponse.status === 401) {
                  console.log('InternshipApplicantsPage: Token refresh failed on retry, redirecting to login');
                  setError('Authentication failed. Please log in again.');
                  navigate('/login');
                  return;
                } else {
                  setError(`Failed to fetch applicants. Server responded with: ${retryResponse.status} - ${retryErrorText}`);
                  return;
                }
              }
              
              // Process the successful retry response
              const retryData = await retryResponse.json();
              console.log('Applicants data received after retry:', retryData);
              
              setApplicants(retryData.items || []);
              setTotalItems(retryData.total || 0);
              setHasNextPage(retryData.hasNextPage || false);
              setCurrentPage(retryData.page || 1);
              
              // If the API returns internship details along with applications, use that
              if (retryData.items && retryData.items.length > 0 && retryData.items[0].internship) {
                setInternship(retryData.items[0].internship);
              }
              return;
            } catch (refreshError) {
              console.error('InternshipApplicantsPage: Token refresh failed:', refreshError);
              console.log('InternshipApplicantsPage: Redirecting to login due to refresh failure');
              setError('Session expired. Please log in again.');
              navigate('/login');
              return;
            }
          } else {
            console.log('InternshipApplicantsPage: Already retried once, redirecting to login');
            setError('Authentication failed. Please log in again.');
            navigate('/login');
            return;
          }
        } else if (response.status === 403) {
          setError('Only companies can view applicants. Please ensure you are logged in as a company account.');
          return;
        } else if (response.status === 404) {
          setError('Internship not found or no applicants available.');
          return;
        } else {
          setError(`Failed to fetch applicants. Server responded with: ${response.status} - ${errorText}`);
          return;
        }
      }

      const data = await response.json();
      console.log('Applicants data received:', data);
      
      setApplicants(data.items || []);
      setTotalItems(data.total || 0);
      setHasNextPage(data.hasNextPage || false);
      setCurrentPage(data.page || 1);
      
      // If the API returns internship details along with applications, use that
      if (data.items && data.items.length > 0 && data.items[0].internship) {
        setInternship(data.items[0].internship);
      }
      
    } catch (err) {
      console.error('Error fetching applicants:', err);
      setError(`Network error: ${err.message}. Please check your connection and try again.`);
    } finally {
      setLoading(false);
    }
  }, [internshipId, user, accessToken, pageSize, refresh, navigate]);

  useEffect(() => {
    // Wait for auth to be initialized
    if (authLoading) {
      return;
    }

    if (!user && !accessToken) {
      return;
    }

    if (internshipId && accessToken && user) {
      fetchApplicants(1, selectedStatus, sortBy);
    } else {
      if (!user) {
        setError('User not authenticated. Please log in again.');
        navigate('/login');
      } else if (!accessToken) {
        setError('Authentication token missing. Please log in again.');
        navigate('/login');
      } else if (!internshipId) {
        setError('Internship ID is missing. Please try again.');
      } else {
        setError('Missing required data. Please try again.');
      }
      setLoading(false);
    }
  }, [fetchApplicants, internshipId, accessToken, user, selectedStatus, sortBy, pageSize, authLoading, navigate]);

  const handlePageChange = (newPage) => {
    fetchApplicants(newPage, selectedStatus, sortBy);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    fetchApplicants(1, selectedStatus, sortBy);
  };

  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
    setCurrentPage(1); // Reset to first page when changing status filter
    fetchApplicants(1, newStatus, sortBy);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1); // Reset to first page when changing sort
    fetchApplicants(1, selectedStatus, newSort);
  };

  const handleViewResume = async (applicationId, retryCount = 0) => {
    if (!applicationId) return;
    
    // Only companies can download files
    if (user?.role !== 'company') {
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
      const url = `${config.API_URL}/companies/company/application/${applicationId}?file=resume`;
      let currentToken = accessToken;
      // Log the request details (force log to appear)
      window.console.log('[InternshipApplicantsPage] View Resume button clicked');
      window.console.log('[InternshipApplicantsPage] File download request URL:', url);
      window.console.log('[InternshipApplicantsPage] Authorization header value:', currentToken);
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
        },
      });
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `resume_${applicationId}.pdf`;
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
      } else {
        const errorText = await response.text();
        if (response.status === 401 && retryCount === 0) {
          try {
            const newToken = await refresh();
            currentToken = newToken;
            return handleViewResume(applicationId, retryCount + 1);
          } catch (refreshError) {
            toast({
              title: 'Session Expired',
              description: 'Please log in again to download files.',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            return;
          }
        }
        let errorMessage = 'Failed to download resume.';
        if (response.status === 401) errorMessage = 'Authentication failed. Please log in again.';
        else if (response.status === 403) errorMessage = 'You are not authorized to download this file.';
        else if (response.status === 404) errorMessage = 'File not found.';
        else errorMessage = `Download failed (${response.status}): ${errorText}`;
        toast({
          title: 'Download Failed',
          description: errorMessage,
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
    if (user?.role !== 'company') {
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
      const url = `${config.API_URL}/companies/company/application/${applicationId}?file=coverLetter`;
      let currentToken = accessToken;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
        },
      });
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `cover_letter_${applicationId}.pdf`;
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
      } else {
        const errorText = await response.text();
        if (response.status === 401 && retryCount === 0) {
          try {
            const newToken = await refresh();
            currentToken = newToken;
            return handleViewCoverLetter(applicationId, retryCount + 1);
          } catch (refreshError) {
            toast({
              title: 'Session Expired',
              description: 'Please log in again to download files.',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            return;
          }
        }
        let errorMessage = 'Failed to download cover letter.';
        if (response.status === 401) errorMessage = 'Authentication failed. Please log in again.';
        else if (response.status === 403) errorMessage = 'You are not authorized to download this file.';
        else if (response.status === 404) errorMessage = 'File not found.';
        else errorMessage = `Download failed (${response.status}): ${errorText}`;
        toast({
          title: 'Download Failed',
          description: errorMessage,
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'green';
      case 'rejected':
        return 'red';
      case 'in_review':
      case 'in review':
        return 'yellow';
      case 'submitted':
        return 'blue';
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
      case 'in_review':
      case 'in review':
        return '⏳';
      case 'submitted':
        return '📋';
      default:
        return '📋';
    }
  };

  const renderPagination = () => {
    if (totalItems <= pageSize) return null;

    const totalPages = Math.ceil(totalItems / pageSize);
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
      <Box 
        bg={cardBg} 
        borderRadius="2xl" 
        p={6} 
        boxShadow="0 4px 24px rgba(44, 62, 80, 0.1)"
        border="1px solid"
        borderColor="gray.100"
      >
        <VStack spacing={4} align="stretch">
          {/* Results Info and Page Size */}
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Text color={cardSubText} fontSize="sm" fontWeight="medium">
                {t('pagination.showing')} <Text as="span" color="blue.600" fontWeight="bold">
                  {startItem}
                </Text> {t('pagination.to')} <Text as="span" color="blue.600" fontWeight="bold">
                  {endItem}
                </Text> {t('pagination.of')} <Text as="span" color="blue.600" fontWeight="bold">
                  {totalItems}
                </Text> {t('internship.applicants.title').toLowerCase()}
              </Text>
              <Text color={cardSubtleText} fontSize="xs">
                {t('pagination.page')} {currentPage} {t('pagination.of')} {totalPages}
              </Text>
            </VStack>
            
            <HStack spacing={3} align="center">
              <Text color={cardSubText} fontSize="sm" fontWeight="medium">{t('pagination.show')}:</Text>
              <Select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                size="sm"
                w="120px"
                borderRadius="md"
              >
                <option value={5}>5 {t('pagination.perPage')}</option>
                <option value={10}>10 {t('pagination.perPage')}</option>
                <option value={20}>20 {t('pagination.perPage')}</option>
                <option value={50}>50 {t('pagination.perPage')}</option>
              </Select>
            </HStack>
          </HStack>
          
          <Divider borderColor="gray.200" />
          
          {/* Page Navigation */}
          <HStack spacing={3} justify="center" w="full">
            <Button
              size="md"
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              isDisabled={currentPage === 1}
              leftIcon={<Icon as={FaChevronLeft} />}
              _hover={{ 
                bg: 'blue.50', 
                borderColor: 'blue.300',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(49, 130, 206, 0.15)'
              }}
              _active={{ transform: 'translateY(0px)' }}
              _disabled={{ 
                opacity: 0.5, 
                cursor: 'not-allowed',
                _hover: { transform: 'none', boxShadow: 'none' }
              }}
              transition="all 0.2s ease"
              borderRadius="12px"
              borderWidth="2px"
              fontWeight="600"
              px={6}
              py={3}
            >
              {t('pagination.previous')}
            </Button>
            
            {/* Page Numbers */}
            <HStack spacing={2}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                const isActive = currentPage === pageNum;
                
                return (
                  <Button
                    key={pageNum}
                    size="md"
                    variant={isActive ? "solid" : "outline"}
                    colorScheme="blue"
                    onClick={() => handlePageChange(pageNum)}
                    _hover={{ 
                      bg: isActive ? 'blue.600' : 'blue.50',
                      borderColor: 'blue.300',
                      transform: 'translateY(-1px)',
                      boxShadow: isActive 
                        ? '0 4px 12px rgba(49, 130, 206, 0.3)' 
                        : '0 4px 12px rgba(49, 130, 206, 0.15)'
                    }}
                    _active={{ transform: 'translateY(0px)' }}
                    transition="all 0.2s ease"
                    borderRadius="12px"
                    borderWidth="2px"
                    fontWeight="600"
                    minW="44px"
                    h="44px"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </HStack>
            
            <Button
              size="md"
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              isDisabled={!hasNextPage}
              rightIcon={<Icon as={FaChevronRight} />}
              _hover={{ 
                bg: 'blue.50', 
                borderColor: 'blue.300',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(49, 130, 206, 0.15)'
              }}
              _active={{ transform: 'translateY(0px)' }}
              _disabled={{ 
                opacity: 0.5, 
                cursor: 'not-allowed',
                _hover: { transform: 'none', boxShadow: 'none' }
              }}
              transition="all 0.2s ease"
              borderRadius="12px"
              borderWidth="2px"
              fontWeight="600"
              px={6}
              py={3}
            >
              {t('pagination.next')}
            </Button>
          </HStack>
        </VStack>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box py={12}>
        <VStack spacing={8} maxW="6xl" mx="auto">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" />
            <Text color="gray.600" fontSize="lg">{t('common.loading')}...</Text>
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
            bg={cardBg} 
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
              <Heading size="lg" color={cardText}>Oops! Something went wrong</Heading>
              <Text color={cardSubText} fontSize="lg">{error}</Text>
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

  return (
    <Box bg={pageBg} minH="100vh">
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
                bg: 'blue.50', 
                transform: 'translateX(-4px)',
                boxShadow: 'lg'
              }}
              transition="all 0.3s ease"
            >
              Back to Internships
            </Button>
          </HStack>
          
          {internship && (
            <Box 
              bg={cardBg} 
              borderRadius="2xl" 
              p={8} 
              w="full"
              boxShadow="0 4px 24px rgba(44,62,80,0.13)"
              borderLeft="8px solid"
              borderLeftColor="blue.500"
            >
              <VStack spacing={6} align="stretch">
                <HStack justify="space-between" align="flex-start">
                  <Heading 
                    size="xl" 
                    bgGradient="linear(to-r, blue.600, purple.600)" 
                    bgClip="text"
                    fontWeight="extrabold"
                  >
                    {internship.title}
                  </Heading>
                </HStack>
                
                <Text color={cardSubText} fontSize="lg" lineHeight="relaxed">
                  {internship.description}
                </Text>
                
                <HStack spacing={4} flexWrap="wrap">
                  <Badge variant="outline" colorScheme="blue" px={4} py={2} borderRadius="full">
                    📍 {internship.location}
                  </Badge>
                  <Badge variant="outline" colorScheme="green" px={4} py={2} borderRadius="full">
                    🕒 {internship.duration}
                  </Badge>
                  <Badge variant="outline" colorScheme="purple" px={4} py={2} borderRadius="full">
                    💻 {internship.isRemote ? 'Remote' : 'On-site'}
                  </Badge>
                </HStack>
              </VStack>
            </Box>
          )}

          {!internship && (
            <Box 
              bg={cardBg} 
              borderRadius="2xl" 
              p={8} 
              w="full"
              boxShadow="0 4px 24px rgba(44,62,80,0.13)"
              borderLeft="8px solid"
              borderLeftColor="blue.500"
            >
              <VStack spacing={4} align="stretch">
                <Heading 
                  size="xl" 
                  bgGradient="linear(to-r, blue.600, purple.600)" 
                  bgClip="text"
                  fontWeight="extrabold"
                >
                  {t('internship.applicants.title')}
                </Heading>
                <Text color={cardSubText} fontSize="lg">
                  {t('internship.applicants.subtitle')}
                </Text>
              </VStack>
            </Box>
          )}

          <HStack justify="space-between" w="full">
            <VStack align="flex-start" spacing={2}>
              <Heading size="lg" color={cardText}>
                {internship ? t('internship.applicants.applicantsForInternship', { title: internship.title }) : t('internship.applicants.title')}
              </Heading>
            </VStack>
            
            <HStack spacing={4}>
              {/* Total Applications Count */}
              <Box 
                bg={infoBgBlue} 
                borderRadius="xl" 
                p={4}
                border="1px solid"
                borderColor="blue.200"
              >
                <HStack spacing={3}>
                  <Icon as={FaBriefcase} color={accentColor} boxSize={5} />
                  <Text color={cardSubText} fontSize="sm" fontWeight="medium">
                    {t('common.total')}:
                  </Text>
                  <Text color={accentColor} fontWeight="bold" fontSize="lg">
                    {totalItems}
                  </Text>
                </HStack>
              </Box>
              
              <HStack spacing={6} align="center" flexWrap="wrap">
                {/* Status Filter */}
                <HStack spacing={3} align="center">
                  <Text color={cardSubText} fontSize="sm" fontWeight="semibold">
                    {t('common.filter')}:
                  </Text>
                  <Select
                    value={selectedStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    size="md"
                    w="200px"
                    borderRadius="xl"
                    borderColor={borderColor}
                    _focus={{
                      borderColor: accentColor,
                      boxShadow: `0 0 0 1px ${accentColor}`
                    }}
                    bg={cardBg}
                    placeholder={t('application.status.allStatuses')}
                  >
                    <option value="">{t('application.status.allStatuses')}</option>
                    <option value="SUBMITTED">{t('application.status.submitted')}</option>
                    <option value="IN_REVIEW">{t('application.status.inReview')}</option>
                    <option value="ACCEPTED">{t('application.status.accepted')}</option>
                    <option value="REJECTED">{t('application.status.rejected')}</option>
                  </Select>
                </HStack>
                
                {/* Sort Order */}
                <HStack spacing={3} align="center">
                  <Icon as={FaSort} color={cardSubText} />
                  <Text color={cardSubText} fontSize="sm" fontWeight="semibold">
                    {t('common.sort')}:
                  </Text>
                  <Select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    size="md"
                    w="280px"
                    borderRadius="xl"
                    borderColor={borderColor}
                    _focus={{
                      borderColor: accentColor,
                      boxShadow: `0 0 0 1px ${accentColor}`
                    }}
                    bg={cardBg}
                  >
                    <option value="appliedAt:desc">{t('applications.sortBy.newest')}</option>
                    <option value="appliedAt:asc">{t('applications.sortBy.oldest')}</option>
                    <option value="status:asc">{t('applications.sortBy.statusAsc')}</option>
                    <option value="status:desc">{t('applications.sortBy.statusDesc')}</option>
                    <option value="studentName:asc">{t('applications.sortBy.studentAZ')}</option>
                    <option value="studentName:desc">{t('applications.sortBy.studentZA')}</option>
                    <option value="university:asc">{t('applications.sortBy.universityAZ')}</option>
                    <option value="university:desc">{t('applications.sortBy.universityZA')}</option>
                  </Select>
                </HStack>
              </HStack>
            </HStack>
          </HStack>
        </VStack>

        {/* Applicants List */}
        {applicants.length === 0 ? (
          <Box 
            bg={cardBg} 
            borderRadius="2xl" 
            p={12} 
            textAlign="center"
            w="full"
            boxShadow="0 4px 24px rgba(44,62,80,0.13)"
          >
            <VStack spacing={6}>
              <Box 
                w={20} 
                h={20} 
                bg={infoBgBlue} 
                borderRadius="full" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
              >
                <Text fontSize="3xl">📝</Text>
              </Box>
              <Heading size="lg" color={cardText}>{t('internship.applicants.noApplicantsFound')}</Heading>
              <Text color={cardSubText} fontSize="lg" maxW="md">
                {selectedStatus 
                  ? t('internship.applicants.noApplicantsWithStatus', { status: selectedStatus })
                  : t('internship.applicants.noApplicantsMessage')
                }
              </Text>
            </VStack>
          </Box>
        ) : (
          <VStack spacing={6} w="full">
            {applicants.map((applicant, index) => (
              <Box 
                key={applicant.id} 
                bg={cardBg} 
                borderRadius="2xl" 
                p={8} 
                w="full"
                boxShadow="0 4px 24px rgba(44,62,80,0.13)"
                _hover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 32px rgba(44,62,80,0.2)' }}
                transition="all 0.3s ease"
              >
                <VStack spacing={6} align="stretch">
                  <HStack justify="space-between" align="flex-start">
                    <HStack spacing={4} align="flex-start">
                      <Box 
                        w={16} 
                        h={16} 
                        bgGradient="linear(to-br, blue.500, purple.600)" 
                        borderRadius="full" 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center"
                        boxShadow="lg"
                      >
                        <Text fontSize="2xl" fontWeight="bold" color="white">
                          {(applicant.student?.fullName || 'U').charAt(0).toUpperCase()}
                        </Text>
                      </Box>
                      <VStack align="flex-start" spacing={2}>
                        <Heading size="md" color="blue.700">
                          {applicant.student?.fullName || t('common.unknown')}
                        </Heading>
                        <Text color={cardSubText} fontSize="md">
                          {applicant.student?.university || t('profile.universityNotSpecified')} • {applicant.student?.major || t('profile.majorNotSpecified')}
                        </Text>
                        <Text color={cardSubtleText} fontSize="sm">
                          {t('application.appliedOn')} {new Date(applicant.appliedAt).toLocaleDateString()} {t('application.at')} {new Date(applicant.appliedAt).toLocaleTimeString()}
                        </Text>
                      </VStack>
                    </HStack>
                    <Badge 
                      colorScheme={getStatusColor(applicant.status)} 
                      variant="subtle" 
                      px={4} 
                      py={2} 
                      borderRadius="full"
                      fontSize="md"
                      fontWeight="semibold"
                    >
                      {getStatusIcon(applicant.status)} {t(`application.status.${applicant.status?.toLowerCase()}`) || t('application.status.pending')}
                    </Badge>
                  </HStack>

                  {/* Student Details */}
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box bg={infoBgBlue} borderRadius="xl" p={4}>
                      <VStack align="flex-start" spacing={2}>
                        <Text fontSize="sm" color={cardSubText} fontWeight="medium">Email</Text>
                        <Text color={cardText} fontWeight="semibold">{applicant.student?.email || 'Not provided'}</Text>
                      </VStack>
                    </Box>
                    <Box bg={infoBgGreen} borderRadius="xl" p={4}>
                      <VStack align="flex-start" spacing={2}>
                        <Text fontSize="sm" color={cardSubText} fontWeight="medium">Graduation Year</Text>
                        <Text color={cardText} fontWeight="semibold">{applicant.student?.graduationYear || 'Not specified'}</Text>
                      </VStack>
                    </Box>
                  </SimpleGrid>

                  {/* Documents */}
                  <VStack align="flex-start" spacing={4}>
                    <Heading size="md" color={cardText}>Documents</Heading>
                    <HStack spacing={4} flexWrap="wrap">
                      {applicant.resumePath && (
                        <Button
                          leftIcon={<Text>📄</Text>}
                          colorScheme="blue"
                          variant="outline"
                          size="md"
                          onClick={() => handleViewResume(applicant.id)}
                          _hover={{ bg: 'blue.50' }}
                        >
                          View Resume
                        </Button>
                      )}
                      {applicant.coverLetterPath && (
                        <Button
                          leftIcon={<Text>📝</Text>}
                          colorScheme="purple"
                          variant="outline"
                          size="md"
                          onClick={() => handleViewCoverLetter(applicant.id)}
                          _hover={{ bg: 'purple.50' }}
                        >
                          View Cover Letter
                        </Button>
                      )}
                    </HStack>
                  </VStack>

                  {/* Action Buttons */}
                  <HStack spacing={4} justify="flex-end">
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      size="md"
                      onClick={() => {
                        console.log('InternshipApplicantsPage: Navigating to application details');
                        console.log('InternshipApplicantsPage: Full applicant object:', applicant);
                        console.log('InternshipApplicantsPage: applicant.id =', applicant.id);
                        
                        navigate(`/internship/application/${applicant.id}`);
                      }}
                      _hover={{ bg: 'blue.50' }}
                    >
                      📋 View Details
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </VStack>
        )}
        
        {/* Pagination */}
        {renderPagination()}
      </VStack>
    </Box>
  );
};

export default InternshipApplicantsPage;