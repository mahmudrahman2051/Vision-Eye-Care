const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();

// Trust reverse proxy for accurate IP determination in production (Nginx/Cloudflare/Render)
app.set('trust proxy', 1);

// ------------------------------------
// Security & Middleware
// ------------------------------------
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ------------------------------------
// Rate Limiting (Production Defense)
// ------------------------------------
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000, // 1000 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 30, // 30 login / register attempts per IP to prevent brute-force
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ------------------------------------
// Static Files (for uploads if needed)
// ------------------------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ------------------------------------
// Health Check
// ------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Drishti API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ------------------------------------
// API Routes
// ------------------------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/users', require('./routes/users'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/ticker', require('./routes/ticker'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api', require('./routes/contact'));

// ------------------------------------
// 404 Handler
// ------------------------------------
app.use('/api/{*path}', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ------------------------------------
// Global Error Handler
// ------------------------------------
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

module.exports = app;
