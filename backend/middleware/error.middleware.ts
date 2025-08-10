import { type Request, type Response, type NextFunction } from 'express';
import { sendError } from '../utils/apiResponse.ts';
import logger from '../config/logger.ts';

// Custom error class
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle custom AppError
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }
  // Handle validation errors
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message;
  }
  // Handle JSON parsing errors
  else if (error instanceof SyntaxError && 'body' in error) {
    statusCode = 400;
    message = 'Invalid JSON format';
  }
  // Handle CastError (MongoDB ObjectId errors)
  else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }
  // Handle duplicate key errors
  else if (error.name === 'MongoError' && (error as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value';
  }
  // Handle JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Log error
  if (statusCode >= 500) {
    logger.error('Server Error:', {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
  } else {
    logger.warn('Client Error:', {
      error: error.message,
      url: req.url,
      method: req.method,
      ip: req.ip,
    });
  }

  // Send error response
  sendError(res, message, statusCode);
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response): void => {
  logger.warn('Route not found:', {
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  sendError(res, `Route ${req.originalUrl} not found`, 404);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Development error handler (with stack trace)
export const developmentErrorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message = error.message;
  const stack = error.stack;

  logger.error('Development Error:', {
    error: message,
    stack,
    url: req.url,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? stack : undefined,
  });
};
