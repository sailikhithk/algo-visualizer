import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon, Monitor, ChevronDown, Code2 } from "lucide-react";
import { SAMPLE_CODES, CATEGORY_SAMPLES } from "@/lib/sampleCode";

interface HeaderProps {
  onSelectTemplate?: (key: string) => void;
}

/*
 * Mega-menu categories laid out in 3 balanced columns,
 * similar to Codecademy's "Catalog" and Educative's content-type nav.
 */
const MENU_COLUMNS: { category: string; keys: string[] }[][] = [
  // Column 1
  [{ category: "Sorting", keys: CATEGORY_SAMPLES["Sorting"] ?? [] }],
  // Column 2
  [
    { category: "Searching", keys: CATEGORY_SAMPLES["Searching"] ?? [] },
    { category: "Graph", keys: CATEGORY_SAMPLES["Graph"] ?? [] },
    { category: "Tree", keys: CATEGORY_SAMPLES["Tree"] ?? [] },
  ],
  // Column 3
  [
    {
      category: "Dynamic Programming",
      keys: CATEGORY_SAMPLES["Dynamic Programming"] ?? [],
    },
    {
      category: "Linked List",
      keys: CATEGORY_SAMPLES["Linked List"] ?? [],
    },
    {
      category: "Two Pointers",
      keys: CATEGORY_SAMPLES["Two Pointers"] ?? [],
    },
    {
      category: "Sliding Window",
      keys: CATEGORY_SAMPLES["Sliding Window"] ?? [],
    },
    {
      category: "Stack & Queue",
      keys: CATEGORY_SAMPLES["Stack & Queue"] ?? [],
    },
  ],
];

export function Header({ onSelectTemplate }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const cycleTheme = () => {
    const next =
      theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
    setTheme(next);
  };

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  const themeLabel =
    theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System";

  // Close mega-menu on click outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [menuOpen]);

  const handleSelect = (key: string) => {
    onSelectTemplate?.(key);
    setMenuOpen(false);
  };

  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-md flex-shrink-0 relative z-50">
      <div className="w-full px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Left: Logo */}
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

        {/* Center: Algorithms mega-menu trigger */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
              transition-colors
              ${
                menuOpen
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }
            `}
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden sm:inline">Algorithms</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Mega-menu panel */}
          {menuOpen && (
            <div
              className="
                absolute left-1/2 -translate-x-1/2 top-full mt-2
                w-[min(90vw,560px)]
                bg-card border border-border/60 rounded-xl
                shadow-[var(--shadow-lg)]
                p-4 sm:p-5
                animate-in fade-in-0 zoom-in-95 duration-150
              "
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                {MENU_COLUMNS.map((column, ci) => (
                  <div key={ci} className="flex flex-col gap-3">
                    {column.map(({ category, keys }) => (
                      <div key={category}>
                        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          {category}
                        </h3>
                        <ul className="space-y-0.5">
                          {keys.map((key) => (
                            <li key={key}>
                              <button
                                onClick={() => handleSelect(key)}
                                className="
                                  w-full text-left text-[13px] px-2 py-1 rounded-md
                                  text-foreground/80 hover:text-primary hover:bg-primary/10
                                  transition-colors
                                "
                              >
                                {SAMPLE_CODES[key]?.title ?? key}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Badge + Theme toggle */}
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
