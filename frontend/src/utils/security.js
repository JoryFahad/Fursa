// Security utilities for protecting against common web vulnerabilities

// Input sanitization and validation
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potentially dangerous characters and patterns
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/script/gi, '') // Remove script tags
    .replace(/iframe/gi, '') // Remove iframe tags
    .replace(/object/gi, '') // Remove object tags
    .replace(/embed/gi, '') // Remove embed tags
    .replace(/form/gi, '') // Remove form tags
    .replace(/input/gi, '') // Remove input tags
    .replace(/button/gi, '') // Remove button tags
    .replace(/select/gi, '') // Remove select tags
    .replace(/textarea/gi, '') // Remove textarea tags
    .replace(/link/gi, '') // Remove link tags
    .replace(/meta/gi, '') // Remove meta tags
    .replace(/style/gi, '') // Remove style tags
    .replace(/title/gi, '') // Remove title tags
    .replace(/head/gi, '') // Remove head tags
    .replace(/body/gi, '') // Remove body tags
    .replace(/html/gi, '') // Remove html tags
    .trim();
};

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    errors: {
      length: password.length < minLength ? `Password must be at least ${minLength} characters` : null,
      uppercase: !hasUpperCase ? 'Password must contain at least one uppercase letter' : null,
      lowercase: !hasLowerCase ? 'Password must contain at least one lowercase letter' : null,
      numbers: !hasNumbers ? 'Password must contain at least one number' : null,
      special: !hasSpecialChar ? 'Password must contain at least one special character' : null
    }
  };
};

// Validate URL format
export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Rate limiting utility
export class RateLimiter {
  constructor(maxRequests = 5, timeWindow = 60000) { // 5 requests per minute by default
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = new Map();
  }

  isAllowed(identifier) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the time window
    const validRequests = userRequests.filter(time => now - time < this.timeWindow);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }

  reset(identifier) {
    this.requests.delete(identifier);
  }
}

// Input length validation
export const validateInputLength = (input, minLength = 1, maxLength = 255) => {
  if (!input || input.length < minLength) {
    return { isValid: false, error: `Input must be at least ${minLength} characters long` };
  }
  if (input.length > maxLength) {
    return { isValid: false, error: `Input must be no more than ${maxLength} characters long` };
  }
  return { isValid: true, error: null };
};

// File upload validation
export const validateFileUpload = (file, allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { isValid: false, error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: `File size too large. Maximum size: ${maxSize / (1024 * 1024)}MB` };
  }
  
  return { isValid: true, error: null };
};

// Sanitize form data recursively
export const sanitizeFormData = (data) => {
  if (typeof data === 'string') {
    return sanitizeInput(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeFormData(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeFormData(value);
    }
    return sanitized;
  }
  
  return data;
};

// Validate and sanitize form submission
export const secureFormSubmission = (formData, validations = {}) => {
  const errors = [];
  const sanitizedData = {};
  
  // Sanitize all input data
  const sanitized = sanitizeFormData(formData);
  
  // Apply custom validations
  for (const [field, value] of Object.entries(sanitized)) {
    const validation = validations[field];
    if (validation) {
      if (validation.required && (!value || value.trim() === '')) {
        errors.push(`${field} is required`);
        continue;
      }
      
      if (validation.email && !validateEmail(value)) {
        errors.push(`${field} must be a valid email address`);
        continue;
      }
      
      if (validation.url && !validateURL(value)) {
        errors.push(`${field} must be a valid URL`);
        continue;
      }
      
      if (validation.password) {
        const passwordValidation = validatePassword(value);
        if (!passwordValidation.isValid) {
          errors.push(...Object.values(passwordValidation.errors).filter(Boolean));
          continue;
        }
      }
      
      if (validation.length) {
        const lengthValidation = validateInputLength(value, validation.length.min, validation.length.max);
        if (!lengthValidation.isValid) {
          errors.push(lengthValidation.error);
          continue;
        }
      }
    }
    
    sanitizedData[field] = value;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    data: sanitizedData
  };
};

// Prevent XSS in content display
export const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Secure API request wrapper
export const secureApiRequest = async (url, options = {}, rateLimiter = null) => {
  // Check rate limiting if provided
  if (rateLimiter && !rateLimiter.isAllowed('api')) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  
  // Add security headers
  const secureOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, secureOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}; 