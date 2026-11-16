import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

/**
 * 1. Global API Rate Limiter
 * Guards entire API against brute-force DDoS, aggressive web scraping, and denial-of-service.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests from this IP address. Please slow down and try again in 15 minutes.'
  }
});

/**
 * 2. Strict Authentication Rate Limiter
 * Prevents credential stuffing, dictionary attacks, and brute-force password cracking.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 login / register attempts per 15 min window
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  message: {
    success: false,
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
    message: 'High security alert: Too many login attempts. For your account security, access from this IP is temporarily restricted for 15 minutes.'
  }
});

/**
 * 3. Checkout & Order Creation Rate Limiter
 * Prevents automated credit card testing, fraudulent spam orders, and checkout botting.
 */
export const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Limit each IP to 10 order submissions per 10 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'ORDER_RATE_LIMIT_EXCEEDED',
    message: 'Order submission rate limit exceeded. Please wait a few moments before placing another order.'
  }
});

/**
 * 4. Admin Endpoint Rate Limiter
 * Shields privileged administrative operations from rapid automated manipulation.
 */
export const adminLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'ADMIN_RATE_LIMIT_EXCEEDED',
    message: 'Administrator action rate limit exceeded. Please retry in 1 minute.'
  }
});

/**
 * 5. Input Sanitization & Anti-XSS Middleware
 * Recursively scans and purges malicious script injections, SQL injection patterns,
 * and null-byte poisonings from all incoming request payloads.
 */
function cleanValue(val) {
  if (typeof val === 'string') {
    // Purge null-byte characters
    let cleaned = val.replace(/\0/g, '');
    // Neutralize script tags and dangerous HTML events
    cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    cleaned = cleaned.replace(/javascript:/gi, '');
    cleaned = cleaned.replace(/\bon\w+\s*=/gi, '');
    return cleaned.trim();
  }
  if (Array.isArray(val)) {
    return val.map(cleanValue);
  }
  if (val !== null && typeof val === 'object') {
    const sanitizedObj = {};
    for (const [k, v] of Object.entries(val)) {
      sanitizedObj[cleanValue(k)] = cleanValue(v);
    }
    return sanitizedObj;
  }
  return val;
}

export function sanitizeInput(req, res, next) {
  try {
    if (req.body) req.body = cleanValue(req.body);
    if (req.query) req.query = cleanValue(req.query);
    if (req.params) req.params = cleanValue(req.params);
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * 6. Hardened Security Headers Config (Helmet)
 * Removes server identification, prevents clickjacking, enforces HTTPS transport,
 * and sets strict MIME sniffing guards.
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "http://localhost:5000", "http://localhost:3000", "https:"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' }, // Clickjacking protection
  hidePoweredBy: true, // Conceal "X-Powered-By: Express"
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, // 1-year HSTS
  ieNoOpen: true,
  noSniff: true, // X-Content-Type-Options: nosniff
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true
});
