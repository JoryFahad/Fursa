import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Flex,
  useToast,
  Divider,
  Icon,
  Select,
  useColorModeValue
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaPlus, FaChevronLeft, FaChevronRight, FaSort, FaBriefcase, FaGraduationCap, FaClock } from 'react-icons/fa';

const CompanyInternshipStatusPage = () => {
  const { t } = useTranslation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('appliedAt:desc');
  const { accessToken, user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Enhanced color scheme with gradients and better dark mode support
  const bgGradient = useColorModeValue(
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardText = useColorModeValue('gray.800', 'white');
  const cardSubText = useColorModeValue('gray.600', 'gray.300');
  const pageBg = useColorModeValue('gray.50', '#0f0f0f');
  const headerBg = useColorModeValue('rgba(255,255,255,0.95)', 'rgba(26,32,44,0.95)');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const shadowColor = useColorModeValue('0 10px 25px rgba(0,0,0,0.1)', '0 10px 25px rgba(0,0,0,0.3)');
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const infoBgBlue = useColorModeValue('blue.50', 'blue.900');

  const fetchApplications = useCallback(async (page = 1, status = null, sort = 'appliedAt:desc') => {
    if (!user || user.role !== 'company') {
      setError('Only company accounts can access this page.');
        setLoading(false);
        return;
      }

    setLoading(true);
    try {
      // Debug logging
      console.log('CompanyInternshipStatusPage: fetchApplications called with:', {
        page,
        status,
        sort,
        pageSize
      });
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        sort: sort,
      });
      
      // Add status filter if provided
      if (status && status !== '') {
        params.append('status', status);
      }

      const url = `${config.API_URL}/applications?${params.toString()}`;
      console.log('CompanyInternshipStatusPage: Fetching from URL:', url);
      console.log('CompanyInternshipStatusPage: Query parameters:', params.toString());
      
      const response = await fetch(url, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
              },
            });
            
      if (response.status === 401) {
        toast({
          title: 'Session Expired',
          description: 'Please log in again.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        logout();
              return;
            }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`Failed to fetch applications. Server responded with: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Applications data received:', data);
      console.log('CompanyInternshipStatusPage: Sample application structure:', data.items?.[0]);
      
      // Handle both legacy and new nested response structures
      let processedApplications = data.items || [];
      if (processedApplications.length > 0) {
        processedApplications = processedApplications.map(item => {
          // If it's the new nested structure { application, student, internship }
          if (item.application && item.student && item.internship) {
            console.log('CompanyInternshipStatusPage: Using new nested structure for application', item.application.id);
            return {
              ...item.application,
              student: item.student,
              internship: item.internship
            };
          }
          // Otherwise, assume it's already in the correct format
          return item;
        });
      }
      
      setApplications(processedApplications);
      setTotalItems(data.total || 0);
      setHasNextPage(data.hasNextPage || false);
      setCurrentPage(data.page || 1);

      } catch (err) {
        setError(err.message);
      console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    }, [user, accessToken, pageSize, toast, logout]);

  useEffect(() => {
    if (accessToken && user) {
      fetchApplications(currentPage, selectedStatus, sortOrder);
    }
  }, [fetchApplications, accessToken, user, currentPage, pageSize, selectedStatus, sortOrder]);
  
  const handlePageChange = (newPage) => {
    fetchApplications(newPage, selectedStatus, sortOrder);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleStatusChange = (newStatus) => {
    console.log('CompanyInternshipStatusPage: Status changed from', selectedStatus, 'to', newStatus);
    setSelectedStatus(newStatus);
    setCurrentPage(1); // Reset to first page when changing status filter
    fetchApplications(1, newStatus, sortOrder);
  };

  const handleSortChange = (newSort) => {
    console.log('CompanyInternshipStatusPage: Sort changed from', sortOrder, 'to', newSort);
    setSortOrder(newSort);
    setCurrentPage(1); // Reset to first page when changing sort order
    fetchApplications(1, selectedStatus, newSort);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'green';
      case 'rejected': return 'red';
      case 'in_review': return 'yellow';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return '✅';
      case 'rejected': return '❌';
      case 'in_review': return '⏳';
      default: return '📋';
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
        borderWidth={0}
      >
        <VStack spacing={4} align="stretch">
          {/* Results Info and Page Size */}
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Text color={cardSubText} fontSize="sm" fontWeight="medium">
                Showing <Text as="span" color="blue.600" fontWeight="bold">
                  {startItem}
                </Text> to <Text as="span" color="blue.600" fontWeight="bold">
                  {endItem}
                </Text> of <Text as="span" color="blue.600" fontWeight="bold">
                  {totalItems}
                </Text> applications
              </Text>
              <Text color={cardSubText} fontSize="xs">
                Page {currentPage} of {totalPages}
              </Text>
            </VStack>
            
            <HStack spacing={3} align="center">
              <Text color={cardSubText} fontSize="sm" fontWeight="medium">Show:</Text>
              <Select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                size="sm"
                w="120px"
                borderRadius="md"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
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
              Previous
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
              Next
            </Button>
          </HStack>
        </VStack>
      </Box>
    );
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="80vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text fontSize="xl" color="gray.600">Loading Applications...</Text>
        </VStack>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" minH="80vh">
        <VStack spacing={6} textAlign="center" bg="white" p={12} borderRadius="2xl" boxShadow="xl">
          <Text fontSize="3xl">⚠️</Text>
          <Heading size="lg" color="red.500">Oops! Something went wrong</Heading>
          <Text color="gray.600" maxW="md">{error}</Text>
          <Button colorScheme="blue" onClick={() => navigate('/home')}>
            ← Back to Home
          </Button>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box minH="100vh" bg={pageBg} position="relative" overflow="hidden">
      {/* Background gradient overlay */}
      <Box 
        position="absolute" 
        top="0" 
        left="0" 
        right="0" 
        height="300px" 
        bgGradient="linear(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)"
        zIndex={0}
      />
      
      <Box maxW="7xl" mx="auto" py={12} px={4} position="relative" zIndex={1}>
        <VStack spacing={8} align="stretch">
          {/* Enhanced Header */}
          <Box 
            bg={headerBg} 
            borderRadius="3xl" 
            p={8} 
            backdropFilter="blur(20px)"
            border="1px solid"
            borderColor={borderColor}
            boxShadow={shadowColor}
          >
            <HStack justify="space-between" align="center">
              <Box>
                <Heading 
                  as="h1" 
                  size="2xl" 
                  bgGradient="linear(to-r, blue.500, purple.600)"
                  bgClip="text"
                  fontWeight="extrabold"
                >
                  {t('applications.companyTitle')}
                </Heading>
                <Text mt={3} fontSize="xl" color={cardSubText} maxW="2xl">
                  {t('applications.companySubtitle')}
                </Text>
              </Box>
              <Button
                leftIcon={<Icon as={FaPlus} />}
                size="lg"
                px={8}
                py={6}
                fontSize="lg"
                fontWeight="bold"
                borderRadius="2xl"
                bgGradient="linear(to-r, blue.500, purple.600)"
                color="white"
                boxShadow="0 8px 32px rgba(79, 70, 229, 0.3)"
                _hover={{
                  bgGradient: 'linear(to-r, blue.600, purple.700)',
                  boxShadow: '0 12px 40px rgba(79, 70, 229, 0.4)',
                  transform: 'translateY(-2px)'
                }}
                _active={{
                  transform: 'translateY(0px)'
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                onClick={() => navigate('/create-internship')}
              >
                {t('home.createInternship')}
              </Button>
            </HStack>
          </Box>

        {/* Enhanced Filters and Controls */}
        <Box 
          bg={cardBg} 
          borderRadius="2xl" 
          p={8} 
          boxShadow={shadowColor}
          border="1px solid"
          borderColor={borderColor}
          backdropFilter="blur(10px)"
        >
          <VStack spacing={6} align="stretch">
            <HStack justify="space-between" align="center" flexWrap="wrap" spacing={4}>
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
                    {t('applications.title')}
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
                    placeholder={t('internships.allStatuses')}
                  >
                    <option value="">{t('internships.allStatuses')}</option>
                    <option value="SUBMITTED">{t('applications.statusSubmitted')}</option>
                    <option value="IN_REVIEW">{t('applications.statusInReview')}</option>
                    <option value="ACCEPTED">{t('applications.statusAccepted')}</option>
                    <option value="REJECTED">{t('applications.statusRejected')}</option>
                  </Select>
                </HStack>
                
                {/* Sort Order */}
                <HStack spacing={3} align="center">
                  <Icon as={FaSort} color={cardSubText} />
                  <Text color={cardSubText} fontSize="sm" fontWeight="semibold">
                    {t('common.sort')}:
                  </Text>
                  <Select
                    value={sortOrder}
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
                    <option value="university:asc">{t('applications.sortBy.universityAZ')}</option>
                  </Select>
                </HStack>
              </HStack>
            </HStack>
          </VStack>
        </Box>

        {/* Applications List */}
        {applications.length === 0 ? (
          <Flex justify="center" align="center" minH="50vh" bg={cardBg} borderRadius="2xl" p={12}>
            <VStack spacing={6} textAlign="center">
              <Text fontSize="4xl">📝</Text>
              <Heading size="xl" color={cardText}>{t('applications.noApplications')}</Heading>
              <Text fontSize="lg" color={cardSubText} maxW="lg">
                {selectedStatus 
                  ? `${t('applications.noAppsWithStatus')} "${selectedStatus}".` 
                  : t('applications.noAppsYet')
                }
              </Text>
            </VStack>
          </Flex>
        ) : (
          <VStack spacing={6} w="full">
            {applications.map((application) => (
              <Box 
                key={application.id}
                bg={cardBg}
                borderRadius="3xl"
                p={8}
                w="full"
                boxShadow={shadowColor}
                border="1px solid"
                borderColor={borderColor}
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                  borderColor: accentColor,
                }}
                transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                position="relative"
                overflow="hidden"
              >
                {/* Subtle background pattern */}
                <Box
                  position="absolute"
                  top="0"
                  right="0"
                  w="100px"
                  h="100px"
                  bgGradient="linear(45deg, blue.500, purple.600)"
                  opacity={0.05}
                  borderBottomLeftRadius="full"
                />
                
                <VStack spacing={6} align="stretch" position="relative" zIndex={1}>
                  <HStack justify="space-between" align="flex-start">
                    <HStack spacing={5} align="flex-start">
                      <Box 
                        w={20} 
                        h={20} 
                        bgGradient="linear(135deg, blue.500, purple.600)" 
                        borderRadius="2xl" 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center"
                        boxShadow="0 8px 25px rgba(79, 70, 229, 0.3)"
                        border="3px solid"
                        borderColor="white"
                      >
                        <Text fontSize="3xl" fontWeight="bold" color="white">
                          {(application.student?.fullName || 'U').charAt(0).toUpperCase()}
                        </Text>
                      </Box>
                      <VStack align="flex-start" spacing={3}>
                        <Heading size="lg" color={cardText} fontWeight="bold">
                          {application.student?.fullName || t('common.unknown')}
                        </Heading>
                        <HStack spacing={2}>
                          <Icon as={FaGraduationCap} color={cardSubText} />
                          <Text color={cardSubText} fontSize="md" fontWeight="medium">
                            {application.student?.university || t('form.university')}
                          </Text>
                        </HStack>
                        <HStack spacing={2}>
                          <Icon as={FaClock} color={cardSubText} />
                          <Text color={cardSubText} fontSize="sm">
                            {t('applications.appliedOn')} {new Date(application.appliedAt).toLocaleDateString()} at {new Date(application.appliedAt).toLocaleTimeString()}
                          </Text>
                        </HStack>
                      </VStack>
                    </HStack>
                    <Badge 
                      colorScheme={getStatusColor(application.status)} 
                      variant="solid" 
                      px={6} 
                      py={3} 
                      borderRadius="full"
                      fontSize="md"
                      fontWeight="bold"
                      boxShadow="lg"
                    >
                      {getStatusIcon(application.status)} {application.status || 'Pending'}
                    </Badge>
                  </HStack>

                  <Divider />

                  {/* Internship Details */}
                  <Box bg={infoBgBlue} borderRadius="xl" p={4}>
                    <VStack align="flex-start" spacing={2}>
                      <Text fontSize="sm" color={cardSubText} fontWeight="medium">{t('internships.position')}</Text>
                      <Text color={cardText} fontWeight="semibold" fontSize="lg">
                        {application.internship?.title || t('common.unknown')}
                      </Text>
                      <HStack color={cardSubText} fontSize="sm">
                        <Icon as={FaMapMarkerAlt} />
                        <Text>{application.internship?.location || t('common.unknown')}</Text>
                      </HStack>
                    </VStack>
                  </Box>

                  {/* Action Buttons */}
                  <HStack spacing={4} justify="flex-end">
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      size="md"
                      onClick={() => navigate(`/internship/application/${application.id}`)}
                      _hover={{ bg: 'blue.50' }}
                    >
                      📋 {t('applications.viewApplication')}
                    </Button>
                    <Button
                      colorScheme="green"
                      variant="outline"
                      size="md"
                      onClick={() => navigate(`/internship/${application.internshipId}/applicants`)}
                      _hover={{ bg: 'green.50' }}
                    >
                      👥 {t('internships.viewApplicants')}
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
    </Box>
  );
};

export default CompanyInternshipStatusPage;