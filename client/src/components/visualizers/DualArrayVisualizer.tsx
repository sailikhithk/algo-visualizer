import { motion } from "framer-motion";
import type { VisualizationStep } from "@/lib/visualizationEngine";

interface DualArrayVisualizerProps {
  step: VisualizationStep | null;
}

function ArrayRow({
  label,
  arr,
  highlights = [],
  pointers = {},
  partition,
  sorted = [],
}: {
  label: string;
  arr: number[];
  highlights?: number[];
  pointers?: Record<string, number>;
  partition?: number;
  sorted?: number[];
}) {
  const hlSet = new Set(highlights);
  const sortedSet = new Set(sorted);

  const displayVal = (v: number) => {
    if (v === -999) return "-∞";
    if (v === 999) return "+∞";
    return String(v);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-stretch gap-0.5 relative">
        {arr.map((val, idx) => {
          const isHL = hlSet.has(idx);
          const isSorted = sortedSet.has(idx);
          const isPartBorder = partition !== undefined && idx === partition - 1;

          let bg = "bg-muted/40 border-muted";
          if (isHL) bg = "bg-[hsl(168,80%,48%)] border-[hsl(168,80%,60%)]";
          else if (isSorted)
            bg = "bg-[hsl(260,60%,62%)] border-[hsl(260,60%,70%)]";

          // pointer names for this index
          const ptrNames = Object.entries(pointers)
            .filter(([, i]) => i === idx)
            .map(([name]) => name);

          return (
            <div key={idx} className="relative flex flex-col items-center">
              {/* pointer label above */}
              <div className="h-5 flex items-end justify-center">
                {ptrNames.map((n) => (
                  <span
                    key={n}
                    className="text-[9px] font-bold font-mono text-[hsl(168,80%,48%)] whitespace-nowrap leading-none px-0.5"
                  >
                    {n}
                  </span>
                ))}
              </div>
              <motion.div
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded border-2 font-mono text-xs font-bold transition-colors duration-200 ${bg} ${isHL ? "text-[hsl(225,25%,6%)]" : "text-foreground"}`}
              >
                {displayVal(val)}
                {/* partition divider — right edge of this cell */}
                {isPartBorder && (
                  <div className="absolute -right-[3px] top-0 h-full w-[3px] bg-[hsl(45,90%,60%)] rounded" />
                )}
              </motion.div>
              {/* index label below */}
              <span className="text-[9px] text-muted-foreground/50 font-mono mt-0.5">
                {idx}
              </span>
            </div>
          );
        })}
        {/* partition label */}
        {partition !== undefined &&
          partition >= 0 &&
          partition <= arr.length && (
            <div
              className="absolute -top-0 text-[8px] font-mono text-[hsl(45,90%,60%)] font-bold whitespace-nowrap"
              style={{ left: `${partition * 44 - 8}px`, top: "-18px" }}
            >
              cut
            </div>
          )}
      </div>
    </div>
  );
}

export function DualArrayVisualizer({ step }: DualArrayVisualizerProps) {
  if (!step) return null;

  const {
    array,
    array2,
    highlights = [],
    highlights2 = [],
    pointers = {},
    pointers2 = {},
    partition1,
    partition2,
    sorted = [],
    variables,
  } = step;

  const hasArray1 = array && array.length > 0;
  const hasArray2 = array2 && array2.length > 0;

  if (!hasArray1 && !hasArray2) return null;

  return (
    <div
      className="flex flex-col gap-6 w-full px-4 py-2"
      data-testid="dual-array-visualizer"
    >
      {hasArray1 && (
        <ArrayRow
          label="nums1"
          arr={array!}
          highlights={highlights}
          pointers={pointers}
          partition={partition1}
          sorted={sorted}
        />
      )}
      {hasArray2 && (
        <ArrayRow
          label="nums2"
          arr={array2!}
          highlights={highlights2}
          pointers={pointers2}
          partition={partition2}
        />
      )}

      {/* Key variables display */}
      {variables && Object.keys(variables).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {Object.entries(variables).map(([k, v]) => (
            <div
              key={k}
              className="flex items-center gap-1 bg-muted/30 rounded px-2 py-1"
            >
              <span className="text-[9px] font-mono text-muted-foreground">
                {k}
              </span>
              <span className="text-[9px] font-mono font-bold text-[hsl(168,80%,48%)]">
                {v === -999 ? "-∞" : v === 999 ? "+∞" : String(v)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
