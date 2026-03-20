import { motion, AnimatePresence } from 'framer-motion';
import type { VisualizationStep } from '@/lib/visualizationEngine';

interface ArrayVisualizerProps {
  step: VisualizationStep | null;
  maxVal?: number;
}

export function ArrayVisualizer({ step, maxVal }: ArrayVisualizerProps) {
  if (!step?.array || step.array.length === 0) return null;

  const arr = step.array;
  const max = maxVal || Math.max(...arr.filter(v => v >= 0), 1);
  const highlights = new Set(step.highlights || []);
  const swapping = new Set(step.swapping || []);
  const sorted = new Set(step.sorted || []);

  return (
    <div className="flex items-end justify-center gap-1 h-64 w-full px-4" data-testid="array-visualizer">
      <AnimatePresence mode="popLayout">
        {arr.map((val, idx) => {
          const height = Math.max(((val < 0 ? 0 : val) / max) * 100, 5);
          let bgClass = 'bg-muted-foreground/30';
          
          if (swapping.has(idx)) {
            bgClass = 'bg-red-500';
          } else if (highlights.has(idx)) {
            bgClass = 'bg-[hsl(168,80%,48%)]';
          } else if (sorted.has(idx)) {
            bgClass = 'bg-[hsl(260,60%,62%)]';
          }

          return (
            <motion.div
              key={`${idx}`}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                height: `${height}%`,
                scale: swapping.has(idx) ? 1.1 : 1,
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 25,
                duration: 0.2 
              }}
              className={`relative rounded-t-sm min-w-[20px] max-w-[48px] flex-1 transition-colors duration-200 ${bgClass}`}
              style={{ height: `${height}%` }}
            >
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                {val < 0 ? '∞' : val}
              </span>
              {step.pointers && Object.entries(step.pointers).map(([name, pIdx]) => (
                pIdx === idx ? (
                  <span key={name} className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[hsl(168,80%,48%)] whitespace-nowrap font-bold">
                    {name}
                  </span>
                ) : null
              ))}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
