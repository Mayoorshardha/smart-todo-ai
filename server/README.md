# Smart Todo AI - Backend Server

This is the backend proxy server for the Smart Todo AI application. It handles CORS issues and securely proxies requests to the Anthropic Claude API.

## Features

- **CORS Proxy**: Resolves browser CORS restrictions when calling Anthropic API
- **Secure API Handling**: Uses official Anthropic SDK for reliable API communication
- **Error Handling**: Proper error responses for different API scenarios
- **Health Checks**: Monitor server status
- **Development Ready**: Hot reload support with `--watch` flag

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the server**
   ```bash
   npm start
   ```

3. **For development (with auto-reload)**
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:3001`

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and timestamp.

### Claude API Proxy
```
POST /api/claude
```
Proxies requests to Anthropic Claude API.

**Headers:**
- `x-api-key`: Your Claude API key
- `Content-Type`: application/json

**Body:** Standard Anthropic API request format

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

- `PORT`: Server port (default: 3001)
- `CLAUDE_API_KEY`: Optional default API key (not recommended)

## Security Notes

- API keys are passed from frontend via headers (more secure)
- Server doesn't store API keys permanently
- CORS is configured for local development only
- For production, update CORS origins in `server.js`

## Error Handling

The server handles common API errors:
- `401`: Invalid API key
- `429`: Rate limit exceeded  
- `400`: Bad request format
- `500`: Server errors

All errors return JSON with `error` and `message` fields.