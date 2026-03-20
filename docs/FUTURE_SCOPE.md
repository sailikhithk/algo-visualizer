# Future Scope & Roadmap

**Product**: AlgoViz — Algorithm Visualizer  
**Last Updated**: March 19, 2026  
**Author**: Sai Likhith K  

---

## Table of Contents

1. [Vision](#1-vision)
2. [Roadmap Overview](#2-roadmap-overview)
3. [Phase 1 — Enhanced Detection & Visualization (v1.1)](#3-phase-1--enhanced-detection--visualization-v11)
4. [Phase 2 — Code Execution & Intelligence (v2.0)](#4-phase-2--code-execution--intelligence-v20)
5. [Phase 3 — Collaboration & Learning Platform (v2.5)](#5-phase-3--collaboration--learning-platform-v25)
6. [Phase 4 — Enterprise & Education (v3.0)](#6-phase-4--enterprise--education-v30)
7. [Technical Debt & Infrastructure](#7-technical-debt--infrastructure)
8. [Algorithm Expansion Matrix](#8-algorithm-expansion-matrix)
9. [Community & Open Source Strategy](#9-community--open-source-strategy)
10. [Research Directions](#10-research-directions)
11. [Metrics & Success Criteria](#11-metrics--success-criteria)

---

## 1. Vision

AlgoViz aims to become the **definitive tool for algorithm visualization** — bridging the gap between writing code and understanding how it works. The long-term vision is to evolve from a single-user paste-and-visualize tool into a full-fledged **interactive learning platform** used by students, educators, and engineering teams worldwide.

### Core Principles (guiding all future development)

- **Code-first**: The input is always real code, not a contrived UI
- **Zero config**: Paste and go — no setup, no language selection, no manual annotations
- **Depth over breadth**: Fewer algorithms done brilliantly beats many done poorly
- **Open**: MIT-licensed, community-driven, extensible by design

---

## 2. Roadmap Overview

```
Q2 2026          Q3 2026          Q4 2026          Q1 2027
────────────────────────────────────────────────────────────
  v1.1              v2.0              v2.5              v3.0
  Enhanced          Code Execution    Collaboration     Enterprise &
  Detection &       & AI              & Learning        Education
  Visualization     Intelligence      Platform
────────────────────────────────────────────────────────────
```

| Phase | Version | Target | Theme |
|-------|---------|--------|-------|
| 1 | v1.1 | Q2 2026 | More algorithms, better visuals, multi-language |
| 2 | v2.0 | Q3 2026 | Real code execution, AI-powered explanations |
| 3 | v2.5 | Q4 2026 | Sharing, classrooms, curated learning paths |
| 4 | v3.0 | Q1 2027 | Enterprise dashboards, LMS integration, analytics |

---

## 3. Phase 1 — Enhanced Detection & Visualization (v1.1)

**Target**: Q2 2026  
**Theme**: Expand algorithm coverage and polish the visual experience

### 3.1 New Algorithm Support

| Algorithm | Visualization Type | Priority |
|---|---|---|
| **Heap Sort** (heapify animation) | Array bars with tree overlay showing heap structure | High |
| **Trie operations** (insert, search, startsWith) | Animated character-by-character tree with highlighted paths | High |
| **Segment Tree** (build, query, update) | Tree with range labels, highlighted query paths | High |
| **Union-Find** (union, find with path compression) | Forest of trees that merge on union operations | High |
| **Dijkstra's algorithm** | Graph with edge weights, distance labels, priority queue state | Medium |
| **A\* search** | Grid with heuristic coloring, open/closed sets | Medium |
| **Kadane's algorithm** | Array with sliding current/max subarray highlight | Medium |
| **Floyd-Warshall** | Distance matrix with cell-by-cell updates | Medium |
| **Bellman-Ford** | Graph with relaxation waves | Low |
| **Kruskal's / Prim's** (MST) | Graph with edges highlighted in MST order | Low |

### 3.2 Multi-Language Support

Currently the detector is Python-only. Phase 1 extends to:

- **JavaScript / TypeScript** — second most common interview language
- **Java** — widely used in competitive programming and enterprise interviews
- **C++** — competitive programming standard

**Implementation approach**:
- Language auto-detection via syntax heuristics (indentation vs braces, `def` vs `function` vs `public void`)
- Language-specific regex pattern sets in the detection engine
- Shared visualization pipeline (language-agnostic step generation)
- Monaco Editor integration with proper syntax highlighting per language

### 3.3 Visual Improvements

| Feature | Description |
|---|---|
| **3D array visualization** | WebGL-powered 2D matrix visualization for DP tables (knapsack, edit distance) |
| **Comparison view** | Side-by-side visualization of two algorithms on the same input (e.g., BFS vs DFS) |
| **Step annotations** | Inline code highlights synced with visualization (highlight the line being executed) |
| **Custom color themes** | User-selectable themes (dark neon, light mode, high contrast, solarized) |
| **Zoom and pan** | Canvas-based visualizations support pinch-to-zoom and drag-to-pan |
| **Responsive mobile** | Full touch-friendly controls, stacked layout on small screens |

### 3.4 Export & Sharing

- **GIF/MP4 export** — Record the entire visualization as an animated GIF or video
- **PNG snapshot** — Single-frame export of the current visualization state
- **Shareable links** — Encode algorithm + input in URL for one-click sharing
- **Embed mode** — `<iframe>` embed code for blog posts and documentation

---

## 4. Phase 2 — Code Execution & Intelligence (v2.0)

**Target**: Q3 2026  
**Theme**: Move from pattern matching to real execution; add AI-powered insights

### 4.1 Sandboxed Code Execution

The v1.0 detection engine uses regex pattern matching — it never executes the user's code. v2.0 introduces a **sandboxed execution environment**:

- **Pyodide integration** (Python in WebAssembly) — runs user code in-browser, zero server cost
- **Instrumented execution** — inject tracing hooks to capture every variable mutation, function call, and loop iteration
- **Real data flow** — visualize actual runtime values instead of pattern-extracted estimates
- **Execution timeline** — scrubber to jump to any point in execution history

**Benefits**:
- 100% accurate visualization (no pattern-matching false positives)
- Works with any valid Python code, even unknown algorithms
- Captures edge cases and runtime behavior

**Architecture**:

```
User Code → Pyodide (WASM) → Instrumented Trace → Step Generator → Visualization
                ↓
         Sandbox (no network, no filesystem, memory-limited)
```

### 4.2 AI-Powered Explanations

Integrate LLM capabilities to provide:

| Feature | Description |
|---|---|
| **Algorithm explanation** | Natural language explanation of what the code does and why |
| **Complexity analysis** | AI-generated time/space complexity with reasoning |
| **Optimization suggestions** | "Your bubble sort is O(n²) — here's how to optimize with merge sort" |
| **Bug detection** | Highlight potential issues (off-by-one, missing base case, infinite loops) |
| **Interview tips** | "This is a common Google interview pattern — here's the follow-up they usually ask" |

**Implementation**:
- Client-side LLM API calls (OpenAI / Anthropic / local models)
- User provides their own API key (privacy-first — no code sent to our servers)
- Optional: local model support via WebLLM for fully offline usage

### 4.3 Interactive Code Editor

Replace the current textarea with a full-featured editor:

- **Monaco Editor** with IntelliSense, bracket matching, minimap
- **Breakpoints** — set visual breakpoints that pause the visualization
- **Variable watch** — pin variables to see their values at each step
- **Edit-and-rerun** — modify code and instantly see updated visualization
- **Template library** — browsable gallery of 50+ algorithm templates by category

---

## 5. Phase 3 — Collaboration & Learning Platform (v2.5)

**Target**: Q4 2026  
**Theme**: Transform from a tool into a learning ecosystem

### 5.1 User Accounts & Persistence

- **Auth** — GitHub OAuth, Google Sign-In, email/password
- **Save visualizations** — bookmark and organize past sessions
- **History** — browse all past code submissions with their visualizations
- **Progress tracking** — track which algorithms you've visualized and studied

### 5.2 Learning Paths

Curated sequences of algorithms that build on each other:

| Path | Algorithms (in order) | Duration |
|---|---|---|
| **Sorting Fundamentals** | Bubble → Selection → Insertion → Merge → Quick → Heap | 2 hours |
| **Graph Mastery** | BFS → DFS → Dijkstra → Bellman-Ford → Floyd-Warshall → Topo Sort → MST | 4 hours |
| **Dynamic Programming** | Fibonacci → Climbing Stairs → Knapsack → LCS → LIS → Edit Distance → Coin Change | 3 hours |
| **Tree Traversals** | Inorder → Preorder → Postorder → Level Order → BST Search → BST Insert → Delete | 2 hours |
| **Interview Sprint** | Binary Search → Two Pointers → Sliding Window → BFS → DFS → DP → Backtracking | 6 hours |

Each path includes:
- Pre-written code for each algorithm
- Guided visualization with annotations
- Quiz questions ("What happens if we change the input?")
- Complexity comparison charts

### 5.3 Classroom Mode

For educators and bootcamps:

- **Instructor dashboard** — create classes, assign algorithms, track student progress
- **Live visualization** — instructor shares a visualization session; students see it in real-time
- **Student submissions** — students paste their code, instructor sees all visualizations on a grid
- **Annotation layer** — instructor can draw on visualizations and add voice notes
- **Grading rubric** — automatic complexity analysis + manual instructor notes

### 5.4 Community Features

- **Public gallery** — share your visualizations with the community
- **Upvoting & comments** — community curation of best implementations
- **Algorithm challenges** — weekly challenges ("Optimize this from O(n²) to O(n log n)")
- **Discussion forums** — per-algorithm discussion threads

---

## 6. Phase 4 — Enterprise & Education (v3.0)

**Target**: Q1 2027  
**Theme**: Monetization, institutional adoption, and scale

### 6.1 Enterprise Features

| Feature | Description |
|---|---|
| **SSO / SAML** | Enterprise single sign-on integration |
| **Team workspaces** | Shared algorithm libraries within organizations |
| **Custom branding** | White-label the visualizer with company/university logos |
| **Admin dashboard** | Usage analytics, user management, content control |
| **API access** | Programmatic access to detection and visualization engines |
| **Self-hosted option** | Docker deployment for air-gapped environments |

### 6.2 LMS Integration

- **LTI 1.3 support** — embed directly in Canvas, Blackboard, Moodle, Brightspace
- **Grade passback** — automatically submit completion/score to the LMS gradebook
- **Assignment creation** — instructors create "Visualize BFS" assignments from the LMS
- **SCORM packaging** — export learning paths as SCORM packages for legacy LMS

### 6.3 Analytics Dashboard

For instructors and enterprise admins:

- **Student engagement** — time spent per algorithm, replay frequency, completion rates
- **Difficulty heatmap** — which algorithms students struggle with most
- **Comparison analytics** — compare cohort performance across semesters
- **Export** — CSV/PDF reports for academic reporting

### 6.4 Pricing Model (Proposed)

| Tier | Price | Features |
|---|---|---|
| **Free** | $0 | Paste & visualize (unlimited), 15 algorithm templates, community gallery |
| **Pro** | $9/mo | AI explanations, code execution, export (GIF/MP4), 50+ templates, learning paths |
| **Team** | $29/mo per seat | Shared workspaces, admin dashboard, priority support |
| **Education** | Custom | LMS integration, classroom mode, analytics, SSO, bulk licensing |
| **Enterprise** | Custom | Self-hosted, API access, custom branding, SLA |

---

## 7. Technical Debt & Infrastructure

### 7.1 Current Technical Debt

| Item | Current State | Target State | Priority |
|---|---|---|---|
| **Code editor** | Plain `<textarea>` | Monaco Editor with syntax highlighting | High |
| **State management** | Local React state | Zustand or Jotai for global state | Medium |
| **Testing** | No automated tests | Jest unit tests + Playwright E2E tests | High |
| **CI/CD** | Manual build/deploy | GitHub Actions: lint → test → build → deploy | High |
| **TypeScript strictness** | Loose types in some modules | `strict: true` with zero `any` | Medium |
| **Bundle size** | 556KB (168KB gzip) | < 400KB gzip with code splitting | Low |
| **Accessibility** | Partial ARIA labels | Full WCAG 2.1 AA compliance | Medium |

### 7.2 Infrastructure Roadmap

| Milestone | Description |
|---|---|
| **GitHub Actions CI** | Automated lint, type-check, test, build on every PR |
| **Preview deployments** | Every PR gets a preview URL (Vercel-style) |
| **Performance monitoring** | Lighthouse CI scores tracked per build |
| **Error tracking** | Sentry integration for runtime error reporting |
| **Analytics** | Privacy-first analytics (Plausible or PostHog) |
| **CDN** | CloudFront or Cloudflare for global distribution |
| **Database** | PostgreSQL + Prisma for user data (Phase 3+) |
| **Auth** | Clerk or Auth.js for user authentication (Phase 3+) |
| **Real-time** | WebSocket (Socket.io) for classroom mode (Phase 3+) |

---

## 8. Algorithm Expansion Matrix

Full target coverage by v3.0:

### Currently Supported (v1.0) — 30+ algorithms

| Category | Algorithms |
|---|---|
| Sorting | Bubble, Selection, Insertion, Merge, Quick, Heap |
| Searching | Binary Search, Linear Search |
| Graph | BFS, DFS, Dijkstra, Topological Sort |
| Tree | Inorder, Preorder, Postorder, Level Order, BST Insert/Search/Delete |
| Dynamic Programming | Fibonacci, Knapsack, LCS, LIS, Coin Change, Edit Distance |
| Linked List | Insert, Delete, Reverse, Cycle Detection |
| Two Pointers | Generic two-pointer pattern |
| Sliding Window | Generic sliding window pattern |
| Backtracking | N-Queens, Sudoku, Permutations, Combinations |
| Stack/Queue | Basic operations |

### Planned Additions (v1.1–v3.0)

| Category | Algorithms | Target Version |
|---|---|---|
| **Advanced Graph** | A*, Bellman-Ford, Floyd-Warshall, Kruskal's, Prim's, Tarjan's SCC, Bridges | v1.1 |
| **Advanced Tree** | AVL Tree, Red-Black Tree, B-Tree, Fenwick Tree | v2.0 |
| **Trie** | Insert, Search, Delete, Autocomplete, Word Search | v1.1 |
| **Segment Tree** | Build, Query, Update, Lazy Propagation | v1.1 |
| **Union-Find** | Union by Rank, Path Compression, Connected Components | v1.1 |
| **String** | KMP, Rabin-Karp, Z-Algorithm, Manacher's, Suffix Array | v2.0 |
| **Geometry** | Convex Hull, Line Intersection, Closest Pair | v2.5 |
| **Number Theory** | Sieve of Eratosthenes, GCD (Euclidean), Modular Exponentiation | v2.0 |
| **Advanced DP** | Matrix Chain, Longest Palindrome, Egg Drop, Rod Cutting | v1.1 |
| **Greedy** | Activity Selection, Huffman Coding, Job Scheduling | v2.0 |
| **Divide & Conquer** | Karatsuba, Strassen's, Closest Pair | v2.5 |
| **Randomized** | Randomized Quick Sort, Skip List, Reservoir Sampling | v3.0 |
| **Bit Manipulation** | Brian Kernighan, Gray Code, Subset Generation | v2.0 |

**Total target by v3.0**: 100+ algorithms across 15+ categories.

---

## 9. Community & Open Source Strategy

### 9.1 Plugin Architecture (v2.0+)

Enable the community to build and share custom visualizers:

```typescript
// Plugin interface
interface AlgoVizPlugin {
  name: string;
  version: string;
  patterns: DetectionPattern[];      // Regex patterns for detection
  extractor: DataExtractor;          // Extract data from code
  generator: StepGenerator;          // Generate visualization steps
  renderer: React.ComponentType;     // Custom visualization component
}
```

- **Plugin registry** — npm-like registry for community plugins
- **Plugin SDK** — CLI tool and documentation for building plugins
- **Review process** — community review + automated testing before listing

### 9.2 Contribution Strategy

| Activity | Platform | Cadence |
|---|---|---|
| Bug reports & feature requests | GitHub Issues | Continuous |
| Code contributions | GitHub Pull Requests | Continuous |
| Algorithm requests | GitHub Discussions | Monthly triage |
| Plugin development | npm + Plugin Registry | Continuous |
| Community showcase | Discord / Reddit | Weekly |
| Blog posts & tutorials | Dev.to / Medium | Bi-weekly |

### 9.3 Hacktoberfest & Events

- Tag `good-first-issue` for new contributors
- Maintain a "wanted algorithms" list for Hacktoberfest
- Host visualization challenges with prizes
- Partner with CS education communities (CS50, freeCodeCamp, etc.)

---

## 10. Research Directions

### 10.1 AI-Driven Algorithm Detection

Move beyond regex pattern matching:

- **AST-based detection** — parse code into an Abstract Syntax Tree and match structural patterns (more robust than regex)
- **ML classification** — train a model on 10,000+ labeled algorithm implementations to detect patterns that regex can't capture
- **Hybrid approach** — use regex for common cases (fast), fall back to AST for ambiguous cases, ML for truly novel code

### 10.2 Automatic Visualization Generation

For algorithms not in the predefined set:

- **Execution tracing** — instrument code to capture every variable mutation, then auto-generate a visualization from the trace
- **LLM-driven layout** — use an LLM to analyze the algorithm and suggest the best visualization type (array, graph, tree, matrix, etc.)
- **Generative visualization** — given a trace, automatically select and compose visualization primitives (bars, nodes, edges, highlights)

### 10.3 Educational Research

- **A/B testing** — measure learning outcomes with vs. without visualization
- **Spaced repetition** — integrate visualization review into a spaced repetition schedule
- **Cognitive load** — research optimal animation speed, color usage, and information density
- **Accessibility** — screen reader-friendly algorithm narration, haptic feedback patterns

---

## 11. Metrics & Success Criteria

### Phase 1 (v1.1) — Adoption

| Metric | Target |
|---|---|
| GitHub stars | 500+ |
| Monthly active users | 1,000+ |
| Algorithms supported | 50+ |
| Languages supported | 4 (Python, JS, Java, C++) |
| Average session duration | > 5 minutes |

### Phase 2 (v2.0) — Engagement

| Metric | Target |
|---|---|
| Monthly active users | 10,000+ |
| Code executions / day | 5,000+ |
| AI explanations used | 30% of sessions |
| User retention (30-day) | > 40% |
| NPS score | > 50 |

### Phase 3 (v2.5) — Community

| Metric | Target |
|---|---|
| Registered users | 25,000+ |
| Learning paths completed | 5,000+ |
| Public gallery submissions | 1,000+ |
| Community plugins | 20+ |
| Classroom adoptions | 50+ institutions |

### Phase 4 (v3.0) — Revenue

| Metric | Target |
|---|---|
| Monthly active users | 100,000+ |
| Paid subscribers (Pro) | 2,000+ |
| Enterprise accounts | 25+ |
| Annual recurring revenue | $250K+ |
| LMS integrations active | 100+ |

---

## Prioritization Framework

All future features are evaluated against:

1. **User Impact** (1–5): How many users benefit? How much does it improve their experience?
2. **Strategic Alignment** (1–5): Does it advance the core mission of code-first visualization?
3. **Engineering Effort** (1–5, inverted): How complex is the implementation? (5 = easy, 1 = very hard)
4. **Revenue Potential** (1–5): Does it enable monetization or institutional adoption?

**Score** = (User Impact × 2) + Strategic Alignment + Engineering Effort + Revenue Potential

Features scoring 12+ are prioritized for the next release.

---

## Contributing to the Roadmap

This roadmap is a living document. Community input shapes priorities:

- **Vote on features**: Use 👍 reactions on [GitHub Discussions](https://github.com/sailikhithk/algo-visualizer/discussions)
- **Propose new features**: Open a Discussion with the `feature-request` label
- **Discuss direction**: Join the conversation in the `#roadmap` channel
- **Build it yourself**: Check the [CONTRIBUTING.md](../CONTRIBUTING.md) guide to add algorithms or build plugins

---

*This document is maintained by the AlgoViz team and updated quarterly. Last updated: March 19, 2026.*
