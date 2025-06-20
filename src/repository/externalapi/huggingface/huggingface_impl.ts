import dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";
import { CONTENT_TYPE_JSON } from "../../../constant/constant.js";
import { ChatMessage } from "../../../model/huggingface/huggingface.js";

export async function chat(messages: ChatMessage[], model?: string) {
  const hfToken = process.env.HF_TOKEN;
  const HF_CHAT_ENDPOINT = process.env.HF_CHAT_ENDPOINT;
  const HF_MODEL = process.env.HF_MODEL;

  if (!hfToken || !HF_CHAT_ENDPOINT || !(model || HF_MODEL)) {
    return {
      RC: "99",
      RD: "Missing environment variables: HF_TOKEN, HF_CHAT_ENDPOINT, or HF_MODEL",
      data: null,
    };
  }

  try {
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

    if (!res.ok) {
      const errorText = await res.text();
      return {
        RC: "99",
        RD: `HTTP ${res.status}: ${errorText}`,
        data: null,
      };
    }

    const data = await res.json();
    return {
      RC: "00",
      RD: "Success",
      data,
    };
  } catch (err: any) {
    return {
      RC: "99",
      RD: `Request failed: ${err.message}`,
      data: null,
    };
  }
}
