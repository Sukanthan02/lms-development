require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');
const db = require('./models');

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categoryRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const courseRoutes = require('./routes/courseRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const config = require('../config');

const app = express();

// ✅ Enable CORS for all routes
const corsOptions = {
  origin: '*', // Allow all origins (change this to a specific origin in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// ✅ Configure cookie session
app.use(
  cookieSession({
    name: 'lms-session',
    keys: ['key1', 'key2'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

// ✅ Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Use cookie parser
app.use(cookieParser());

// ✅ Initialize Passport (uncomment when authentication is needed)
// app.use(passport.initialize());
// app.use(passport.session());

// ✅ Sync database
db.sequelize
  .sync()
  .then(() => {
    console.log('✅ Database synced successfully.');
  })
  .catch((err) => {
    console.error('❌ Database sync failed: ' + err.message);
  });

// ✅ Simple GET route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to LMS Backend API',
    version: '1.0.0',
    environment: config.nodeEnv
  });
});

// ✅ Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// ✅ POST route for JSON messages
app.post('/', (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  res.json({
    receivedMessage: message,
    status: 'Message received successfully!'
  });
});

// ✅ Register API routes **BEFORE** serving static files
app.use('/api/auth', authRoutes);

app.use('/api/categories', categoryRoutes);
app.use('/api/sub-categories', subCategoryRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
// Add more route modules here as needed
// require('./routes/courses')(app);
// require('./routes/posts')(app);
// etc.

// ✅ Serve frontend static files **AFTER** API routes (optional)
// app.use(express.static(__dirname + '/../public'));

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    ...(config.isDevelopment && { stack: err.stack })
  });
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
  console.log(`📋 Environment: ${config.nodeEnv}`);
  console.log(`📁 Media Upload Path: ${config.mediaUploadPath}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    process.exit(1);
  } else {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
});

module.exports = app;
