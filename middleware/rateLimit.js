const rateLimit = require("express-rate-limit");

// Apply only on decision endpoint
const decisionRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per minute

  message: {
    success: false,
    error: "RATE_LIMIT_EXCEEDED",
    message: "Too many requests. Please try again after 1 minute.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = decisionRateLimiter;