import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import config from '../../config';
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  Button,
  useToast,
  Text,
  Spinner,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';

const EditInternship = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();
  const toast = useToast();
  
  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const titleColor = useColorModeValue('gray.700', 'white');
  const textColor = useColorModeValue('gray.500', 'gray.300');
  const loadingTextColor = useColorModeValue('gray.600', 'gray.400');
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    isRemote: false,
    duration: "",
    applicationDeadline: "",
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchInternshipData = async () => {
      setIsLoading(true);      try {        // Fetch the internship by ID using the new internships endpoint
        const response = await fetch(`${config.API_URL}/internships/${id}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        if (!response.ok) throw new Error('Failed to fetch internship data.');
        const currentInternship = await response.json();
        setFormData({
          title: currentInternship.title || '',
          description: currentInternship.description || '',
          location: currentInternship.location || '',
          isRemote: currentInternship.isRemote || false,
          duration: currentInternship.duration || '',
          applicationDeadline: currentInternship.applicationDeadline 
            ? new Date(currentInternship.applicationDeadline).toISOString().slice(0, 16) 
            : '',
        });
      } catch (err) {
        toast({
          title: 'Error Loading Internship',
          description: err.message,
          status: 'error',
          duration: 7000,
          isClosable: true,
        });
        navigate('/home');
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchInternshipData();
    }
  }, [id, accessToken, toast, navigate, user.id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;

    if (name === 'title' || name === 'location') {
      processedValue = value.replace(/[0-9]/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      const sanitizedData = { ...formData };
      const response = await fetch(`${config.API_URL}/internships/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(sanitizedData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setErrors({ submit: errorData.message || 'Failed to update internship.' });
      } else {
        toast({
          title: 'Internship Updated',
          description: 'Internship updated successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/home');
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to update internship.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg={bgColor}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text fontSize="lg" color={loadingTextColor}>Loading Internship Editor...</Text>
        </VStack>
      </Flex>
    );
  }
  return (
    <Flex minH="100vh" align="center" justify="center" bg={bgColor}>
      <Box 
        bg={cardBg} 
        p={10} 
        borderRadius="2xl" 
        boxShadow="xl" 
        w="full" 
        maxW="2xl"
      >
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="xl" color={titleColor}>
              Edit Internship
            </Heading>
            <Text mt={2} color={textColor}>
              Update the details for your internship opportunity.
            </Text>
          </Box>
          
          <form onSubmit={handleSubmit}>
            <VStack spacing={5}>
              <FormControl isInvalid={errors.title}>
                <FormLabel htmlFor="title">Title</FormLabel>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} isDisabled={isSubmitting} />
              </FormControl>

              <FormControl isInvalid={errors.description}>
                <FormLabel htmlFor="description">Description</FormLabel>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} isDisabled={isSubmitting} rows={6} />
              </FormControl>

              <FormControl isInvalid={errors.location}>
                <FormLabel htmlFor="location">Location</FormLabel>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} isDisabled={isSubmitting} />
              </FormControl>

              <FormControl>
                <Checkbox id="isRemote" name="isRemote" isChecked={formData.isRemote} onChange={handleChange} isDisabled={isSubmitting}>
                  This is a remote position
                </Checkbox>
              </FormControl>

              <FormControl isInvalid={errors.duration}>
                <FormLabel htmlFor="duration">Duration</FormLabel>
                <Input id="duration" name="duration" value={formData.duration} onChange={handleChange} isDisabled={isSubmitting} />
              </FormControl>

              <FormControl isInvalid={errors.applicationDeadline}>
                <FormLabel htmlFor="applicationDeadline">Application Deadline</FormLabel>
                <Input id="applicationDeadline" name="applicationDeadline" type="datetime-local" value={formData.applicationDeadline} onChange={handleChange} isDisabled={isSubmitting} />
              </FormControl>

              <Flex w="full" gap={4}>
                 <Button 
                    type="button" 
                    variant="outline"
                    colorScheme="gray"
                    size="lg"
                    w="full"
                    onClick={() => navigate(-1)}
                    isDisabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    colorScheme="blue"
                    size="lg"
                    w="full"
                    isLoading={isSubmitting}
                    loadingText="Updating..."
                    bgGradient="linear(to-r, blue.400, teal.400)"
                    color="white"
                    _hover={{
                        bgGradient: 'linear(to-r, blue.500, teal.500)',
                        boxShadow: 'md',
                    }}
                  >
                    Update Internship
                  </Button>
              </Flex>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Flex>
  );
};

export default EditInternship;