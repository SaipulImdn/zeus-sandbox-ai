import { ChatMessage } from "../../model/huggingface/huggingface.js";
import { chat as hfChatImpl } from "./huggingface/huggingface_impl.js";

export async function chat(messages: ChatMessage[], model?: string) {
  return hfChatImpl(messages, model);
}
