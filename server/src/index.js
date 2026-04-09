import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load env vars
dotenv.config();

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors({ 
  origin: [
    process.env.CLIENT_URL, 
    'http://localhost:5173', 
    'http://localhost:5174',
    'http://localhost:3001'
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// Import routes
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import technicianRoutes from './routes/technicianRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import sparePartsRoutes from './routes/sparePartsRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Mount all routes under /api/v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/technicians', technicianRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/support', supportRoutes);
app.use('/api/v1/pricing', pricingRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/spare-parts', sparePartsRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/payment', paymentRoutes);

// Legacy route support (keep /api/* working for existing frontend)
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`API v1: http://localhost:${PORT}/api/v1`);
});
