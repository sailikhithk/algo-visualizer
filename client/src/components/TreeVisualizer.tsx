import { useEffect, useRef } from 'react';
import type { VisualizationStep } from '@/lib/visualizationEngine';

interface TreeVisualizerProps {
  step: VisualizationStep | null;
  tree: any;
}

interface TreeLayout {
  value: number;
  x: number;
  y: number;
  left?: TreeLayout;
  right?: TreeLayout;
}

function layoutTree(node: any, x: number, y: number, xSpread: number, level: number): TreeLayout | null {
  if (!node) return null;
  return {
    value: node.value,
    x,
    y,
    left: layoutTree(node.left, x - xSpread, y + 60, xSpread * 0.55, level + 1),
    right: layoutTree(node.right, x + xSpread, y + 60, xSpread * 0.55, level + 1),
  };
}

function drawTree(ctx: CanvasRenderingContext2D, layout: TreeLayout | null, highlighted: Set<number>) {
  if (!layout) return;

  // Draw edges first
  if (layout.left) {
    ctx.beginPath();
    ctx.moveTo(layout.x, layout.y);
    ctx.lineTo(layout.left.x, layout.left.y);
    ctx.strokeStyle = highlighted.has(layout.value) && highlighted.has(layout.left.value) ? '#2dd4bf' : 'rgba(100,100,120,0.4)';
    ctx.lineWidth = highlighted.has(layout.value) ? 2.5 : 1.5;
    ctx.stroke();
    drawTree(ctx, layout.left, highlighted);
  }
  if (layout.right) {
    ctx.beginPath();
    ctx.moveTo(layout.x, layout.y);
    ctx.lineTo(layout.right.x, layout.right.y);
    ctx.strokeStyle = highlighted.has(layout.value) && highlighted.has(layout.right.value) ? '#2dd4bf' : 'rgba(100,100,120,0.4)';
    ctx.lineWidth = highlighted.has(layout.value) ? 2.5 : 1.5;
    ctx.stroke();
    drawTree(ctx, layout.right, highlighted);
  }

  // Draw node
  const isHL = highlighted.has(layout.value);
  ctx.beginPath();
  ctx.arc(layout.x, layout.y, 18, 0, Math.PI * 2);
  
  if (isHL) {
    ctx.fillStyle = '#2dd4bf';
    ctx.shadowColor = '#2dd4bf';
    ctx.shadowBlur = 12;
  } else {
    ctx.fillStyle = 'rgba(60,60,80,0.8)';
    ctx.shadowBlur = 0;
  }
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = isHL ? '#2dd4bf' : 'rgba(100,100,120,0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = isHL ? '#0d1117' : '#e4e4e7';
  ctx.font = '600 12px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(layout.value), layout.x, layout.y);
}

export function TreeVisualizer({ step, tree }: TreeVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !tree) return;
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

    const layout = layoutTree(tree, w / 2, 30, w * 0.22, 0);
    const highlighted = new Set(step?.treeHighlight || []);
    drawTree(ctx, layout, highlighted);
  }, [step, tree]);

  return (
    <div className="w-full h-64 relative" data-testid="tree-visualizer">
      <canvas ref={canvasRef} className="w-full h-full" />
      {step?.array && step.array.length > 0 && (
        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-xs font-mono">
          <span className="text-muted-foreground">Result:</span>
          {step.array.map((n, i) => (
            <span key={i} className="px-1.5 py-0.5 bg-muted rounded text-foreground">{n}</span>
          ))}
        </div>
      )}
    </div>
  );
}
