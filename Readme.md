# Zeus AI Sandbox

A CLI tool for interacting with AI models from Hugging Face directly in the terminal, with optional API server mode.

## Features

- **CLI Mode**: Interactive REPL for chatting with AI models
- **API Mode**: REST API server for chat completions
- **Hugging Face Integration**: Uses Hugging Face chat completion endpoints
- **TypeScript**: Fully typed codebase

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file with your Hugging Face configuration:

```env
# Hugging Face API token and endpoint
HF_TOKEN=your_huggingface_token_here
HF_CHAT_ENDPOINT=https://router.huggingface.co/novita/v3/openai/chat/completions
HF_MODEL=minimaxai/minimax-m1-80k

# Server configuration
PORT=3000

# Mode selection (true for API server, false for CLI)
USE_API=false
```

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
└── constant/
    └── constant.ts         # Application constants
```

## Response Codes

- `RC: "00"` - Success
- `RC: "01"` - Bad request
- `RC: "99"` - Error

## Requirements

- Node.js 18+
- Valid Hugging Face API token
- TypeScript