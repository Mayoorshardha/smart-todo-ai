import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Smart Todo AI Server is running',
    timestamp: new Date().toISOString()
  });
});

// Claude API proxy endpoint
app.post('/api/claude', async (req, res) => {
  try {
    // Get API key from request headers
    const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
    
    if (!apiKey) {
      return res.status(401).json({ 
        error: 'API key required',
        message: 'Please provide your Claude API key in the x-api-key header'
      });
    }

    // Initialize Anthropic client with the provided API key
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Forward the request to Claude API
    const response = await anthropic.messages.create({
      model: req.body.model || 'claude-3-haiku-20240307',
      max_tokens: req.body.max_tokens || 400,
      messages: req.body.messages
    });

    // Return the response
    res.json(response);

  } catch (error) {
    console.error('Claude API Error:', error);
    
    // Handle different types of errors
    if (error.status === 401) {
      return res.status(401).json({
        error: 'Invalid API key',
        message: 'Please check your Claude API key is correct'
      });
    }
    
    if (error.status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.'
      });
    }

    if (error.status === 400) {
      return res.status(400).json({
        error: 'Bad request',
        message: error.message || 'Invalid request format'
      });
    }

    // Generic error response
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to process request. Please try again.'
    });
  }
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Smart Todo AI Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Claude API proxy: http://localhost:${PORT}/api/claude`);
  console.log('');
  console.log('💡 Make sure to set your Claude API key in the frontend app');
});