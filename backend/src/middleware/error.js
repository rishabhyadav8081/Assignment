export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

export const errorHandler = (
  err,
  req,
  res,
  next
) => {
  console.error(err.message);

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'That record already exists',
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors)[0].message,
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid login token',
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error',
  });
};