import express, { Request, Response } from "express";
import { ChatMessage } from "../model/huggingface/huggingface.js";
import { runChatAndPrint } from "../usecase/chatsession_usecase.js";

const router = express.Router();

router.post("/ask", async (req: Request, res: Response): Promise<void> => {
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