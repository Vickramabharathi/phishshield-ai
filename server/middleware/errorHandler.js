function errorHandler(err, req, res, next) {
  console.error('Unhandled Application Exception:', err.stack || err.message);

  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'An internal security exception occurred. Please try again.'
    : err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR'
    }
  });
}

module.exports = { errorHandler };
