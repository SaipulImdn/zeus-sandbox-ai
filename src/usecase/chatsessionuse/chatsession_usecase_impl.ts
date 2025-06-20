import { ChatMessage } from "../../model/huggingface/huggingface.js";
import { chat } from "../../repository/externalapi/huggingface.js";

export async function runChatAndPrint(
  messages: ChatMessage[],
  userInput: string
): Promise<ChatMessage[]> {
  messages.push({ role: "user", content: userInput });

  try {
    const response = await chat(messages) as any;
    const reply = response.choices?.[0]?.message?.content;

    if (!reply) {
      console.log(`AI: (No response)\n`);
      console.log("RC: 99");
      console.log("RD: AI returned empty response\n");
      return messages;
    }

    messages.push({ role: "assistant", content: reply });
    console.log(`AI: ${reply}\n`);
    console.log("RC: 00");
    console.log("RD: Success\n");

    return messages;
  } catch (err: any) {
    console.log("AI: (Error)");
    console.log("RC: 99");
    console.log(`RD: ${err.message || "Unknown error occurred"}\n`);
    return messages;
  }
}
