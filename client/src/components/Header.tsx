import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon, Monitor } from "lucide-react";

export function Header() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const next =
      theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
    setTheme(next);
  };

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  const themeLabel =
    theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System";

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm flex-shrink-0">
      <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-label="Algorithm Visualizer logo"
            >
              <path
                d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-primary-foreground"
              />
              <path
                d="M17.5 14v7M14 17.5h7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="text-primary-foreground"
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
            className="text-[10px] font-mono bg-primary/10 text-primary border-primary/30 hidden sm:flex"
          >
            Interview Prep
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={cycleTheme}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            title={`Theme: ${themeLabel}`}
          >
            <ThemeIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
