import { ChatMessage } from "../../model/huggingface/huggingface.js";
import { chat } from "../../repository/externalapi/huggingface.js";
import { logError, logInfo, logWarn } from "../../utils/logger.js";

export async function runChatAndPrint(
  messages: ChatMessage[],
  userInput: string
): Promise<ChatMessage[]> {
  logInfo("========== CHAT SESSION START ==========");
  logInfo("User Input:", userInput);
  logInfo("Total messages before:", messages.length);

  messages.push({ role: "user", content: userInput });

  const start = Date.now();
  try {
    const response = await chat(messages) as any;
    const duration = Date.now() - start;

    logInfo("AI Request Duration:", `${duration}ms`);

    const reply = response.choices?.[0]?.message?.content;

    if (!reply) {
      logWarn("AI: (No response)");
      logWarn("RC: 99");
      logWarn("RD: AI returned empty response\n");
      return messages;
    }

    messages.push({ role: "assistant", content: reply });

    logInfo("AI:", reply);
    logInfo("RC: 00");
    logInfo("RD: Success");
    logInfo("Total messages after:", messages.length);
    logInfo("========== CHAT SESSION END ==========\n");

    return messages;
  } catch (err: any) {
    logError("AI: (Error)");
    logError("RC: 99");
    logError("RD:", err.message || "Unknown error occurred");
    logError("========== CHAT SESSION END ==========\n");

    return messages;
  }
}
