import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Text,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';

const CreateInternship = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  // Color mode values
  const bgGradient = useColorModeValue('linear(to-br, #f8fafc, #e2e8f0)', 'linear(to-br, #1a202c, #2d3748)');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const errorBg = useColorModeValue('red.50', 'red.900');
  const errorColor = useColorModeValue('red.600', 'red.200');
  const successBg = useColorModeValue('green.50', 'green.900');
  const successColor = useColorModeValue('green.600', 'green.200');

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    isRemote: false,
    duration: "",
    applicationDeadline: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      const sanitizedData = {
        ...formData,
        applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline).toISOString() : "",
      };
      const response = await fetch(`${config.API_URL}/internships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(sanitizedData),
      });
      const responseData = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(responseData.message || responseData.error || 'Failed to create internship');
      } else {
        setSuccess('Internship created successfully!');
        setFormData({
          title: "",
          description: "",
          location: "",
          isRemote: false,
          duration: "",
          applicationDeadline: "",
        });
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 1000);
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };  return (
    <Flex align="center" justify="center" minH="100vh" bgGradient={bgGradient}>
      <Box bg={cardBg} p={8} rounded="2xl" shadow="xl" w="100%" maxW="420px" border="1px solid" borderColor={cardBorder}>
        <Heading
          mb={2}
          size="lg"
          bgGradient="linear(to-r, #667eea, #764ba2)"
          bgClip="text"
          fontWeight="extrabold"
          textAlign="center"
        >
          Create New Internship        </Heading>
        <Text mb={6} color={textColor} textAlign="center">Post a new internship opportunity for students</Text>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input name="title" value={formData.title} onChange={handleChange} focusBorderColor="#0ea5e9" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea name="description" value={formData.description} onChange={handleChange} rows={4} focusBorderColor="#0ea5e9" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Location</FormLabel>
              <Input name="location" value={formData.location} onChange={handleChange} focusBorderColor="#0ea5e9" />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <Checkbox name="isRemote" isChecked={formData.isRemote} onChange={handleChange} colorScheme="teal" mr={2} />
              <FormLabel mb={0}>Remote?</FormLabel>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Duration</FormLabel>
              <Input name="duration" value={formData.duration} onChange={handleChange} focusBorderColor="#0ea5e9" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Application Deadline</FormLabel>
              <Input type="datetime-local" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} focusBorderColor="#0ea5e9" />
            </FormControl>            {error && <Text color={errorColor} bg={errorBg} borderRadius={4} p={2} fontSize="sm">{error}</Text>}
            {success && <Text color={successColor} bg={successBg} borderRadius={4} p={2} fontSize="sm">{success}</Text>}<Button
              type="submit"
              size="lg"
              w="full"
              isLoading={isLoading}
              loadingText="Creating..."
              fontWeight="bold"
              borderRadius="lg"
              mt={2}
              bgGradient="linear(to-r, #667eea, #764ba2)"
              _hover={{ bgGradient: 'linear(to-r, #5a67d8, #6b46c1)' }}
              color="white"
            >
              Create Internship
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default CreateInternship;