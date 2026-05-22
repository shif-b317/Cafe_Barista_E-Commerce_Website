const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Initialize app
const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Database seeding endpoint (temporary for production deployment)
const { seedDBWithoutExit } = require('./utils/seed');
app.get('/api/seed', async (req, res, next) => {
  try {
    const result = await seedDBWithoutExit();
    res.json({
      success: true,
      message: 'Database seeded successfully!',
      usersCreated: result.usersCount,
      productsCreated: result.productsCount
    });
  } catch (error) {
    next(error);
  }
});

// Base route for API status verification
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date(), app: 'Cafe Barista API' });
});

// Error handling middleware (catch-all)
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
