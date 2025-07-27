import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import config from '../../config';
import InternshipStatusBadge from '../../components/InternshipStatusBadge';
import InternshipFilter from '../../components/InternshipFilter';
import { Box, Text, Heading, Select, HStack, useColorModeValue } from '@chakra-ui/react';

const buttonStyle = {
  padding: '12px 20px',
  borderRadius: '10px',
  border: 'none',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  textDecoration: 'none',
  outline: 'none',
};

const AllInternshipsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, accessToken, refresh } = useAuth();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterRemote, setFilterRemote] = useState('all');
  const [appliedInternships, setAppliedInternships] = useState(new Set());

  // Color mode values for dark mode support
  const cardBg = useColorModeValue('#ffffff', '#2d3748');
  const cardBorder = useColorModeValue('#e2e8f0', '#4a5568');
  const cardShadow = useColorModeValue('0 4px 16px rgba(0, 0, 0, 0.05)', '0 4px 16px rgba(0, 0, 0, 0.3)');
  const textColor = useColorModeValue('#1a202c', '#f7fafc');
  const secondaryTextColor = useColorModeValue('#718096', '#cbd5e0');
  
  // Additional color values for form inputs and buttons
  const inputBg = useColorModeValue('white', '#2d3748');
  const inputTextColor = useColorModeValue('#2d3748', '#f7fafc');
  const inputBorder = useColorModeValue('#c7d2fe', '#4a5568');
  const inputBorderFocus = '#6366f1';
  
  // Button colors for callbacks
  const viewButtonBg = useColorModeValue('#f8fafc', '#4a5568');
  const viewButtonColor = useColorModeValue('#475569', '#e2e8f0');
  const viewButtonBorder = useColorModeValue('#e2e8f0', '#718096');
  const viewButtonHoverBg = useColorModeValue('#f1f5f9', '#5a6779');
  const viewButtonHoverBorder = useColorModeValue('#cbd5e1', '#8a96a6');
    // Pagination button colors
  const prevButtonBg = useColorModeValue('#f1f5f9', '#4a5568');
  const prevButtonColor = useColorModeValue('#94a3b8', '#a0aec0');
  const nextButtonBg = useColorModeValue('#3b82f6', '#5a67d8');
  const nextButtonHoverBg = useColorModeValue('#2563eb', '#4c51bf');
  
  // Additional color values for all UI elements
  const searchFilterBg = useColorModeValue('linear-gradient(135deg, #f0f9ff 0%, #fdf4ff 100%)', 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)');
  const searchFilterShadow = useColorModeValue('0 12px 32px rgba(44, 62, 80, 0.10)', '0 12px 32px rgba(0, 0, 0, 0.25)');
  const searchFilterBorder = useColorModeValue('1.5px solid #e0e7ff', '1.5px solid #4a5568');
  const labelColor = useColorModeValue('#3730a3', '#c3dafe');
  const inputShadow = useColorModeValue('0 2px 8px rgba(102, 126, 234, 0.07)', '0 2px 8px rgba(0, 0, 0, 0.15)');
  const resultsCountBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(45, 55, 72, 0.9)');
  
  // Badge colors
  const badgeBg = useColorModeValue('#f1f5f9', '#4a5568');
  const badgeColor = useColorModeValue('#64748b', '#cbd5e0');
  const badgeBorder = useColorModeValue('1px solid #e2e8f0', '1px solid #718096');
  
  // Deadline warning colors
  const deadlineBg = useColorModeValue('#fef2f2', '#4a1a1a');
  const deadlineBorder = useColorModeValue('1px solid #fecaca', '1px solid #742a2a');
  const deadlineColor = useColorModeValue('#dc2626', '#fca5a5');
  
  // Empty state colors
  const emptyStateBg = useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(45, 55, 72, 0.95)');
  const emptyStateBorder = useColorModeValue('1px solid rgba(255, 255, 255, 0.2)', '1px solid rgba(74, 85, 104, 0.3)');
  const emptyStateShadow = useColorModeValue('0 20px 40px rgba(0, 0, 0, 0.1)', '0 20px 40px rgba(0, 0, 0, 0.3)');
  const emptyStateGradient = useColorModeValue('linear-gradient(135deg, #2d3748 0%, #4a5568 100%)', 'linear-gradient(135deg, #f7fafc 0%, #e2e8f0 100%)');
  const emptyStateTextColor = useColorModeValue('#4a5568', '#cbd5e0');
  
  // Pagination colors
  const paginationBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(45, 55, 72, 0.9)');
  const paginationShadow = useColorModeValue('0 4px 16px rgba(0, 0, 0, 0.05)', '0 4px 16px rgba(0, 0, 0, 0.25)');
  const paginationCountBg = useColorModeValue('#f8fafc', '#4a5568');
  const paginationCountBorder = useColorModeValue('1px solid #e2e8f0', '1px solid #718096');  const paginationCountColor = useColorModeValue('#475569', '#e2e8f0');
  
  // Company logo background color
  const companyLogoBg = useColorModeValue('#f8fafc', '#2d3748');
  
  // New state variables for status filtering, pagination, and sorting
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt:desc'); // Default to newest first
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [filterCounts, setFilterCounts] = useState({});

  const ITEMS_PER_PAGE = 10;  // Fetch internships with current filters, pagination, and sorting
  const fetchInternships = useCallback(async (status = 'all', page = 1, sort = 'createdAt:desc') => {
    if (!accessToken) {
      setError("You must be logged in to view internships.");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        sort: sort,
      });
      
      // Only add status parameter if it's not 'all'
      if (status !== 'all') {
        params.append('status', status);
      }
      
      console.log('Fetching internships with params:', params.toString());
      console.log('Current status filter:', status);
      console.log('Current sort:', sort);
      
      // Use the new role-aware /internships endpoint
      // This endpoint automatically returns:
      // - For students: All public internships from all companies
      // - For companies: Only their own internships
      const apiUrl = `${config.API_URL}/internships?${params}`;
      
      console.log('API URL for role', user?.role, ':', apiUrl);
      
      const internshipsResponse = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
        if (!internshipsResponse.ok) {
        if (internshipsResponse.status === 401) {
          // Try to refresh the token
          try {
            console.log('Attempting to refresh token...');
            const newTokens = await refresh();
            const newAccessToken = newTokens?.accessToken || accessToken;
            console.log('Token refreshed successfully, retrying request...');
            // If refresh succeeds, retry the request
            const retryResponse = await fetch(apiUrl, {
              headers: {
                'Authorization': `Bearer ${newAccessToken}`,
              },
            });
            if (!retryResponse.ok) {
              throw new Error('Your session has expired. Please log in again.');
            }
            const retryData = await retryResponse.json();
            
            // Handle paginated vs non-paginated response
            if (retryData.items) {
              // Paginated response
              setInternships(retryData.items);
              setTotalItems(retryData.total);
              setTotalPages(Math.ceil(retryData.total / ITEMS_PER_PAGE));
              setHasNextPage(retryData.hasNextPage);
            } else {
              // Non-paginated response (fallback)
              setInternships(retryData);
              setTotalItems(retryData.length);
              setTotalPages(1);
              setHasNextPage(false);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            throw new Error('Your session has expired. Please log in again.');
          }
        } else {
          throw new Error('Failed to fetch internships. Please try again later.');        }
      } else {
        const internshipsData = await internshipsResponse.json();
        console.log('Internships response structure:', internshipsData);        // Handle paginated vs non-paginated response
        if (internshipsData.items) {
          // Paginated response
          setInternships(internshipsData.items);
          setTotalItems(internshipsData.total);
          setTotalPages(Math.ceil(internshipsData.total / ITEMS_PER_PAGE));
          setHasNextPage(internshipsData.hasNextPage);
        } else {
          // Non-paginated response (fallback)
          setInternships(internshipsData);
          setTotalItems(internshipsData.length);
          setTotalPages(1);
          setHasNextPage(false);
        }
      }      // Fetch student applications if user is a student
      if (user && user.role === 'student') {
        console.log('AllInternshipsPage: Fetching student applications from:', `${config.API_URL}/applications`);
        console.log('AllInternshipsPage: User role:', user.role);
        console.log('AllInternshipsPage: Access token exists:', !!accessToken);
        
        const applicationsResponse = await fetch(`${config.API_URL}/applications`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        
        console.log('AllInternshipsPage: Applications response status:', applicationsResponse.status);
        
        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json();
          console.log('Applications data structure:', applicationsData);
          // Handle paginated response - use items array
          const applications = applicationsData.items || applicationsData || [];
          const appliedIds = new Set(applications.map(app => app.internshipId));
          setAppliedInternships(appliedIds);
        } else if (applicationsResponse.status === 403) {
          // User is not a student, which is expected
          console.log('User is not a student, skipping applications fetch');
        } else {
          console.error('Failed to fetch student applications');
        }
      }

    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [accessToken, refresh, user, ITEMS_PER_PAGE]);
  // Fetch filter counts
  const fetchFilterCounts = useCallback(async () => {
    if (!accessToken || !user) return;
    
    try {
      // Use the new role-aware /internships endpoint for all users
      const baseUrl = `${config.API_URL}/internships`;

      const [allRes, openRes, closedRes] = await Promise.all([
        fetch(`${baseUrl}?limit=1`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }),
        fetch(`${baseUrl}?status=open&limit=1`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }),
        fetch(`${baseUrl}?status=closed&limit=1`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }),
      ]);

      if (allRes.ok && openRes.ok && closedRes.ok) {
        const [allData, openData, closedData] = await Promise.all([
          allRes.json(),
          openRes.json(),
          closedRes.json(),
        ]);

        setFilterCounts({
          all: allData.total || allData.length || 0,
          open: openData.total || openData.length || 0,
          closed: closedData.total || closedData.length || 0,
        });
          console.log('Filter counts updated:', {
          all: allData.total || allData.length || 0,
          open: openData.total || openData.length || 0,
          closed: closedData.total || closedData.length || 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch filter counts:', error);
    }
  }, [accessToken, user]);  // Handle filter change
  const handleStatusChange = (newStatus) => {
    console.log(`Status filter changed from '${statusFilter}' to '${newStatus}'`);
    setStatusFilter(newStatus);
    setCurrentPage(1); // Reset to first page
  };

  // Handle sorting change
  const handleSortChange = (newSort) => {
    console.log(`Sort changed from '${sortBy}' to '${newSort}'`);
    setSortBy(newSort);
    setCurrentPage(1); // Reset to first page
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchInternships(statusFilter, currentPage, sortBy);
  }, [fetchInternships, statusFilter, currentPage, sortBy]);

  useEffect(() => {
    fetchFilterCounts();
  }, [fetchFilterCounts]);
  // Client-side filtering (for search and location only - status is server-side)
  const filteredInternships = internships.filter(internship => {
    const companyName = internship.company?.companyName || '';
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !filterLocation || 
                           internship.location.toLowerCase().includes(filterLocation.toLowerCase());
    
    const matchesRemote = filterRemote === 'all' || 
                         (filterRemote === 'remote' && internship.isRemote) ||
                         (filterRemote === 'onsite' && !internship.isRemote);
    
    return matchesSearch && matchesLocation && matchesRemote;
  });  const handleViewDetails = async (internship) => {
    if (user && user.role === 'company') {
      // For companies, show applicants
      navigate(`/internship/${internship.id}/applicants`);
    } else {
      // For students, fetch internship details using the new internships API and show details
      try {
        const response = await fetch(`${config.API_URL}/internships/${internship.id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch internship details');
        }
        
        const internshipData = await response.json();
        navigate(`/internship/${internship.id}`, { state: { internship: internshipData } });
      } catch (error) {
        console.error('Error fetching internship details:', error);
        // Fallback to using the existing internship data
        navigate(`/internship/${internship.id}`, { state: { internship } });
      }
    }
  };

  const handleDelete = async (internshipId, internshipTitle) => {
    if (!user || user.role !== 'company') {
      alert('Only company users can delete internships.');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${internshipTitle}"? This action cannot be undone.`
    );    if (!confirmDelete) {
      return;
    }    try {
      const response = await fetch(`${config.API_URL}/internships/${internshipId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });if (response.ok) {
        // Remove the deleted internship from the list
        setInternships(prevInternships => 
          prevInternships.filter(internship => internship.id !== internshipId)
        );
        // Update total count
        const newTotal = Math.max(0, totalItems - 1);
        setTotalItems(newTotal);
        setTotalPages(Math.ceil(newTotal / ITEMS_PER_PAGE));
        
        // If current page is now empty and not the first page, go to previous page
        const remainingItemsOnPage = internships.length - 1;
        if (remainingItemsOnPage === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        
        // Refresh filter counts
        await fetchFilterCounts();
        
        alert('Internship deleted successfully!');
      }else if (response.status === 401) {
        alert('Authentication failed. Please log in again.');
        navigate('/login');
      } else if (response.status === 403) {
        alert('Only company users can delete internships.');
      } else {
        alert('Failed to delete internship. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting internship:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };
  // Function to create dynamic card styles based on color mode
  const getCardStyle = () => ({
    background: cardBg,
    borderRadius: '16px',
    padding: '24px',
    boxShadow: cardShadow,
    border: `1px solid ${cardBorder}`,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',  });

  // Dynamic styles for card elements
  const getCompanyLogoStyle = () => ({
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '48px',
    height: '48px',
    background: companyLogoBg,
    border: `2px solid ${cardBorder}`,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: secondaryTextColor,
    fontSize: '18px',
    fontWeight: '600',
  });

  const getTitleStyle = () => ({
    fontSize: '1.5rem',
    fontWeight: '700',
    color: textColor,
    marginBottom: '8px',
    lineHeight: '1.3'
  });

  const getCompanyNameStyle = () => ({
    color: secondaryTextColor,
    fontWeight: '500',
    fontSize: '16px',
    margin: '0'
  });
  const getDescriptionStyle = () => ({
    color: secondaryTextColor,
    lineHeight: '1.7',
    marginBottom: '24px',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    fontSize: '15px'
  });
  const bgGradient = useColorModeValue('linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)');
  const loadingBg = useColorModeValue('linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)');
  const loadingText = useColorModeValue('white', 'gray.100');
  const heroBg = useColorModeValue('rgba(255,255,255,0.95)', 'rgba(26,32,44,0.95)');
  const heroSubText = useColorModeValue('gray.600', 'gray.300');

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="60vh" bgGradient={loadingBg} color={loadingText} fontSize="xl" fontWeight="semibold">
        <Box textAlign="center">
          <Box fontSize="5xl" mb={4}>⏳</Box>
          <Box>Loading internship opportunities...</Box>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="60vh" bgGradient={loadingBg} color={loadingText} fontSize="lg">
        <Box textAlign="center">
          <Box fontSize="5xl" mb={4}>⚠️</Box>
          <Box>{error}</Box>
        </Box>
      </Box>
    );
  }
  return (
    <Box minH="100vh" bgGradient={bgGradient} pt={5}>
      <Box maxW="7xl" mx="auto" px={6} py={8}>
        {/* Dynamic Header based on user role */}
        {user?.role === 'student' ? (
          <Box textAlign="center" mb={12} p={10} bg={heroBg} borderRadius="2xl" boxShadow="2xl" backdropFilter="blur(10px)">
            <Heading fontSize="3.5rem" fontWeight="extrabold" bgGradient="linear(to-r, #667eea, #764ba2)" bgClip="text" mb={5} letterSpacing="-0.02em">
              {t('internships.title')}
            </Heading>
            <Text fontSize="1.3rem" color={heroSubText} maxW="700px" mx="auto" lineHeight="1.6" fontWeight="500">
              {t('internships.subtitle')}
            </Text>
          </Box>
        ) : (
          <Box textAlign="center" mb={12} p={10} bg={heroBg} borderRadius="2xl" boxShadow="2xl" backdropFilter="blur(10px)">
            <Heading fontSize="3.5rem" fontWeight="extrabold" bgGradient="linear(to-r, #667eea, #764ba2)" bgClip="text" mb={5} letterSpacing="-0.02em">
              {t('internships.companyTitle')}
            </Heading>
            <Text fontSize="1.3rem" color={heroSubText} maxW="700px" mx="auto" lineHeight="1.6" fontWeight="500">
              {t('internships.companySubtitle')}
            </Text>
          </Box>
        )}      {/* Search and Filters */}
      <div
        style={{
          background: searchFilterBg,
          padding: '36px 32px',
          borderRadius: '24px',
          boxShadow: searchFilterShadow,
          marginBottom: '48px',
          border: searchFilterBorder,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '32px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ minWidth: 260, flex: 1 }}>
          <label
            style={{
              display: 'block',
              marginBottom: '10px',
              fontWeight: 700,
              color: '#3730a3',
              fontSize: '1.1rem',
              letterSpacing: '0.01em',
            }}
          >
            <span role="img" aria-label="search">🔍</span> {t('common.search')}
          </label>
          <div style={{ position: 'relative' }}>            <input
              type="text"
              placeholder={t('internships.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}              style={{
                width: '100%',
                padding: '16px 48px 16px 20px',
                borderRadius: '14px',
                border: `2px solid ${inputBorder}`,
                fontSize: '1rem',
                background: inputBg,                color: inputTextColor,
                transition: 'all 0.3s',
                boxShadow: inputShadow,
                outline: 'none',
              }}
              onFocus={e => (e.target.style.borderColor = inputBorderFocus)}
              onBlur={e => (e.target.style.borderColor = inputBorder)}
            />
            <span
              style={{
                position: 'absolute',
                right: 18,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6366f1',
                fontSize: '1.3rem',
                pointerEvents: 'none',
              }}
            >🔎</span>
          </div>
        </div>

        <div style={{ minWidth: 220, flex: 1 }}>          <label
            style={{
              display: 'block',
              marginBottom: '10px',
              fontWeight: 700,
              color: labelColor,
              fontSize: '1.1rem',
              letterSpacing: '0.01em',
            }}
          >
            <span role="img" aria-label="location">📍</span> {t('internships.location')}
          </label>
          <input
            type="text"
            placeholder={t('internships.location.placeholder')}
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}            style={{
              width: '100%',
              padding: '16px 20px',
              borderRadius: '14px',
              border: `2px solid ${inputBorder}`,
              fontSize: '1rem',
              background: inputBg,              color: inputTextColor,
              transition: 'all 0.3s',
              boxShadow: inputShadow,
              outline: 'none',
            }}
            onFocus={e => (e.target.style.borderColor = inputBorderFocus)}
            onBlur={e => (e.target.style.borderColor = inputBorder)}
          />
        </div>

        <div style={{ minWidth: 200, flex: 1 }}>
          <label
            style={{
              display: 'block',
              marginBottom: '10px',
              fontWeight: 700,
              color: '#3730a3',
              fontSize: '1.1rem',
              letterSpacing: '0.01em',
            }}
          >
            <span role="img" aria-label="work type">💼</span> {t('internships.workType')}
          </label>
          <div style={{ position: 'relative' }}>            <select
              value={filterRemote}
              onChange={(e) => setFilterRemote(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 40px 16px 20px',                borderRadius: '14px',
                border: `2px solid ${inputBorder}`,
                fontSize: '1rem',
                background: inputBg,
                color: inputTextColor,                transition: 'all 0.3s',
                boxShadow: inputShadow,
                cursor: 'pointer',
                appearance: 'none',
                outline: 'none',
              }}
              onFocus={e => (e.target.style.borderColor = inputBorderFocus)}
              onBlur={e => (e.target.style.borderColor = inputBorder)}
            >
              <option value="all">{t('internships.allTypes')}</option>
              <option value="remote">{t('internships.remoteOnly')}</option>
              <option value="onsite">{t('internships.onsiteOnly')}</option>
            </select>
            <span
              style={{
                position: 'absolute',
                right: 18,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6366f1',
                fontSize: '1.2rem',
                pointerEvents: 'none',
              }}
            >▼</span>
          </div>
        </div>

        <div style={{ minWidth: 220, flex: 1 }}>
          <label
            style={{
              display: 'block',
              marginBottom: '10px',
              fontWeight: 700,
              color: labelColor,
              fontSize: '1.1rem',
              letterSpacing: '0.01em',
            }}
          >
            <span role="img" aria-label="sort">🔄</span> {t('internships.sortBy')}
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 40px 16px 20px',
                borderRadius: '14px',
                border: `2px solid ${inputBorder}`,
                fontSize: '1rem',
                background: inputBg,
                color: inputTextColor,
                transition: 'all 0.3s',
                boxShadow: inputShadow,
                cursor: 'pointer',
                appearance: 'none',
                outline: 'none',
              }}
              onFocus={e => (e.target.style.borderColor = inputBorderFocus)}
              onBlur={e => (e.target.style.borderColor = inputBorder)}
            >
              <option value="createdAt:desc">{t('internships.newestFirst')}</option>
              <option value="createdAt:asc">{t('internships.oldestFirst')}</option>
              <option value="title:asc">{t('internships.titleAZ')}</option>
              <option value="title:desc">{t('internships.titleZA')}</option>
              <option value="applicationDeadline:asc">{t('internships.deadlineSoon')}</option>
              <option value="applicationDeadline:desc">{t('internships.deadlineLatest')}</option>
              {user?.role === 'student' && (
                <>
                  <option value="companyName:asc">{t('internships.companyAZ')}</option>
                  <option value="companyName:desc">{t('internships.companyZA')}</option>
                </>
              )}
            </select>
            <span
              style={{
                position: 'absolute',
                right: 18,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6366f1',
                fontSize: '1.2rem',
                pointerEvents: 'none',
              }}
            >▼</span>
          </div>
        </div>      </div>

      {/* Status Filter */}
      <InternshipFilter
        currentStatus={statusFilter}
        onStatusChange={handleStatusChange}
        counts={filterCounts}
      />      {/* Results Count */}
      <div style={{ 
        marginBottom: '32px',
        background: resultsCountBg,
        padding: '20px 24px',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
      }}>        <Text 
          color={textColor}
          fontSize="18px"
          fontWeight="600"
          margin="0"
          display="flex"
          alignItems="center"
          gap="8px"
        >
          <span style={{ fontSize: '24px' }}>📊</span>
          {t('internships.found', { count: totalItems })}
          {statusFilter !== 'all' && ` (${statusFilter === 'open' ? t('internships.open') : t('internships.closed')} Applications)`}
          {currentPage > 1 && ` - ${t('internships.page')} ${currentPage} of ${totalPages}`}
        </Text>
      </div>

      {/* Internships Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', 
        gap: '32px',
        padding: '0 8px'
      }}>
        {filteredInternships.map((internship, index) => {
          console.log('=== INTERNSHIP DEBUG ===');
          console.log('Internship object:', internship);
          console.log('Internship ID field:', internship.id);
          console.log('Internship _id field:', internship._id);
          console.log('Internship internshipId field:', internship.internshipId);
          console.log('All internship keys:', Object.keys(internship));
          console.log('========================');
          
          // Try to find a real ID first, then fall back to creating one
          let internshipId = internship.id || internship._id || internship.internshipId;
          
          if (!internshipId) {
            // Create a more meaningful identifier
            const titleWords = internship.title?.toLowerCase().split(' ').slice(0, 2) || ['internship'];
            const location = internship.location?.toLowerCase().split(' ')[0] || 'remote';
            const company = internship.company?.companyName?.toLowerCase().split(' ')[0] || 'company';
            
            // Create a shorter, more meaningful ID
            internshipId = `${titleWords.join('-')}-${location}-${company}-${index + 1}`;
            console.log('Created meaningful ID:', internshipId);
            console.warn('⚠️ BACKEND ISSUE: No real ID provided. Using temporary ID:', internshipId);
            console.warn('🔧 Backend should return real database IDs for internships');
          } else {
            console.log('Using existing ID:', internshipId);
          }
          
          // Create a more structured identifier for the backend
          const internshipData = {
            id: internshipId,
            identifier: internshipId,
            title: internship.title,
            description: internship.description,
            location: internship.location,
            company: internship.company,
            isRemote: internship.isRemote,
            duration: internship.duration,
            applicationDeadline: internship.applicationDeadline,
            index: index,
            // Include any other fields that might be useful
            ...internship
          };
          
          return (            <div 
              key={internshipId} 
            style={{
              ...getCardStyle(),
              background: cardBg,
              position: 'relative'
            }}onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = cardShadow.includes('0.05') 
                ? '0 8px 24px rgba(0, 0, 0, 0.1)' 
                : '0 8px 24px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = cardShadow;
            }}
          >            {/* Company Logo Placeholder */}
            <div style={getCompanyLogoStyle()}>
              {internship.company?.companyName?.charAt(0) || 'C'}
            </div>

            {/* Status Badge */}
            <div style={{
              position: 'absolute',
              top: '80px',
              right: '20px',
            }}>              <InternshipStatusBadge
                isOpen={internship.isOpen !== undefined ? internship.isOpen : true}
                applicationDeadline={internship.applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
              />
            </div>            <div style={{ marginBottom: '20px', paddingRight: '70px' }}>              <h3 style={getTitleStyle()}>
                {internship.title}
              </h3>
              {/* Only show company name for students, not for companies viewing their own internships */}
              {user?.role === 'student' && (
                <p style={getCompanyNameStyle()}>
                  🏢 {internship.companyName || internship.company?.companyName || 'Unknown Company'}
                </p>
              )}
            </div>            <p style={getDescriptionStyle()}>
              {internship.description}
            </p>

            <div style={{ marginBottom: '24px' }}>            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>                <span style={{ 
                  background: badgeBg, 
                  color: badgeColor, 
                  padding: '6px 12px', 
                  borderRadius: '16px',
                  fontSize: '13px',
                  fontWeight: '500',
                  border: badgeBorder
                }}>
                  📍 {internship.location}
                </span>                <span style={{ 
                  background: badgeBg, 
                  color: badgeColor, 
                  padding: '6px 12px', 
                  borderRadius: '16px',
                  fontSize: '13px',
                  fontWeight: '500',
                  border: badgeBorder
                }}>
                  🕒 {internship.duration}                </span>
                <span style={{ 
                  background: badgeBg, 
                  color: badgeColor, 
                  padding: '6px 12px', 
                  borderRadius: '16px',
                  fontSize: '13px',
                  fontWeight: '500',
                  border: badgeBorder
                }}>
                  💻 {internship.isRemote ? 'Remote' : 'On-site'}
                </span>
              </div>              <div style={{
                background: deadlineBg,
                padding: '10px 14px',
                borderRadius: '10px',
                border: deadlineBorder
              }}>
                <p style={{ 
                  color: deadlineColor, 
                  fontSize: '13px', 
                  fontWeight: '500',
                  margin: '0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>⏰</span>
                  Deadline: {new Date(internship.applicationDeadline).toLocaleDateString()}
                </p>
              </div>
            </div>            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={(e) => { e.stopPropagation(); handleViewDetails(internship); }}                style={{
                  ...buttonStyle,
                  background: viewButtonBg,
                  color: viewButtonColor,
                  border: `1px solid ${viewButtonBorder}`,
                  flex: 1,
                  minWidth: '120px'
                }}onMouseEnter={(e) => {
                  e.target.style.background = viewButtonHoverBg;
                  e.target.style.borderColor = viewButtonHoverBorder;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = viewButtonBg;
                  e.target.style.borderColor = viewButtonBorder;
                }}
              >
                {user && user.role === 'company' ? (
                  <>
                    <span>👥</span>
                    {t('internships.viewApplicants')}
                  </>
                ) : (
                  <>
                    <span>👁️</span>
                    {t('internships.viewDetails')}
                  </>
                )}
              </button>

              {user && user.role === 'student' && (
                <button
                  onClick={() => {
                    // Check if internship is still open before allowing application
                    const deadline = internship.applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                    const isDeadlinePassed = new Date(deadline) < new Date();
                    const internshipIsOpen = internship.isOpen !== undefined ? internship.isOpen : true;
                    const canApply = internshipIsOpen && !isDeadlinePassed && !appliedInternships.has(internshipId);
                    
                    if (!canApply) {
                      if (!internshipIsOpen) {
                        alert('Applications for this internship are closed.');
                      } else if (isDeadlinePassed) {
                        alert('The application deadline has passed.');
                      } else if (appliedInternships.has(internshipId)) {
                        alert('You have already applied to this internship.');
                      }
                      return;
                    }
                    
                    console.log('Navigating to apply with internship identifier:', internshipId);
                    navigate(`/internships/apply/${internshipId}`, { 
                      state: { internship: internshipData } 
                    });
                  }}
                  disabled={(() => {
                    const deadline = internship.applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                    const isDeadlinePassed = new Date(deadline) < new Date();
                    const internshipIsOpen = internship.isOpen !== undefined ? internship.isOpen : true;
                    const isDisabled = !internshipIsOpen || isDeadlinePassed;
                    return isDisabled ? true : appliedInternships.has(internshipId);
                  })()}                  style={{
                    ...buttonStyle,                    background: (() => {
                      if (appliedInternships.has(internshipId)) {
                        return 'linear-gradient(135deg, #10b981 0%, #059669 100%)'; // Green gradient for applied
                      }
                      const deadline = internship.applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                      const isDeadlinePassed = new Date(deadline) < new Date();
                      const internshipIsOpen = internship.isOpen !== undefined ? internship.isOpen : true;
                      const isDisabled = !internshipIsOpen || isDeadlinePassed;
                      return isDisabled ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'; // Website theme gradient
                    })(),
                    color: 'white',
                    flex: 1,
                    minWidth: '120px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
                    border: 'none',
                    cursor: (() => {
                      const deadline = internship.applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                      const isDeadlinePassed = new Date(deadline) < new Date();
                      const internshipIsOpen = internship.isOpen !== undefined ? internship.isOpen : true;
                      const isDisabled = !internshipIsOpen || isDeadlinePassed || appliedInternships.has(internshipId);
                      return isDisabled ? 'not-allowed' : 'pointer';
                    })(),
                    opacity: (() => {
                      const deadline = internship.applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                      const isDeadlinePassed = new Date(deadline) < new Date();
                      const internshipIsOpen = internship.isOpen !== undefined ? internship.isOpen : true;
                      const isDisabled = !internshipIsOpen || isDeadlinePassed || appliedInternships.has(internshipId);
                      return isDisabled ? 0.6 : 1;
                    })(),
                    transform: 'translateY(0px)',
                    transition: 'all 0.2s ease'
                  }}                  onMouseEnter={(e) => {
                    const deadline = internship.applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                    const isDeadlinePassed = new Date(deadline) < new Date();
                    const internshipIsOpen = internship.isOpen !== undefined ? internship.isOpen : true;
                    const isDisabled = !internshipIsOpen || isDeadlinePassed || appliedInternships.has(internshipId);
                    if (!isDisabled) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.3)';
                      if (appliedInternships.has(internshipId)) {
                        e.target.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                      } else {
                        e.target.style.background = 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)';
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.05)';
                    if (appliedInternships.has(internshipId)) {
                      e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                    } else {
                      const deadline = internship.applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                      const isDeadlinePassed = new Date(deadline) < new Date();
                      const internshipIsOpen = internship.isOpen !== undefined ? internship.isOpen : true;
                      const isDisabled = !internshipIsOpen || isDeadlinePassed;
                      e.target.style.background = isDisabled ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    }
                  }}
                >
                  {(() => {
                    if (appliedInternships.has(internshipId)) {
                      return (
                        <>
                          <span>✅</span>
                          {t('internships.applied')}
                        </>
                      );
                    }
                    const deadline = internship.applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                    const isDeadlinePassed = new Date(deadline) < new Date();
                    const internshipIsOpen = internship.isOpen !== undefined ? internship.isOpen : true;
                    
                    if (!internshipIsOpen) {
                      return (
                        <>
                          <span>🔒</span>
                          {t('internships.closed')}
                        </>
                      );
                    } else if (isDeadlinePassed) {
                      return (
                        <>
                          <span>⏰</span>
                          {t('internships.expired')}
                        </>
                      );
                    } else {
                      return (
                        <>
                          <span>🚀</span>
                          {t('common.apply')}
                        </>
                      );
                    }
                  })()}
                </button>
              )}

              {user && user.role === 'company' && (
                <>
                  <button
                    onClick={() => navigate(`/edit-internship/${internshipId}`)}
                    style={{
                      ...buttonStyle,
                      background: '#f59e0b',
                      color: 'white',
                      minWidth: '80px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#d97706';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#f59e0b';
                    }}
                  >
                    <span>✏️</span>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(internshipId, internship.title)}
                    style={{
                      ...buttonStyle,
                      background: '#ef4444',
                      color: 'white',
                      minWidth: '80px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#dc2626';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#ef4444';
                    }}
                  >
                    <span>🗑️</span>
                    Delete
                  </button>
                </>
              )}
            </div>
            </div>
          );
        })}
      </div>      {filteredInternships.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 20px',
          background: emptyStateBg,
          borderRadius: '24px',
          backdropFilter: 'blur(10px)',
          border: emptyStateBorder,
          boxShadow: emptyStateShadow,
          margin: '40px 0'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🔍</div>
          <h3 style={{ 
            fontSize: '2rem', 
            marginBottom: '16px',
            background: emptyStateGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '800'
          }}>
            No internships found
          </h3>
          <p style={{ 
            color: emptyStateTextColor,
            fontSize: '18px',
            lineHeight: '1.6',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            Try adjusting your search criteria or check back later for new opportunities.
          </p>
        </div>
      )}      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '40px',
          padding: '24px',
          background: paginationBg,
          borderRadius: '16px',
          boxShadow: paginationShadow,
        }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}            style={{
              ...buttonStyle,
              background: currentPage === 1 ? prevButtonBg : nextButtonBg,
              color: currentPage === 1 ? prevButtonColor : 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.6 : 1,
              minWidth: '100px'
            }}onMouseEnter={(e) => {
              if (currentPage !== 1) {
                e.target.style.background = nextButtonHoverBg;
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 1) {
                e.target.style.background = nextButtonBg;
              }
            }}
          >
            <span>←</span>
            Previous
          </button>
            <span style={{
            padding: '12px 20px',
            background: paginationCountBg,
            borderRadius: '10px',
            border: paginationCountBorder,
            fontSize: '14px',
            fontWeight: '600',
            color: paginationCountColor,
          }}>
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}            style={{
              ...buttonStyle,
              background: !hasNextPage ? prevButtonBg : nextButtonBg,
              color: !hasNextPage ? prevButtonColor : 'white',
              cursor: !hasNextPage ? 'not-allowed' : 'pointer',
              opacity: !hasNextPage ? 0.6 : 1,
              minWidth: '100px'
            }}onMouseEnter={(e) => {
              if (hasNextPage) {
                e.target.style.background = nextButtonHoverBg;
              }
            }}
            onMouseLeave={(e) => {
              if (hasNextPage) {
                e.target.style.background = nextButtonBg;
              }
            }}
          >
            Next
            <span>→</span>
          </button>
        </div>
      )}
      </Box>
    </Box>
  );
};

export default AllInternshipsPage;