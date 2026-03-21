import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  GraduationCap, Lightbulb, Globe, TrendingUp, AlertTriangle,
  Award, GitBranch, ChevronDown, ChevronRight, Loader2, Sparkles,
  BookOpen, Brain, Rocket, MessageCircle, X
} from 'lucide-react';

export interface TutorExplanation {
  algorithmName: string;
  realWorldAnalogy: {
    title: string;
    story: string;
  };
  intuitionBuilder: {
    question: string;
    insight: string;
  };
  stepByStepIntuition: string[];
  realWorldApplications: {
    domain: string;
    application: string;
    scale: string;
  }[];
  bruteForceToOptimal: {
    naive: {
      approach: string;
      complexity: string;
      whyItWorks: string;
    };
    optimal: {
      approach: string;
      complexity: string;
      keyInsight: string;
    };
    comparisonExample: string;
  };
  commonMistakes: string[];
  interviewTips: string[];
  relatedAlgorithms: {
    name: string;
    relationship: string;
  }[];
}

interface TutorPanelProps {
  explanation: TutorExplanation | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}

function CollapsibleSection({ 
  title, icon: Icon, children, defaultOpen = true, accentColor = "hsl(168,80%,48%)" 
}: { 
  title: string; 
  icon: any; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
  accentColor?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/30 last:border-0">
      <button 
        onClick={() => setOpen(!open)} 
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-muted/20 transition-colors"
        data-testid={`section-toggle-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
        <span className="text-xs font-semibold text-foreground flex-1 text-left">{title}</span>
        {open ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export function TutorPanel({ explanation, isLoading, error, onClose }: TutorPanelProps) {
  if (!isLoading && !explanation && !error) return null;

  return (
    <Card className="bg-card border-border/50 overflow-hidden flex flex-col" data-testid="tutor-panel">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-gradient-to-r from-[hsl(168,80%,48%/0.08)] to-[hsl(260,60%,62%/0.08)]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[hsl(168,80%,48%)] to-[hsl(260,60%,62%)] flex items-center justify-center">
            <GraduationCap className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground">AI Tutor</h3>
            <p className="text-[9px] text-muted-foreground">Powered by Claude</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-muted/50 transition-colors" data-testid="button-close-tutor">
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(168,80%,48%/0.2)] to-[hsl(260,60%,62%/0.2)] flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-[hsl(168,80%,48%)] animate-spin" />
            </div>
            <Sparkles className="w-3 h-3 text-[hsl(260,60%,62%)] absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-foreground">Analyzing your code...</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Building real-world connections</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 gap-2 px-4">
          <AlertTriangle className="w-8 h-8 text-orange-400/60" />
          <p className="text-xs text-muted-foreground text-center">{error}</p>
        </div>
      )}

      {/* Content */}
      {explanation && !isLoading && (
        <ScrollArea className="flex-1 max-h-[600px]">
          <div className="divide-y divide-border/20">
            
            {/* Algorithm Name Header */}
            <div className="px-4 py-3 bg-muted/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[hsl(168,80%,48%)]" />
                <span className="text-sm font-bold text-foreground">{explanation.algorithmName}</span>
              </div>
            </div>

            {/* Real-World Analogy */}
            <CollapsibleSection title="Real-World Analogy" icon={Globe} accentColor="hsl(168,80%,48%)">
              <div className="rounded-lg bg-[hsl(168,80%,48%/0.06)] border border-[hsl(168,80%,48%/0.15)] p-3">
                <p className="text-xs font-semibold text-[hsl(168,80%,48%)] mb-1.5">{explanation.realWorldAnalogy.title}</p>
                <p className="text-xs text-foreground/80 leading-relaxed">{explanation.realWorldAnalogy.story}</p>
              </div>
            </CollapsibleSection>

            {/* Intuition Builder */}
            <CollapsibleSection title="Build Your Intuition" icon={Lightbulb} accentColor="hsl(45,90%,60%)">
              <div className="space-y-3">
                <div className="rounded-lg bg-[hsl(45,90%,60%/0.06)] border border-[hsl(45,90%,60%/0.15)] p-3">
                  <div className="flex items-start gap-2">
                    <MessageCircle className="w-3 h-3 text-[hsl(45,90%,60%)] mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-foreground/80 leading-relaxed italic">{explanation.intuitionBuilder.question}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-[hsl(168,80%,48%/0.06)] border border-[hsl(168,80%,48%/0.15)] p-3">
                  <div className="flex items-start gap-2">
                    <Brain className="w-3 h-3 text-[hsl(168,80%,48%)] mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-foreground leading-relaxed font-medium">{explanation.intuitionBuilder.insight}</p>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Step-by-Step */}
            <CollapsibleSection title="How It Works (Step by Step)" icon={BookOpen} accentColor="hsl(210,80%,60%)">
              <div className="space-y-2">
                {explanation.stepByStepIntuition.map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-5 h-5 rounded-full bg-[hsl(210,80%,60%/0.15)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[9px] font-bold text-[hsl(210,80%,60%)]">{i + 1}</span>
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* Brute Force → Optimal */}
            <CollapsibleSection title="From Brute Force to Optimal" icon={TrendingUp} accentColor="hsl(260,60%,62%)">
              <div className="space-y-3">
                {/* Naive */}
                <div className="rounded-lg bg-red-500/5 border border-red-500/15 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-[9px] bg-red-500/10 text-red-400 border-red-500/20 px-1.5 py-0">
                      Naive
                    </Badge>
                    <span className="text-[10px] font-mono font-bold text-red-400">{explanation.bruteForceToOptimal.naive.complexity}</span>
                  </div>
                  <p className="text-xs text-foreground/70 leading-relaxed">{explanation.bruteForceToOptimal.naive.approach}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 italic">{explanation.bruteForceToOptimal.naive.whyItWorks}</p>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[hsl(260,60%,62%/0.1)]">
                    <TrendingUp className="w-3 h-3 text-[hsl(260,60%,62%)]" />
                    <span className="text-[9px] font-semibold text-[hsl(260,60%,62%)]">Optimize</span>
                  </div>
                </div>

                {/* Optimal */}
                <div className="rounded-lg bg-[hsl(168,80%,48%/0.06)] border border-[hsl(168,80%,48%/0.15)] p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-[9px] bg-[hsl(168,80%,48%/0.1)] text-[hsl(168,80%,48%)] border-[hsl(168,80%,48%/0.2)] px-1.5 py-0">
                      Optimal
                    </Badge>
                    <span className="text-[10px] font-mono font-bold text-[hsl(168,80%,48%)]">{explanation.bruteForceToOptimal.optimal.complexity}</span>
                  </div>
                  <p className="text-xs text-foreground/70 leading-relaxed">{explanation.bruteForceToOptimal.optimal.approach}</p>
                  <p className="text-[10px] text-[hsl(168,80%,48%)] mt-1.5 font-medium">Key insight: {explanation.bruteForceToOptimal.optimal.keyInsight}</p>
                </div>

                {/* Comparison */}
                <div className="rounded-lg bg-muted/30 p-2.5">
                  <p className="text-[10px] text-foreground/70 leading-relaxed font-mono">{explanation.bruteForceToOptimal.comparisonExample}</p>
                </div>
              </div>
            </CollapsibleSection>

            {/* Real-World Applications */}
            <CollapsibleSection title="Where It's Used (Real World)" icon={Rocket} accentColor="hsl(168,80%,48%)">
              <div className="space-y-2.5">
                {explanation.realWorldApplications.map((app, i) => (
                  <div key={i} className="rounded-lg bg-muted/20 p-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0">{app.domain}</Badge>
                    </div>
                    <p className="text-xs text-foreground/80">{app.application}</p>
                    <p className="text-[10px] text-muted-foreground italic">{app.scale}</p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* Common Mistakes */}
            <CollapsibleSection title="Common Mistakes" icon={AlertTriangle} accentColor="hsl(30,90%,55%)" defaultOpen={false}>
              <div className="space-y-2">
                {explanation.commonMistakes.map((mistake, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                    <p className="text-xs text-foreground/70 leading-relaxed">{mistake}</p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* Interview Tips */}
            <CollapsibleSection title="Interview Tips" icon={Award} accentColor="hsl(260,60%,62%)" defaultOpen={false}>
              <div className="space-y-2">
                {explanation.interviewTips.map((tip, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[hsl(260,60%,62%)] mt-1.5 flex-shrink-0" />
                    <p className="text-xs text-foreground/70 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* Related Algorithms */}
            <CollapsibleSection title="Related Algorithms" icon={GitBranch} accentColor="hsl(210,70%,55%)" defaultOpen={false}>
              <div className="flex flex-wrap gap-2">
                {explanation.relatedAlgorithms.map((rel, i) => (
                  <div key={i} className="rounded-lg bg-muted/30 px-2.5 py-1.5">
                    <p className="text-[10px] font-semibold text-foreground">{rel.name}</p>
                    <p className="text-[9px] text-muted-foreground">{rel.relationship}</p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          </div>
        </ScrollArea>
      )}
    </Card>
  );
}
