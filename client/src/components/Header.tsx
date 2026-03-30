import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
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
  );
}
