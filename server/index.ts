import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:8080',
      'http://localhost:3000',
      'https://amani-ecru-ten.vercel.app'
    ];
    
    // Allow all Vercel preview deployments
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database connection variables
let dbConnected = false;
let Quotation = null;
let Message = null;

// Try to connect to database
try {
  const connectDB = require('./db/mongodb.js').default;
  const QuotationModel = require('./models/Quotation.js').default;
  const MessageModel = require('./models/Message.js').default;
  
  connectDB()
    .then(() => {
      dbConnected = true;
      Quotation = QuotationModel;
      Message = MessageModel;
      console.log('✅ Database connected successfully');
    })
    .catch((error) => {
      console.error('❌ Database connection failed:', error.message);
      console.log('⚠️ Server will continue without database connection');
    });
} catch (error) {
  console.error('❌ Database modules failed to load:', error.message);
  console.log('⚠️ Server will continue without database connection');
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Portfolio API Server',
    version: '1.0.0',
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Quotation endpoints
app.post('/api/quotations', async (req, res) => {
  if (!dbConnected || !Quotation) {
    return res.status(503).json({
      success: false,
      message: 'Database not available',
    });
  }
  
  try {
    const { name, email, phone, company, projectType, budget, timeline, description } = req.body;
    
    const quotation = new Quotation({
      name,
      email,
      phone,
      company,
      project_type: projectType,
      budget,
      timeline,
      description,
    });

    await quotation.save();
    
    res.status(201).json({
      success: true,
      message: 'Quotation request submitted successfully',
      id: quotation._id,
    });
  } catch (error) {
    console.error('Error creating quotation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quotation request',
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});