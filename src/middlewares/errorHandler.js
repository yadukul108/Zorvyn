import { createErrorResponse } from '../utils/responses.js';
import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.logError(err, req);

  // Handle Joi validation errors
  if (err.isJoi) {
    const { statusCode, response } = createErrorResponse(
      {
        message: 'Validation error',
        details: err.details.map((detail) => ({
          message: detail.message,
          path: detail.path,
        })),
      },
      err.status || 400
    );
    return res.status(statusCode).json(response);
  }

  // Handle custom application errors
  if (err.statusCode) {
    const { statusCode, response } = createErrorResponse(err, err.statusCode);
    return res.status(statusCode).json(response);
  }

  // Handle MongoDB/Mongoose errors
  if (err.name === 'ValidationError') {
    const { statusCode, response } = createErrorResponse(
      {
        message: 'Database validation error',
        details: Object.values(err.errors).map((e) => e.message),
      },
      400
    );
    return res.status(statusCode).json(response);
  }

  if (err.name === 'CastError') {
    const { statusCode, response } = createErrorResponse(
      { message: 'Invalid resource ID format' },
      400
    );
    return res.status(statusCode).json(response);
  }

  if (err.code === 11000) {
    const { statusCode, response } = createErrorResponse(
      { message: 'Duplicate field value entered' },
      409
    );
    return res.status(statusCode).json(response);
  }

  // Default error response
  const { statusCode, response } = createErrorResponse(
    { message: err.message || 'Internal server error' },
    500
  );
  res.status(statusCode).json(response);
};

export default errorHandler;
