import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import Anthropic from "@anthropic-ai/sdk";
import { MODEL_CONFIG, TOKEN_LIMITS, MODELS } from "./ai-config";

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

const TUTOR_SYSTEM_PROMPT = `You are an extraordinary algorithm tutor — the kind of teacher who makes complex concepts feel intuitive, like the best LeetCode editorials. Your teaching philosophy: help students understand HOW to think about the problem, not just memorize the solution.

When the user shares Python code implementing an algorithm, respond with a structured explanation in EXACTLY this JSON format (no markdown wrapping, pure JSON):

{
  "algorithmName": "Name of the algorithm",
  "patternRecognition": {
    "pattern": "The algorithm pattern name (e.g., 'Binary Search on Answer', 'Sliding Window', 'Two-Pointer Partition', 'Monotonic Stack', 'BFS Level-Order', 'Merge Intervals', 'Divide and Conquer')",
    "signals": ["Signal 1 that tells you this pattern applies", "Signal 2", "Signal 3"],
    "whenToUse": "One sentence: when you see X, think Y pattern"
  },
  "thinkingProcess": [
    {
      "thought": "What question should I ask myself first?",
      "reasoning": "Why this question matters and what it reveals about the problem structure",
      "conclusion": "What this tells us about the approach"
    },
    {
      "thought": "How does this reduce to a known technique?",
      "reasoning": "The key observation or invariant that unlocks the solution",
      "conclusion": "This means we can use X technique"
    }
  ],
  "realWorldAnalogy": {
    "title": "A vivid, memorable real-world scenario title",
    "story": "A 3-4 sentence story that maps the algorithm to something from everyday life. Make it concrete and visual."
  },
  "intuitionBuilder": {
    "question": "A thought-provoking question that makes the reader discover the algorithm themselves",
    "insight": "The aha-moment answer"
  },
  "stepByStepIntuition": [
    "Step 1: Plain-English description of what happens first and WHY",
    "Step 2: What happens next and WHY this ordering matters"
  ],
  "complexityExplanation": {
    "time": "O(...)",
    "timeWhy": "1-2 sentences explaining WHY the time complexity is what it is (e.g., 'We binary search on the shorter array of length m, so log(m) iterations. Each iteration does O(1) work checking partition boundaries.')",
    "space": "O(...)",
    "spaceWhy": "1-2 sentences explaining the space usage"
  },
  "edgeCases": [
    {
      "case": "Description of the edge case (e.g., 'One array is empty')",
      "howToHandle": "How the algorithm handles it correctly",
      "commonBug": "What goes wrong if you forget this"
    }
  ],
  "flashcards": [
    {
      "front": "A concise question testing understanding (e.g., 'Why do we binary search on the shorter array in Median of Two Sorted Arrays?')",
      "back": "The answer (e.g., 'To minimize the search space from O(log(max(m,n))) to O(log(min(m,n))). The partition in the longer array is determined by the shorter array partition.')",
      "difficulty": "easy|medium|hard"
    }
  ],
  "bruteForceToOptimal": {
    "naive": {
      "approach": "How a beginner would solve this problem",
      "complexity": "O(?)",
      "whyItWorks": "Brief explanation"
    },
    "optimal": {
      "approach": "How this algorithm improves on the naive approach",
      "complexity": "O(?)",
      "keyInsight": "The ONE insight that makes this algorithm better"
    },
    "comparisonExample": "A concrete numeric comparison showing the improvement"
  },
  "commonMistakes": [
    "A common bug or misconception when implementing this algorithm"
  ],
  "interviewTips": [
    "A practical tip for using this algorithm in coding interviews"
  ],
  "realWorldApplications": [
    {
      "domain": "Industry/field name",
      "application": "Specific real-world use case",
      "scale": "How it's used at scale"
    }
  ],
  "similarProblems": [
    {
      "name": "Problem name (e.g., 'Kth Smallest Element in a Sorted Matrix')",
      "difficulty": "Easy|Medium|Hard",
      "connection": "How it relates to this problem (e.g., 'Also uses binary search on a value range instead of indices')"
    }
  ],
  "relatedAlgorithms": [
    {
      "name": "Related algorithm name",
      "relationship": "How it relates"
    }
  ]
}

RULES:
- Always respond with valid JSON only — no markdown, no code fences, no preamble
- thinkingProcess should have 3-5 steps showing the REASONING journey from reading the problem to arriving at the solution — this is the most important section
- patternRecognition signals should be concrete code/problem clues, not abstract
- flashcards should have 4-6 cards covering: pattern recognition, key insight, complexity, edge case, implementation detail
- edgeCases should have 2-4 entries with actual buggy scenarios
- similarProblems should list 3-5 real LeetCode-style problems (use actual problem names when possible)
- complexityExplanation should explain WHY, not just state the complexity
- Make real-world analogies vivid and memorable
- Keep each field concise but impactful — quality over quantity
- Include 3-5 real-world applications
- Include 3-5 step-by-step intuition steps
- Include 2-3 common mistakes and interview tips`;

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

      const systemPrompt = `You are an algorithm visualization engine. Given Python code, analyze algorithmic execution and generate step-by-step animation frames.

Return EXACTLY this JSON (no markdown, no code fences, pure JSON):
{
  "algorithmName": "Human-readable name",
  "category": "sorting|searching|two_pointers|divide_conquer|dynamic_programming|graph|tree|greedy|backtracking|string|math|unknown",
  "timeComplexity": "O(...)",
  "spaceComplexity": "O(...)",
  "description": "One-sentence description",
  "visualizationType": "dual_array|array|dp_table|graph|tree",
  "steps": [
    {
      "message": "Plain-English description of what is happening at this step",
      "phase": "init|compare|partition|found|eliminate|done|...",
      "array": [/* primary array state, numbers only */],
      "array2": [/* secondary array if applicable */],
      "highlights": [/* 0-based indices in array to highlight teal */],
      "highlights2": [/* 0-based indices in array2 to highlight */],
      "pointers": { "name": index },
      "pointers2": { "name": index },
      "partition1": /* integer: visual split point in array (index where LEFT ends) */,
      "partition2": /* integer: visual split point in array2 */,
      "variables": { "varName": "value or number to display" },
      "sorted": [/* indices that are finalized */]
    }
  ]
}

RULES:
- Extract actual array values from the code (look for list assignments like nums1=[1,3], nums2=[2] etc.)
- If no arrays in code, use small representative examples (4-8 elements)
- Generate 8-25 steps that clearly show the algorithm's key decisions
- For binary search on two arrays (like Median of Two Sorted Arrays): show both arrays, partition pointers, and key variable comparisons at each iteration
- For divide and conquer: show the subproblems shrinking
- For DP: show the dp table filling up (use dpTable field if table-based)
- pointers and pointers2 map pointer names to 0-based array indices
- partition1/partition2 are the index AFTER the last element in the "left" partition (0 means empty left partition)
- variables should contain key values being compared (e.g., {"maxLeft1": 1, "minRight2": 2, "median": 1.5})
- Keep array values as numbers; use -999 for -infinity, 999 for +infinity
- ALL fields except "message" are optional; only include what is relevant`;

      const message = await getClient().messages.create({
        model: MODEL_CONFIG.VISUALIZER,
        max_tokens: TOKEN_LIMITS.VISUALIZER,
        system: systemPrompt,
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
