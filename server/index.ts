import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/mongodb.js';
import Quotation from './models/Quotation.js';
import Message from './models/Message.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://localhost:3000', 
    'https://amani-ecru-ten.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Connect to MongoDB with error handling
let dbConnected = false;
connectDB()
  .then(() => {
    dbConnected = true;
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error.message);
    console.log('⚠️ Server will continue without database connection');
  });

// Root endpoint - confirms server is running
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Portfolio API Server',
    version: '1.0.0',
    database: dbConnected ? 'connected' : 'disconnected',
    endpoints: {
      health: '/api/health',
      quotations: '/api/quotations',
      messages: '/api/messages'
    }
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
  if (!dbConnected) {
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

app.get('/api/quotations', async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ created_at: -1 });
    
    // Transform to match the expected format
    const formattedQuotations = quotations.map((q) => ({
      id: q._id.toString(),
      name: q.name,
      email: q.email,
      phone: q.phone,
      company: q.company,
      project_type: q.project_type,
      budget: q.budget,
      timeline: q.timeline,
      description: q.description,
      status: q.status,
      created_at: q.created_at,
      updated_at: q.updated_at,
    }));

    res.json({ success: true, data: formattedQuotations });
  } catch (error) {
    console.error('Error fetching quotations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quotations',
    });
  }
});

app.get('/api/quotations/stats', async (req, res) => {
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
      message: 'Failed to fetch statistics',
    });
  }
});

app.patch('/api/quotations/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await Quotation.findByIdAndUpdate(id, { status });
    
    res.json({
      success: true,
      message: 'Status updated successfully',
    });
  } catch (error) {
    console.error('Error updating quotation status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
    });
  }
});

app.delete('/api/quotations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Quotation.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Quotation deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting quotation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete quotation',
    });
  }
});

// Message endpoints
app.post('/api/messages', async (req, res) => {
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

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ created_at: -1 });
    
    // Transform to match the expected format
    const formattedMessages = messages.map((m) => ({
      id: m._id.toString(),
      name: m.name,
      email: m.email,
      message: m.message,
      status: m.status,
      created_at: m.created_at,
      updated_at: m.updated_at,
    }));

    res.json({ success: true, data: formattedMessages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
    });
  }
});

app.get('/api/messages/stats', async (req, res) => {
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
      message: 'Failed to fetch statistics',
    });
  }
});

app.patch('/api/messages/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await Message.findByIdAndUpdate(id, { status });
    
    res.json({
      success: true,
      message: 'Status updated successfully',
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
    });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});