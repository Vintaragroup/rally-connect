/**
 * Form validation utilities
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (errors.length === 0) {
    strength = 'strong';
  } else if (errors.length === 1) {
    strength = 'medium';
  }

  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
}

/**
 * Validate team name
 */
export function validateTeamName(name: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!name || name.trim().length === 0) {
    errors.push({ field: 'teamName', message: 'Team name is required' });
  } else if (name.trim().length < 3) {
    errors.push({ field: 'teamName', message: 'Team name must be at least 3 characters' });
  } else if (name.trim().length > 50) {
    errors.push({ field: 'teamName', message: 'Team name must not exceed 50 characters' });
  }

  // Check for invalid characters
  if (!/^[a-zA-Z0-9\s\-()&.,]+$/.test(name)) {
    errors.push({ field: 'teamName', message: 'Team name contains invalid characters' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (phone && phone.trim().length > 0) {
    // Remove common formatting characters
    const cleanPhone = phone.replace(/[\s\-().]/g, '');
    if (!/^[0-9]{10,}$/.test(cleanPhone)) {
      errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate required field
 */
export function validateRequired(value: string, fieldName: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!value || value.trim().length === 0) {
    errors.push({ field: fieldName, message: `${fieldName} is required` });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate form data for team creation
 */
export function validateTeamCreation(data: {
  teamName: string;
  location?: string;
  sport?: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  const nameValidation = validateTeamName(data.teamName);
  errors.push(...nameValidation.errors);

  if (data.location && data.location.trim().length > 0) {
    if (data.location.trim().length < 3 || data.location.trim().length > 100) {
      errors.push({ field: 'location', message: 'Location must be between 3 and 100 characters' });
    }
  }

  if (!data.sport) {
    errors.push({ field: 'sport', message: 'Sport selection is required' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate form data for profile setup
 */
export function validateProfileSetup(data: {
  name: string;
  phone?: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  const nameValidation = validateRequired(data.name, 'Full name');
  errors.push(...nameValidation.errors);

  if (data.name && data.name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Full name must not exceed 100 characters' });
  }

  const phoneValidation = validatePhone(data.phone || '');
  if (!phoneValidation.isValid) {
    errors.push(...phoneValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
