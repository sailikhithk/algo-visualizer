import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import Anthropic from "@anthropic-ai/sdk";
import { MODEL_CONFIG, TOKEN_LIMITS } from "./ai-config";
import { TUTOR_SYSTEM_PROMPT, VISUALIZER_SYSTEM_PROMPT } from "./prompts";

// Lazy-init: don't create at import time (dotenv may not have loaded yet)
let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY is not set. Add it to .env or export it.",
      );
    }
    // Explicitly set baseURL to avoid inheriting ANTHROPIC_BASE_URL from shell
    // (e.g. Ollama's localhost:11434)
    _client = new Anthropic({
      apiKey,
      baseURL: "https://api.anthropic.com",
    });
    console.log(
      `[ai] Anthropic client ready (key: ${apiKey.slice(0, 12)}..., models: tutor=${MODEL_CONFIG.TUTOR}, viz=${MODEL_CONFIG.VISUALIZER})`,
    );
  }
  return _client;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  /** Extract and parse JSON from AI response text, handling code fences and surrounding text */
  function extractJSON(raw: string): any {
    let text = raw.trim();
    // Strip markdown code fences (```json ... ``` or ``` ... ```)
    text = text
      .replace(/^```(?:json|JSON)?\s*\n?/m, "")
      .replace(/\n?```\s*$/m, "");
    // Find the outermost { ... } block
    const startIdx = text.indexOf("{");
    const endIdx = text.lastIndexOf("}");
    if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
      throw new Error("No JSON object found in response");
    }
    return JSON.parse(text.slice(startIdx, endIdx + 1));
  }

  // AI Tutor endpoint — generates rich algorithm explanation
  app.post("/api/explain", async (req: Request, res: Response) => {
    try {
      const { code, algorithmName, category } = req.body;

      if (!code) {
        return res.status(400).json({ error: "Code is required" });
      }

      const userMessage = `Here is Python code implementing ${algorithmName || "an algorithm"} (category: ${category || "unknown"}):

\`\`\`python
${code}
\`\`\`

Analyze this code and provide a comprehensive teaching explanation.`;

      const message = await getClient().messages.create({
        model: MODEL_CONFIG.TUTOR,
        max_tokens: TOKEN_LIMITS.TUTOR,
        system: TUTOR_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      });

      // Extract text content
      const textBlock = message.content.find((b: any) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        return res.status(500).json({ error: "No text response from AI" });
      }

      // Parse JSON response — robust extraction
      try {
        const explanation = extractJSON(textBlock.text);
        return res.json({ explanation });
      } catch (parseErr) {
        console.error(
          "JSON parse error:",
          parseErr,
          "Raw text:",
          textBlock.text.substring(0, 200),
        );
        // If JSON parsing fails, return raw text as fallback
        return res.json({ explanation: null, rawText: textBlock.text });
      }
    } catch (error: any) {
      console.error("AI Tutor error:", error);
      return res.status(500).json({
        error: "Failed to generate explanation",
        details: error.message,
      });
    }
  });

  // AI Visualization endpoint — generates step-by-step animation frames for any algorithm
  app.post("/api/visualize", async (req: Request, res: Response) => {
    try {
      const { code } = req.body;
      if (!code) return res.status(400).json({ error: "Code is required" });

      const message = await getClient().messages.create({
        model: MODEL_CONFIG.VISUALIZER,
        max_tokens: TOKEN_LIMITS.VISUALIZER,
        system: VISUALIZER_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Analyze and generate visualization steps for this Python code:\n\`\`\`python\n${code}\n\`\`\``,
          },
        ],
      });

      const textBlock = message.content.find((b: any) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        return res.status(500).json({ error: "No response from AI" });
      }

      const result = extractJSON(textBlock.text);
      return res.json({ result });
    } catch (error: any) {
      console.error("AI Visualize error:", error);
      return res.status(500).json({
        error: "Failed to generate visualization",
        details: error.message,
      });
    }
  });

  // Health check — test AI connectivity
  app.get("/api/health", async (_req: Request, res: Response) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const status: Record<string, unknown> = {
      server: "ok",
      anthropicKey: apiKey ? `${apiKey.slice(0, 12)}...` : "MISSING",
      models: MODEL_CONFIG,
    };

    if (!apiKey) {
      return res.status(500).json({ ...status, ai: "no_key" });
    }

    try {
      const msg = await getClient().messages.create({
        model: MODEL_CONFIG.VISUALIZER,
        max_tokens: 32,
        messages: [{ role: "user", content: "Say 'ok'" }],
      });
      const text = msg.content.find((b: any) => b.type === "text");
      status.ai = "ok";
      status.response =
        text?.type === "text" ? text.text.slice(0, 50) : "no text";
      return res.json(status);
    } catch (err: any) {
      status.ai = "error";
      status.error = err.message;
      return res.status(500).json(status);
    }
  });

  return httpServer;
}
