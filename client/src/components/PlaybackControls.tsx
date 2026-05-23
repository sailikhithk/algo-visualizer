import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react";

interface PlaybackControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onStepChange: (step: number) => void;
  onPlayToggle: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export function PlaybackControls({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onStepChange,
  onPlayToggle,
  onReset,
  onSpeedChange,
}: PlaybackControlsProps) {
  return (
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
                onClick={onReset}
                disabled={totalSteps === 0}
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
                onClick={() => onStepChange(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0 || totalSteps === 0}
                data-testid="button-prev"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous Step</TooltipContent>
          </Tooltip>
          <Button
            size="icon"
            className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={onPlayToggle}
            disabled={totalSteps === 0}
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
                  onStepChange(Math.min(totalSteps - 1, currentStep + 1))
                }
                disabled={currentStep >= totalSteps - 1 || totalSteps === 0}
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
            max={Math.max(totalSteps - 1, 0)}
            step={1}
            onValueChange={([v]) => onStepChange(v)}
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
            onValueChange={([v]) => onSpeedChange(1000 - v)}
            className="w-20"
            data-testid="slider-speed"
          />
        </div>
      </div>
    </Card>
  );
}
