// Centralized AI provider + model configuration.
//
// Provider auto-selection: if DEEPSEEK_API_KEY is set, use DeepSeek.
// Else if OPENROUTER_API_KEY is set, use OpenRouter.
// Else if GROQ_API_KEY is set, use Groq.
// Else if ANTHROPIC_API_KEY is set, use Anthropic.
// Else /api endpoints will 500 with a clear error.

export type Provider = "deepseek" | "openrouter" | "groq" | "anthropic";

export function detectProvider(): Provider | null {
  if (process.env.DEEPSEEK_API_KEY) return "deepseek";
  if (process.env.OPENROUTER_API_KEY) return "openrouter";
  if (process.env.GROQ_API_KEY) return "groq";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return null;
}

// DeepSeek model catalogue (OpenAI-compatible API)
// Reference: https://api-docs.deepseek.com/quick_start/pricing
export const DEEPSEEK_MODELS = {
  // V4 Flash — cost-effective, high quality (Quality 77)
  FLASH: "deepseek-v4-flash",
  // V4 Pro — flagship reasoning (Quality 86)
  PRO: "deepseek-v4-pro",
} as const;

// Anthropic model catalogue
export const ANTHROPIC_MODELS = {
  HAIKU: "claude-haiku-4-5-20251001",
  SONNET: "claude-sonnet-4-5-20250929",
  SONNET_LATEST: "claude-sonnet-4-6",
  OPUS: "claude-opus-4-6",
} as const;

// Groq model catalogue (OpenAI-compatible API)
// Reference: https://console.groq.com/docs/models
export const GROQ_MODELS = {
  // Fast & cheap — Haiku equivalent
  INSTANT: "llama-3.1-8b-instant",
  // Balanced general purpose — Sonnet equivalent
  LLAMA_70B: "llama-3.3-70b-versatile",
  // OpenAI's gpt-oss-120b on Groq — top quality
  GPT_OSS_120B: "openai/gpt-oss-120b",
  // Moonshot Kimi — strong reasoning
  KIMI: "moonshotai/kimi-k2-instruct",
} as const;

// OpenRouter model catalogue (OpenAI-compatible API)
// Reference: https://openrouter.ai/models
// Free models — verified working IDs from costgoat.com (May 2026)
export const OPENROUTER_MODELS = {
  // DeepSeek V4 Flash — highest quality free model (Quality 77)
  DEEPSEEK_V4: "deepseek/deepseek-v4-flash:free",
  // MiniMax M2.5 — strong reasoning (Quality 70)
  MINIMAX_M2_5: "minimax/minimax-m2.5:free",
  // Google Gemma 4 31B — vision + tools (Quality 65)
  GEMMA_4_31B: "google/gemma-4-31b-it:free",
  // NVIDIA Nemotron 3 Super 120B — general purpose (Quality 60)
  NEMOTRON_SUPER: "nvidia/nemotron-3-super-120b-a12b:free",
  // Qwen3 Coder — best for coding (Quality 41)
  QWEN3_CODER: "qwen/qwen3-coder:free",
  // Meta Llama 3.3 70B — general purpose (Quality 24)
  LLAMA_3_3_70B: "meta-llama/llama-3.3-70b-instruct:free",
  // Meta Llama 3.2 3B — lightweight (Quality 16)
  LLAMA_3_2_3B: "meta-llama/llama-3.2-3b-instruct:free",
} as const;

// Per-feature model assignment, per provider.
// Tutor needs better reasoning (explanations); visualizer needs structured JSON.
export const MODEL_CONFIG = {
  deepseek: {
    TUTOR: DEEPSEEK_MODELS.FLASH,
    VISUALIZER: DEEPSEEK_MODELS.FLASH,
  },
  anthropic: {
    TUTOR: ANTHROPIC_MODELS.HAIKU,
    VISUALIZER: ANTHROPIC_MODELS.HAIKU,
  },
  groq: {
    TUTOR: GROQ_MODELS.LLAMA_70B,
    VISUALIZER: GROQ_MODELS.INSTANT,
  },
  openrouter: {
    TUTOR: OPENROUTER_MODELS.DEEPSEEK_V4,
    VISUALIZER: OPENROUTER_MODELS.NEMOTRON_SUPER,
  },
} as const;

export const TOKEN_LIMITS = {
  TUTOR: 2048, // Reduced to stay under Groq free tier 6000 TPM limit
  VISUALIZER: 1024, // Further reduced for visualization requests
} as const;

/** Resolve the model for a feature given the active provider. */
export function modelFor(feature: "TUTOR" | "VISUALIZER"): string {
  const provider = detectProvider();
  if (!provider) {
    throw new Error(
      "No AI provider configured. Set DEEPSEEK_API_KEY, OPENROUTER_API_KEY, GROQ_API_KEY, or ANTHROPIC_API_KEY in .env",
    );
  }
  return MODEL_CONFIG[provider][feature];
}
