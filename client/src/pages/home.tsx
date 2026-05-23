import { useState, useCallback, useRef, useEffect } from "react";
import { BarChart3, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export interface SavedCode {
  id: number;
  title: string;
  code: string;
  algorithm_type: string | null;
  created_at: string;
  updated_at: string;
}
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
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { GraphVisualizer } from "@/components/visualizers/GraphVisualizer";
import { TreeVisualizer } from "@/components/visualizers/TreeVisualizer";
import { LinkedListVisualizer } from "@/components/visualizers/LinkedListVisualizer";
import {
  AIVisualizer,
  type AIVisualizationType,
} from "@/components/visualizers/AIVisualizer";
import { SAMPLE_CODES } from "@/lib/sampleCode";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import {
  TutorPanel,
  type TutorExplanation,
} from "@/components/editorial/TutorPanel";

import { Header } from "@/components/Header";
import { CodeEditor } from "@/components/CodeEditor";
import { PlaybackControls } from "@/components/PlaybackControls";
import { AlgorithmInfo } from "@/components/AlgorithmInfo";
import { VisualizationPanel } from "@/components/VisualizationPanel";

const DEFAULT_CODE = SAMPLE_CODES.bubble_sort.code;

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

  // Saved codes state
  const [savedCodes, setSavedCodes] = useState<SavedCode[]>([]);

  // Fetch saved codes on mount
  useEffect(() => {
    apiRequest("GET", "/api/saved-codes")
      .then((res) => res.json())
      .then((data) => setSavedCodes(data.codes ?? []))
      .catch(() => {});
  }, []);

  const handleSave = useCallback(() => {
    const title = window.prompt("Name this snippet:", "");
    if (!title) return;
    apiRequest("POST", "/api/saved-codes", {
      title,
      code,
      algorithmType: detected?.type ?? null,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code) setSavedCodes((prev) => [data.code, ...prev]);
      })
      .catch(() => {});
  }, [code, detected]);

  const generateSteps = useCallback(
    (alg: DetectedAlgorithm, sourceCode: string): boolean => {
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
          // No built-in generator for this algorithm — delegate to AI
          return false;
      }

      const allSteps = Array.from(generator);
      setSteps(allSteps);
      setCurrentStep(0);
      setIsPlaying(false);
      return true;
    },
    [],
  );

  const handleLoadSaved = useCallback(
    (saved: SavedCode) => {
      setCode(saved.code);
      const alg = detectAlgorithm(saved.code);
      setDetected(alg);
      generateSteps(alg, saved.code);
    },
    [generateSteps],
  );

  const handleDeleteSaved = useCallback((id: number) => {
    apiRequest("DELETE", `/api/saved-codes/${id}`)
      .then(() => setSavedCodes((prev) => prev.filter((c) => c.id !== id)))
      .catch(() => {});
  }, []);

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
    const handled = generateSteps(alg, code);
    if (!handled) {
      handleAIVisualize(code);
    }
  }, [code, generateSteps, handleAIVisualize]);

  const handleVisualizeAndLearn = useCallback(() => {
    const alg = detectAlgorithm(code);
    setDetected(alg);
    setAiVizResult(null);
    setAiVizError(null);
    const handled = generateSteps(alg, code);
    fetchTutorExplanation(code, alg);
    if (!handled) {
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
    if (aiVizLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
    return <ArrayVisualizer step={currentStepData} maxVal={maxArrayVal} />;
  };

  // Detect on initial load
  useEffect(() => {
    handleVisualize();
  }, []);

  // AlgorithmInfo needs "name" for aiVizResult (it uses "algorithmName" internally)
  const aiVizForInfo = aiVizResult
    ? { ...aiVizResult, name: aiVizResult.algorithmName }
    : null;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header
        onSelectTemplate={loadSample}
        savedCodes={savedCodes}
        onLoadSaved={handleLoadSaved}
        onDeleteSaved={handleDeleteSaved}
      />

      <main className="flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col min-h-full">
          <div className="flex-1 min-h-[70vh] grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 sm:p-4">
            {/* LEFT: Code Editor */}
            <div className="lg:col-span-5 flex flex-col gap-3 order-2 lg:order-1 min-h-0">
              <CodeEditor
                code={code}
                onChange={setCode}
                onVisualize={handleVisualize}
                onAIVisualize={() => handleAIVisualize(code)}
                onLearn={handleVisualizeAndLearn}
                onSave={handleSave}
                aiVizLoading={aiVizLoading}
                tutorLoading={tutorLoading}
              />
            </div>

            {/* RIGHT: Visualization + Controls + Info */}
            <div className="lg:col-span-7 flex flex-col gap-3 order-1 lg:order-2 min-h-0">
              <VisualizationPanel
                detected={detected}
                aiVizResult={aiVizResult}
                currentStepData={currentStepData}
                currentStep={currentStep}
                totalSteps={steps.length}
              >
                {renderVisualization()}
              </VisualizationPanel>

              <PlaybackControls
                currentStep={currentStep}
                totalSteps={steps.length}
                isPlaying={isPlaying}
                speed={speed}
                onStepChange={(step) => {
                  setCurrentStep(step);
                  setIsPlaying(false);
                }}
                onPlayToggle={() => setIsPlaying(!isPlaying)}
                onReset={() => {
                  setCurrentStep(0);
                  setIsPlaying(false);
                }}
                onSpeedChange={setSpeed}
              />

              <AlgorithmInfo detected={detected} aiVizResult={aiVizForInfo} />
            </div>
          </div>

          {/* AI Tutor Panel */}
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
      </main>
    </div>
  );
}
