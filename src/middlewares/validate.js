import { ZodError } from 'zod';

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    // Replace with parsed values to ensure coerce and defaults
    req.body = parsed.body;
    req.params = parsed.params;
    req.query = parsed.query;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    next(error);
  }
};

export default validate;