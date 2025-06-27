# Zeus AI Sandbox

A modern AI playground featuring CLI chat, web interface, and REST API server with load balancing across multiple Hugging Face providers.

## Features

- **🖥️ CLI Mode**: Interactive REPL for terminal-based AI conversations
- **🌐 Web Interface**: Modern web playground with real-time chat UI
- **🔌 REST API**: Full-featured API server with health monitoring
- **⚖️ Load Balancing**: Weighted distribution across multiple AI providers
- **📊 Health Monitoring**: Real-time system health dashboard with metrics
- **🛡️ Rate Limiting**: Built-in protection against API abuse
- **📱 Responsive Design**: Mobile-friendly web interface
- **⚡ Real-time Updates**: Live health monitoring with charts and metrics
- **🎨 Modern UI**: Glassmorphism design with smooth animations
- **🔧 TypeScript**: Fully typed codebase for better development experience

## Installation

```bash
npm install
```

## Configuration

### Option 1: JSON Configuration (Recommended)

Create a `config.json` file in the project root:

```json
{
  "huggingface": {
    "providers": [
      {
        "id": 1,
        "token": "your_hf_token_here",
        "endpoint": "https://router.huggingface.co/featherless-ai/v1/chat/completions",
        "model": "mistralai/Magistral-Small-2506",
        "percentage": 70
      },
      {
        "id": 2,
        "token": "your_hf_token_here",
        "endpoint": "https://router.huggingface.co/nebius/v1/chat/completions",
        "model": "deepseek-ai/DeepSeek-R1-0528",
        "percentage": 30
      }
    ]
  },
  "server": {
    "port": 3000,
    "useApi": true
  }
}
```

### Option 2: Environment Variables

Create a `.env` file:

```env
# Multiple Provider Configuration
HF_TOKEN_1=your_hf_token_here
HF_CHAT_ENDPOINT_1=https://router.huggingface.co/featherless-ai/v1/chat/completions
HF_MODEL_1=mistralai/Magistral-Small-2506
PERCENTAGE_1=70

HF_TOKEN_2=your_hf_token_here
HF_CHAT_ENDPOINT_2=https://router.huggingface.co/nebius/v1/chat/completions
HF_MODEL_2=deepseek-ai/DeepSeek-R1-0528
PERCENTAGE_2=30

# Server Configuration
PORT=3000
USE_API=true
NODE_ENV=development
HOST=localhost
```

## Usage

### Web Interface (Recommended)

Start the server and open the web playground:

```bash
npm start
```

Then open your browser to:
- **Playground**: `http://localhost:3000/`
- **Health Monitor**: `http://localhost:3000/interface/healthz.html`

### CLI Mode

Set `USE_API=false` in your configuration, then:

```bash
npm start
```

This launches an interactive terminal chat interface.

### API Server Mode

The API server runs automatically when `USE_API=true`. Available endpoints:

## API Endpoints

### Chat Completion
**POST** `/api/v1/ask`

Request:
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

### Health Check
**GET** `/api/v1/healthz`

Response:
```json
{
  "status": "yes",
  "timestamp": "2025-06-23T07:03:29.927Z",
  "uptime": "12s",
  "memory": {
    "used": "9MB",
    "total": "11MB"
  }
}
```

## Web Interface Features

### 🎮 Playground (`/`)
- Modern chat interface with Zeus AI branding
- Real-time message streaming
- Sidebar with model selection and session stats
- Mobile-responsive design
- Smooth animations and transitions

### 📊 Health Monitor (`/interface/healthz.html`)
- Real-time system metrics with live charts
- Memory usage visualization with progress bars
- Response time tracking
- Connection duration and update counters
- Grafana-style dashboard design
- Auto-updating every 2 seconds

### 🚫 404 Page (`/not-found`)
- Custom branded 404 page
- Interactive sparkle effects
- Auto-redirect to playground
- Consistent design theme

## Load Balancing

The system automatically distributes requests across multiple providers based on weighted percentages:

```json
{
  "providers": [
    {
      "percentage": 70  // 70% of requests
    },
    {
      "percentage": 30  // 30% of requests  
    }
  ]
}
```

## Rate Limiting

API protection with configurable limits:
- **Default**: 100 requests per 15 minutes per IP
- **Error Response**: RC "88" when limit exceeded
- **Headers**: `X-RateLimit-*` headers included

## Project Structure

```
src/
├── main.ts                 # Application entry point
├── config/
│   └── config.ts           # Configuration management
├── cli/
│   └── repl.ts             # CLI REPL implementation
├── routes/
│   └── routes.ts           # Express API routes
├── interface/              # Web UI files
│   ├── sandbox.html        # Main playground interface
│   ├── healthz.html        # Health monitoring dashboard
│   └── not-found.html      # Custom 404 page
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
│   └── rateLimitMiddleware.ts
├── utils/
│   └── logger.ts           # Logging utilities
└── constant/
    └── constant.ts         # Application constants
```

## Response Codes

| Code | Meaning |
|------|---------|
| `00` | Success |
| `01` | Bad request |
| `88` | Rate limit exceeded |
| `99` | Internal error |

## Environment Detection

The application automatically detects environment and adjusts URLs:

**Development:**
```
API server ready at http://localhost:3000
Try UI at http://localhost:3000/interface/sandbox.html
```

**Production:**
```
API server ready at https://your-domain.com
Try UI at https://your-domain.com/interface/sandbox.html
Health check: https://your-domain.com/api/v1/healthz
```

## Provider Management

Built-in functions for managing multiple AI providers:

```typescript
import { getRandomProvider, getProviderById } from './config/config.js';

// Get weighted random provider
const provider = getRandomProvider();

// Get specific provider
const provider1 = getProviderById(1);
```

## Health Monitoring Features

- **Real-time Metrics**: Memory usage, uptime, response times
- **Live Charts**: Historical data visualization
- **Connection Stats**: Update counters and connection duration  
- **Health Score**: Calculated system health percentage
- **Visual Indicators**: Color-coded status indicators
- **Auto-refresh**: Updates every 2 seconds

## Requirements

- **Node.js**: 18+ 
- **TypeScript**: Latest version
- **Valid Hugging Face API Token**: Required for AI functionality
- **Modern Browser**: For web interface (Chrome, Firefox, Safari, Edge)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure `HOST` environment variable
3. Use HTTPS in production
4. Set appropriate rate limits
5. Monitor health endpoint

## License

MIT License - See LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Zeus AI Sandbox** - A modern, full-featured AI playground for developers and AI enthusiasts.