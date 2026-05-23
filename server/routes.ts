import type { Express, Request, Response } from "express";
import type { Server } from "http";
import { complete, ping, detectProvider } from "./ai-client";
import { TUTOR_SYSTEM_PROMPT, VISUALIZER_SYSTEM_PROMPT } from "./prompts";
import {
  listSavedCodes,
  getSavedCode,
  createSavedCode,
  updateSavedCode,
  deleteSavedCode,
} from "./storage";

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

      const text = await complete({
        feature: "TUTOR",
        system: TUTOR_SYSTEM_PROMPT,
        user: userMessage,
      });

      // Parse JSON response — robust extraction
      try {
        const explanation = extractJSON(text);
        return res.json({ explanation });
      } catch (parseErr) {
        console.error(
          "JSON parse error:",
          parseErr,
          "Raw text:",
          text.substring(0, 200),
        );
        // If JSON parsing fails, return raw text as fallback
        return res.json({ explanation: null, rawText: text });
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

      const text = await complete({
        feature: "VISUALIZER",
        system: VISUALIZER_SYSTEM_PROMPT,
        user: `Analyze and generate visualization steps for this Python code:\n\`\`\`python\n${code}\n\`\`\``,
      });

      const result = extractJSON(text);
      return res.json({ result });
    } catch (error: any) {
      console.error("AI Visualize error:", error);
      return res.status(500).json({
        error: "Failed to generate visualization",
        details: error.message,
      });
    }
  });

  // ============ Saved Codes CRUD ============

  // List all saved codes
  app.get("/api/saved-codes", (_req: Request, res: Response) => {
    try {
      const codes = listSavedCodes();
      return res.json({ codes });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // Get a single saved code
  app.get("/api/saved-codes/:id", (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const code = getSavedCode(id);
      if (!code) return res.status(404).json({ error: "Not found" });
      return res.json({ code });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // Create a saved code
  app.post("/api/saved-codes", (req: Request, res: Response) => {
    try {
      const { title, code, algorithmType } = req.body;
      if (!title || !code)
        return res.status(400).json({ error: "Title and code are required" });
      if (typeof title !== "string" || title.length > 200)
        return res
          .status(400)
          .json({ error: "Title must be a string under 200 chars" });
      if (typeof code !== "string" || code.length > 50000)
        return res
          .status(400)
          .json({ error: "Code must be a string under 50k chars" });
      const saved = createSavedCode(title, code, algorithmType);
      return res.status(201).json({ code: saved });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // Update a saved code
  app.put("/api/saved-codes/:id", (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const { title, code, algorithmType } = req.body;
      if (!title || !code)
        return res.status(400).json({ error: "Title and code are required" });
      if (typeof title !== "string" || title.length > 200)
        return res
          .status(400)
          .json({ error: "Title must be a string under 200 chars" });
      if (typeof code !== "string" || code.length > 50000)
        return res
          .status(400)
          .json({ error: "Code must be a string under 50k chars" });
      const updated = updateSavedCode(id, title, code, algorithmType);
      if (!updated) return res.status(404).json({ error: "Not found" });
      return res.json({ code: updated });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // Delete a saved code
  app.delete("/api/saved-codes/:id", (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const deleted = deleteSavedCode(id);
      if (!deleted) return res.status(404).json({ error: "Not found" });
      return res.json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // Health check — test AI connectivity
  app.get("/api/health", async (_req: Request, res: Response) => {
    const provider = detectProvider();
    const status: Record<string, unknown> = {
      server: "ok",
      provider: provider ?? "none",
    };

    if (!provider) {
      return res.status(500).json({ ...status, ai: "no_key" });
    }

    try {
      const result = await ping();
      status.ai = "ok";
      status.response = result.response;
      return res.json(status);
    } catch (err: any) {
      status.ai = "error";
      status.error = err.message;
      return res.status(500).json(status);
    }
  });

  return httpServer;
}
