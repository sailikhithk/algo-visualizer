import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Clock, HardDrive, ChevronRight } from "lucide-react";
import type { DetectedAlgorithm } from "@/lib/algorithmDetector";

interface AIVizInfo {
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  category: string;
  description: string;
}

interface AlgorithmInfoProps {
  detected: DetectedAlgorithm | null;
  aiVizResult: AIVizInfo | null;
}

export function AlgorithmInfo({ detected, aiVizResult }: AlgorithmInfoProps) {
  if (!aiVizResult && (!detected || detected.type === "unknown")) {
    return null;
  }

  const algorithmName = aiVizResult?.name ?? detected?.name;
  const time = aiVizResult?.timeComplexity ?? detected?.timeComplexity;
  const space = aiVizResult?.spaceComplexity ?? detected?.spaceComplexity;
  const category = (aiVizResult?.category ?? detected?.category ?? "").replace(
    /_/g,
    " ",
  );
  const description = aiVizResult?.description ?? detected?.description;

  return (
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
            {algorithmName}
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
            {time}
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
            {space}
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
            {category}
          </Badge>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-3 border-t border-border/30 pt-3">
        {description}
      </p>
    </Card>
  );
}
