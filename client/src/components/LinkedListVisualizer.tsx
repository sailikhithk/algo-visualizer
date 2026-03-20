import { motion } from 'framer-motion';
import type { VisualizationStep } from '@/lib/visualizationEngine';

interface LinkedListVisualizerProps {
  step: VisualizationStep | null;
}

export function LinkedListVisualizer({ step }: LinkedListVisualizerProps) {
  if (!step?.linkedList) return null;

  const list = step.linkedList;
  const highlight = step.llHighlight ?? -1;
  const pointers = step.llPointers || {};

  return (
    <div className="flex items-center justify-center gap-0 h-64 w-full overflow-x-auto px-4" data-testid="linked-list-visualizer">
      {list.map((node, idx) => (
        <div key={idx} className="flex items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: highlight === idx ? 1.1 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-lg border-2 transition-colors duration-200 ${
              highlight === idx 
                ? 'border-[hsl(168,80%,48%)] bg-[hsl(168,80%,48%/0.15)]' 
                : 'border-muted bg-card'
            }`}
          >
            <span className={`text-sm font-mono font-bold ${highlight === idx ? 'text-[hsl(168,80%,48%)]' : 'text-foreground'}`}>
              {node.value}
            </span>
            {/* Pointer labels below */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
              {Object.entries(pointers).map(([name, pIdx]) => (
                pIdx === idx ? (
                  <span key={name} className="text-[9px] font-mono text-[hsl(260,60%,62%)] font-bold whitespace-nowrap">
                    {name}
                  </span>
                ) : null
              ))}
            </div>
          </motion.div>
          {/* Arrow */}
          {idx < list.length - 1 && (
            <div className="flex items-center mx-1">
              <div className="w-6 h-0.5 bg-muted-foreground/40" />
              <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-muted-foreground/40" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
