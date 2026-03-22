const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  console.error(`[ERROR] ${req.method} ${req.path} → ${err.message}`);
  res.status(status).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
};

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { errorHandler, asyncHandler };