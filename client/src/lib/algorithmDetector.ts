// Algorithm detection engine — parses Python code and identifies algorithms/data structures

export interface DetectedAlgorithm {
  type: AlgorithmType;
  category: AlgorithmCategory;
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  dataStructure: DataStructureType;
}

export type AlgorithmCategory =
  | 'sorting'
  | 'searching'
  | 'tree'
  | 'graph'
  | 'dynamic_programming'
  | 'linked_list'
  | 'stack_queue'
  | 'heap'
  | 'trie'
  | 'hash_map'
  | 'two_pointers'
  | 'sliding_window'
  | 'backtracking'
  | 'union_find'
  | 'segment_tree'
  | 'binary_search'
  | 'divide_conquer'
  | 'greedy';

export type AlgorithmType =
  | 'bubble_sort' | 'selection_sort' | 'insertion_sort' | 'merge_sort' | 'quick_sort' | 'heap_sort'
  | 'binary_search' | 'linear_search'
  | 'bfs' | 'dfs' | 'dijkstra' | 'topological_sort' | 'kruskal' | 'prim'
  | 'bst_insert' | 'bst_search' | 'inorder' | 'preorder' | 'postorder' | 'level_order'
  | 'linked_list_ops' | 'linked_list_reverse' | 'linked_list_cycle'
  | 'stack_ops' | 'queue_ops'
  | 'dp_fibonacci' | 'dp_knapsack' | 'dp_lcs' | 'dp_lis' | 'dp_matrix_chain' | 'dp_coin_change' | 'dp_edit_distance' | 'dp_generic'
  | 'two_pointers_generic' | 'sliding_window_generic'
  | 'backtracking_generic' | 'nqueens' | 'sudoku' | 'permutations' | 'combinations'
  | 'trie_ops'
  | 'heap_ops' | 'heapify'
  | 'union_find_ops'
  | 'segment_tree_ops'
  | 'hash_map_ops'
  | 'greedy_generic'
  | 'unknown';

export type DataStructureType =
  | 'array' | 'linked_list' | 'binary_tree' | 'graph' | 'stack' | 'queue'
  | 'heap' | 'trie' | 'hash_map' | 'matrix' | 'segment_tree' | 'union_find' | 'unknown';

interface PatternMatch {
  pattern: RegExp;
  type: AlgorithmType;
  category: AlgorithmCategory;
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  dataStructure: DataStructureType;
  priority: number;
}

const PATTERNS: PatternMatch[] = [
  // SORTING
  {
    pattern: /for\s+\w+\s+in\s+range\(.*\)[\s\S]*?for\s+\w+\s+in\s+range\(.*\)[\s\S]*?(>|<)[\s\S]*?(\bswap\b|\[\w+\]\s*,\s*\w+\[\w+\]\s*=\s*\w+\[\w+\]\s*,\s*\w+\[\w+\])/,
    type: 'bubble_sort', category: 'sorting', name: 'Bubble Sort',
    timeComplexity: 'O(n²)', spaceComplexity: 'O(1)',
    description: 'Repeatedly swaps adjacent elements if they are in wrong order.',
    dataStructure: 'array', priority: 5
  },
  {
    pattern: /\bbubble.?sort\b/i,
    type: 'bubble_sort', category: 'sorting', name: 'Bubble Sort',
    timeComplexity: 'O(n²)', spaceComplexity: 'O(1)',
    description: 'Repeatedly swaps adjacent elements if they are in wrong order.',
    dataStructure: 'array', priority: 10
  },
  {
    pattern: /\bselection.?sort\b/i,
    type: 'selection_sort', category: 'sorting', name: 'Selection Sort',
    timeComplexity: 'O(n²)', spaceComplexity: 'O(1)',
    description: 'Finds minimum element and places it at the beginning.',
    dataStructure: 'array', priority: 10
  },
  {
    pattern: /\binsertion.?sort\b/i,
    type: 'insertion_sort', category: 'sorting', name: 'Insertion Sort',
    timeComplexity: 'O(n²)', spaceComplexity: 'O(1)',
    description: 'Builds sorted array one element at a time by inserting into correct position.',
    dataStructure: 'array', priority: 10
  },
  {
    pattern: /\bmerge.?sort\b|def\s+merge\s*\(.*\)[\s\S]*?(left|right)[\s\S]*?def\s+\w*sort/i,
    type: 'merge_sort', category: 'sorting', name: 'Merge Sort',
    timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)',
    description: 'Divides array in half, sorts each half, then merges them.',
    dataStructure: 'array', priority: 10
  },
  {
    pattern: /\bquick.?sort\b|\bpartition\b[\s\S]*?\bpivot\b/i,
    type: 'quick_sort', category: 'sorting', name: 'Quick Sort',
    timeComplexity: 'O(n log n)', spaceComplexity: 'O(log n)',
    description: 'Picks a pivot, partitions array around it, then recursively sorts.',
    dataStructure: 'array', priority: 10
  },
  {
    pattern: /\bheap.?sort\b|\bheapify\b[\s\S]*?sort/i,
    type: 'heap_sort', category: 'sorting', name: 'Heap Sort',
    timeComplexity: 'O(n log n)', spaceComplexity: 'O(1)',
    description: 'Builds a heap, then repeatedly extracts the maximum.',
    dataStructure: 'heap', priority: 10
  },

  // SEARCHING
  {
    pattern: /\bbinary.?search\b|\bmid\s*=\s*\(?.*\+.*\)?\s*\/\/?\s*2|\blow\b.*\bhigh\b.*\bmid\b/i,
    type: 'binary_search', category: 'binary_search', name: 'Binary Search',
    timeComplexity: 'O(log n)', spaceComplexity: 'O(1)',
    description: 'Searches a sorted array by repeatedly dividing the search interval in half.',
    dataStructure: 'array', priority: 9
  },
  {
    pattern: /\blinear.?search\b|for\s+\w+\s+in\s+\w+[\s\S]*?==\s*target/i,
    type: 'linear_search', category: 'searching', name: 'Linear Search',
    timeComplexity: 'O(n)', spaceComplexity: 'O(1)',
    description: 'Checks each element sequentially until the target is found.',
    dataStructure: 'array', priority: 3
  },

  // GRAPH
  {
    pattern: /\bbfs\b|\bbreadth.?first\b|from\s+collections\s+import\s+deque[\s\S]*?(visited|queue)/i,
    type: 'bfs', category: 'graph', name: 'Breadth-First Search',
    timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)',
    description: 'Explores all neighbors at present depth before moving to nodes at next depth level.',
    dataStructure: 'graph', priority: 9
  },
  {
    pattern: /\bdfs\b|\bdepth.?first\b|def\s+dfs\s*\(|def\s+\w*dfs\w*\s*\(/i,
    type: 'dfs', category: 'graph', name: 'Depth-First Search',
    timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)',
    description: 'Explores as far as possible along each branch before backtracking.',
    dataStructure: 'graph', priority: 9
  },
  {
    pattern: /\bdijkstra\b|\bheapq\b[\s\S]*?(dist|distance|weight)/i,
    type: 'dijkstra', category: 'graph', name: "Dijkstra's Algorithm",
    timeComplexity: 'O((V+E) log V)', spaceComplexity: 'O(V)',
    description: 'Finds shortest paths from source to all vertices in weighted graph.',
    dataStructure: 'graph', priority: 10
  },
  {
    pattern: /\btopological\b|\bin.?degree\b[\s\S]*?queue/i,
    type: 'topological_sort', category: 'graph', name: 'Topological Sort',
    timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)',
    description: 'Orders vertices in a DAG so every edge goes from earlier to later.',
    dataStructure: 'graph', priority: 10
  },

  // TREES
  {
    pattern: /class\s+\w*[Nn]ode[\s\S]*?\.left[\s\S]*?\.right|\.left\s*=|\.right\s*=/,
    type: 'bst_insert', category: 'tree', name: 'Binary Search Tree',
    timeComplexity: 'O(log n)', spaceComplexity: 'O(n)',
    description: 'Tree where left child is smaller and right child is larger than parent.',
    dataStructure: 'binary_tree', priority: 6
  },
  {
    pattern: /\binorder\b|in.?order/i,
    type: 'inorder', category: 'tree', name: 'Inorder Traversal',
    timeComplexity: 'O(n)', spaceComplexity: 'O(h)',
    description: 'Visits left subtree, then root, then right subtree.',
    dataStructure: 'binary_tree', priority: 8
  },
  {
    pattern: /\bpreorder\b|pre.?order/i,
    type: 'preorder', category: 'tree', name: 'Preorder Traversal',
    timeComplexity: 'O(n)', spaceComplexity: 'O(h)',
    description: 'Visits root, then left subtree, then right subtree.',
    dataStructure: 'binary_tree', priority: 8
  },
  {
    pattern: /\bpostorder\b|post.?order/i,
    type: 'postorder', category: 'tree', name: 'Postorder Traversal',
    timeComplexity: 'O(n)', spaceComplexity: 'O(h)',
    description: 'Visits left subtree, then right subtree, then root.',
    dataStructure: 'binary_tree', priority: 8
  },
  {
    pattern: /\blevel.?order\b|\bbfs\b[\s\S]*?(left|right)/i,
    type: 'level_order', category: 'tree', name: 'Level Order Traversal',
    timeComplexity: 'O(n)', spaceComplexity: 'O(w)',
    description: 'Visits all nodes level by level from top to bottom.',
    dataStructure: 'binary_tree', priority: 8
  },

  // LINKED LIST
  {
    pattern: /class\s+\w*[Nn]ode[\s\S]*?\.next[\s\S]*?reverse|reverse[\s\S]*?\.next/i,
    type: 'linked_list_reverse', category: 'linked_list', name: 'Reverse Linked List',
    timeComplexity: 'O(n)', spaceComplexity: 'O(1)',
    description: 'Reverses the direction of a linked list.',
    dataStructure: 'linked_list', priority: 8
  },
  {
    pattern: /\bslow\b[\s\S]*?\bfast\b|\btortoise\b[\s\S]*?\bhare\b|\.next\.next/i,
    type: 'linked_list_cycle', category: 'linked_list', name: 'Cycle Detection',
    timeComplexity: 'O(n)', spaceComplexity: 'O(1)',
    description: "Floyd's cycle detection using slow and fast pointers.",
    dataStructure: 'linked_list', priority: 9
  },
  {
    pattern: /class\s+\w*[Nn]ode[\s\S]*?self\.next|class\s+\w*[Ll]inked/i,
    type: 'linked_list_ops', category: 'linked_list', name: 'Linked List Operations',
    timeComplexity: 'O(n)', spaceComplexity: 'O(n)',
    description: 'A linear collection of elements where each points to the next.',
    dataStructure: 'linked_list', priority: 5
  },

  // STACK & QUEUE
  {
    pattern: /\bstack\b[\s\S]*?(push|pop|append|\.pop\(\))|\bpush\b[\s\S]*?\bpop\b/i,
    type: 'stack_ops', category: 'stack_queue', name: 'Stack Operations',
    timeComplexity: 'O(1)', spaceComplexity: 'O(n)',
    description: 'Last-In-First-Out (LIFO) data structure.',
    dataStructure: 'stack', priority: 6
  },
  {
    pattern: /\bqueue\b[\s\S]*?(enqueue|dequeue|popleft)|from\s+collections\s+import\s+deque/i,
    type: 'queue_ops', category: 'stack_queue', name: 'Queue Operations',
    timeComplexity: 'O(1)', spaceComplexity: 'O(n)',
    description: 'First-In-First-Out (FIFO) data structure.',
    dataStructure: 'queue', priority: 6
  },

  // DYNAMIC PROGRAMMING
  {
    pattern: /\bfib\b|\bfibonacci\b/i,
    type: 'dp_fibonacci', category: 'dynamic_programming', name: 'Fibonacci (DP)',
    timeComplexity: 'O(n)', spaceComplexity: 'O(n)',
    description: 'Computes Fibonacci numbers using memoization or tabulation.',
    dataStructure: 'array', priority: 10
  },
  {
    pattern: /\bknapsack\b/i,
    type: 'dp_knapsack', category: 'dynamic_programming', name: '0/1 Knapsack',
    timeComplexity: 'O(nW)', spaceComplexity: 'O(nW)',
    description: 'Maximizes value within a weight capacity.',
    dataStructure: 'matrix', priority: 10
  },
  {
    pattern: /\blcs\b|\blongest.?common.?sub/i,
    type: 'dp_lcs', category: 'dynamic_programming', name: 'Longest Common Subsequence',
    timeComplexity: 'O(mn)', spaceComplexity: 'O(mn)',
    description: 'Finds the longest subsequence common to two sequences.',
    dataStructure: 'matrix', priority: 10
  },
  {
    pattern: /\blis\b|\blongest.?increasing.?sub/i,
    type: 'dp_lis', category: 'dynamic_programming', name: 'Longest Increasing Subsequence',
    timeComplexity: 'O(n²)', spaceComplexity: 'O(n)',
    description: 'Finds the longest strictly increasing subsequence.',
    dataStructure: 'array', priority: 10
  },
  {
    pattern: /\bcoin.?change\b|\bcoins?\b[\s\S]*?\bamount\b[\s\S]*?\bdp\b/i,
    type: 'dp_coin_change', category: 'dynamic_programming', name: 'Coin Change',
    timeComplexity: 'O(n×amount)', spaceComplexity: 'O(amount)',
    description: 'Finds the minimum number of coins to make a given amount.',
    dataStructure: 'array', priority: 10
  },
  {
    pattern: /\bedit.?distance\b|\blevenshtein\b/i,
    type: 'dp_edit_distance', category: 'dynamic_programming', name: 'Edit Distance',
    timeComplexity: 'O(mn)', spaceComplexity: 'O(mn)',
    description: 'Minimum operations to convert one string to another.',
    dataStructure: 'matrix', priority: 10
  },
  {
    pattern: /\bdp\b\s*=\s*\[|\bmemo\b|\bmemoiz/i,
    type: 'dp_generic', category: 'dynamic_programming', name: 'Dynamic Programming',
    timeComplexity: 'Varies', spaceComplexity: 'O(n)',
    description: 'Solves complex problems by breaking into overlapping subproblems.',
    dataStructure: 'array', priority: 4
  },

  // TWO POINTERS
  {
    pattern: /\btwo.?pointer\b|\bleft\b[\s\S]*?\bright\b[\s\S]*?while[\s\S]*?(left|right)\s*(\+|-)/i,
    type: 'two_pointers_generic', category: 'two_pointers', name: 'Two Pointers',
    timeComplexity: 'O(n)', spaceComplexity: 'O(1)',
    description: 'Uses two pointers that move toward each other or in the same direction.',
    dataStructure: 'array', priority: 7
  },

  // SLIDING WINDOW
  {
    pattern: /\bsliding.?window\b|\bwindow\b[\s\S]*?(expand|shrink|left|right)/i,
    type: 'sliding_window_generic', category: 'sliding_window', name: 'Sliding Window',
    timeComplexity: 'O(n)', spaceComplexity: 'O(k)',
    description: 'Maintains a window of elements that slides across the data.',
    dataStructure: 'array', priority: 8
  },

  // BACKTRACKING
  {
    pattern: /\bn.?queen/i,
    type: 'nqueens', category: 'backtracking', name: 'N-Queens',
    timeComplexity: 'O(n!)', spaceComplexity: 'O(n²)',
    description: 'Places N queens on an N×N chessboard so no two attack each other.',
    dataStructure: 'matrix', priority: 10
  },
  {
    pattern: /\bsudoku\b/i,
    type: 'sudoku', category: 'backtracking', name: 'Sudoku Solver',
    timeComplexity: 'O(9^(n²))', spaceComplexity: 'O(n²)',
    description: 'Fills a 9x9 grid so each row, column, and 3x3 box has digits 1-9.',
    dataStructure: 'matrix', priority: 10
  },
  {
    pattern: /\bpermutation/i,
    type: 'permutations', category: 'backtracking', name: 'Permutations',
    timeComplexity: 'O(n!)', spaceComplexity: 'O(n)',
    description: 'Generates all possible arrangements of elements.',
    dataStructure: 'array', priority: 9
  },
  {
    pattern: /\bcombination/i,
    type: 'combinations', category: 'backtracking', name: 'Combinations',
    timeComplexity: 'O(C(n,k))', spaceComplexity: 'O(k)',
    description: 'Generates all possible selections of k elements from n.',
    dataStructure: 'array', priority: 9
  },
  {
    pattern: /\bbacktrack/i,
    type: 'backtracking_generic', category: 'backtracking', name: 'Backtracking',
    timeComplexity: 'Exponential', spaceComplexity: 'O(n)',
    description: 'Tries all possible solutions, abandoning paths that fail constraints.',
    dataStructure: 'array', priority: 6
  },

  // TRIE
  {
    pattern: /\btrie\b|\bTrieNode\b|self\.children\s*=\s*\{|\bprefix.?tree\b/i,
    type: 'trie_ops', category: 'trie', name: 'Trie (Prefix Tree)',
    timeComplexity: 'O(L)', spaceComplexity: 'O(ALPHABET × L × n)',
    description: 'Tree for efficient prefix-based string retrieval.',
    dataStructure: 'trie', priority: 10
  },

  // HEAP
  {
    pattern: /\bheapq\b|\bheap\b[\s\S]*?(push|pop|insert|extract)|import\s+heapq/i,
    type: 'heap_ops', category: 'heap', name: 'Heap / Priority Queue',
    timeComplexity: 'O(log n)', spaceComplexity: 'O(n)',
    description: 'Tree-based structure where parent is always greater/smaller than children.',
    dataStructure: 'heap', priority: 8
  },
  {
    pattern: /\bheapify\b/i,
    type: 'heapify', category: 'heap', name: 'Heapify',
    timeComplexity: 'O(n)', spaceComplexity: 'O(1)',
    description: 'Converts an array into a heap in-place.',
    dataStructure: 'heap', priority: 9
  },

  // UNION FIND
  {
    pattern: /\bunion.?find\b|\bdisjoint.?set\b|\bfind\b[\s\S]*?\bunion\b[\s\S]*?parent/i,
    type: 'union_find_ops', category: 'union_find', name: 'Union-Find (Disjoint Set)',
    timeComplexity: 'O(α(n))', spaceComplexity: 'O(n)',
    description: 'Tracks elements partitioned into disjoint sets with near-constant operations.',
    dataStructure: 'union_find', priority: 10
  },

  // SEGMENT TREE
  {
    pattern: /\bsegment.?tree\b|\brange.?query\b[\s\S]*?(update|build)/i,
    type: 'segment_tree_ops', category: 'segment_tree', name: 'Segment Tree',
    timeComplexity: 'O(log n)', spaceComplexity: 'O(n)',
    description: 'Tree for efficient range queries and point updates.',
    dataStructure: 'segment_tree', priority: 10
  },

  // HASH MAP
  {
    pattern: /\bdict\b\s*\(|\{\}[\s\S]*?\[.*\]\s*=|\bhash.?map\b|\bhash.?table\b/i,
    type: 'hash_map_ops', category: 'hash_map', name: 'Hash Map',
    timeComplexity: 'O(1) avg', spaceComplexity: 'O(n)',
    description: 'Key-value store with constant-time average lookups.',
    dataStructure: 'hash_map', priority: 3
  },

  // GREEDY
  {
    pattern: /\bgreedy\b|\binterval\b[\s\S]*?sort[\s\S]*?(start|end)/i,
    type: 'greedy_generic', category: 'greedy', name: 'Greedy Algorithm',
    timeComplexity: 'O(n log n)', spaceComplexity: 'O(1)',
    description: 'Makes locally optimal choices at each step.',
    dataStructure: 'array', priority: 6
  },
];

export function detectAlgorithm(code: string): DetectedAlgorithm {
  const matches: (PatternMatch & { score: number })[] = [];

  for (const pattern of PATTERNS) {
    if (pattern.pattern.test(code)) {
      matches.push({ ...pattern, score: pattern.priority });
    }
  }

  // Sort by priority (highest first)
  matches.sort((a, b) => b.score - a.score);

  if (matches.length > 0) {
    const best = matches[0];
    return {
      type: best.type,
      category: best.category,
      name: best.name,
      timeComplexity: best.timeComplexity,
      spaceComplexity: best.spaceComplexity,
      description: best.description,
      dataStructure: best.dataStructure,
    };
  }

  return {
    type: 'unknown',
    category: 'sorting',
    name: 'Unknown Algorithm',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    description: 'Could not detect the algorithm. Try using recognizable function names.',
    dataStructure: 'unknown',
  };
}

export function extractArrayFromCode(code: string): number[] {
  // Try to find array definitions
  const arrayMatch = code.match(/\[(\s*\d+\s*(?:,\s*\d+\s*)*)\]/);
  if (arrayMatch) {
    return arrayMatch[1].split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
  }
  // Default array
  return [64, 34, 25, 12, 22, 11, 90, 45, 78, 33];
}

export function extractGraphFromCode(code: string): { nodes: string[]; edges: [string, string, number?][] } {
  const nodes: Set<string> = new Set();
  const edges: [string, string, number?][] = [];

  // Match adjacency list patterns
  const adjMatch = code.matchAll(/['"](\w+)['"]\s*:\s*\[((?:[^[\]]*|\[(?:[^[\]]*|\[[^[\]]*\])*\])*)\]/g);
  for (const m of adjMatch) {
    const from = m[1];
    nodes.add(from);
    const neighbors = m[2].matchAll(/['"](\w+)['"]/g);
    for (const n of neighbors) {
      nodes.add(n[1]);
      edges.push([from, n[1]]);
    }
  }

  if (nodes.size === 0) {
    // Default graph
    return {
      nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
      edges: [['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'E'], ['D', 'F'], ['E', 'F']],
    };
  }

  return { nodes: Array.from(nodes), edges };
}

export function extractTreeFromCode(code: string): { value: number; left?: any; right?: any } {
  // Try to find tree construction
  const insertValues = code.matchAll(/insert\s*\(\s*(\d+)\s*\)/g);
  const values: number[] = [];
  for (const m of insertValues) {
    values.push(parseInt(m[1]));
  }

  if (values.length === 0) {
    values.push(50, 30, 70, 20, 40, 60, 80);
  }

  // Build BST from values
  function insertBST(root: any, val: number): any {
    if (!root) return { value: val };
    if (val < root.value) root.left = insertBST(root.left, val);
    else root.right = insertBST(root.right, val);
    return root;
  }

  let root = null;
  for (const v of values) {
    root = insertBST(root, v);
  }

  return root || { value: 50, left: { value: 30 }, right: { value: 70 } };
}
