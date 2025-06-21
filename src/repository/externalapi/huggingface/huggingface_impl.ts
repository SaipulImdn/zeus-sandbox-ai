import fetch from "node-fetch";
import { CONTENT_TYPE_JSON } from "../../../constant/constant.js";
import { ChatMessage } from "../../../model/huggingface/huggingface.js";
import { logError, logInfo, logWarn } from "../../../utils/logger.js";

export async function chat(messages: ChatMessage[], model?: string) {
  const hfToken = process.env.HF_TOKEN;
  const HF_CHAT_ENDPOINT = process.env.HF_CHAT_ENDPOINT;
  const HF_MODEL = process.env.HF_MODEL;

  logInfo("Preparing chat request...");
  logInfo("Model:", model || HF_MODEL);
  logInfo("Messages count:", messages.length);

  if (!hfToken || !HF_CHAT_ENDPOINT || !(model || HF_MODEL)) {
    const errorMsg = "Missing environment variables: HF_TOKEN, HF_CHAT_ENDPOINT, or HF_MODEL";
    logError(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const start = Date.now();
    const res = await fetch(HF_CHAT_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": CONTENT_TYPE_JSON,
      },
      body: JSON.stringify({
        messages,
        model: model || HF_MODEL,
        stream: false,
      }),
    });
    const duration = Date.now() - start;
    logInfo("API response time:", `${duration}ms`);

    if (!res.ok) {
      const errorText = await res.text();
      logWarn(`HF response not OK - HTTP ${res.status}:`, errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    logInfo("HF API call success");
    logInfo("API Response structure:", JSON.stringify(data, null, 2));
    
    return data;
  } catch (err: any) {
    logError("HF API call failed:", err.message);
    throw err;
  }
}
