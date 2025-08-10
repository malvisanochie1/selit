import { type Request, type Response, type NextFunction } from 'express';
import { sendValidationError } from '../utils/apiResponse.ts';

// Generic validation function
export const validate = (validationFn: (data: any) => any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = validationFn(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof Error) {
        sendValidationError(res, [error.message]);
      } else {
        sendValidationError(res, ['Validation failed']);
      }
    }
  };
};

// Query parameter validation
export const validateQuery = (validationFn: (data: any) => any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = validationFn(req.query);
      req.query = validatedData;
      next();
    } catch (error) {
      if (error instanceof Error) {
        sendValidationError(res, [error.message]);
      } else {
        sendValidationError(res, ['Query validation failed']);
      }
    }
  };
};

// URL parameter validation
export const validateParams = (validationFn: (data: any) => any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = validationFn(req.params);
      req.params = validatedData;
      next();
    } catch (error) {
      if (error instanceof Error) {
        sendValidationError(res, [error.message]);
      } else {
        sendValidationError(res, ['Parameter validation failed']);
      }
    }
  };
};

// Simple validation helpers
export const validateId = (id: string): string => {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    throw new Error('Valid ID is required');
  }
  return id.trim();
};

export const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new Error('Valid email is required');
  }
  return email.toLowerCase().trim();
};

export const validateString = (value: string, fieldName: string, minLength: number = 1, maxLength: number = 255): string => {
  if (!value || typeof value !== 'string') {
    throw new Error(`${fieldName} is required`);
  }
  
  const trimmedValue = value.trim();
  if (trimmedValue.length < minLength) {
    throw new Error(`${fieldName} must be at least ${minLength} characters`);
  }
  
  if (trimmedValue.length > maxLength) {
    throw new Error(`${fieldName} must be at most ${maxLength} characters`);
  }
  
  return trimmedValue;
};

export const validateNumber = (value: number, fieldName: string, min: number = 0, max: number = Number.MAX_SAFE_INTEGER): number => {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`${fieldName} must be a valid number`);
  }
  
  if (value < min) {
    throw new Error(`${fieldName} must be at least ${min}`);
  }
  
  if (value > max) {
    throw new Error(`${fieldName} must be at most ${max}`);
  }
  
  return value;
};

export const validateArray = (value: any[], fieldName: string, itemValidator?: (item: any) => any): any[] => {
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }
  
  if (itemValidator) {
    return value.map((item, index) => {
      try {
        return itemValidator(item);
      } catch (error) {
        throw new Error(`${fieldName}[${index}]: ${error instanceof Error ? error.message : 'Invalid item'}`);
      }
    });
  }
  
  return value;
};

export const validateEnum = (value: string, fieldName: string, allowedValues: string[]): string => {
  if (!value || !allowedValues.includes(value)) {
    throw new Error(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
  }
  return value;
};

// Pagination validation
export const validatePagination = (query: any) => {
  const page = query.page ? parseInt(query.page as string) : 1;
  const limit = query.limit ? parseInt(query.limit as string) : 10;
  
  if (page < 1) {
    throw new Error('Page must be at least 1');
  }
  
  if (limit < 1 || limit > 100) {
    throw new Error('Limit must be between 1 and 100');
  }
  
  return { page, limit };
};
