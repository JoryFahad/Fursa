import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Icon,
  Divider,
  Select,
  useColorModeValue
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Mapping from status to a more readable format and icon
const getStatusDetails = (t) => ({
  ALL: { text: t('applications.statusAll'), icon: '📂', color: 'blue' },
  SUBMITTED: { text: t('applications.statusSubmitted'), icon: '📝', color: 'gray' },
  IN_REVIEW: { text: t('applications.statusInReview'), icon: '⏳', color: 'yellow' },
  ACCEPTED: { text: t('applications.statusAccepted'), icon: '✅', color: 'green' },
  REJECTED: { text: t('applications.statusRejected'), icon: '❌', color: 'red' },
});

const ApplicationCard = ({ application, internship, onDownload }) => {
  const { t } = useTranslation();
  const statusDetails = getStatusDetails(t);
  const detail = statusDetails[application.status] || statusDetails.SUBMITTED;
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardText = useColorModeValue('gray.800', 'white');
  const cardSubText = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box
      bg={cardBg}
      borderRadius="2xl"
      p={6}
      w="full"
      boxShadow="0 4px 24px rgba(44, 62, 80, 0.1)"
      borderLeft="6px solid"
      borderLeftColor={`${detail.color}.400`}
      _hover={{
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 32px rgba(44, 62, 80, 0.15)',
      }}
      transition="all 0.3s ease"
    >
      <VStack spacing={4} align="stretch">
        <Heading size="md" color={cardText}>
          {internship?.title || 'Internship Title'}
        </Heading>
        <Text color={cardSubText} fontWeight="medium">
          {internship?.companyName ? `at ${internship.companyName}` : ''}
        </Text>
        <Text color={cardSubText} fontSize="sm">
          {t('applications.location')}: <b>{internship?.location || 'N/A'}</b> | {t('applications.duration')}: <b>{internship?.duration || 'N/A'}</b>
        </Text>
        <Text color={cardSubText} fontSize="sm">
          {t('applications.applicationStatus')}: <Badge colorScheme={detail.color}>{detail.icon} {detail.text}</Badge>
        </Text>
        <Text color={cardSubText} fontSize="sm">
          {t('applications.appliedOn')}: <b>{application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'N/A'}</b>
        </Text>
        <HStack spacing={4}>
          <Badge colorScheme={application.resumePath ? 'green' : 'gray'}>
            {application.resumePath ? t('applications.resumeUploaded') : t('applications.noResume')}
          </Badge>
          <Badge colorScheme={application.coverLetterPath ? 'purple' : 'gray'}>
            {application.coverLetterPath ? t('applications.coverLetterUploaded') : t('applications.noCoverLetter')}
          </Badge>
        </HStack>
        <HStack spacing={4}>
          <Button
            as={Link}
            to={`/internship/application/${application.id}`}
            size="sm"
            colorScheme="blue"
            variant="ghost"
          >
            {t('applications.viewApplicationArrow')}
          </Button>
          <Button
            size="sm"
            colorScheme="green"
            variant="outline"
            onClick={() => onDownload(application.id, 'resume')}
            leftIcon={<Icon as={FaChevronRight} />}
          >
            {t('applications.downloadResume')}
          </Button>
          <Button
            size="sm"
            colorScheme="purple"
            variant="outline"
            onClick={() => onDownload(application.id, 'coverLetter')}
            leftIcon={<Icon as={FaChevronRight} />}
          >
            {t('applications.downloadCoverLetter')}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

const StatusPage = () => {
  const { t } = useTranslation();
  const { user, accessToken, logout, refresh } = useAuth();
  const statusTabs = useMemo(() => ['ALL', 'SUBMITTED', 'IN_REVIEW', 'ACCEPTED', 'REJECTED'], []);
  const statusDetails = useMemo(() => getStatusDetails(t), [t]);
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const toast = useToast();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  
  // Pagination and sorting state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [sortBy, setSortBy] = useState('appliedAt:desc'); // Default to newest applications first

  const pageBg = useColorModeValue('gray.50', '#18181b');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardText = useColorModeValue('gray.800', 'white');
  const cardSubText = useColorModeValue('gray.600', 'gray.300');
  const cardBorder = useColorModeValue('gray.100', 'gray.700');

  const fetchApplications = useCallback(async (page = 1, status = null, sort = 'appliedAt:desc') => {
    if (!user || user.role !== 'student') {
      setError('Only students can view this page.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        sort: sort,
      });
      
      // Add status filter if not 'ALL'
      if (status && status !== 'ALL') {
        params.append('status', status);
      }
      
      const url = `${config.API_URL}/applications?${params.toString()}`;
      console.log('Fetching applications from:', url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        toast({
          title: t('applications.sessionExpired'),
          description: t('applications.pleaseLoginAgain'),
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch applications.');
      }

      const data = await response.json();
      console.log('Applications data received:', data);
      console.log('Applications items:', data.items);
      
      setApplications(data.items || []);
      setTotalItems(data.total || 0);
      setHasNextPage(data.hasNextPage || false);
      setCurrentPage(data.page || 1);
    } catch (err) {
      setError(t('applications.couldNotLoad'));
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  }, [user, pageSize, accessToken, logout, toast, t]);
  useEffect(() => {
    const currentStatus = statusTabs[activeTabIndex];
    fetchApplications(1, currentStatus === 'ALL' ? null : currentStatus, sortBy);
  }, [user, accessToken, activeTabIndex, pageSize, sortBy, fetchApplications, statusTabs]);

  const handleTabChange = (index) => {
    setActiveTabIndex(index);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1); // Reset to first page when changing sort
  };

  const handlePageChange = (newPage) => {
    const currentStatus = statusTabs[activeTabIndex];
    fetchApplications(newPage, currentStatus === 'ALL' ? null : currentStatus, sortBy);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const downloadFile = async (applicationId, fileType) => {
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
          title: t('applications.downloadStarted'),
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
            title: t('applications.downloadFailed'),
            description: 'Authentication failed. Please log in again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } else if (response.status === 403) {
        toast({
          title: t('applications.accessDenied'),
          description: 'You are not authorized to download this file.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (response.status === 404) {
        toast({
          title: t('applications.fileNotFound'),
          description: 'The requested file was not found.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: t('applications.downloadFailed'),
          description: 'Unable to download file. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('File download error:', error);
      toast({
        title: t('applications.downloadError'),
        description: 'An error occurred while downloading the file.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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
        borderColor={cardBorder}
      >
        <VStack spacing={4} align="stretch">
          {/* Results Info and Page Size */}
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Text color={cardSubText} fontSize="sm" fontWeight="medium">
                {t('applications.showing')} <Text as="span" color="blue.600" fontWeight="bold">
                  {startItem}
                </Text> {t('applications.to')} <Text as="span" color="blue.600" fontWeight="bold">
                  {endItem}
                </Text> {t('applications.of')} <Text as="span" color="blue.600" fontWeight="bold">
                  {totalItems}
                </Text> {t('applications.applicationsText')}
              </Text>
              <Text color={cardSubText} fontSize="xs">
                {t('applications.page')} {currentPage} {t('applications.of')} {totalPages}
              </Text>
            </VStack>
            
            <HStack spacing={3} align="center">
              <Text color={cardSubText} fontSize="sm" fontWeight="medium">{t('applications.show')}:</Text>
              <Select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                size="sm"
                w="120px"
                borderRadius="md"
              >
                <option value={5}>5 {t('applications.perPage')}</option>
                <option value={10}>10 {t('applications.perPage')}</option>
                <option value={20}>20 {t('applications.perPage')}</option>
                <option value={50}>50 {t('applications.perPage')}</option>
              </Select>
            </HStack>
          </HStack>
          
          <Divider borderColor={cardBorder} />
          
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

  const renderContent = () => {
    if (loading) {
      return (
        <Box py={12} bg={pageBg} minH="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" />
            <Text color={cardSubText}>{t('applications.loadingApps')}</Text>
          </VStack>
        </Box>
      );
    }

    if (error) {
      return (
        <Box py={12} bg={pageBg} minH="100vh">
          <VStack spacing={4}>
            <Text color="red.500" fontWeight="bold">{error}</Text>
          </VStack>
        </Box>
      );
    }    if (applications.length === 0) {
      // Show empty state within the tab structure instead of replacing it
      return (
        <VStack spacing={6} align="stretch">
          <Tabs index={activeTabIndex} onChange={handleTabChange} isFitted variant="soft-rounded" colorScheme="blue">
            <TabList mb={8}>
              {statusTabs.map(status => (
                <Tab key={status} fontWeight="bold" fontSize="lg" py={3} borderRadius="full">
                  {statusDetails[status]?.icon || '📂'} {statusDetails[status]?.text || 'All'}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              {statusTabs.map(status => (
                <TabPanel key={status} p={0}>
                  <Box textAlign="center" py={16} bg={cardBg} borderRadius="2xl" p={8} boxShadow="md">
                    <Text fontSize="4xl" mb={4}>🧭</Text>
                    <Heading size="xl" color={cardText}>{t('applications.noApplications')}</Heading>
                    <Text mt={4} fontSize="lg" color={cardSubText} maxW="md" mx="auto">
                      {status === 'ALL' 
                        ? t('applications.noAppsYet')
                        : t('applications.noAppsWithStatus', { status: statusDetails[status]?.text || status })
                      }
                    </Text>
                    {status === 'ALL' && (
                      <Button
                        as={Link}
                        to="/internships"
                        colorScheme="blue"
                        size="lg"
                        mt={8}
                        px={8}
                        py={6}
                        fontSize="xl"
                        fontWeight="bold"
                        boxShadow="lg"
                        bgGradient="linear(to-r, blue.400, teal.400)"
                        _hover={{
                          bgGradient: 'linear(to-r, blue.500, teal.500)',
                          boxShadow: 'xl',
                          transform: 'translateY(-2px)'
                        }}
                        transition="all 0.3s ease"
                      >
                        {t('applications.exploreInternships')}
                      </Button>
                    )}
                  </Box>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </VStack>
      );
    }

    return (
      <VStack spacing={6} align="stretch">
        {/* Sorting Control */}
        <HStack spacing={4} justify="space-between" align="center" w="full">
          <Text fontSize="lg" fontWeight="semibold" color={cardText}>
            {t('applications.sortApplicationsBy')}
          </Text>
          <Select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            maxW="300px"
            bg={cardBg}
            borderColor={cardBorder}
            _hover={{ borderColor: 'blue.300' }}
            _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
          >
            <option value="appliedAt:desc">Newest Applications First</option>
            <option value="appliedAt:asc">Oldest Applications First</option>
            <option value="status:asc">Status (Pending → Rejected)</option>
            <option value="status:desc">Status (Rejected → Pending)</option>
            <option value="companyName:asc">Company Name A-Z</option>
            <option value="companyName:desc">Company Name Z-A</option>
            <option value="internshipTitle:asc">Internship Title A-Z</option>
            <option value="deadline:asc">Deadline (Soon First)</option>
          </Select>
        </HStack>

        <Tabs index={activeTabIndex} onChange={handleTabChange} isFitted variant="soft-rounded" colorScheme="blue">
          <TabList mb={8}>
            {statusTabs.map(status => (
              <Tab key={status} fontWeight="bold" fontSize="lg" py={3} borderRadius="full">
                {statusDetails[status]?.icon || '📂'} {statusDetails[status]?.text || 'All'}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {statusTabs.map(status => (
              <TabPanel key={status} p={0}>
                <VStack spacing={6} w="full">
                  {(applications && Array.isArray(applications) && applications.map((item) => {
                    // Handle different possible data structures
                    let application, internship;
                    
                    if (item && item.application && item.internship) {
                      // Data structure: { application: {...}, internship: {...} }
                      application = item.application;
                      internship = item.internship;
                    } else if (item && item.id) {
                      // Data structure: application object directly
                      application = item;
                      internship = item.internship || item.Internship || null;
                    } else {
                      // Invalid data structure
                      return null;
                    }
                    
                    // Safety check
                    if (!application || !application.id) {
                      return null;
                    }
                    
                    return (
                      <ApplicationCard
                        key={application.id}
                        application={application}
                        internship={internship}
                        onDownload={downloadFile}
                      />
                    );
                  }).filter(Boolean)) || []}
                </VStack>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
        
        {/* Pagination */}
        {renderPagination()}
      </VStack>
    );
  };
  return (
    <Box minH="100vh" bg={pageBg} py={10} px={2}>
      <Box py={12} maxW="5xl" mx="auto" px={4}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" color="gray.800" fontWeight="bold">
            {t('applications.title')}
          </Heading>
          <Text mt={3} fontSize="xl" color="gray.600">
            {t('applications.subtitle')}
          </Text>
        </Box>        {renderContent()}
      </VStack>
      </Box>
    </Box>
  );
};

export default StatusPage;
