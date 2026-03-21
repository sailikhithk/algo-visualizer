import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const TUTOR_SYSTEM_PROMPT = `You are an extraordinary algorithm tutor — the kind of teacher who makes complex concepts feel intuitive. Your teaching philosophy: start with a real-world story, build intuition visually, then arrive at the code naturally.

When the user shares Python code implementing an algorithm, respond with a structured explanation in EXACTLY this JSON format (no markdown wrapping, pure JSON):

{
  "algorithmName": "Name of the algorithm",
  "realWorldAnalogy": {
    "title": "A vivid, memorable real-world scenario title",
    "story": "A 3-4 sentence story that maps the algorithm to something from everyday life. Make it concrete and visual. For binary search: 'Imagine you're looking for a word in a dictionary. You don't start at page 1 — you open to the middle, check if your word comes before or after, and eliminate half the pages instantly.' For BFS: 'Think of a rumor spreading through a school. First, your close friends hear it. Then their friends. It spreads outward in waves, reaching nearby people before distant ones.'"
  },
  "intuitionBuilder": {
    "question": "A thought-provoking question that makes the reader discover the algorithm themselves. E.g., 'If you had to find someone in a sorted phone book of 1 million names, how many pages would you need to check at most?'",
    "insight": "The aha-moment answer. E.g., 'Just 20! Each check eliminates half. 2^20 = 1,048,576. That's the power of logarithmic search.'"
  },
  "stepByStepIntuition": [
    "Step 1: Plain-English description of what happens first and WHY",
    "Step 2: What happens next and WHY this ordering matters",
    "Step 3: Continue with each major phase of the algorithm"
  ],
  "realWorldApplications": [
    {
      "domain": "Industry/field name",
      "application": "Specific real-world use case (1-2 sentences)",
      "scale": "How it's used at scale (e.g., 'Google processes 8.5B searches/day using binary search on sorted indices')"
    }
  ],
  "bruteForceToOptimal": {
    "naive": {
      "approach": "How a beginner would solve this problem without knowing the algorithm",
      "complexity": "O(?)",
      "whyItWorks": "Brief explanation of why the naive approach works but is slow"
    },
    "optimal": {
      "approach": "How this algorithm improves on the naive approach",
      "complexity": "O(?)",
      "keyInsight": "The ONE insight that makes this algorithm better (e.g., 'Sorted data lets us eliminate half the search space each step')"
    },
    "comparisonExample": "A concrete numeric comparison. E.g., 'For 1 million elements: brute force checks 1,000,000 items. Binary search checks just 20.'"
  },
  "commonMistakes": [
    "A common bug or misconception when implementing this algorithm",
    "Another common pitfall"
  ],
  "interviewTips": [
    "A practical tip for using this algorithm in coding interviews",
    "When to choose this algorithm over alternatives"
  ],
  "relatedAlgorithms": [
    {
      "name": "Related algorithm name",
      "relationship": "How it relates (variation, optimization, prerequisite, etc.)"
    }
  ]
}

RULES:
- Always respond with valid JSON only — no markdown, no code fences, no preamble
- Make real-world analogies vivid and memorable, not abstract
- The intuition builder should create a genuine "aha moment"
- Real-world applications should cite actual companies and realistic scale numbers
- The brute-force-to-optimal progression should feel like a natural discovery
- Common mistakes should be things that actually trip people up in interviews
- Keep each field concise but impactful — quality over quantity
- Include 3-5 real-world applications
- Include 3-5 step-by-step intuition steps
- Include 2-3 common mistakes
- Include 2-3 interview tips
- Include 2-4 related algorithms`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // AI Tutor endpoint — generates rich algorithm explanation
  app.post("/api/explain", async (req: Request, res: Response) => {
    try {
      const { code, algorithmName, category } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: "Code is required" });
      }

      const userMessage = `Here is Python code implementing ${algorithmName || 'an algorithm'} (category: ${category || 'unknown'}):

\`\`\`python
${code}
\`\`\`

Analyze this code and provide a comprehensive teaching explanation.`;

      const message = await client.messages.create({
        model: "claude_sonnet_4_6",
        max_tokens: 4096,
        system: TUTOR_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      });

      // Extract text content
      const textBlock = message.content.find((b: any) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        return res.status(500).json({ error: "No text response from AI" });
      }

      // Parse JSON response — strip markdown code fences if present
      try {
        let jsonText = textBlock.text.trim();
        // Remove ```json ... ``` or ``` ... ``` wrapping (greedy, handles multiline)
        const fenceMatch = jsonText.match(/^```(?:json)?\s*([\s\S]*?)```\s*$/s);
        if (fenceMatch) {
          jsonText = fenceMatch[1].trim();
        }
        // Also handle case where there's text before/after the JSON
        if (!jsonText.startsWith('{')) {
          const startIdx = jsonText.indexOf('{');
          const endIdx = jsonText.lastIndexOf('}');
          if (startIdx !== -1 && endIdx !== -1) {
            jsonText = jsonText.slice(startIdx, endIdx + 1);
          }
        }
        const explanation = JSON.parse(jsonText);
        return res.json({ explanation });
      } catch (parseErr) {
        console.error("JSON parse error:", parseErr, "Raw text:", textBlock.text.substring(0, 200));
        // If JSON parsing fails, return raw text as fallback
        return res.json({ explanation: null, rawText: textBlock.text });
      }
    } catch (error: any) {
      console.error("AI Tutor error:", error);
      return res.status(500).json({ 
        error: "Failed to generate explanation",
        details: error.message 
      });
    }
  });

  return httpServer;
}
