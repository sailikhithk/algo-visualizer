<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-22c55e" alt="MIT License" />
</p>

<h1 align="center">⚡ AlgoViz</h1>
<p align="center">
  <strong>Algorithm Visualizer for Coding Interview Preparation</strong>
</p>
<p align="center">
  Paste your Python code → Auto-detect the algorithm → Watch it animate step by step
</p>

---

## What is AlgoViz?

AlgoViz is a web-based algorithm visualization tool designed for **coding interview preparation**. Instead of mentally tracing through code, you paste your Python solution and instantly see how the algorithm works through animated, step-by-step visualizations.

The app **auto-detects** which algorithm and data structure your code uses via pattern matching — no manual selection needed. It then generates an appropriate visualization (bar chart for arrays, network graph for graph algorithms, tree diagram for BSTs, etc.) and animates through every operation.

---

## Features

### Core
- **Auto-Detection Engine** — Paste Python code and the app identifies the algorithm using 40+ regex patterns with priority scoring
- **Step-by-Step Animation** — Every comparison, swap, traversal, and state change is animated with explanatory messages
- **Playback Controls** — Play, pause, step forward/backward, scrub the timeline, adjust speed
- **Complexity Analysis** — Time and space complexity auto-displayed with algorithm description

### Visualizations
| Type | What it shows | Used for |
|---|---|---|
| **Bar Chart** | Array elements as bars with height proportional to value | Sorting, searching, DP, sliding window, two pointers |
| **Network Graph** | Nodes in a circle with directed edges | BFS, DFS, Dijkstra, topological sort |
| **Tree Diagram** | Binary tree with parent-child edges | BST operations, inorder/preorder/postorder traversal |
| **Linked List** | Nodes connected by arrows | Reverse linked list, cycle detection |

### Algorithms Supported

<details>
<summary><strong>Sorting (5)</strong></summary>

- Bubble Sort — O(n²) time, O(1) space
- Selection Sort — O(n²) time, O(1) space
- Insertion Sort — O(n²) time, O(1) space
- Merge Sort — O(n log n) time, O(n) space
- Quick Sort — O(n log n) time, O(log n) space
</details>

<details>
<summary><strong>Searching (2)</strong></summary>

- Binary Search — O(log n) time, O(1) space
- Linear Search — O(n) time, O(1) space
</details>

<details>
<summary><strong>Graph (4)</strong></summary>

- Breadth-First Search (BFS) — O(V + E) time, O(V) space
- Depth-First Search (DFS) — O(V + E) time, O(V) space
- Dijkstra's Algorithm — O((V+E) log V) time, O(V) space
- Topological Sort — O(V + E) time, O(V) space
</details>

<details>
<summary><strong>Tree (5)</strong></summary>

- BST Insert / Search
- Inorder Traversal (Left → Root → Right)
- Preorder Traversal (Root → Left → Right)
- Postorder Traversal (Left → Right → Root)
- Level Order Traversal
</details>

<details>
<summary><strong>Dynamic Programming (7)</strong></summary>

- Fibonacci (tabulation)
- 0/1 Knapsack
- Longest Common Subsequence (LCS)
- Longest Increasing Subsequence (LIS)
- Coin Change
- Edit Distance
- Generic DP detection (memo/tabulation patterns)
</details>

<details>
<summary><strong>Linked List (3)</strong></summary>

- Linked List Operations
- Reverse Linked List
- Cycle Detection (Floyd's)
</details>

<details>
<summary><strong>Other Patterns (10+)</strong></summary>

- Two Pointers
- Sliding Window
- Stack Operations (LIFO)
- Queue Operations (FIFO)
- Heap / Priority Queue / Heapify
- Trie (Prefix Tree)
- Union-Find (Disjoint Set)
- Segment Tree
- Hash Map
- Backtracking (N-Queens, Sudoku, Permutations, Combinations)
- Greedy Algorithms
</details>

### UI / UX
- **Dark Neon Theme** — Deep navy background with teal (#2dd4bf) and purple (#8b5cf6) accents
- **15 Built-in Templates** — Pre-written Python solutions organized by category (Sorting, Graph, Tree, DP, etc.)
- **Code Editor** — Syntax-highlighted textarea with line numbers
- **Grid Background** — Subtle graph paper pattern in the visualization canvas
- **Responsive Layout** — Two-column on desktop, stacked on mobile
- **JetBrains Mono** — Monospace font throughout for that developer aesthetic

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Install & Run

```bash
git clone https://github.com/sailikhithk/algo-visualizer.git
cd algo-visualizer
npm install
npm run dev
```

Open `http://localhost:5000` in your browser.

### Build for Production

```bash
npm run build
NODE_ENV=production node dist/index.cjs
```

---

## Project Structure

```
algo-visualizer/
├── client/
│   ├── index.html                      # Entry HTML with fonts
│   └── src/
│       ├── App.tsx                     # Router + dark mode setup
│       ├── pages/
│       │   └── home.tsx                # Main page (editor + viz + controls)
│       ├── components/
│       │   ├── ArrayVisualizer.tsx     # Bar chart visualization
│       │   ├── GraphVisualizer.tsx     # Canvas-based graph network
│       │   ├── TreeVisualizer.tsx      # Canvas-based binary tree
│       │   └── LinkedListVisualizer.tsx # Node-arrow chain
│       └── lib/
│           ├── algorithmDetector.ts    # Pattern matching engine (40+ patterns)
│           ├── visualizationEngine.ts  # Step generators for each algorithm
│           └── sampleCode.ts           # 15 Python code templates
├── server/
│   ├── index.ts                        # Express server
│   └── routes.ts                       # API routes
├── shared/
│   └── schema.ts                       # Data model
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

---

## How Detection Works

The algorithm detector (`algorithmDetector.ts`) uses **prioritized regex pattern matching** against your Python code:

1. Each pattern has a priority score (1-10)
2. All matching patterns are collected
3. The highest-priority match wins
4. If a function name like `bubble_sort` or `binary_search` is found, that gets priority 10 (exact match)
5. Structural patterns (nested loops with swaps, divide-and-conquer recursion) get lower priority as fallback

Example detection flow:
```
Input: "def merge_sort(arr)..."
  → Pattern "merge.?sort" matches (priority 10)
  → Pattern "def merge(...)" matches (priority 10)
  → Best match: Merge Sort
  → Generates merge sort visualization steps
  → Displays: O(n log n) time, O(n) space
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Tailwind CSS v3 |
| **UI Components** | shadcn/ui (Radix primitives) |
| **Animation** | Framer Motion (array bars), Canvas API (graphs, trees) |
| **Icons** | Lucide React |
| **Bundler** | Vite 5 |
| **Backend** | Express (serves static build) |
| **Font** | JetBrains Mono (Google Fonts) |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-algorithm`)
3. Add your algorithm pattern in `algorithmDetector.ts`
4. Add the step generator in `visualizationEngine.ts`
5. Add a sample in `sampleCode.ts`
6. Submit a pull request

### Adding a New Algorithm

To add support for a new algorithm:

**Step 1:** Add a detection pattern in `client/src/lib/algorithmDetector.ts`:
```typescript
{
  pattern: /\byour_algorithm\b/i,
  type: 'your_algorithm',
  category: 'your_category',
  name: 'Your Algorithm',
  timeComplexity: 'O(?)',
  spaceComplexity: 'O(?)',
  description: 'What it does.',
  dataStructure: 'array',
  priority: 10
}
```

**Step 2:** Add a step generator in `client/src/lib/visualizationEngine.ts`:
```typescript
export function* yourAlgorithmSteps(arr: number[]): Generator<VisualizationStep> {
  yield { array: [...arr], highlights: [], sorted: [], message: 'Starting...', phase: 'init' };
  // ... generate steps
  yield { array: [...arr], highlights: [], sorted: [], message: 'Done!', phase: 'done' };
}
```

**Step 3:** Wire it up in `home.tsx`'s `generateSteps` function.

**Step 4:** Add a sample in `sampleCode.ts`.

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with <a href="https://www.perplexity.ai/computer">Perplexity Computer</a>
</p>
