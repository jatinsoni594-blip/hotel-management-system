const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/db');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const guestRoutes = require('./routes/guestRoutes');
const authRoutes = require('./routes/authRoutes');
const { getStats } = require('./controllers/bookingController');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/auth', authRoutes);
app.get('/api/stats', getStats);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    service: 'Grand Azure Hotel Management API',
    version: '1.0.0'
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 40px auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
      <h2 style="color: #1e3a8a; margin-top: 0;">🏨 Grand Azure Hotel Management API is Running</h2>
      <p style="color: #475569;">Backend server is active on port ${PORT}.</p>
      <ul>
        <li><a href="/api/rooms">/api/rooms</a> - View all rooms & filters</li>
        <li><a href="/api/bookings">/api/bookings</a> - View all bookings</li>
        <li><a href="/api/guests">/api/guests</a> - Guest directory</li>
        <li><a href="/api/stats">/api/stats</a> - Dashboard KPIs</li>
        <li><a href="/api/health">/api/health</a> - Server health status</li>
      </ul>
    </div>
  `);
});

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🏨 Hotel Management Backend running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});
