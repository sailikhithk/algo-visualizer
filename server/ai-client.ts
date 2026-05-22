// Provider-agnostic AI client.
//
// Exposes one `complete()` function that works with DeepSeek, OpenRouter, Groq, or Anthropic.
// Routes call this and don't care which provider is active.

import Anthropic from "@anthropic-ai/sdk";
import Groq from "groq-sdk";
import OpenAI from "openai";
import { detectProvider, modelFor, TOKEN_LIMITS } from "./ai-config";

export interface CompleteArgs {
  feature: "TUTOR" | "VISUALIZER";
  system: string;
  user: string;
}

let _anthropic: Anthropic | null = null;
let _groq: Groq | null = null;
let _openrouter: OpenAI | null = null;
let _deepseek: OpenAI | null = null;

function getAnthropic(): Anthropic {
  if (_anthropic) return _anthropic;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  // Avoid inheriting ANTHROPIC_BASE_URL from shell (e.g. Ollama localhost:11434)
  _anthropic = new Anthropic({ apiKey, baseURL: "https://api.anthropic.com" });
  console.log(`[ai] Anthropic ready (key: ${apiKey.slice(0, 12)}...)`);
  return _anthropic;
}

function getGroq(): Groq {
  if (_groq) return _groq;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");
  _groq = new Groq({ apiKey });
  console.log(`[ai] Groq ready (key: ${apiKey.slice(0, 12)}...)`);
  return _groq;
}

function getOpenRouter(): OpenAI {
  if (_openrouter) return _openrouter;
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");
  _openrouter = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });
  console.log(`[ai] OpenRouter ready (key: ${apiKey.slice(0, 12)}...)`);
  return _openrouter;
}

function getDeepSeek(): OpenAI {
  if (_deepseek) return _deepseek;
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY is not set");
  _deepseek = new OpenAI({
    apiKey,
    baseURL: "https://api.deepseek.com",
  });
  console.log(`[ai] DeepSeek ready (key: ${apiKey.slice(0, 12)}...)`);
  return _deepseek;
}

/**
 * Call the configured AI provider. Returns the assistant's text response.
 * Throws if no provider is configured or the call fails.
 * Includes retry logic for rate limits (429 errors).
 */
export async function complete(args: CompleteArgs): Promise<string> {
  const provider = detectProvider();
  if (!provider) {
    throw new Error(
      "No AI provider configured. Set DEEPSEEK_API_KEY, OPENROUTER_API_KEY, GROQ_API_KEY, or ANTHROPIC_API_KEY in .env",
    );
  }
  const model = modelFor(args.feature);
  const maxTokens = TOKEN_LIMITS[args.feature];

  // Retry logic for rate limits
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (provider === "deepseek") {
        const client = getDeepSeek();
        const completion = await client.chat.completions.create({
          model,
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: args.system },
            { role: "user", content: args.user },
          ],
        });
        const text = completion.choices[0]?.message?.content ?? "";
        if (!text) throw new Error("DeepSeek returned empty response");
        return text;
      }

      if (provider === "openrouter") {
        const client = getOpenRouter();
        const completion = await client.chat.completions.create({
          model,
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: args.system },
            { role: "user", content: args.user },
          ],
        });
        const text = completion.choices[0]?.message?.content ?? "";
        if (!text) throw new Error("OpenRouter returned empty response");
        return text;
      }

      if (provider === "groq") {
        const client = getGroq();
        const completion = await client.chat.completions.create({
          model,
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: args.system },
            { role: "user", content: args.user },
          ],
        });
        const text = completion.choices[0]?.message?.content ?? "";
        if (!text) throw new Error("Groq returned empty response");
        return text;
      }

      // Anthropic
      const client = getAnthropic();
      const message = await client.messages.create({
        model,
        max_tokens: maxTokens,
        system: args.system,
        messages: [{ role: "user", content: args.user }],
      });
      const block = message.content.find((b: any) => b.type === "text");
      if (!block || block.type !== "text") {
        throw new Error("Anthropic returned no text block");
      }
      return block.text;
    } catch (error: any) {
      // Retry on rate limit (429, 413) or server errors (5xx)
      const isRetryable =
        error?.status === 429 ||
        error?.status === 413 ||
        (error?.status >= 500 && error?.status < 600);

      if (isRetryable && attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        console.log(
          `[ai] Rate limit or server error (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${Math.round(delay)}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }

  throw new Error("Max retries exceeded");
}

/** Lightweight health probe used by /api/health. */
export async function ping(): Promise<{ provider: string; response: string }> {
  const provider = detectProvider();
  if (!provider) throw new Error("No AI provider configured");
  const response = await complete({
    feature: "VISUALIZER",
    system: "Reply with exactly: ok",
    user: "ping",
  });
  return { provider, response: response.slice(0, 50) };
}

export { detectProvider };
