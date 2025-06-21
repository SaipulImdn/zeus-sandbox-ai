# Zeus AI Sandbox

A CLI tool for interacting with AI models from Hugging Face directly in the terminal, with optional API server mode.

## Features

- **CLI Mode**: Interactive REPL for chatting with AI models
- **API Mode**: REST API server for chat completions
- **Hugging Face Integration**: Uses Hugging Face chat completion endpoints
- **TypeScript**: Fully typed codebase
- **Rate Limiting**: Built-in rate limiting middleware for API protection

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file with your Hugging Face configuration:

```env
# Hugging Face API token and endpoint
HF_TOKEN=
HF_CHAT_ENDPOINT=
HF_MODEL=

# Server configuration
PORT=3000

# Mode selection (true for API server, false for CLI)
USE_API=false
```

**Note**: Currently using hardcoded values in the implementation for testing purposes.

## Usage

### CLI Mode (Default)

Start the interactive terminal chat:

```bash
npm start
```

This will launch a REPL where you can type messages and get AI responses directly in your terminal.

### API Server Mode

Set `USE_API=true` in your `.env` file, then start the server:

```bash
npm start
```

The API will be available at `http://localhost:3000/api/v1/ask`

#### API Endpoint

**POST** `/api/v1/ask`

Request body:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ],
  "input": "What's the weather like?"
}
```

Response:
```json
{
  "RC": "00",
  "RD": "Success",
  "data": {
    "reply": "AI response here",
    "messages": [
      // Updated conversation history
    ]
  }
}
```

## Rate Limiting

The API includes rate limiting to prevent abuse:
- **Window**: 60 seconds per IP address
- **Error Code**: RC: "88" when rate limit exceeded
- **Response**: Returns wait time in seconds

## Project Structure

```
src/
├── main.ts                 # Entry point
├── cli/
│   └── repl.ts             # CLI REPL implementation
├── routes/
│   └── routes.ts           # Express API routes
├── usecase/
│   ├── chatsession_usecase.ts
│   └── chatsessionuse/
│       └── chatsession_usecase_impl.ts
├── repository/
│   └── externalapi/
│       ├── huggingface.ts
│       └── huggingface/
│           └── huggingface_impl.ts
├── model/
│   └── huggingface/
│       └── huggingface.ts  # Type definitions
├── middleware/
│   └── rateLimitMiddleware.ts # Rate limiting middleware
├── utils/
│   └── logger.ts           # Logging utilities
└── constant/
    └── constant.ts         # Application constants
```

## Response Codes

- `RC: "00"` - Success
- `RC: "01"` - Bad request
- `RC: "88"` - Rate limit exceeded
- `RC: "99"` - Error

## Current Configuration

The application is currently configured to use:
- **Endpoint**: ``
- **Model**: ``
- **Token**: Hardcoded for testing (consider moving to environment variables for production)

## Requirements

- Node.js 18+
- Valid Hugging Face API token
- TypeScript

## Development Notes

- Logging includes detailed request/response information for debugging
- Rate limiting prevents excessive API calls
- Error handling provides detailed feedback for troubleshooting
- Supports both streaming and non-streaming responses (currently using non-streaming)