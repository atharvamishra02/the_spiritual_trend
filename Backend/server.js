import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
import cartRoutes from './routes/cartRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import categoryRoutes from './routes/categoryRoutes.js';
import { Server } from 'socket.io';
import paymentRoutes from './routes/paymentRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Serve uploads folder statically with cache headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { maxAge: '30d' }));

// Log environment variables for debugging
console.log('Environment variables:');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);

// Check if JWT_SECRET is missing
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set! Please add it to your .env file');
  console.error('Example: JWT_SECRET=your-super-secret-jwt-key-here');
}

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://thespiritualtrends.com',
  'https://thespiritualtrends.com',
  'http://www.thespiritualtrends.com',
  'https://www.thespiritualtrends.com',
  'http://admin.thespiritualtrends.com',
  'https://admin.thespiritualtrends.com'
];

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.json({ message: "Spiritual Trend Backend API" });
});

// Auth Routes
app.use('/api/auth', authRoutes);

// Admin Routes
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import adminProductRoutes from './routes/adminProductRoutes.js';
import adminOrderRoutes from './routes/adminOrderRoutes.js';
import adminUserRoutes from './routes/adminUserRoutes.js';
import adminCartRoutes from './routes/adminCartRoutes.js';

app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/cart', adminCartRoutes);

// Product Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/homepage/categories', categoryRoutes);

// ❌ Unknown Route Handler (this should always be last)
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found", path: req.originalUrl });
});

// DB Connection with better error handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/spiritual-trend';
    console.log('Attempting to connect to MongoDB with URI:', mongoURI);
    
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
    
    // Start server only after DB connection
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // --- SOCKET.IO SETUP ---
    const io = new Server(server, {
      cors: {
        origin: allowedOrigins,
        credentials: true
      }
    });
    global.io = io;
    io.on('connection', (socket) => {
      console.log('Admin panel connected to notifications:', socket.id);
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

connectDB();
