export default function validate(schema) {
  return (req, res, next) => {
    const toValidate = { body: req.body, params: req.params, query: req.query };
    const options = { abortEarly: false, allowUnknown: true, stripUnknown: true };
    const { error, value } = schema.validate(toValidate, options);
    if (error) {
      error.status = 400;
      return next(error);
    }
    req.body = value.body || req.body;
    // Avoid assigning to req.params/req.query (read-only getters in Express 5)
    // Controllers can read from req.params/req.query as-is; we only sanitize body.
    next();
  };
}
