import express, { Request, Response } from "express";
import { rateLimitMiddleware } from "../middleware/rateLimitMiddleware.js";
import { ChatMessage } from "../model/huggingface/huggingface.js";
import { runChatAndPrint } from "../usecase/chatsession_usecase.js";

const router = express.Router();

router.get("/healthz", (req: Request, res: Response): void => {
  const uptime = process.uptime();
  const timestamp = new Date().toISOString();
  
  try {
    const memoryUsage = process.memoryUsage();
    const isHealthy = memoryUsage.heapUsed < 500 * 1024 * 1024; // Less than 500MB
    
    if (isHealthy) {
      res.status(200).json({
        status: "yes",
        timestamp,
        uptime: `${Math.floor(uptime)}s`,
        memory: {
          used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
        }
      });
    } else {
      res.status(503).json({
        status: "no",
        timestamp,
        uptime: `${Math.floor(uptime)}s`,
        reason: "High memory usage",
        memory: {
          used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
        }
      });
    }
  } catch (err: any) {
    res.status(503).json({
      status: "no",
      timestamp,
      reason: "Health check failed",
      error: err.message
    });
  }
});

router.post("/ask", rateLimitMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { messages, input } = req.body as {
    messages: ChatMessage[];
    input: string;
  };

  if (!input || !Array.isArray(messages)) {
    res.status(400).json({
      RC: "01",
      RD: "Bad request. 'messages' must be array and 'input' required.",
    });
    return;
  }

  try {
    const updatedMessages = await runChatAndPrint(messages, input);
    const reply = updatedMessages.at(-1)?.content ?? "(No response)";

    res.status(200).json({
      RC: "00",
      RD: "Success",
      data: {
        reply,
        messages: updatedMessages,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      RC: "99",
      RD: err.message ?? "Internal error",
    });
  }
});

export default router;