import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Badge,
  Spinner,
  useToast,
  useColorModeValue
} from '@chakra-ui/react';

// Landing Page for Non-Logged-In Users
const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const bgGradient = useColorModeValue(
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)'
  );
  const heroText = useColorModeValue('white', 'gray.100');
  const heroSubText = useColorModeValue('rgba(255,255,255,0.95)', 'gray.200');
  const heroSubText2 = useColorModeValue('rgba(255,255,255,0.85)', 'gray.300');
  const sectionBg = useColorModeValue('rgba(255,255,255,0.1)', 'rgba(26,32,44,0.7)');
  const featureCardBg = useColorModeValue('rgba(255,255,255,0.95)', 'rgba(26,32,44,0.95)');
  const featureCardText = useColorModeValue('gray.800', 'white');

  const features = [
    {
      icon: '🎯',
      titleKey: 'home.feature1.title',
      descriptionKey: 'home.feature1.description',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: '🚀',
      titleKey: 'home.feature2.title',
      descriptionKey: 'home.feature2.description',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: '🤝',
      titleKey: 'home.feature3.title',
      descriptionKey: 'home.feature3.description',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: '📈',
      titleKey: 'home.feature4.title',
      descriptionKey: 'home.feature4.description',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ];

  const stats = [
    { number: '500+', labelKey: 'home.stats.internships', icon: '💼' },
    { number: '200+', labelKey: 'home.stats.companies', icon: '🏢' },
    { number: '10K+', labelKey: 'home.stats.students', icon: '🎓' },
    { number: '95%', labelKey: 'home.stats.success', icon: '📊' }
  ];

  return (
    <Box minH="100vh" bgGradient={bgGradient} position="relative" overflow="hidden">
      {/* Floating Background Elements */}
      <Box position="absolute" top="10%" left="5%" w="100px" h="100px" bg="whiteAlpha.200" borderRadius="50%" style={{ animation: 'float 6s ease-in-out infinite' }} />
      <Box position="absolute" top="20%" right="10%" w="60px" h="60px" bg="whiteAlpha.100" borderRadius="50%" style={{ animation: 'float 8s ease-in-out infinite reverse' }} />
      <Box position="absolute" bottom="15%" left="15%" w="80px" h="80px" bg="whiteAlpha.100" borderRadius="50%" style={{ animation: 'float 7s ease-in-out infinite' }} />

      {/* Hero Section */}
      <Box as="section" py={{ base: 24, md: 32 }} px={4} textAlign="center" position="relative" zIndex={2}>
        <Box maxW="6xl" mx="auto">
          <Heading as="h1" fontSize={{ base: '4xl', md: '7xl' }} fontWeight="extrabold" color={heroText} mb={8} lineHeight="tight" textShadow="0 4px 20px rgba(0,0,0,0.3)">
            {t('home.welcome')} <Box as="span" color={heroText}>Fursa</Box>
          </Heading>
          <Text fontSize={{ base: 'xl', md: '2xl' }} color={heroSubText} mb={8} maxW="2xl" mx="auto" lineHeight="relaxed">
            {t('home.gateway')}
          </Text>
          <Text fontSize={{ base: 'lg', md: 'xl' }} color={heroSubText2} mb={12} maxW="xl" mx="auto" lineHeight="relaxed">
            {t('home.description')}
          </Text>
          <Box display="flex" gap={6} justifyContent="center" flexWrap="wrap">
            <Button
              onClick={() => navigate('/login')}
              px={8}
              py={4}
              fontSize="lg"
              fontWeight="bold"
              colorScheme="whiteAlpha"
              bg="whiteAlpha.300"
              border="2px solid"
              borderColor="whiteAlpha.400"
              borderRadius="full"
              _hover={{ bg: 'whiteAlpha.400', transform: 'translateY(-4px)' }}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              backdropFilter="blur(10px)"
            >
              📝 {t('nav.login')}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Stats Section */}
      <Box as="section" py={16} px={4} bg={sectionBg} backdropFilter="blur(20px)" borderTop="1px solid rgba(255,255,255,0.2)" borderBottom="1px solid rgba(255,255,255,0.2)">
        <Box maxW="6xl" mx="auto">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} textAlign="center">
            {stats.map((stat, index) => (
              <div
                key={index}
                style={{
                  animation: `fadeInUp 1s ease-out ${0.8 + index * 0.1}s both`
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>
                  {stat.icon}
                </div>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  color: 'white',
                  marginBottom: '0.5rem',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontSize: '1.2rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: '600'
                }}>
                  {t(stat.labelKey)}
                </div>
              </div>
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      {/* Features Section */}
      <Box as="section" py={20} px={4} bgGradient="linear(to-br, whiteAlpha.200 0%, whiteAlpha.100 100%)">
        <Box maxW="6xl" mx="auto">
          <Heading as="h2" fontSize={{ base: '3xl', md: '5xl' }} fontWeight="extrabold" color={heroText} textAlign="center" mb={12} textShadow="0 4px 15px rgba(0,0,0,0.3)">
            {t('home.whyChoose')}
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: featureCardBg,
                  borderRadius: '24px',
                  padding: '2.5rem',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(20px)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-10px) scale(1.02)';
                  e.target.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {/* Feature Icon */}
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1.5rem',
                  display: 'inline-block',
                  padding: '1rem',
                  background: feature.color,
                  borderRadius: '20px',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
                }}>
                  {feature.icon}
                </div>

                {/* Feature Title */}
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#2d3748',
                  marginBottom: '1rem',
                  background: feature.color,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {t(feature.titleKey)}
                </h3>

                {/* Feature Description */}
                <p style={{
                  fontSize: '1rem',
                  color: '#4a5568',
                  lineHeight: '1.6',
                  fontWeight: '500'
                }}>
                  {t(feature.descriptionKey)}
                </p>
              </div>
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      {/* Call to Action Section */}
      <Box as="section" py={20} px={4} textAlign="center" bgGradient="linear(to-br, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%)">
        <Box maxW="800px" mx="auto">
          <Heading as="h2" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="extrabold" color="white" mb={1.5}>
            Ready to Start Your Journey?
          </Heading>
          <Text color="rgba(255, 255, 255, 0.9)" fontSize={{ base: '1.3rem', md: '1.5rem' }} mb={3}>
            Join thousands of students who have found their dream internships through Fursa. 
            Your future starts here!
          </Text>
        </Box>
      </Box>

      {/* Footer */}
      <Box as="footer" py={8} textAlign="center" bg={sectionBg} borderTop="1px solid rgba(255, 255, 255, 0.1)">
        <Text color="rgba(255, 255, 255, 0.7)" fontSize="1rem" m={0}>
          © 2025 Fursa. Empowering the next generation of professionals.
        </Text>
      </Box>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </Box>
  );
};

const Demo = ({ latestInternships, latestApplications, applicationsPage, setApplicationsPage, hasNextPage, internshipsPage, setInternshipsPage, hasNextInternshipsPage }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardText = useColorModeValue('gray.800', 'white');
  const cardSubText = useColorModeValue('gray.600', 'gray.300');
  const cardBorder = useColorModeValue('gray.200', '#23232b');
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 10, md: 16 }} maxW="6xl" mx="auto" py={{ base: 6, md: 12 }}>
      <Box 
        bg={cardBg}
        borderRadius="2xl" 
        p={8} 
        boxShadow="0 4px 24px rgba(44,62,80,0.13)"
        borderLeft="8px solid"
        borderLeftColor="blue.500"
        _hover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 32px rgba(44,62,80,0.2)' }}
        transition="all 0.3s ease"
        mb={{ base: 10, md: 0 }}
      >
        <VStack spacing={6} align="stretch">
          <HStack justify="center" spacing={4} mb={6}>
            <Box 
              w={12} 
              h={12} 
              bgGradient="linear(to-br, blue.500, blue.600)" 
              borderRadius="xl" 
              display="flex" 
              alignItems="center" 
              justifyContent="center"
              boxShadow="lg"
            >
              <Text fontSize="xl" fontWeight="bold" color="white">📋</Text>
            </Box>
            <Heading size="lg" color={cardText}>{t('home.latestInternships')}</Heading>
          </HStack>
          
          {latestInternships && latestInternships.length > 0 ? (
            <VStack spacing={6} align="stretch">
              {latestInternships.slice(0, 4).map((internship) => (
                <Box
                  key={internship.id}
                  bg={cardBg}
                  borderWidth={1}
                  borderColor={cardBorder}
                  borderRadius="xl"
                  p={4}
                  mb={1}
                  cursor="pointer"
                  _hover={{ 
                    bg: 'gray.100', 
                    transform: 'scale(1.02)',
                    boxShadow: 'lg'
                  }}
                  transition="all 0.3s ease"
                  onClick={() => {
                    if (user?.role === 'company') {
                      // Companies should go to view applicants for their internship
                      navigate(`/internship/${internship.id}/applicants`);
                    } else {
                      // Students should go to their application detail for this internship
                      navigate(`/internship/${internship.id}`);
                    }
                  }}
                >
                  <VStack spacing={2.5} align="stretch">
                    <HStack justify="space-between" align="flex-start" mb={1}>
                      <Heading size="md" color="blue.700" noOfLines={1} lineHeight="1.3">
                        {internship.title}
                      </Heading>
                      {internship.company && internship.company.companyName && (
                        <Badge 
                          colorScheme="blue" 
                          variant="subtle" 
                          px={4} 
                          py={2} 
                          borderRadius="full"
                          fontSize="sm"
                          fontWeight="semibold"
                        >
                          {internship.company.companyName}
                        </Badge>
                      )}
                    </HStack>
                    <Text color="gray.600" noOfLines={2} lineHeight="1.5" mb={1}>
                      {internship.description}
                    </Text>
                    <HStack spacing={2} flexWrap="wrap" mb={1}>
                      <Badge variant="outline" colorScheme="gray" px={3} py={1} borderRadius="full">
                        📍 {internship.location}
                      </Badge>
                      <Badge variant="outline" colorScheme="gray" px={3} py={1} borderRadius="full">
                        🕒 {internship.duration}
                      </Badge>
                      <Badge variant="outline" colorScheme="gray" px={3} py={1} borderRadius="full">
                        💻 {internship.isRemote ? 'Remote' : 'On-site'}
                      </Badge>
                    </HStack>
                    <Box borderBottom="1px solid" borderColor="gray.200" my={1} />
                    <HStack justify="space-between" align="center">
                      <Text color="gray.500" fontSize="sm">
                        <Text as="span" fontWeight="semibold">Deadline:</Text> {new Date(internship.applicationDeadline).toLocaleDateString()}
                      </Text>
                      <Box w={2} h={2} bg="blue.500" borderRadius="full" animation="pulse 2s infinite" />
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </VStack>
          ) : (
            <VStack spacing={4} py={12}>
              <Box 
                w={16} 
                h={16} 
                bg="gray.100" 
                borderRadius="full" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
              >
                <Text fontSize="2xl">📭</Text>
              </Box>
              <Text color="gray.500" fontSize="lg">
                No recent internships found.
              </Text>
              <Text color="gray.400" fontSize="sm">
                Start posting opportunities to see them here!
              </Text>
            </VStack>
          )}
          
          <Box textAlign="center" mt={8}>
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
              onClick={(e) => { e.stopPropagation(); navigate('/internships'); }}
            >
              👀 View All Your Internships
            </Button>
          </Box>
        </VStack>
      </Box>
      
      <Box 
        bg={cardBg}
        borderRadius="2xl" 
        p={8} 
        boxShadow="0 4px 24px rgba(44,62,80,0.13)"
        borderLeft="8px solid"
        borderLeftColor="purple.500"
        _hover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 32px rgba(44,62,80,0.2)' }}
        transition="all 0.3s ease"
        mt={{ base: 0, md: 0 }}
      >
        <VStack spacing={6} align="stretch">
          <HStack justify="center" spacing={4} mb={6}>
            <Box 
              w={12} 
              h={12} 
              bgGradient="linear(to-br, purple.500, purple.600)" 
              borderRadius="xl" 
              display="flex" 
              alignItems="center" 
              justifyContent="center"
              boxShadow="lg"
            >
              <Text fontSize="xl" fontWeight="bold" color="white">👨‍🎓</Text>
            </Box>
            <Heading size="lg" color={cardText}>Latest Applications</Heading>
          </HStack>
          
          {latestApplications && latestApplications.length > 0 ? (
            <VStack spacing={6} align="stretch">
              {latestApplications.slice(0, 4).map((app) => (
                <Box
                  key={app.id || app.applicationId}
                  bg={cardBg}
                  borderWidth={1}
                  borderColor={cardBorder}
                  borderRadius="xl"
                  p={4}
                  mb={1}
                  cursor="pointer"
                  _hover={{ 
                    bg: 'gray.100', 
                    transform: 'scale(1.02)',
                    boxShadow: 'lg'
                  }}
                  transition="all 0.3s ease"                  onClick={() => {
                    // Navigate to the specific applicant's detail page
                    const applicationId = app.id || app.applicationId;
                    if (applicationId) {
                      navigate(`/internship/application/${applicationId}`);
                    } else {
                      console.error('No application ID found for application:', app);
                    }
                  }}
                >
                  <VStack spacing={2.5} align="stretch">
                    <HStack justify="space-between" align="flex-start" mb={1}>
                      <Heading size="md" color="purple.700" noOfLines={1} lineHeight="1.3">
                        {app.studentName || app.student?.fullName || 'Unknown Student'}
                      </Heading>
                      <Badge 
                        colorScheme="purple" 
                        variant="subtle" 
                        px={4} 
                        py={2} 
                        borderRadius="full"
                        fontSize="sm"
                        fontWeight="semibold"
                      >
                        {app.status || 'New Applicant'}
                      </Badge>
                    </HStack>
                    <Text color="gray.600" noOfLines={2} lineHeight="1.5" mb={1}>
                      Applied for: <strong>{app.internshipTitle || app.internship?.title || 'Unknown Internship'}</strong>
                    </Text>
                    <Box borderBottom="1px solid" borderColor="gray.200" my={1} />
                    <HStack justify="space-between" align="center">
                      <Text color="gray.500" fontSize="sm">
                        {t('home.appliedOn')} {new Date(app.appliedAt || app.createdAt || Date.now()).toLocaleDateString()}
                      </Text>
                      <Box w={2} h={2} bg="purple.500" borderRadius="full" animation="pulse 2s infinite" />
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </VStack>
          ) : (
            <VStack spacing={4} py={12}>
              <Box 
                w={16} 
                h={16} 
                bg="gray.100" 
                borderRadius="full" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
              >
                <Text fontSize="2xl">📪</Text>
              </Box>
              <Text color="gray.500" fontSize="lg">
                {t('home.noRecentApplications')}
              </Text>
            </VStack>
          )}

          <Box textAlign="center" mt={8}>
            <Button
              colorScheme="purple"
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
              onClick={() => {
                console.log('View All Applications clicked - Current user:', user);
                console.log('View All Applications clicked - User role:', user?.role);
                console.log('View All Applications clicked - Access token:', localStorage.getItem('access_token') ? 'Present' : 'Missing');
                navigate('/internship-status');
              }}
            >
              📊 View All Applications
            </Button>
          </Box>
        </VStack>
      </Box>
    </SimpleGrid>
  );
};

const HomePage = () => {
  const { t } = useTranslation();
  const { user, accessToken, refresh, logout } = useAuth();
  const [latestInternships, setLatestInternships] = useState([]);
  const [latestApplications, setLatestApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey] = useState(0);
  const [isCreateButtonHovered, setIsCreateButtonHovered] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [applicationsPage, setApplicationsPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [internshipsPage, setInternshipsPage] = useState(1);
  const [hasNextInternshipsPage, setHasNextInternshipsPage] = useState(false);

  // Move all useColorModeValue hooks here
  const pageBg = useColorModeValue('gray.50', '#18181b');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardText = useColorModeValue('gray.800', 'white');
  const cardSubText = useColorModeValue('gray.600', 'gray.300');
  const cardBorder = useColorModeValue('gray.200', '#23232b');
  const headingGradient = useColorModeValue('linear(to-r, blue.600, purple.600)', 'linear(to-r, blue.300, purple.400)');
  const quickActionBg = useColorModeValue('white', 'gray.800');
  const quickActionText = useColorModeValue('gray.800', 'white');
  const quickActionSubText = useColorModeValue('gray.600', 'gray.300');
  const quickActionBorder = useColorModeValue('gray.200', 'gray.700');
  const iconCompanyBg = useColorModeValue('white', 'gray.900');
  const iconStudentBg = useColorModeValue('white', 'gray.900');
  const learnBoxBg = useColorModeValue('blue.100', 'blue.900');
  const learnIconColor = useColorModeValue('blue.800', 'blue.100');
  const networkBoxBg = useColorModeValue('purple.100', 'purple.900');
  const networkIconColor = useColorModeValue('purple.800', 'purple.100');
  const careerBoxBg = useColorModeValue('green.100', 'green.900');
  const careerIconColor = useColorModeValue('green.800', 'green.100');

  const fetchLatest = useCallback(async (page = 1, internshipsPageArg = 1) => {
    if (!user || !accessToken) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      let internshipsResponse;
      let applicationsResponse;
      let currentToken = accessToken;      const headers = { Authorization: `Bearer ${currentToken}` };      if (user.role === 'student') {
        // Students don't need to fetch internships on homepage - they can browse on /internships page
        // But they should see their own applications
        console.log('HomePage: Fetching student applications, user role:', user.role);
        console.log('HomePage: Access token exists:', !!accessToken);
        console.log('HomePage: User details:', user);
        
        internshipsResponse = null;
        applicationsResponse = await fetch(`${config.API_URL}/applications?limit=4&page=${page}`, { headers });
        
        if (!applicationsResponse.ok) {
          console.error('HomePage: Failed to fetch applications:', applicationsResponse.status, applicationsResponse.statusText);
          console.error('HomePage: Request headers:', headers);
        }
        
        setLatestInternships([]); // No internships shown on homepage for students
      } else if (user.role === 'company') {
        internshipsResponse = await fetch(`${config.API_URL}/internships?page=${internshipsPageArg}&limit=4`, { headers });
        applicationsResponse = await fetch(`${config.API_URL}/applications?limit=4&page=${page}`, { headers });
      } else {
        throw new Error('Unknown user role');
      }

      if (internshipsResponse) {
        if (internshipsResponse.status === 401) {
          try {
            console.log('Token expired, attempting refresh...');
            const newAccessToken = await refresh();
            console.log('Token refreshed successfully, retrying requests...');
            
            currentToken = newAccessToken;
            
            const retriedHeaders = { Authorization: `Bearer ${currentToken}` };
            internshipsResponse = await fetch(internshipsResponse.url, { headers: retriedHeaders });
            if (applicationsResponse) {
              applicationsResponse = await fetch(applicationsResponse.url, { headers: retriedHeaders });
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            if (latestInternships.length > 0 || latestApplications.length > 0) {
              logout();
              navigate('/login');
              toast({
                title: 'Session expired.',
                description: 'Please log in again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
              });
            } else {
              console.log('HomePage: Initial load failed, not logging out user');
            }
            return;
          }
        }
        if (!internshipsResponse.ok) {
          const errorData = await internshipsResponse.json().catch(() => ({ message: internshipsResponse.statusText }));
          throw new Error(`Failed to fetch internships: ${errorData.message || internshipsResponse.status}`);
        }

        const internshipsData = await internshipsResponse.json();
        console.log('HomePage internships response structure:', internshipsData);
        
        let filteredInternships = [];
        if (internshipsData.items) {
          filteredInternships = internshipsData.items;
        } else if (Array.isArray(internshipsData)) {
          filteredInternships = internshipsData;
        } else {
          console.warn('Unexpected internships response structure:', internshipsData);
          filteredInternships = [];
        }
        
        console.log('Filtered internships for sorting:', filteredInternships);
        
        const sortedInternships = filteredInternships.sort((a, b) => {
          const dateA = a.created_at || a.createdAt;
          const dateB = b.created_at || b.createdAt;
          return new Date(dateB) - new Date(dateA);
        });
        setLatestInternships(sortedInternships);
        setHasNextInternshipsPage(internshipsData.hasNextPage || false);
      }

      if (applicationsResponse) {
        if (!applicationsResponse.ok) {
          console.warn(`Could not fetch latest applications: ${applicationsResponse.statusText}`);
          setLatestApplications([]);
        } else {
          const applicationsData = await applicationsResponse.json();
          setLatestApplications(applicationsData.items || applicationsData || []);
          setHasNextPage(applicationsData.hasNextPage || false);
        }
      }
    } catch (err) {
      console.error("Error fetching latest data:", err);
      toast({
        title: 'Error loading dashboard.',
        description: err.message,
        status: 'error',
        duration: 6000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, accessToken, refresh, toast, latestApplications.length, latestInternships.length, logout, navigate]);

  useEffect(() => {
    if (user && accessToken) {
      fetchLatest(applicationsPage, internshipsPage);
    } else {
      setIsLoading(false);
    }
  }, [fetchLatest, user, accessToken, refreshKey, applicationsPage, internshipsPage]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [applicationsPage, internshipsPage]);

  // Show landing page for non-logged-in users
  if (!user) {
    return <LandingPage />;
  }

  if (isLoading) {
    return (
      <Box py={12} bg={pageBg} minH="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color={cardSubText}>Loading your dashboard...</Text>
        </VStack>
      </Box>
    );
  }

  if (user.role === 'company') {
    return (
      <Box py={12} bg={pageBg} minH="100vh">
        <VStack spacing={16} maxW="6xl" mx="auto">
          <VStack spacing={6} textAlign="center">
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
              <Text fontSize="3xl" color={iconCompanyBg}>🏢</Text>
            </Box>
            <Heading 
              size="2xl" 
              bgGradient={headingGradient}
              bgClip="text"
              fontWeight="extrabold"
            >
              {t('home.welcomeUser', { name: localStorage.getItem('name') ? localStorage.getItem('name') : 'Company' })}
            </Heading>
            <Text fontSize="xl" color={cardSubText} maxW="3xl" lineHeight="relaxed">
              {t('home.companyJourney')}
            </Text>
          </VStack>
          <Demo
            latestInternships={latestInternships}
            latestApplications={latestApplications}
            applicationsPage={applicationsPage}
            setApplicationsPage={setApplicationsPage}
            hasNextPage={hasNextPage}
            internshipsPage={internshipsPage}
            setInternshipsPage={setInternshipsPage}
            hasNextInternshipsPage={hasNextInternshipsPage}
          />
          <Box
            position="fixed"
            bottom="24px"
            right="24px"
            zIndex="1000"
            onMouseEnter={() => setIsCreateButtonHovered(true)}
            onMouseLeave={() => setIsCreateButtonHovered(false)}
          >
            {/* Tooltip/Quick Info that appears on hover */}
            {isCreateButtonHovered && (
              <Box
                position="absolute"
                bottom="80px"
                right="0"
                bg={quickActionBg}
                borderRadius="lg"
                boxShadow="2xl"
                p={4}
                minW="280px"
                border="1px solid"
                borderColor={quickActionBorder}
                transform="translateY(0)"
                opacity="1"
                transition="all 0.3s ease"
              >
                <VStack align="flex-start" spacing={3}>
                  <HStack>
                    <Text fontSize="xl">🚀</Text>
                    <Text fontWeight="bold" color={quickActionText}>
                      Quick Actions
                    </Text>
                  </HStack>
                  <VStack align="flex-start" spacing={2} w="full">
                    <Text fontSize="sm" color={quickActionSubText}>
                      {t('home.createOpportunities')}
                    </Text>
                    <Text fontSize="sm" color={quickActionSubText}>
                      {t('home.attractTalent')}
                    </Text>
                    <Text fontSize="sm" color={quickActionSubText}>
                      {t('home.manageEasily')}
                    </Text>
                  </VStack>
                  <Text fontSize="xs" color={quickActionSubText} fontStyle="italic">
                    {t('home.clickToStart')}
                  </Text>
                </VStack>
              </Box>
            )}
            <Button
              bgGradient="linear(to-r, #667eea, #764ba2)"
              color="white"
              size="lg"
              px={8}
              py={4}
              fontWeight="bold"
              borderRadius="full"
              boxShadow="2xl"
              _hover={{ bgGradient: 'linear(to-r, #5a67d8, #6b46c1)', transform: 'translateY(-2px)' }}
              transition="all 0.3s"
              onClick={() => navigate('/create-internship')}
            >
              ➕ {t('home.createInternship')}
            </Button>
          </Box>
        </VStack>
      </Box>
    );
  }

  if (user.role === 'student') {
    return (
      <Box py={12} bg={pageBg} minH="100vh">
        <VStack spacing={12} maxW="3xl" mx="auto">
          <VStack spacing={6} textAlign="center">
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
              <Text fontSize="3xl" color={iconStudentBg}>🎓</Text>
            </Box>
            <Heading 
              size="2xl" 
              bgGradient="linear(to-r, blue.600, purple.600)" 
              bgClip="text"
              fontWeight="extrabold"
            >
              {t('home.welcomeUser', { name: localStorage.getItem('name') && localStorage.getItem('name') !== 'null' ? localStorage.getItem('name') : 'Student' })}
            </Heading>
            <Text fontSize="xl" color={cardSubText} lineHeight="relaxed">
              {t('home.studentJourney')}
            </Text>
            <Button
              size="lg"
              px={16}
              py={6}
              fontSize="2xl"
              fontWeight="extrabold"
              borderRadius="full"
              bgGradient="linear(to-r, #0ea5e9, #d946ef)"
              color="white"
              boxShadow="2xl"
              leftIcon={<span role='img' aria-label='sparkle'>✨</span>}
              _hover={{
                bgGradient: 'linear(to-r, #d946ef, #0ea5e9)',
                boxShadow: '3xl',
                transform: 'translateY(-3px) scale(1.03)'
              }}
              _active={{
                transform: 'scale(0.98)'
              }}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              onClick={() => navigate('/internships')}
            >
              {t('home.findFursa')}
            </Button>
          </VStack>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
            <Box 
              bg={cardBg} 
              borderRadius="xl" 
              p={6} 
              textAlign="center"
              boxShadow="0 4px 24px rgba(44,62,80,0.13)"
              _hover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 32px rgba(44,62,80,0.2)' }}
              transition="all 0.3s ease"
            >
              <VStack spacing={4}>
                <Box 
                  w={12} 
                  h={12} 
                  bg={learnBoxBg} 
                  borderRadius="full" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                >
                  <Text fontSize="xl" color={learnIconColor}>📚</Text>
                </Box>
                <Heading size="md" color={cardText}>Learn & Grow</Heading>
                <Text fontSize="sm" color={cardSubText}>Gain valuable experience in your field</Text>
              </VStack>
            </Box>
            
            <Box 
              bg={cardBg} 
              borderRadius="xl" 
              p={6} 
              textAlign="center"
              boxShadow="0 4px 24px rgba(44,62,80,0.13)"
              _hover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 32px rgba(44,62,80,0.2)' }}
              transition="all 0.3s ease"
            >
              <VStack spacing={4}>
                <Box 
                  w={12} 
                  h={12} 
                  bg={networkBoxBg} 
                  borderRadius="full" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                >
                  <Text fontSize="xl" color={networkIconColor}>🤝</Text>
                </Box>
                <Heading size="md" color={cardText}>Network</Heading>
                <Text fontSize="sm" color={cardSubText}>Connect with industry professionals</Text>
              </VStack>
            </Box>
            
            <Box 
              bg={cardBg} 
              borderRadius="xl" 
              p={6} 
              textAlign="center"
              boxShadow="0 4px 24px rgba(44,62,80,0.13)"
              _hover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 32px rgba(44,62,80,0.2)' }}
              transition="all 0.3s ease"
            >
              <VStack spacing={4}>
                <Box 
                  w={12} 
                  h={12} 
                  bg={careerBoxBg} 
                  borderRadius="full" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                >
                  <Text fontSize="xl" color={careerIconColor}>💼</Text>
                </Box>
                <Heading size="md" color={cardText}>Career Ready</Heading>
                <Text fontSize="sm" color={cardSubText}>Build your professional portfolio</Text>
              </VStack>
            </Box>
          </SimpleGrid>
        </VStack>
      </Box>
    );
  }

  return (
    <Box py={12} bg={pageBg} minH="100vh">
      <VStack spacing={6} textAlign="center">
        <Box 
          w={16} 
          h={16} 
          bgGradient="linear(to-br, blue.500, purple.600)" 
          borderRadius="full" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
        >
          <Text fontSize="2xl">👋</Text>
        </Box>
        <Heading 
          size="xl" 
          bgGradient="linear(to-r, blue.600, purple.600)" 
          bgClip="text"
        >
          Welcome {localStorage.getItem('name') ? localStorage.getItem('name') : 'User'}!
        </Heading>
        <Text color="gray.600" fontSize="lg">
          Your personalized dashboard will appear here.
        </Text>
      </VStack>
    </Box>
  );
};

export default HomePage;