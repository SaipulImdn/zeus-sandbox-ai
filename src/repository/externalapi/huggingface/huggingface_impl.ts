import fetch from "node-fetch";
import { CONTENT_TYPE_JSON } from "../../../constant/constant.js";
import { ChatMessage } from "../../../model/huggingface/huggingface.js";
import { logError, logInfo, logWarn } from "../../../utils/logger.js";

// Load environment variables
const HF_CONFIGS = [
  {
    token: process.env.HF_TOKEN_1,
    endpoint: process.env.HF_CHAT_ENDPOINT_1,
    model: process.env.HF_MODEL_1,
    frequency: parseInt(process.env.PERCENTAGE_1 || "1", 10),
  },
  {
    token: process.env.HF_TOKEN_2,
    endpoint: process.env.HF_CHAT_ENDPOINT_2,
    model: process.env.HF_MODEL_2,
    frequency: parseInt(process.env.PERCENTAGE_2 || "1", 10),
  },
];

let currentConfigIndex = 0;
let currentCount = 0;

function getNextConfig() {
  const config = HF_CONFIGS[currentConfigIndex];
  currentCount++;

  if (currentCount >= config.frequency) {
    currentConfigIndex = (currentConfigIndex + 1) % HF_CONFIGS.length;
    currentCount = 0;
  }

  return config;
}

export async function chat(messages: ChatMessage[], modelOverride?: string) {
  const { token, endpoint, model } = getNextConfig();

  const finalModel = modelOverride || model;

  logInfo("Preparing chat request...");
  logInfo("Using HF_MODEL:", finalModel);
  logInfo("Messages count:", messages.length);

  if (!token || !endpoint || !finalModel) {
    const errorMsg = "Missing environment variables for HF config";
    logError(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const start = Date.now();
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": CONTENT_TYPE_JSON,
      },
      body: JSON.stringify({
        messages,
        model: finalModel,
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
