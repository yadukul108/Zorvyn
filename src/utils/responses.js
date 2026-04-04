/**
 * Response helper utilities for consistent API responses
 */

export const createSuccessResponse = (data, message = null, statusCode = 200) => {
  const response = { success: true };

  if (message) {
    response.message = message;
  }

  if (data !== undefined) {
    response.data = data;
  }

  return { statusCode, response };
};

export const createErrorResponse = (error, statusCode = 500) => {
  const response = {
    success: false,
    error: error.message || 'Internal server error',
  };

  if (error.details) {
    response.details = error.details;
  }

  if (process.env.NODE_ENV !== 'production' && error.stack) {
    response.stack = error.stack;
  }

  return { statusCode, response };
};

export const sendSuccessResponse = (res, data, message = null, statusCode = 200) => {
  const { statusCode: code, response } = createSuccessResponse(data, message, statusCode);
  return res.status(code).json(response);
};

export const sendErrorResponse = (res, error, statusCode = 500) => {
  const { statusCode: code, response } = createErrorResponse(error, statusCode);
  return res.status(code).json(response);
};

export const sendPaginatedResponse = (res, data, pagination, message = null) => {
  const response = {
    success: true,
    data,
    pagination,
  };

  if (message) {
    response.message = message;
  }

  return res.json(response);
};