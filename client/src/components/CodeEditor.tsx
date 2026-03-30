import { useRef, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, Zap, Brain, GraduationCap, Loader2, Save } from "lucide-react";
import { highlightPython } from "@/lib/pythonHighlighter";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onVisualize: () => void;
  onAIVisualize: () => void;
  onLearn: () => void;
  onSave?: () => void;
  aiVizLoading: boolean;
  tutorLoading: boolean;
}

export function CodeEditor({
  code,
  onChange,
  onVisualize,
  onAIVisualize,
  onLearn,
  onSave,
  aiVizLoading,
  tutorLoading,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const highlightedHtml = useMemo(() => highlightPython(code), [code]);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

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
          {onSave && (
            <Button
              size="sm"
              variant="outline"
              onClick={onSave}
              className="h-7 text-xs font-semibold gap-1"
              data-testid="button-save"
              title="Save code snippet"
            >
              <Save className="w-3 h-3" />
              Save
            </Button>
          )}
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
      {/* Code area always dark — matches Codecademy / Educative editors */}
      <div className="relative flex-1 min-h-0 overflow-hidden bg-[#0d1117] dark:bg-transparent rounded-b-lg">
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-[#161b22] dark:bg-muted/30 border-r border-[#21262d] dark:border-border/30 flex flex-col pt-2 z-10">
          {code.split("\n").map((_, i) => (
            <span
              key={i}
              className="text-[10px] text-[#484f58] dark:text-muted-foreground/50 text-right pr-2 leading-[1.65rem] select-none font-mono"
            >
              {i + 1}
            </span>
          ))}
        </div>
        {/* Syntax-highlighted overlay */}
        <pre
          ref={preRef}
          className="absolute inset-0 pl-12 p-2 font-mono text-xs leading-[1.65rem] whitespace-pre overflow-hidden pointer-events-none select-none m-0"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: highlightedHtml + "\n" }}
        />
        {/* Transparent textarea (user types here) */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          className="relative w-full h-full bg-transparent text-transparent caret-[#e6edf3] dark:caret-foreground font-mono text-xs leading-[1.65rem] p-2 pl-12 resize-none focus:outline-none z-[1]"
          spellCheck={false}
          data-testid="input-code"
        />
      </div>
    </Card>
  );
}
