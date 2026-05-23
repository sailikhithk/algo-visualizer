# Features

Comprehensive feature documentation for AlgoViz.

---

## 1. Auto-Detection Engine

The core differentiator — paste Python code and the app figures out what algorithm you wrote.

### How it works
- **40+ regex patterns** match against function names, structural patterns, and library imports
- **Priority scoring** (1–10) resolves conflicts when code matches multiple patterns
- **Exact name match** (e.g., `bubble_sort`, `binary_search`) gets priority 10
- **Structural match** (e.g., nested loops with swaps) gets lower priority as fallback

### What it detects

| Category | Algorithms | Detection Method |
|---|---|---|
| Sorting | Bubble, Selection, Insertion, Merge, Quick, Heap Sort | Function names + structural patterns (nested loops, pivot/partition, divide-and-conquer) |
| Searching | Binary Search, Linear Search | Function names + `mid = (low + high) // 2` pattern |
| Graph | BFS, DFS, Dijkstra, Topological Sort | Function names + `deque` import + `visited`/`queue` patterns |
| Tree | BST ops, Inorder, Preorder, Postorder, Level Order | `TreeNode` class + `.left`/`.right` + traversal function names |
| Dynamic Programming | Fibonacci, Knapsack, LCS, LIS, Coin Change, Edit Distance | Function names + `dp = [...]` / `memo` patterns |
| Linked List | Operations, Reverse, Cycle Detection | `ListNode` class + `.next` + `slow`/`fast` pointer patterns |
| Two Pointers | Generic two-pointer | `left`/`right` variables with while loop advancing |
| Sliding Window | Generic sliding window | `window` variable + expand/shrink logic |
| Backtracking | N-Queens, Sudoku, Permutations, Combinations | Function names + `backtrack` keyword |
| Stack/Queue | Stack ops, Queue ops | `stack`/`queue` + `push`/`pop`/`popleft` |
| Heap | Heap ops, Heapify | `heapq` import + heap operations |
| Trie | Trie operations | `TrieNode` class + `children` dictionary |
| Union-Find | Disjoint Set | `find`/`union` + `parent` array |
| Segment Tree | Range queries | `segment_tree` + `range_query`/`update` |
| Hash Map | Dictionary operations | `dict()` or `{}` with key access |
| Greedy | Generic greedy | `greedy` keyword + interval sorting |

### Data extraction
Beyond detecting the algorithm, the engine also extracts data from your code:
- **Arrays**: Finds `[64, 34, 25, ...]` patterns for sorting/searching visualizations
- **Graphs**: Parses adjacency list dictionaries (`{'A': ['B', 'C'], ...}`)
- **Trees**: Finds `insert(value)` calls and builds a BST from them

---

## 2. Visualization Modes

### Bar Chart (Array Visualizer)
Used for: Sorting, Binary Search, DP, Two Pointers, Sliding Window, Stack

- Bar height proportional to value
- **Teal** (#2dd4bf) = actively compared/highlighted element
- **Purple** (#8b5cf6) = sorted/finalized element
- **Red** (#ef4444) = elements being swapped
- **Gray** = untouched elements
- Pointer labels (left, right, mid, pivot) appear below bars
- Values displayed above each bar
- Animated transitions using Framer Motion springs

### Network Graph (Graph Visualizer)
Used for: BFS, DFS, Dijkstra, Topological Sort

- Nodes arranged in a circle using trigonometric positioning
- Directed edges with arrowheads
- **Teal glow** = currently visiting node
- **Purple fill** = already visited node
- **Gray** = unvisited node
- Edge highlighting during traversal
- Queue/Stack display at bottom of canvas
- Rendered on HTML5 Canvas for performance

### Tree Diagram (Tree Visualizer)
Used for: BST operations, all traversal orders

- Recursive tree layout with decreasing horizontal spread per level
- Parent-child edges drawn first, then nodes on top
- **Teal glow** = currently visiting node
- Traversal result array shown at bottom
- Rendered on HTML5 Canvas

### Linked List Chain (Linked List Visualizer)
Used for: Reverse Linked List, Cycle Detection

- Horizontal node chain with arrow connectors
- Animated node highlighting with Framer Motion
- Pointer labels (prev, curr, next) shown below nodes
- Scale animation on active node

---

## 3. Playback Controls

| Control | Action |
|---|---|
| **Play/Pause** | Start or stop auto-advancing through steps |
| **Step Forward** | Advance one step |
| **Step Backward** | Go back one step |
| **Reset** | Return to step 1 |
| **Progress Slider** | Scrub to any step in the timeline |
| **Speed Slider** | Adjust animation speed (50ms – 1000ms per step) |

---

## 4. Algorithm Information Panel

For every detected algorithm, the app displays:
- **Algorithm name** (e.g., "Bubble Sort")
- **Time complexity** in teal (e.g., "O(n²)")
- **Space complexity** in purple (e.g., "O(1)")
- **Category badge** (e.g., "sorting", "graph", "dynamic programming")
- **Description** — one-line explanation of how the algorithm works

---

## 5. Built-in Templates

15 pre-written Python solutions organized by category:

| Category | Templates |
|---|---|
| **Sorting** | Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort |
| **Searching** | Binary Search |
| **Graph** | BFS, DFS |
| **Tree** | Inorder Traversal |
| **Dynamic Programming** | Fibonacci, Coin Change |
| **Linked List** | Reverse Linked List |
| **Two Pointers** | Two Sum (Sorted) |
| **Sliding Window** | Max Sum Subarray |
| **Stack & Queue** | Stack Operations |

Each template includes complete, runnable Python code with sample data.

---

## 6. Step Messages

Every visualization step includes a human-readable message explaining what's happening:

**Sorting examples:**
- `"Comparing 64 and 34"`
- `"Swapping 64 and 34"`
- `"Pass 1 complete. 90 is in position."`

**Graph examples:**
- `"Starting BFS from A"`
- `"Visiting B"`
- `"Discovered D via B"`

**DP examples:**
- `"F(4) = F(3) + F(2) = 2 + 1"`
- `"F(4) = 3"`

**Tree examples:**
- `"Going left from 50"`
- `"Visit 20 → Result: [20]"`

---

## 7. Design System

### Color Palette
| Role | Color | HSL |
|---|---|---|
| Background | Deep navy | `225 25% 6%` |
| Card surfaces | Slightly lighter navy | `225 22% 9%` |
| Primary accent | Teal/cyan | `168 80% 48%` |
| Secondary accent | Purple/violet | `260 60% 62%` |
| Swap indicator | Red | `0 72% 51%` |
| Text | Light gray | `210 20% 92%` |
| Muted text | Medium gray | `220 10% 55%` |

### Typography
- **Font**: JetBrains Mono (monospace throughout)
- Code editor, step messages, complexity badges, and UI labels all use the same font family for a cohesive developer aesthetic

### Visual Effects
- **Neon glow** on primary buttons and active elements
- **Grid background** (40px graph paper pattern) in visualization canvas
- **Spring animations** (Framer Motion) on bar chart elements
- **Canvas glow effects** (shadowBlur) on graph and tree nodes
- Custom scrollbar styling matching the dark theme
