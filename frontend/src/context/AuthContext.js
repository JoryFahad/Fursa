import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const AuthContext = createContext(null);

// This will hold the promise for the token refresh, ensuring it only runs once.
let refreshPromise = null;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('access_token');
  });
  const [refreshToken, setRefreshToken] = useState(() => {
    return localStorage.getItem('refresh_token');
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Listen for token refresh events from axios interceptor
  useEffect(() => {
    const handleTokenRefresh = (event) => {
      const { access_token, refresh_token } = event.detail;
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
    };

    const handleAuthLogout = () => {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
    };

    window.addEventListener('tokenRefreshed', handleTokenRefresh);
    window.addEventListener('authLogout', handleAuthLogout);

    return () => {
      window.removeEventListener('tokenRefreshed', handleTokenRefresh);
      window.removeEventListener('authLogout', handleAuthLogout);
    };
  }, []);

  const register = async ({ email, password, role }) => {
    try {
      console.log('Register: sending request', { email, role });
      const response = await axios.post(`${config.API_URL}/auth/register`, { 
        email: email.trim().toLowerCase(), 
        password, 
        role 
      });
      console.log('Register: response received', response.data);
      
      // Registration successful, return the response
      return response.data;
    } catch (err) {
      console.error('Register: error', err);
      
      // Handle specific HTTP status codes
      if (err.response) {
        const { status, data } = err.response;
        
        switch (status) {
          case 400:
            // Handle all the specific email validation errors
            const message = data?.message || '';
            
            if (message.includes('Email already in use')) {
              throw new Error('This email is already registered. Please use a different email or try logging in.');
            } else if (message.includes('Invalid email format')) {
              throw new Error('Please enter a valid email address.');
            } else if (message.includes('does not have valid mail servers')) {
              throw new Error('This email domain cannot receive emails. Please use a different email address.');
            } else if (message.includes('does not exist')) {
              throw new Error('This email domain does not exist. Please check your email address.');
            } else if (message.includes('Disposable email addresses are not allowed')) {
              throw new Error('Temporary or disposable email addresses are not allowed. Please use a permanent email address.');
            } else if (message.includes('Unable to verify email domain')) {
              throw new Error('We cannot verify your email domain. Please check your email address or try again later.');
            } else {
              throw new Error(message || 'Registration failed. Please check your information.');
            }
          case 429:
            throw new Error('Too many registration attempts. Please wait a few minutes before trying again.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(data?.message || 'Registration failed. Please try again.');
        }
      } else if (err.request) {
        // Network error
        throw new Error('Network error. Please check your internet connection and try again.');
      } else {
        // Other errors
        throw new Error(err.message || 'Registration failed. Please try again.');
      }
    }
  };

  const login = async ({ email, password }) => {
    if (isLoggingIn) {
      throw new Error('Login already in progress. Please wait.');
    }
    
    setIsLoggingIn(true);
    try {
      console.log('Login: sending request', email);
      const response = await axios.post(`${config.API_URL}/auth/login`, { email, password });
      console.log('Login: response received', response.data);
      // Accept both snake_case and camelCase
      const data = response.data;
      const accessToken = data.access_token || data.accessToken;
      const refreshToken = data.refresh_token || data.refreshToken;
      const userData = data.user || data.userData || data.user_info || data.userInfo;
      const name = data.name;
      console.log('Login: parsed tokens', { accessToken, refreshToken, userData, name });
      if (!accessToken || !refreshToken || !userData) {
        console.error('Login: missing required fields', { accessToken, refreshToken, userData });
        throw new Error('Login response missing required fields.');
      }
      
      setUser(userData);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('name', name || ''); // Save name in localStorage
      console.log('Login: user and tokens set');
      console.log('Login: accessToken stored:', localStorage.getItem('access_token') ? 'Yes' : 'No');
    } catch (err) {
      console.error('Login: error', err);
      
      // Handle specific HTTP status codes
      if (err.response) {
        const { status, data } = err.response;
        
        switch (status) {
          case 429:
            throw new Error('Too many login attempts. Please wait a few minutes before trying again.');
          case 401:
            throw new Error(data?.message || 'Invalid email or password. Please check your credentials and try again.');
          case 400:
            throw new Error(data?.message || 'Please check your email and password.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(data?.message || `Login failed (${status}). Please try again.`);
        }
      } else if (err.request) {
        // Network error
        throw new Error('Network error. Please check your internet connection and try again.');
      } else {
        // Other errors
        throw new Error(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      if (user && user.id && accessToken) {
        console.log('Logout: sending request to invalidate refresh token', { userId: user.id });
        const response = await axios.post(`${config.API_URL}/auth/logout`, { userId: user.id }, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log('Logout: refresh token invalidated successfully', response.data);
      } else {
        console.log('Logout: skipping API call - missing user, user.id, or accessToken');
      }
    } catch (err) {
      // Log the error but continue with local logout
      console.log('Logout API call failed, but continuing with local logout:', err.response?.data || err.message);
      
      // Handle specific error cases for debugging
      if (err.response) {
        const { status } = err.response;
        switch (status) {
          case 401:
            console.log('Logout: Unauthorized - token may already be invalid');
            break;
          case 404:
            console.log('Logout: User not found');
            break;
          case 500:
            console.log('Logout: Server error during logout');
            break;
          default:
            console.log(`Logout: Unexpected error (${status})`);
        }
      }
    }
      // Always perform local logout regardless of API call success
    console.log('Logout: clearing local state and localStorage');
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('name');
    // Clean up any legacy camelCase keys that might exist
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    console.log('Logout: completed successfully');
  };

  const refresh = async () => {
    // If a refresh is already in progress, attach to the existing promise.
    if (refreshPromise) {
      console.log('Refresh: Attaching to an in-progress refresh call.');
      return refreshPromise;
    }

    // Start a new refresh promise.
    console.log('Refresh: Starting a new token refresh promise.');
    refreshPromise = (async () => {
      try {
        const currentRefreshToken = localStorage.getItem('refresh_token');
        const currentUser = JSON.parse(localStorage.getItem('user'));

        if (!currentUser || !currentRefreshToken) {
          console.error('Refresh: Missing user or refresh token from localStorage.');
          throw new Error('No refresh token or user data found.');
        }

        console.log('Refresh: Attempting to refresh token for user:', currentUser.id);
        const requestBody = {
          userId: currentUser.id,
          refresh_token: currentRefreshToken,
        };

        const response = await axios.post(`${config.API_URL}/auth/refresh`, requestBody);

        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;

        if (!newAccessToken || !newRefreshToken) {
          console.error('Refresh: Invalid response from refresh endpoint.');
          throw new Error('Invalid refresh response - missing tokens');
        }

        console.log('Refresh: Token refresh successful.');
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        localStorage.setItem('access_token', newAccessToken);
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refresh_token', newRefreshToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        return newAccessToken;
      } catch (err) {
        console.error('Token refresh failed catastrophically:', err.response?.data || err.message);
        
        // Handle specific refresh token errors
        if (err.response) {
          const { status } = err.response;
          
          switch (status) {
            case 403:
              console.error('Refresh token invalid or expired');
              break;
            case 401:
              console.error('Access denied - invalid refresh token');
              break;
            default:
              console.error(`Refresh failed with status ${status}`);
          }
        }
        
        // On failure, perform a full logout and force re-authentication.
        logout(); 
        throw new Error('Session expired. Please log in again.');
      } finally {
        // Clear the promise so the next refresh call will start a new one.
        console.log('Refresh: Clearing the refresh promise.');
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  };

  // Profile management functions
  const getProfile = async () => {
    // Get the most current token from localStorage as a fallback
    const currentToken = accessToken || localStorage.getItem('access_token');
    
    if (!currentToken) {
      throw new Error('No access token available. Please log in again.');
    }

    try {
      const response = await fetch(`${config.API_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Invalid user role.');
        } else if (response.status === 404) {
          throw new Error('Profile not found. Please create your profile first.');
        } else {
          throw new Error(result.message || 'Failed to retrieve profile.');
        }
      }

      // Update user context with fresh profile data
      const updatedUser = { 
        ...user, 
        [user.role === 'student' ? 'studentProfile' : 'companyProfile']: result 
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return result;
    } catch (error) {
      console.error('Profile retrieval error:', error);
      throw error;
    }
  };

  const createProfile = async (profileData) => {
    // Get the most current token from localStorage as a fallback
    const currentToken = accessToken || localStorage.getItem('access_token');
    
    console.log('CreateProfile: accessToken from state:', accessToken ? 'Available' : 'Missing');
    console.log('CreateProfile: accessToken from localStorage:', localStorage.getItem('access_token') ? 'Available' : 'Missing');
    console.log('CreateProfile: user from state:', user);
    console.log('CreateProfile: token being sent:', currentToken);
    console.log('CreateProfile: Full token being sent:', currentToken);
    
    if (!currentToken) {
      throw new Error('No access token available. Please log in again.');
    }

    console.log('CreateProfile: Using token:', currentToken ? 'Token available' : 'No token');
    console.log('CreateProfile: Profile data:', profileData);

    try {
      const response = await fetch(`${config.API_URL}/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();
      
      console.log('CreateProfile: Response status:', response.status);
      console.log('CreateProfile: Response data:', result);

      if (!response.ok) {
        if (response.status === 401) {
          console.error('CreateProfile: 401 Unauthorized - token may be invalid');
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Profile creation failed. You may already have a profile or have invalid permissions.');
        } else if (response.status === 400) {
          throw new Error(result.message || 'Invalid profile data. Please check your information.');
        } else {
          throw new Error(result.message || 'Failed to create profile.');
        }
      }

      // Update user context with new profile
      const updatedUser = { 
        ...user, 
        [user.role === 'student' ? 'studentProfile' : 'companyProfile']: result 
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return result;
    } catch (error) {
      console.error('Profile creation error:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    // Get the most current token from localStorage as a fallback
    const currentToken = accessToken || localStorage.getItem('access_token');
    
    if (!currentToken) {
      throw new Error('No access token available. Please log in again.');
    }

    try {
      const response = await fetch(`${config.API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Invalid user role.');
        } else if (response.status === 404) {
          throw new Error('Profile not found. Please create your profile first.');
        } else if (response.status === 400) {
          throw new Error(result.message || 'Invalid profile data. Please check your information.');
        } else {
          throw new Error(result.message || 'Failed to update profile.');
        }
      }

      // Update user context with updated profile
      const updatedUser = { 
        ...user, 
        [user.role === 'student' ? 'studentProfile' : 'companyProfile']: result 
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return result;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  // Check if user is logged in on initial load
  React.useEffect(() => {
    const initializeAuth = () => {
      try {        const storedUser = localStorage.getItem('user');
        const storedAccess = localStorage.getItem('access_token');
        const storedRefresh = localStorage.getItem('refresh_token');
        const storedName = localStorage.getItem('name');

        console.log('=== AUTH INITIALIZATION DEBUG ===');
        console.log('Raw localStorage values:');
        console.log('- storedUser:', storedUser);
        console.log('- storedAccess:', storedAccess ? storedAccess.substring(0, 50) + '...' : 'null');
        console.log('- storedRefresh:', storedRefresh ? storedRefresh.substring(0, 50) + '...' : 'null');
        console.log('- storedName:', storedName);
        console.log('Validation checks:');
        console.log('- hasUser:', !!storedUser);
        console.log('- hasAccess:', !!storedAccess);
        console.log('- hasRefresh:', !!storedRefresh);
        console.log('- hasName:', !!storedName);

        if (
          storedUser &&
          storedUser !== 'undefined' &&
          storedUser !== 'null' &&
          storedAccess &&
          storedAccess !== 'undefined' &&
          storedAccess !== 'null' &&
          storedRefresh &&
          storedRefresh !== 'undefined' &&
          storedRefresh !== 'null'
        ) {
          const parsedUser = JSON.parse(storedUser);
          console.log('✅ Valid session found, restoring user:', parsedUser);
          setUser(parsedUser);
          setAccessToken(storedAccess);
          setRefreshToken(storedRefresh);
        } else {
          console.log('❌ No valid session found in localStorage');
          console.log('Clearing any invalid data...');
          // Clear any invalid data
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('name');
        }
        console.log('=== END AUTH INITIALIZATION ===');
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('name');
      } finally {
        console.log('Setting isLoading to false');
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      register,
      login, 
      logout, 
      refresh, 
      accessToken, 
      refreshToken,
      isLoading,
      isLoggingIn,
      getProfile,
      createProfile,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};