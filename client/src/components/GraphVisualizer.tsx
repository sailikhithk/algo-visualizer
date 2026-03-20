import { useEffect, useRef } from 'react';
import type { VisualizationStep } from '@/lib/visualizationEngine';

interface GraphVisualizerProps {
  step: VisualizationStep | null;
  nodes: string[];
  edges: [string, string, number?][];
}

export function GraphVisualizer({ step, nodes, edges }: GraphVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // Position nodes in a circle
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.35;
    const nodePositions: Record<string, { x: number; y: number }> = {};

    nodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
      nodePositions[node] = {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    });

    const visited = new Set(step?.graphVisited || []);
    const current = step?.graphCurrent || '';
    const edgeHL = new Set((step?.graphEdgeHighlight || []).map(e => `${e[0]}-${e[1]}`));

    // Draw edges
    for (const [u, v] of edges) {
      const from = nodePositions[u];
      const to = nodePositions[v];
      if (!from || !to) continue;

      const isHighlighted = edgeHL.has(`${u}-${v}`) || edgeHL.has(`${v}-${u}`);

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = isHighlighted ? '#2dd4bf' : visited.has(u) && visited.has(v) ? 'rgba(139,92,246,0.5)' : 'rgba(100,100,120,0.3)';
      ctx.lineWidth = isHighlighted ? 3 : 1.5;
      ctx.stroke();

      // Arrow
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      const arrowLen = 10;
      const arrowX = to.x - 22 * Math.cos(angle);
      const arrowY = to.y - 22 * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(arrowX - arrowLen * Math.cos(angle - 0.4), arrowY - arrowLen * Math.sin(angle - 0.4));
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(arrowX - arrowLen * Math.cos(angle + 0.4), arrowY - arrowLen * Math.sin(angle + 0.4));
      ctx.stroke();
    }

    // Draw nodes
    for (const node of nodes) {
      const pos = nodePositions[node];
      if (!pos) continue;
      const isCurrent = node === current;
      const isVisited = visited.has(node);

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
      
      if (isCurrent) {
        ctx.fillStyle = '#2dd4bf';
        ctx.shadowColor = '#2dd4bf';
        ctx.shadowBlur = 15;
      } else if (isVisited) {
        ctx.fillStyle = '#8b5cf6';
        ctx.shadowColor = '#8b5cf6';
        ctx.shadowBlur = 10;
      } else {
        ctx.fillStyle = 'rgba(60,60,80,0.8)';
        ctx.shadowBlur = 0;
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = isCurrent ? '#2dd4bf' : isVisited ? '#8b5cf6' : 'rgba(100,100,120,0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.fillStyle = isCurrent ? '#0d1117' : '#e4e4e7';
      ctx.font = '600 14px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node, pos.x, pos.y);
    }
  }, [step, nodes, edges]);

  return (
    <div className="w-full h-64 relative" data-testid="graph-visualizer">
      <canvas ref={canvasRef} className="w-full h-full" />
      {step?.graphQueue && step.graphQueue.length > 0 && (
        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-xs font-mono">
          <span className="text-muted-foreground">Queue:</span>
          {step.graphQueue.map((n, i) => (
            <span key={i} className="px-1.5 py-0.5 bg-muted rounded text-foreground">{n}</span>
          ))}
        </div>
      )}
    </div>
  );
}
