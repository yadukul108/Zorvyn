import Joi from 'joi';

const validate = (schema) => (req, res, next) => {
  const options = {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  };

  const { error, value } = schema.validate(
    {
      body: req.body,
      params: req.params,
      query: req.query
    },
    options
  );

  if (error) {
    error.status = 400;
    return next(error);
  }

  req.body = value.body;
  req.params = value.params;
  req.query = value.query;
  next();
};

export default validate;