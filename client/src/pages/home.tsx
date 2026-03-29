import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Zap,
  Clock,
  HardDrive,
  ChevronRight,
  Code2,
  BarChart3,
  BookOpen,
  GraduationCap,
  Loader2,
  Brain,
} from "lucide-react";
import {
  detectAlgorithm,
  extractArrayFromCode,
  extractGraphFromCode,
  extractTreeFromCode,
} from "@/lib/algorithmDetector";
import type { DetectedAlgorithm } from "@/lib/algorithmDetector";
import {
  bubbleSortSteps,
  selectionSortSteps,
  insertionSortSteps,
  mergeSortSteps,
  quickSortSteps,
  binarySearchSteps,
  bfsSteps,
  dfsSteps,
  inorderSteps,
  preorderSteps,
  postorderSteps,
  dpFibonacciSteps,
  dpCoinChangeSteps,
  linkedListReverseSteps,
  stackSteps,
  twoPointersSteps,
  slidingWindowSteps,
  type VisualizationStep,
} from "@/lib/visualizationEngine";
import { ArrayVisualizer } from "@/components/ArrayVisualizer";
import { GraphVisualizer } from "@/components/GraphVisualizer";
import { TreeVisualizer } from "@/components/TreeVisualizer";
import { LinkedListVisualizer } from "@/components/LinkedListVisualizer";
import {
  AIVisualizer,
  type AIVisualizationType,
} from "@/components/AIVisualizer";
import { SAMPLE_CODES, CATEGORY_SAMPLES } from "@/lib/sampleCode";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { TutorPanel, type TutorExplanation } from "@/components/TutorPanel";
import { apiRequest } from "@/lib/queryClient";

const DEFAULT_CODE = SAMPLE_CODES.bubble_sort.code;

// Algorithm types that delegate to AI visualization instead of built-in generators
const AI_VIZ_TYPES = new Set([
  "median_two_sorted",
  "trapping_rain_water",
  "longest_palindrome",
  "word_break",
  "regex_match",
  "wildcard_match",
  "next_permutation",
  "rotate_image",
  "unknown",
]);

export default function Home() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [detected, setDetected] = useState<DetectedAlgorithm | null>(null);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [graphData, setGraphData] = useState<{
    nodes: string[];
    edges: [string, string, number?][];
  }>({ nodes: [], edges: [] });
  const [treeData, setTreeData] = useState<any>(null);
  const [maxArrayVal, setMaxArrayVal] = useState(100);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // AI Tutor state
  const [tutorExplanation, setTutorExplanation] =
    useState<TutorExplanation | null>(null);
  const [tutorLoading, setTutorLoading] = useState(false);
  const [tutorError, setTutorError] = useState<string | null>(null);
  const [tutorOpen, setTutorOpen] = useState(false);

  // AI Visualization state
  const [aiVizResult, setAiVizResult] = useState<{
    algorithmName: string;
    category: string;
    timeComplexity: string;
    spaceComplexity: string;
    description: string;
    visualizationType: AIVisualizationType;
  } | null>(null);
  const [aiVizLoading, setAiVizLoading] = useState(false);
  const [aiVizError, setAiVizError] = useState<string | null>(null);

  // Algorithm types that should fall back to AI visualization
  // (defined above as module-level constant)

  const generateSteps = useCallback(
    (alg: DetectedAlgorithm, sourceCode: string) => {
      const arr = extractArrayFromCode(sourceCode);
      const graph = extractGraphFromCode(sourceCode);
      const tree = extractTreeFromCode(sourceCode);
      setMaxArrayVal(Math.max(...arr.filter((v) => v >= 0), 100));

      let generator: Generator<VisualizationStep>;

      switch (alg.type) {
        case "bubble_sort":
          generator = bubbleSortSteps(arr);
          break;
        case "selection_sort":
          generator = selectionSortSteps(arr);
          break;
        case "insertion_sort":
          generator = insertionSortSteps(arr);
          break;
        case "merge_sort":
          generator = mergeSortSteps(arr);
          break;
        case "quick_sort":
          generator = quickSortSteps(arr);
          break;
        case "binary_search":
          generator = binarySearchSteps(arr);
          break;
        case "bfs":
          setGraphData(graph);
          generator = bfsSteps(graph.nodes, graph.edges);
          break;
        case "dfs":
          setGraphData(graph);
          generator = dfsSteps(graph.nodes, graph.edges);
          break;
        case "inorder":
        case "bst_insert":
        case "bst_search":
          setTreeData(tree);
          generator = inorderSteps(tree);
          break;
        case "preorder":
          setTreeData(tree);
          generator = preorderSteps(tree);
          break;
        case "postorder":
          setTreeData(tree);
          generator = postorderSteps(tree);
          break;
        case "dp_fibonacci":
          generator = dpFibonacciSteps();
          break;
        case "dp_coin_change":
          generator = dpCoinChangeSteps();
          break;
        case "linked_list_reverse":
        case "linked_list_ops":
        case "linked_list_cycle":
          generator = linkedListReverseSteps();
          break;
        case "stack_ops":
          generator = stackSteps();
          break;
        case "two_pointers_generic":
          generator = twoPointersSteps(arr);
          break;
        case "sliding_window_generic":
          generator = slidingWindowSteps(arr);
          break;
        default:
          // AI-viz algorithms: don't generate fake steps — leave steps empty
          // so the UI shows the "Paste code and click Visualize" placeholder
          // until the AI viz result arrives.
          if (AI_VIZ_TYPES.has(alg.type)) return;
          generator = bubbleSortSteps(arr);
          break;
      }

      const allSteps = Array.from(generator);
      setSteps(allSteps);
      setCurrentStep(0);
      setIsPlaying(false);
    },
    [],
  );

  const fetchTutorExplanation = useCallback(
    async (sourceCode: string, alg: DetectedAlgorithm) => {
      setTutorLoading(true);
      setTutorError(null);
      setTutorOpen(true);
      try {
        const res = await apiRequest("POST", "/api/explain", {
          code: sourceCode,
          algorithmName: alg.name || "an algorithm",
          category: alg.category || "unknown",
        });
        const data = await res.json();
        if (data.explanation) {
          setTutorExplanation(data.explanation);
        } else {
          setTutorError("Could not parse explanation");
        }
      } catch (err: any) {
        setTutorError(err.message || "Failed to get explanation");
      } finally {
        setTutorLoading(false);
      }
    },
    [],
  );

  const handleAIVisualize = useCallback(async (sourceCode: string) => {
    setAiVizLoading(true);
    setAiVizError(null);
    setAiVizResult(null);
    try {
      const res = await apiRequest("POST", "/api/visualize", {
        code: sourceCode,
      });
      const data = await res.json();
      if (data.result && data.result.steps?.length > 0) {
        const { steps: aiSteps, ...meta } = data.result;
        setAiVizResult(meta);
        // Feed AI steps directly into the existing playback system
        setSteps(aiSteps);
        setCurrentStep(0);
        setIsPlaying(false);
      } else {
        setAiVizError("AI could not generate visualization steps");
      }
    } catch (err: any) {
      setAiVizError(err.message || "Failed to generate AI visualization");
    } finally {
      setAiVizLoading(false);
    }
  }, []);

  const handleVisualize = useCallback(() => {
    const alg = detectAlgorithm(code);
    setDetected(alg);
    setAiVizResult(null);
    setAiVizError(null);
    generateSteps(alg, code);
    // Auto-trigger AI viz for complex/unknown algorithms
    if (AI_VIZ_TYPES.has(alg.type)) {
      handleAIVisualize(code);
    }
  }, [code, generateSteps, handleAIVisualize]);

  const handleVisualizeAndLearn = useCallback(() => {
    const alg = detectAlgorithm(code);
    setDetected(alg);
    setAiVizResult(null);
    setAiVizError(null);
    generateSteps(alg, code);
    fetchTutorExplanation(code, alg);
    // Also trigger AI viz for complex/unknown algorithms
    if (AI_VIZ_TYPES.has(alg.type)) {
      handleAIVisualize(code);
    }
  }, [code, generateSteps, fetchTutorExplanation, handleAIVisualize]);

  const loadSample = useCallback(
    (key: string) => {
      const sample = SAMPLE_CODES[key];
      if (sample) {
        setCode(sample.code);
        const alg = detectAlgorithm(sample.code);
        setDetected(alg);
        generateSteps(alg, sample.code);
      }
    },
    [generateSteps],
  );

  // Autoplay
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, steps.length]);

  const currentStepData = steps[currentStep] || null;

  const renderVisualization = () => {
    // Loading state for AI viz
    if (aiVizLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[hsl(168,80%,48%)]" />
          <p className="text-sm">AI is analyzing your code…</p>
        </div>
      );
    }

    if (!detected || steps.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <BarChart3 className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm">Paste code and click Visualize</p>
          {aiVizError && (
            <p className="text-xs text-red-400 mt-2">{aiVizError}</p>
          )}
        </div>
      );
    }

    // AI-generated visualization
    if (aiVizResult) {
      return (
        <AIVisualizer
          step={currentStepData}
          visualizationType={aiVizResult.visualizationType}
          maxVal={maxArrayVal}
        />
      );
    }

    const cat = detected.category;
    if (cat === "graph") {
      return (
        <GraphVisualizer
          step={currentStepData}
          nodes={graphData.nodes}
          edges={graphData.edges}
        />
      );
    }
    if (cat === "tree") {
      return <TreeVisualizer step={currentStepData} tree={treeData} />;
    }
    if (cat === "linked_list") {
      return <LinkedListVisualizer step={currentStepData} />;
    }
    // Default: array-based visualization
    return <ArrayVisualizer step={currentStepData} maxVal={maxArrayVal} />;
  };

  // Detect on initial load
  useEffect(() => {
    handleVisualize();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background dark overflow-hidden">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm flex-shrink-0">
        <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[hsl(168,80%,48%)] flex items-center justify-center flex-shrink-0">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-label="Algorithm Visualizer logo"
              >
                <path
                  d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3z"
                  stroke="hsl(225,25%,6%)"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M17.5 14v7M14 17.5h7"
                  stroke="hsl(225,25%,6%)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-foreground">
                AlgoViz
              </h1>
              <p className="text-[10px] text-muted-foreground hidden sm:block">
                Algorithm Visualizer
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-[10px] font-mono bg-[hsl(168,80%,48%/0.1)] text-[hsl(168,80%,48%)] border-[hsl(168,80%,48%/0.3)] hidden sm:flex"
            >
              Interview Prep
            </Badge>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col min-h-full">
          <div className="flex-1 min-h-[70vh] grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 sm:p-4">
            {/* LEFT: Code Editor + Samples — shown below visualization on mobile */}
            <div className="lg:col-span-5 flex flex-col gap-3 order-2 lg:order-1 min-h-0">
              {/* Sample Algorithm Picker */}
              <Card className="p-3 bg-card border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Templates
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(CATEGORY_SAMPLES).map(([category, keys]) => (
                    <Select key={category} onValueChange={loadSample}>
                      <SelectTrigger
                        className="h-7 w-auto text-[11px] bg-muted/50 border-0 px-2.5 gap-1"
                        data-testid={`select-${category}`}
                      >
                        <SelectValue placeholder={category} />
                      </SelectTrigger>
                      <SelectContent>
                        {keys.map((key) => (
                          <SelectItem key={key} value={key} className="text-xs">
                            {SAMPLE_CODES[key]?.title || key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ))}
                </div>
              </Card>

              {/* Code Editor */}
              <Card className="flex-1 min-h-0 flex flex-col bg-card border-border/50 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-[hsl(168,80%,48%)]" />
                    <span className="text-xs font-semibold text-foreground">
                      Python Code
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      onClick={handleVisualize}
                      className="h-7 text-xs bg-[hsl(168,80%,48%)] hover:bg-[hsl(168,80%,55%)] text-[hsl(225,25%,6%)] font-semibold gap-1"
                      data-testid="button-visualize"
                    >
                      <Zap className="w-3 h-3" />
                      Visualize
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAIVisualize(code)}
                      className="h-7 text-xs bg-[hsl(260,60%,62%)] hover:bg-[hsl(260,60%,70%)] text-white font-semibold gap-1"
                      disabled={aiVizLoading}
                      data-testid="button-ai-visualize"
                    >
                      {aiVizLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Brain className="w-3 h-3" />
                      )}
                      AI Viz
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleVisualizeAndLearn}
                      className="h-7 text-xs bg-gradient-to-r from-[hsl(168,80%,48%)] to-[hsl(260,60%,62%)] hover:from-[hsl(168,80%,55%)] hover:to-[hsl(260,60%,68%)] text-white font-semibold gap-1"
                      disabled={tutorLoading}
                      data-testid="button-learn"
                    >
                      {tutorLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <GraduationCap className="w-3 h-3" />
                      )}
                      Learn
                    </Button>
                  </div>
                </div>
                <div className="relative flex-1 min-h-0 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-10 bg-muted/30 border-r border-border/30 flex flex-col pt-2">
                    {code.split("\n").map((_, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-muted-foreground/50 text-right pr-2 leading-[1.65rem] select-none font-mono"
                      >
                        {i + 1}
                      </span>
                    ))}
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full bg-transparent text-foreground font-mono text-xs leading-[1.65rem] p-2 pl-12 resize-none focus:outline-none"
                    spellCheck={false}
                    data-testid="input-code"
                  />
                </div>
              </Card>
            </div>

            {/* RIGHT: Visualization + Controls + Info — shown FIRST on mobile */}
            <div className="lg:col-span-7 flex flex-col gap-3 order-1 lg:order-2 min-h-0">
              {/* Visualization Panel */}
              <Card className="flex-1 min-h-0 bg-card border-border/50 overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-[hsl(260,60%,62%)]" />
                    <span className="text-xs font-semibold text-foreground">
                      Visualization
                    </span>
                  </div>
                  {(aiVizResult ||
                    (detected && detected.type !== "unknown")) && (
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono ${aiVizResult ? "border-[hsl(260,60%,62%)] text-[hsl(260,60%,62%)]" : ""}`}
                    >
                      {aiVizResult
                        ? `AI: ${aiVizResult.algorithmName}`
                        : detected?.name}
                    </Badge>
                  )}
                </div>
                <div className="flex-1 min-h-0 p-2 sm:p-4 grid-bg flex items-center justify-center overflow-auto">
                  {renderVisualization()}
                </div>
                {/* Step message */}
                {currentStepData && (
                  <div className="px-4 py-2 border-t border-border/50 bg-muted/20">
                    <p className="text-xs font-mono text-muted-foreground">
                      <span className="text-[hsl(168,80%,48%)]">
                        Step {currentStep + 1}/{steps.length}
                      </span>
                      <span className="mx-2 text-border">|</span>
                      {currentStepData.message}
                    </p>
                  </div>
                )}
              </Card>

              {/* Playback Controls */}
              <Card className="p-3 bg-card border-border/50">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Transport */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setCurrentStep(0);
                            setIsPlaying(false);
                          }}
                          disabled={steps.length === 0}
                          data-testid="button-reset"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Reset</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            setCurrentStep(Math.max(0, currentStep - 1))
                          }
                          disabled={currentStep === 0 || steps.length === 0}
                          data-testid="button-prev"
                        >
                          <SkipBack className="w-3.5 h-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Previous Step</TooltipContent>
                    </Tooltip>
                    <Button
                      size="icon"
                      className="h-9 w-9 rounded-full bg-[hsl(168,80%,48%)] hover:bg-[hsl(168,80%,55%)] text-[hsl(225,25%,6%)]"
                      onClick={() => setIsPlaying(!isPlaying)}
                      disabled={steps.length === 0}
                      data-testid="button-play"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </Button>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            setCurrentStep(
                              Math.min(steps.length - 1, currentStep + 1),
                            )
                          }
                          disabled={
                            currentStep >= steps.length - 1 ||
                            steps.length === 0
                          }
                          data-testid="button-next"
                        >
                          <SkipForward className="w-3.5 h-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Next Step</TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Progress */}
                  <div className="flex-1 min-w-[80px]">
                    <Slider
                      value={[currentStep]}
                      max={Math.max(steps.length - 1, 0)}
                      step={1}
                      onValueChange={([v]) => {
                        setCurrentStep(v);
                        setIsPlaying(false);
                      }}
                      className="w-full"
                      data-testid="slider-progress"
                    />
                  </div>

                  {/* Speed */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Speed
                    </span>
                    <Slider
                      value={[1000 - speed]}
                      max={950}
                      step={50}
                      onValueChange={([v]) => setSpeed(1000 - v)}
                      className="w-20"
                      data-testid="slider-speed"
                    />
                  </div>
                </div>
              </Card>

              {/* Algorithm Info */}
              {(aiVizResult || (detected && detected.type !== "unknown")) && (
                <Card className="p-4 bg-card border-border/50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Zap className="w-3 h-3" />
                        <span className="text-[10px] uppercase tracking-wider font-semibold">
                          Algorithm
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {aiVizResult?.algorithmName ?? detected?.name}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px] uppercase tracking-wider font-semibold">
                          Time
                        </span>
                      </div>
                      <p className="text-sm font-mono font-bold text-[hsl(168,80%,48%)]">
                        {aiVizResult?.timeComplexity ??
                          detected?.timeComplexity}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <HardDrive className="w-3 h-3" />
                        <span className="text-[10px] uppercase tracking-wider font-semibold">
                          Space
                        </span>
                      </div>
                      <p className="text-sm font-mono font-bold text-[hsl(260,60%,62%)]">
                        {aiVizResult?.spaceComplexity ??
                          detected?.spaceComplexity}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-[10px] uppercase tracking-wider font-semibold">
                          Category
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {(
                          aiVizResult?.category ??
                          detected?.category ??
                          ""
                        ).replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 border-t border-border/30 pt-3">
                    {aiVizResult?.description ?? detected?.description}
                  </p>
                </Card>
              )}
            </div>
            {/* end right column */}
          </div>
          {/* end grid */}

          {/* AI Tutor Panel — Full Width Below */}
          {tutorOpen && (
            <div className="px-3 sm:px-4 pb-3">
              <TutorPanel
                explanation={tutorExplanation}
                isLoading={tutorLoading}
                error={tutorError}
                onClose={() => setTutorOpen(false)}
              />
            </div>
          )}
          <footer className="border-t border-border/30 py-3 px-4 flex-shrink-0">
            <PerplexityAttribution />
          </footer>
        </div>
        {/* end h-full flex flex-col */}
      </main>
    </div>
  );
}
