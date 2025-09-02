// Vercel Serverless Function for Claude API Proxy
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported'
    });
  }

  try {
    // Get API key from request headers
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({ 
        error: 'API key required',
        message: 'Please provide your Claude API key in the x-api-key header'
      });
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Make request to Claude API
    const response = await anthropic.messages.create({
      model: req.body.model || 'claude-3-haiku-20240307',
      max_tokens: req.body.max_tokens || 1000,
      messages: req.body.messages
    });

    // Return successful response
    res.status(200).json(response);

  } catch (error) {
    console.error('Claude API Error:', error);
    
    // Handle specific error types
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

    // Generic server error
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to process request. Please try again.'
    });
  }
}