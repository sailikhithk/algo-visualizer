// Centralized AI model configuration
// Switch between models for testing vs production

export const MODELS = {
  // Fast & cheap — use for testing and development
  HAIKU: "claude-haiku-4-5-20251001",

  // Balanced — good quality at reasonable cost
  SONNET: "claude-sonnet-4-5-20250929",

  // Best quality — use for production / complex tasks
  SONNET_LATEST: "claude-sonnet-4-6",

  // Top tier
  OPUS: "claude-opus-4-6",
} as const;

// Which model to use for each feature
// Change these to upgrade/downgrade quality vs cost
export const MODEL_CONFIG = {
  // AI Tutor (explain endpoint) — needs good reasoning for teaching
  TUTOR: MODELS.HAIKU,

  // AI Visualization (visualize endpoint) — needs structured JSON output
  VISUALIZER: MODELS.HAIKU,
} as const;

// Max tokens per endpoint
export const TOKEN_LIMITS = {
  TUTOR: 8192,
  VISUALIZER: 8192,
} as const;
