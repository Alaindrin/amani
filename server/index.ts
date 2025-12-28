import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    console.log('CORS request from origin:', origin);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:8080',
      'http://localhost:3000',
      'https://amani-ecru-ten.vercel.app'
    ];
    
    // Allow all Vercel preview deployments
    if (origin.includes('vercel.app')) {
      console.log('Allowing Vercel deployment:', origin);
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      console.log('Allowing origin from list:', origin);
      return callback(null, true);
    }
    
    console.log('Rejecting origin:', origin);
    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database connection variables
let dbConnected = false;
let Quotation: any = null;
let Message: any = null;

// Try to connect to database using dynamic imports
(async () => {
  try {
    const { default: connectDB } = await import('./db/mongodb.js');
    const { default: QuotationModel } = await import('./models/Quotation.js');
    const { default: MessageModel } = await import('./models/Message.js');
    
    await connectDB();
    dbConnected = true;
    Quotation = QuotationModel;
    Message = MessageModel;
    console.log('✅ Database connected successfully');
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    console.log('⚠️ Server will continue without database connection');
  }
})();

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
app.get('/api/quotations', async (req, res) => {
  if (!dbConnected || !Quotation) {
    return res.status(503).json({
      success: false,
      message: 'Database not available',
    });
  }
  
  try {
    const quotations = await Quotation.find().sort({ created_at: -1 });
    res.json({
      success: true,
      data: quotations,
    });
  } catch (error) {
    console.error('Error fetching quotations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quotations',
    });
  }
});

app.get('/api/quotations/stats', async (req, res) => {
  if (!dbConnected || !Quotation) {
    return res.status(503).json({
      success: false,
      message: 'Database not available',
    });
  }
  
  try {
    const total = await Quotation.countDocuments();
    const pending = await Quotation.countDocuments({ status: 'pending' });
    const reviewed = await Quotation.countDocuments({ status: 'reviewed' });
    const responded = await Quotation.countDocuments({ status: 'responded' });
    
    res.json({
      success: true,
      data: { total, pending, reviewed, responded },
    });
  } catch (error) {
    console.error('Error fetching quotation stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quotation stats',
    });
  }
});

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

// Message endpoints
app.get('/api/messages', async (req, res) => {
  if (!dbConnected || !Message) {
    return res.status(503).json({
      success: false,
      message: 'Database not available',
    });
  }
  
  try {
    const messages = await Message.find().sort({ created_at: -1 });
    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
    });
  }
});

app.get('/api/messages/stats', async (req, res) => {
  if (!dbConnected || !Message) {
    return res.status(503).json({
      success: false,
      message: 'Database not available',
    });
  }
  
  try {
    const total = await Message.countDocuments();
    const unread = await Message.countDocuments({ status: 'unread' });
    const read = await Message.countDocuments({ status: 'read' });
    const replied = await Message.countDocuments({ status: 'replied' });
    
    res.json({
      success: true,
      data: { total, unread, read, replied },
    });
  } catch (error) {
    console.error('Error fetching message stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch message stats',
    });
  }
});

app.post('/api/messages', async (req, res) => {
  if (!dbConnected || !Message) {
    return res.status(503).json({
      success: false,
      message: 'Database not available',
    });
  }
  
  try {
    const { name, email, message } = req.body;
    
    const newMessage = new Message({
      name,
      email,
      message,
    });

    await newMessage.save();
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      id: newMessage._id,
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});