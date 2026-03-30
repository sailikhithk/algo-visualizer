import { type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import type { VisualizationStep } from "@/lib/visualizationEngine";

interface VisualizationPanelProps {
  detected: { type: string; name?: string } | null;
  aiVizResult: { algorithmName?: string } | null;
  currentStepData: VisualizationStep | null;
  currentStep: number;
  totalSteps: number;
  children: ReactNode;
}

export function VisualizationPanel({
  detected,
  aiVizResult,
  currentStepData,
  currentStep,
  totalSteps,
  children,
}: VisualizationPanelProps) {
  return (
    <Card className="flex-1 min-h-0 bg-card border-border/50 overflow-hidden flex flex-col">
      <div className="px-3 py-2 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-semibold text-foreground">
            Visualization
          </span>
        </div>
        {(aiVizResult || (detected && detected.type !== "unknown")) && (
          <Badge
            variant="outline"
            className={`text-[10px] font-mono ${aiVizResult ? "border-accent text-accent" : ""}`}
          >
            {aiVizResult ? `AI: ${aiVizResult.algorithmName}` : detected?.name}
          </Badge>
        )}
      </div>
      <div className="flex-1 min-h-0 p-2 sm:p-4 grid-bg flex items-center justify-center overflow-auto">
        {children}
      </div>
      {currentStepData && (
        <div className="px-4 py-2 border-t border-border/50 bg-muted/20">
          <p className="text-xs font-mono text-muted-foreground">
            <span className="text-primary">
              Step {currentStep + 1}/{totalSteps}
            </span>
            <span className="mx-2 text-border">|</span>
            {currentStepData.message}
          </p>
        </div>
      )}
    </Card>
  );
}
