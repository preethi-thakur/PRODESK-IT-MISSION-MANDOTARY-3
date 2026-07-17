import { logError } from '../utils/logger.js';

export const errorHandler = (error, req, res, _next) => {
  logError(error, req.path);

  if (error instanceof Error) {
    const response = {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
    res.status(500).json(response);
  } else {
    const response = {
      success: false,
      message: 'An unexpected error occurred',
    };
    res.status(500).json(response);
  }
};

export const notFoundHandler = (req, res) => {
  const response = {
    success: false,
    message: `Route ${req.originalUrl} not found`,
  };
  res.status(404).json(response);
};
