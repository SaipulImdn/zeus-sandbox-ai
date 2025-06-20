import readline from "readline";
import { ChatMessage } from "../model/huggingface/huggingface.js";
import { runChatAndPrint } from "../usecase/chatsession_usecase.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let messages: ChatMessage[] = [];

export const startRepl = () => {
  console.log("\n AI Sandbox ready. Type your message:\n");

  const ask = () => {
    rl.question("You: ", async (input: string) => {
      try {
        messages = await runChatAndPrint(messages, input);
      } catch (err) {
        console.error("Error:", err);
      }

      ask();
    });
  };

  ask();
};
