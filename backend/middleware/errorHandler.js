export function errorHandler(err, req, res, next) {
  console.error('[SERVER ERROR]', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  const statusCode = err.statusCode || 500;
  const message = err.isOperational
    ? err.message
    : (process.env.NODE_ENV === 'development' ? err.message : 'An unexpected server error occurred. Please try again.');

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || null
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
}

