import { ChatMessage } from "../model/huggingface/huggingface.js";
import { runChatAndPrint as impl } from "../usecase/chatsessionuse/chatsession_usecase_impl.js";

export async function runChatAndPrint(
  messages: ChatMessage[],
  userInput: string
): Promise<ChatMessage[]> {
  return impl(messages, userInput);
}
