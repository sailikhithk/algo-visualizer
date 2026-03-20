# Contributing to AlgoViz

Thanks for your interest in contributing. This guide will help you get started.

---

## Getting Started

```bash
# Fork and clone
git clone https://github.com/<your-username>/algo-visualizer.git
cd algo-visualizer

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app runs at `http://localhost:5000` with hot reload.

---

## Adding a New Algorithm

This is the most common contribution. It involves three files:

### 1. Detection Pattern — `client/src/lib/algorithmDetector.ts`

Add a new entry to the `PATTERNS` array:

```typescript
{
  pattern: /\byour_algorithm_name\b/i,    // regex to match in Python code
  type: 'your_algorithm',                  // unique identifier
  category: 'your_category',               // sorting, graph, tree, etc.
  name: 'Your Algorithm Name',             // display name
  timeComplexity: 'O(n log n)',            // Big-O notation
  spaceComplexity: 'O(n)',                 // Big-O notation
  description: 'Brief explanation.',        // one line
  dataStructure: 'array',                  // array, graph, binary_tree, etc.
  priority: 10                             // 1-10, higher = more specific match
}
```

**Priority guidelines:**
- `10` — Exact function name match (e.g., `\bmerge_sort\b`)
- `8-9` — Strong structural match (e.g., slow/fast pointers for cycle detection)
- `5-7` — Moderate structural match (e.g., nested loops)
- `3-4` — Weak/generic match (e.g., `dp = [...]` for generic DP)

Also add your type to the `AlgorithmType` union type at the top of the file.

### 2. Step Generator — `client/src/lib/visualizationEngine.ts`

Create a generator function that yields `VisualizationStep` objects:

```typescript
export function* yourAlgorithmSteps(arr: number[]): Generator<VisualizationStep> {
  // Initial state
  yield {
    array: [...arr],
    highlights: [],
    sorted: [],
    message: 'Starting Your Algorithm',
    phase: 'init'
  };

  // Algorithm logic with yields at each visual step
  for (let i = 0; i < arr.length; i++) {
    yield {
      array: [...arr],
      highlights: [i],           // indices to highlight in teal
      sorted: [],                // indices already sorted (purple)
      message: `Processing element ${arr[i]}`,
      phase: 'process'
    };
  }

  // Final state
  yield {
    array: [...arr],
    highlights: [],
    sorted: Array.from({ length: arr.length }, (_, i) => i),
    message: 'Your Algorithm complete!',
    phase: 'done'
  };
}
```

**VisualizationStep fields:**

| Field | Type | Used by | Purpose |
|---|---|---|---|
| `array` | `number[]` | ArrayVisualizer | Bar values |
| `highlights` | `number[]` | ArrayVisualizer | Teal highlighted indices |
| `swapping` | `number[]` | ArrayVisualizer | Red swapping indices |
| `sorted` | `number[]` | ArrayVisualizer | Purple finalized indices |
| `pointers` | `Record<string, number>` | ArrayVisualizer | Named pointer labels |
| `message` | `string` | All | Step explanation text |
| `graphVisited` | `string[]` | GraphVisualizer | Visited node names |
| `graphCurrent` | `string` | GraphVisualizer | Currently active node |
| `graphQueue` | `string[]` | GraphVisualizer | Queue/stack contents |
| `graphEdgeHighlight` | `[string, string][]` | GraphVisualizer | Edges to highlight |
| `treeHighlight` | `number[]` | TreeVisualizer | Node values to glow |
| `linkedList` | `{value, next}[]` | LinkedListVisualizer | Linked list state |
| `llHighlight` | `number` | LinkedListVisualizer | Active node index |
| `phase` | `string` | All | Step type for styling |

### 3. Wire it up — `client/src/pages/home.tsx`

In the `generateSteps` function, add a case for your algorithm:

```typescript
case 'your_algorithm': generator = yourAlgorithmSteps(arr); break;
```

Don't forget to import the function at the top of the file.

### 4. Sample Code — `client/src/lib/sampleCode.ts`

Add a Python code sample:

```typescript
your_algorithm: {
  title: 'Your Algorithm',
  code: `def your_algorithm(arr):
    # ... Python implementation
    pass

arr = [64, 34, 25, 12, 22, 11, 90]
print(your_algorithm(arr))`
},
```

And add it to `CATEGORY_SAMPLES` under the appropriate category.

---

## Adding a New Visualization Mode

If your algorithm needs a new type of visualization (not array/graph/tree/linked list):

1. Create a new component in `client/src/components/` (e.g., `MatrixVisualizer.tsx`)
2. Accept `step: VisualizationStep | null` as a prop
3. Add any new fields to the `VisualizationStep` interface in `visualizationEngine.ts`
4. Add rendering logic in `home.tsx`'s `renderVisualization` function

---

## Code Style

- TypeScript strict mode
- Functional components with hooks
- Tailwind CSS for styling (no inline styles except canvas)
- Generator functions (`function*`) for step generation
- Canvas API for graph/tree rendering, Framer Motion for array animations

---

## Pull Request Checklist

- [ ] New algorithm detected correctly from sample Python code
- [ ] Step generator yields meaningful steps with clear messages
- [ ] Visualization animates correctly (play through all steps)
- [ ] Sample code template added
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] Complexity info is accurate
