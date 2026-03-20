import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Zap, Clock, HardDrive, ChevronRight, Code2, BarChart3, BookOpen } from 'lucide-react';
import { detectAlgorithm, extractArrayFromCode, extractGraphFromCode, extractTreeFromCode } from '@/lib/algorithmDetector';
import type { DetectedAlgorithm } from '@/lib/algorithmDetector';
import {
  bubbleSortSteps, selectionSortSteps, insertionSortSteps, mergeSortSteps, quickSortSteps,
  binarySearchSteps, bfsSteps, dfsSteps, inorderSteps, preorderSteps, postorderSteps,
  dpFibonacciSteps, dpCoinChangeSteps, linkedListReverseSteps, stackSteps,
  twoPointersSteps, slidingWindowSteps,
  type VisualizationStep
} from '@/lib/visualizationEngine';
import { ArrayVisualizer } from '@/components/ArrayVisualizer';
import { GraphVisualizer } from '@/components/GraphVisualizer';
import { TreeVisualizer } from '@/components/TreeVisualizer';
import { LinkedListVisualizer } from '@/components/LinkedListVisualizer';
import { SAMPLE_CODES, CATEGORY_SAMPLES } from '@/lib/sampleCode';
import { PerplexityAttribution } from '@/components/PerplexityAttribution';

const DEFAULT_CODE = SAMPLE_CODES.bubble_sort.code;

export default function Home() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [detected, setDetected] = useState<DetectedAlgorithm | null>(null);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [graphData, setGraphData] = useState<{ nodes: string[]; edges: [string, string, number?][] }>({ nodes: [], edges: [] });
  const [treeData, setTreeData] = useState<any>(null);
  const [maxArrayVal, setMaxArrayVal] = useState(100);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const generateSteps = useCallback((alg: DetectedAlgorithm, sourceCode: string) => {
    const arr = extractArrayFromCode(sourceCode);
    const graph = extractGraphFromCode(sourceCode);
    const tree = extractTreeFromCode(sourceCode);
    setMaxArrayVal(Math.max(...arr.filter(v => v >= 0), 100));

    let generator: Generator<VisualizationStep>;

    switch (alg.type) {
      case 'bubble_sort': generator = bubbleSortSteps(arr); break;
      case 'selection_sort': generator = selectionSortSteps(arr); break;
      case 'insertion_sort': generator = insertionSortSteps(arr); break;
      case 'merge_sort': generator = mergeSortSteps(arr); break;
      case 'quick_sort': generator = quickSortSteps(arr); break;
      case 'binary_search': generator = binarySearchSteps(arr); break;
      case 'bfs': setGraphData(graph); generator = bfsSteps(graph.nodes, graph.edges); break;
      case 'dfs': setGraphData(graph); generator = dfsSteps(graph.nodes, graph.edges); break;
      case 'inorder': case 'bst_insert': case 'bst_search': setTreeData(tree); generator = inorderSteps(tree); break;
      case 'preorder': setTreeData(tree); generator = preorderSteps(tree); break;
      case 'postorder': setTreeData(tree); generator = postorderSteps(tree); break;
      case 'dp_fibonacci': generator = dpFibonacciSteps(); break;
      case 'dp_coin_change': generator = dpCoinChangeSteps(); break;
      case 'linked_list_reverse': case 'linked_list_ops': case 'linked_list_cycle': generator = linkedListReverseSteps(); break;
      case 'stack_ops': generator = stackSteps(); break;
      case 'two_pointers_generic': generator = twoPointersSteps(arr); break;
      case 'sliding_window_generic': generator = slidingWindowSteps(arr); break;
      default: generator = bubbleSortSteps(arr); break;
    }

    const allSteps = Array.from(generator);
    setSteps(allSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const handleVisualize = useCallback(() => {
    const alg = detectAlgorithm(code);
    setDetected(alg);
    generateSteps(alg, code);
  }, [code, generateSteps]);

  const loadSample = useCallback((key: string) => {
    const sample = SAMPLE_CODES[key];
    if (sample) {
      setCode(sample.code);
      const alg = detectAlgorithm(sample.code);
      setDetected(alg);
      generateSteps(alg, sample.code);
    }
  }, [generateSteps]);

  // Autoplay
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
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
    if (!detected || steps.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <BarChart3 className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm">Paste code and click Visualize</p>
        </div>
      );
    }

    const cat = detected.category;
    if (cat === 'graph') {
      return <GraphVisualizer step={currentStepData} nodes={graphData.nodes} edges={graphData.edges} />;
    }
    if (cat === 'tree') {
      return <TreeVisualizer step={currentStepData} tree={treeData} />;
    }
    if (cat === 'linked_list') {
      return <LinkedListVisualizer step={currentStepData} />;
    }
    // Default: array-based visualization (sorting, searching, DP, two pointers, sliding window, stack)
    return <ArrayVisualizer step={currentStepData} maxVal={maxArrayVal} />;
  };

  // Detect on initial load
  useEffect(() => {
    handleVisualize();
  }, []);

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[hsl(168,80%,48%)] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-label="Algorithm Visualizer logo">
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3z" stroke="hsl(225,25%,6%)" strokeWidth="2" fill="none"/>
                <path d="M17.5 14v7M14 17.5h7" stroke="hsl(225,25%,6%)" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-foreground">AlgoViz</h1>
              <p className="text-[10px] text-muted-foreground">Algorithm Visualizer</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono bg-[hsl(168,80%,48%/0.1)] text-[hsl(168,80%,48%)] border-[hsl(168,80%,48%/0.3)]">
              Interview Prep
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* LEFT: Code Editor + Samples */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Sample Algorithm Picker */}
            <Card className="p-3 bg-card border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Templates</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(CATEGORY_SAMPLES).map(([category, keys]) => (
                  <Select key={category} onValueChange={loadSample}>
                    <SelectTrigger className="h-7 w-auto text-[11px] bg-muted/50 border-0 px-2.5 gap-1" data-testid={`select-${category}`}>
                      <SelectValue placeholder={category} />
                    </SelectTrigger>
                    <SelectContent>
                      {keys.map(key => (
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
            <Card className="flex-1 flex flex-col bg-card border-border/50 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5 text-[hsl(168,80%,48%)]" />
                  <span className="text-xs font-semibold text-foreground">Python Code</span>
                </div>
                <Button 
                  size="sm" 
                  onClick={handleVisualize}
                  className="h-7 text-xs bg-[hsl(168,80%,48%)] hover:bg-[hsl(168,80%,55%)] text-[hsl(225,25%,6%)] font-semibold gap-1"
                  data-testid="button-visualize"
                >
                  <Zap className="w-3 h-3" />
                  Visualize
                </Button>
              </div>
              <div className="relative flex-1 min-h-[350px]">
                <div className="absolute left-0 top-0 bottom-0 w-10 bg-muted/30 border-r border-border/30 flex flex-col pt-2">
                  {code.split('\n').map((_, i) => (
                    <span key={i} className="text-[10px] text-muted-foreground/50 text-right pr-2 leading-[1.65rem] select-none font-mono">{i + 1}</span>
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

          {/* RIGHT: Visualization + Controls + Info */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Visualization Panel */}
            <Card className="bg-card border-border/50 overflow-hidden">
              <div className="px-3 py-2 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-[hsl(260,60%,62%)]" />
                  <span className="text-xs font-semibold text-foreground">Visualization</span>
                </div>
                {detected && detected.type !== 'unknown' && (
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {detected.name}
                  </Badge>
                )}
              </div>
              <div className="p-4 grid-bg min-h-[280px] flex items-center justify-center">
                {renderVisualization()}
              </div>
              {/* Step message */}
              {currentStepData && (
                <div className="px-4 py-2 border-t border-border/50 bg-muted/20">
                  <p className="text-xs font-mono text-muted-foreground">
                    <span className="text-[hsl(168,80%,48%)]">Step {currentStep + 1}/{steps.length}</span>
                    <span className="mx-2 text-border">|</span>
                    {currentStepData.message}
                  </p>
                </div>
              )}
            </Card>

            {/* Playback Controls */}
            <Card className="p-3 bg-card border-border/50">
              <div className="flex items-center gap-3">
                {/* Transport */}
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost" size="icon"
                        className="h-8 w-8"
                        onClick={() => { setCurrentStep(0); setIsPlaying(false); }}
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
                        variant="ghost" size="icon"
                        className="h-8 w-8"
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
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
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost" size="icon"
                        className="h-8 w-8"
                        onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                        disabled={currentStep >= steps.length - 1 || steps.length === 0}
                        data-testid="button-next"
                      >
                        <SkipForward className="w-3.5 h-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Next Step</TooltipContent>
                  </Tooltip>
                </div>

                {/* Progress */}
                <div className="flex-1">
                  <Slider
                    value={[currentStep]}
                    max={Math.max(steps.length - 1, 0)}
                    step={1}
                    onValueChange={([v]) => { setCurrentStep(v); setIsPlaying(false); }}
                    className="w-full"
                    data-testid="slider-progress"
                  />
                </div>

                {/* Speed */}
                <div className="flex items-center gap-2 min-w-[120px]">
                  <span className="text-[10px] text-muted-foreground font-mono">Speed</span>
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
            {detected && detected.type !== 'unknown' && (
              <Card className="p-4 bg-card border-border/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Zap className="w-3 h-3" />
                      <span className="text-[10px] uppercase tracking-wider font-semibold">Algorithm</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{detected.name}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px] uppercase tracking-wider font-semibold">Time</span>
                    </div>
                    <p className="text-sm font-mono font-bold text-[hsl(168,80%,48%)]">{detected.timeComplexity}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <HardDrive className="w-3 h-3" />
                      <span className="text-[10px] uppercase tracking-wider font-semibold">Space</span>
                    </div>
                    <p className="text-sm font-mono font-bold text-[hsl(260,60%,62%)]">{detected.spaceComplexity}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <ChevronRight className="w-3 h-3" />
                      <span className="text-[10px] uppercase tracking-wider font-semibold">Category</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {detected.category.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 border-t border-border/30 pt-3">
                  {detected.description}
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-8 border-t border-border/30 py-4">
        <div className="max-w-[1400px] mx-auto px-4">
          <PerplexityAttribution />
        </div>
      </footer>
    </div>
  );
}
