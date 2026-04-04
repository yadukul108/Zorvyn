const errorHandler = (err, req, res, next) => {
  if (err.isJoi) {
    return res.status(err.status || 400).json({
      error: 'Validation error',
      details: err.details.map((detail) => ({
        message: detail.message,
        path: detail.path
      }))
    });
  }

  const status = err.status || err.statusCode || 500;
  const response = {
    error: err.message || 'Internal server error'
  };

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }

  res.status(status).json(response);
};

export default errorHandler;
