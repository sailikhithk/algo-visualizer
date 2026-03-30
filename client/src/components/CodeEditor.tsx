import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, Zap, Brain, GraduationCap, Loader2 } from "lucide-react";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onVisualize: () => void;
  onAIVisualize: () => void;
  onLearn: () => void;
  aiVizLoading: boolean;
  tutorLoading: boolean;
}

export function CodeEditor({
  code,
  onChange,
  onVisualize,
  onAIVisualize,
  onLearn,
  aiVizLoading,
  tutorLoading,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Card className="flex-1 min-h-0 flex flex-col bg-card border-border/50 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">
            Python Code
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            onClick={onVisualize}
            className="h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1"
            data-testid="button-visualize"
          >
            <Zap className="w-3 h-3" />
            Visualize
          </Button>
          <Button
            size="sm"
            onClick={onAIVisualize}
            className="h-7 text-xs bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-1"
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
            onClick={onLearn}
            className="h-7 text-xs bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold gap-1"
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
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-transparent text-foreground font-mono text-xs leading-[1.65rem] p-2 pl-12 resize-none focus:outline-none"
          spellCheck={false}
          data-testid="input-code"
        />
      </div>
    </Card>
  );
}
