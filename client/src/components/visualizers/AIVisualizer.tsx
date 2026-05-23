import type { VisualizationStep } from "@/lib/visualizationEngine";
import { DualArrayVisualizer } from "./DualArrayVisualizer";
import { ArrayVisualizer } from "./ArrayVisualizer";
import { BarChart3 } from "lucide-react";

export type AIVisualizationType =
  | "dual_array"
  | "array"
  | "dp_table"
  | "graph"
  | "tree"
  | "unknown";

interface AIVisualizerProps {
  step: VisualizationStep | null;
  visualizationType: AIVisualizationType;
  maxVal?: number;
}

/** Renders AI-generated visualization steps by dispatching to the correct sub-visualizer. */
export function AIVisualizer({
  step,
  visualizationType,
  maxVal = 100,
}: AIVisualizerProps) {
  if (!step) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
        <BarChart3 className="w-10 h-10 mb-2 opacity-30" />
        <p className="text-sm">No visualization data yet</p>
      </div>
    );
  }

  switch (visualizationType) {
    case "dual_array":
      return <DualArrayVisualizer step={step} />;

    case "dp_table":
      return <DPTableVisualizer step={step} />;

    case "array":
    default:
      return <ArrayVisualizer step={step} maxVal={maxVal} />;
  }
}

/* ─── Inline DP Table Visualizer ─────────────────────────────────────────── */
function DPTableVisualizer({ step }: { step: VisualizationStep }) {
  const { dpTable, dpHighlight, dpFilled } = step;
  if (!dpTable || dpTable.length === 0) {
    return (
      <ArrayVisualizer
        step={step}
        maxVal={Math.max(...(step.array || [1]), 1)}
      />
    );
  }

  const filledSet = new Set((dpFilled || []).map(([r, c]) => `${r},${c}`));
  const [hlR, hlC] = dpHighlight || [-1, -1];

  return (
    <div className="overflow-auto max-w-full max-h-full p-2">
      <table className="border-collapse text-xs font-mono">
        <tbody>
          {dpTable.map((row, r) => (
            <tr key={r}>
              {row.map((val, c) => {
                const isHL = r === hlR && c === hlC;
                const isFilled = filledSet.has(`${r},${c}`);
                return (
                  <td
                    key={c}
                    className={`w-8 h-8 text-center border border-border/40 text-[11px] font-mono transition-colors duration-200
                      ${isHL ? "bg-primary text-primary-foreground font-bold" : isFilled ? "bg-accent/30 text-foreground" : "bg-muted/20 text-muted-foreground"}`}
                  >
                    {val === -999 ? "-∞" : val === 999 ? "+∞" : val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
