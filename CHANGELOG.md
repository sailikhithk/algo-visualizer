# Changelog

All notable changes to AlgoViz will be documented in this file.

---

## [1.0.0] — 2026-03-19

### Added

**Core**
- Auto-detection engine with 40+ regex patterns and priority scoring
- Step-by-step visualization generator using JavaScript generators
- Playback controls: play, pause, step forward/backward, reset, speed adjustment, timeline scrub

**Algorithms**
- Sorting: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort
- Searching: Binary Search, Linear Search
- Graph: BFS, DFS, Dijkstra, Topological Sort
- Tree: BST Insert/Search, Inorder, Preorder, Postorder, Level Order Traversal
- Dynamic Programming: Fibonacci, 0/1 Knapsack, LCS, LIS, Coin Change, Edit Distance
- Linked List: Operations, Reverse, Cycle Detection (Floyd's)
- Two Pointers, Sliding Window
- Stack, Queue, Heap, Trie, Union-Find, Segment Tree
- Backtracking: N-Queens, Sudoku, Permutations, Combinations
- Greedy Algorithms

**Visualizations**
- Bar chart (ArrayVisualizer) with Framer Motion spring animations
- Network graph (GraphVisualizer) with Canvas API and glow effects
- Binary tree diagram (TreeVisualizer) with recursive layout
- Linked list chain (LinkedListVisualizer) with arrow connectors

**UI**
- Dark neon theme (navy + teal + purple)
- 15 built-in Python code templates
- Code editor with line numbers
- Algorithm info panel (name, time/space complexity, category, description)
- Grid background in visualization canvas
- JetBrains Mono typography throughout
- Responsive two-column layout

**Infrastructure**
- React 18 + TypeScript + Tailwind CSS v3 + Vite 5
- shadcn/ui component library
- Express backend serving static build
- Production build with Vite bundling
