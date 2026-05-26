require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const { globalRateLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/categories');
const tagRoutes = require('./routes/tags');
const commentRoutes = require('./routes/comments');
const contactRoutes = require('./routes/contact');
const newsletterRoutes = require('./routes/newsletter');
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/admin');

const app = express();

// Connect to MongoDB
connectDB();

// Security Headers
app.use(helmet());

// CORS
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB injection sanitization
app.use(mongoSanitize());

// HTTP request logging (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Global rate limiting
app.use('/api', globalRateLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Ethara Blog API is running', timestamp: new Date().toISOString() });
});

// Mount routes
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Route not found.' });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Ethara Blog API running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;
