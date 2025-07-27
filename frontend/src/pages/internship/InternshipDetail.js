import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import config from '../../config';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Heading,
  Spinner,
  SimpleGrid,
  Flex,
  useToast,
  Divider,
  Icon,
  useColorModeValue,
  Badge
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaRegClock, FaBriefcase, FaBuilding, FaInfoCircle } from 'react-icons/fa';

const InternshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user, accessToken } = useAuth();
  const toast = useToast();

  // Color mode values for dark mode support
  const bgGradient = useColorModeValue(
    'linear(to-br, #f8fafc, #e2e8f0)', 
    'linear(to-br, #1a202c, #2d3748)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.600');
  const titleColor = useColorModeValue('gray.800', 'gray.100');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.700', 'gray.200');
  const loadingTextColor = useColorModeValue('gray.600', 'gray.300');
  const errorCardBg = useColorModeValue('white', 'gray.800');

  // Store internship data
  const [internship, setInternship] = useState(state?.internship || null);
  const [loading, setLoading] = useState(!state?.internship);
  const [error, setError] = useState('');  useEffect(() => {
    const fetchInternshipDetails = async () => {
      // Only logged-in users should access this page
      if (!user) {
        setError('You must be logged in to view internship details.');
        setLoading(false);
        return;
      }

      // If we already have internship data from navigation state, use it
      if (state?.internship) {
        setInternship(state.internship);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        // Fetch internship details using the new internships API
        const response = await fetch(`${config.API_URL}/internships/${id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch internship details.');
        }
        
        const internshipData = await response.json();
        setInternship(internshipData);
        setLoading(false);
      } catch (e) {
        toast({
          title: 'Error',
          description: 'Could not load internship details.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        setError('Could not load internship details.');
        setLoading(false);
      }
    };

    if (id && accessToken) {
      fetchInternshipDetails();
    } else if (!accessToken) {
      setLoading(false);
      setError('You must be logged in to view internship details.');
    }
  }, [id, accessToken, toast, user, state]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  if (loading) {
    return (
      <Box minH="100vh" bgGradient={bgGradient} w="100%">
        <Flex justify="center" align="center" minH="80vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <Text fontSize="xl" color={loadingTextColor}>Loading Internship Details...</Text>
          </VStack>
        </Flex>
      </Box>
    );
  }
  if (error) {
    return (
      <Box minH="100vh" bgGradient={bgGradient} w="100%">
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
      </Box>
    );
  }  if (!internship) {
    return (
      <Box minH="100vh" bgGradient={bgGradient} w="100%">
        <Flex justify="center" align="center" minH="80vh">
          <VStack spacing={6} textAlign="center" bg={errorCardBg} p={12} borderRadius="2xl" boxShadow="xl">
            <Text fontSize="3xl">🤷‍♀️</Text>
            <Heading size="lg" color={titleColor}>Internship Not Found</Heading>
            <Text color={textColor} maxW="md">
              The internship you're looking for doesn't exist or may have been removed.
            </Text>
            <Button colorScheme="blue" onClick={() => navigate('/internships')}>
              ← Back to Internships
            </Button>
          </VStack>
        </Flex>
      </Box>
    );
  }
  // Add application info to the header
  return (
    <Box minH="100vh" bgGradient={bgGradient} w="100%">
      <Box maxW="1400px" mx="auto" py={12} px={{ base: 6, md: 8 }}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box 
            bg={cardBg} 
            borderRadius="24px" 
            p={{ base: 6, md: 8 }} 
            boxShadow="xl"
            border="1px solid"
            borderColor={cardBorder}
            position="relative"
            overflow="hidden"
          >
            {/* Decorative gradient overlay */}
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              height="4px"
              bgGradient="linear(90deg, #667eea 0%, #764ba2 100%)"
            />
            
            <VStack spacing={6} align="stretch">
              <HStack justify="space-between" align="flex-start" flexWrap="wrap" gap={4}>
                <VStack align="flex-start" spacing={3} flex={1} minW="300px">
                  <Heading as="h1" size="2xl" color={titleColor} lineHeight="shorter">
                    {internship.title}
                  </Heading>
                  <HStack spacing={6} color={textColor} fontSize="lg" flexWrap="wrap">
                    <HStack>
                      <Icon as={FaBuilding} color="blue.500" />
                      <Text fontWeight="semibold">
                        {internship.company?.companyName || 'Unknown Company'}
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaMapMarkerAlt} color="blue.500" />
                      <Text>{internship.location || 'N/A'}</Text>
                    </HStack>
                  </HStack>
                  
                  {/* Work type badge */}
                  <HStack spacing={3}>
                    <Badge 
                      colorScheme={internship.isRemote ? "green" : "blue"}
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="sm"
                      fontWeight="600"
                    >
                      {internship.isRemote ? "Remote" : "On-site"}
                    </Badge>
                    <Badge 
                      colorScheme="purple"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="sm"
                      fontWeight="600"
                    >
                      {internship.duration}
                    </Badge>
                  </HStack>                </VStack>
                
                {/* Apply Button - Only show for students */}
                {user?.role === 'student' && (
                  <Button
                    size="lg"
                    bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                    color="white"
                    _hover={{
                      bgGradient: "linear(135deg, #5a67d8 0%, #6b46c1 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "lg"
                    }}
                    _active={{
                      transform: "translateY(0)",
                    }}
                    borderRadius="16px"
                    px={8}
                    py={6}
                    transition="all 0.3s ease"
                    onClick={() => navigate(`/apply/${internship.id}`, { state: { internship } })}
                  >
                    Apply Now 🚀
                  </Button>
                )}</HStack>
            </VStack>
          </Box>

          {/* Main Content */}
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
            {/* Left Column (Description) */}
            <VStack spacing={6} align="stretch" gridColumn={{ base: 'auto', lg: 'span 2' }}>
              <Box 
                bg={cardBg} 
                borderRadius="24px" 
                p={{ base: 6, md: 8 }} 
                boxShadow="xl"
                border="1px solid"
                borderColor={cardBorder}
              >
                <VStack spacing={6} align="stretch">
                  <Heading size="lg" color={headingColor}>Job Description</Heading>
                  <Divider borderColor={cardBorder} />
                  <Text 
                    fontSize="md" 
                    color={textColor} 
                    whiteSpace="pre-wrap" 
                    lineHeight="tall"
                  >
                    {internship.description}
                  </Text>
                </VStack>
              </Box>
            </VStack>

            {/* Right Column (Details) */}
            <VStack spacing={6} align="stretch">
              <Box 
                bg={cardBg} 
                borderRadius="24px" 
                p={{ base: 6, md: 8 }} 
                boxShadow="xl"
                border="1px solid"
                borderColor={cardBorder}
              >
                <VStack spacing={6} align="stretch">
                  <Heading size="lg" color={headingColor}>Internship Details</Heading>
                  <Divider borderColor={cardBorder} />                  <VStack spacing={4} align="stretch">
                    <HStack spacing={4} align="flex-start">
                      <Icon as={FaBriefcase} color="blue.500" w={5} h={5} mt={1} />
                      <VStack align="stretch" spacing={1} flex={1}>
                        <Text fontWeight="bold" color={headingColor} fontSize="sm">Type</Text>
                        <Text color={textColor} fontSize="md">
                          {internship.isRemote ? 'Remote' : 'On-site'}
                        </Text>
                      </VStack>
                    </HStack>
                    
                    <HStack spacing={4} align="flex-start">
                      <Icon as={FaRegClock} color="blue.500" w={5} h={5} mt={1} />
                      <VStack align="stretch" spacing={1} flex={1}>
                        <Text fontWeight="bold" color={headingColor} fontSize="sm">Duration</Text>
                        <Text color={textColor} fontSize="md">{internship.duration}</Text>
                      </VStack>
                    </HStack>
                    
                    <HStack spacing={4} align="flex-start">
                      <Icon as={FaInfoCircle} color="blue.500" w={5} h={5} mt={1} />
                      <VStack align="stretch" spacing={1} flex={1}>
                        <Text fontWeight="bold" color={headingColor} fontSize="sm">Application Deadline</Text>
                        <Text color={textColor} fontSize="md">
                          {new Date(internship.applicationDeadline).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>
            </VStack>
          </SimpleGrid>
        </VStack>
      </Box>
    </Box>
  );
};

export default InternshipDetail; 