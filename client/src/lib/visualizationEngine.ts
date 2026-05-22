// Visualization step generator — creates animation frames for each algorithm

export interface VisualizationStep {
  array?: number[];
  highlights?: number[];
  swapping?: number[];
  sorted?: number[];
  message: string;
  pointers?: Record<string, number>;
  array2?: number[];
  highlights2?: number[];
  pointers2?: Record<string, number>;
  partition1?: number;
  partition2?: number;
  variables?: Record<string, string | number>;
  treeHighlight?: number[];
  treeEdgeHighlight?: [number, number][];
  graphVisited?: string[];
  graphCurrent?: string;
  graphQueue?: string[];
  graphEdgeHighlight?: [string, string][];
  dpTable?: number[][];
  dpHighlight?: [number, number];
  dpFilled?: [number, number][];
  linkedList?: { value: number; next?: boolean }[];
  llHighlight?: number;
  llPointers?: Record<string, number>;
  phase?: string;
}

// ─── Sorting ─────────────────────────────────────────────────────────────────

export function* bubbleSortSteps(arr: number[]): Generator<VisualizationStep> {
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [];

  yield {
    array: [...a],
    highlights: [],
    sorted: [],
    message: "Starting Bubble Sort",
    phase: "init",
  };

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield {
        array: [...a],
        highlights: [j, j + 1],
        sorted: [...sorted],
        message: `Comparing ${a[j]} and ${a[j + 1]}`,
        phase: "compare",
      };
      if (a[j] > a[j + 1]) {
        yield {
          array: [...a],
          swapping: [j, j + 1],
          highlights: [j, j + 1],
          sorted: [...sorted],
          message: `Swapping ${a[j]} and ${a[j + 1]}`,
          phase: "swap",
        };
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        yield {
          array: [...a],
          highlights: [j, j + 1],
          sorted: [...sorted],
          message: `After swap: ${a[j]}, ${a[j + 1]}`,
          phase: "after-swap",
        };
      }
    }
    sorted.push(n - 1 - i);
    yield {
      array: [...a],
      highlights: [],
      sorted: [...sorted],
      message: `Pass ${i + 1} done — ${a[n - 1 - i]} locked in place`,
      phase: "pass-done",
    };
  }
  sorted.push(0);
  yield {
    array: [...a],
    highlights: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: "Bubble Sort complete!",
    phase: "done",
  };
}

export function* selectionSortSteps(
  arr: number[],
): Generator<VisualizationStep> {
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [];

  yield {
    array: [...a],
    highlights: [],
    sorted: [],
    message: "Starting Selection Sort",
    phase: "init",
  };

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    yield {
      array: [...a],
      highlights: [i],
      sorted: [...sorted],
      message: `Scanning for minimum from index ${i}`,
      pointers: { min: minIdx },
      phase: "find-min",
    };

    for (let j = i + 1; j < n; j++) {
      yield {
        array: [...a],
        highlights: [minIdx, j],
        sorted: [...sorted],
        message: `Comparing ${a[minIdx]} with ${a[j]}`,
        pointers: { min: minIdx, scan: j },
        phase: "compare",
      };
      if (a[j] < a[minIdx]) {
        minIdx = j;
        yield {
          array: [...a],
          highlights: [minIdx],
          sorted: [...sorted],
          message: `New minimum: ${a[minIdx]} at index ${minIdx}`,
          pointers: { min: minIdx },
          phase: "new-min",
        };
      }
    }

    if (minIdx !== i) {
      yield {
        array: [...a],
        swapping: [i, minIdx],
        sorted: [...sorted],
        message: `Swapping ${a[i]} and ${a[minIdx]}`,
        phase: "swap",
      };
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    }
    sorted.push(i);
    yield {
      array: [...a],
      highlights: [],
      sorted: [...sorted],
      message: `${a[i]} placed at position ${i}`,
      phase: "placed",
    };
  }
  sorted.push(n - 1);
  yield {
    array: [...a],
    highlights: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: "Selection Sort complete!",
    phase: "done",
  };
}

export function* insertionSortSteps(
  arr: number[],
): Generator<VisualizationStep> {
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [0];

  yield {
    array: [...a],
    highlights: [],
    sorted: [0],
    message: "Starting Insertion Sort — first element is trivially sorted",
    phase: "init",
  };

  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    yield {
      array: [...a],
      highlights: [i],
      sorted: [...sorted],
      message: `Inserting ${key} into sorted portion`,
      pointers: { key: i },
      phase: "pick",
    };

    while (j >= 0 && a[j] > key) {
      yield {
        array: [...a],
        highlights: [j, j + 1],
        sorted: [...sorted],
        message: `${a[j]} > ${key} — shifting right`,
        phase: "shift",
      };
      a[j + 1] = a[j];
      j--;
      yield {
        array: [...a],
        highlights: [j + 1],
        sorted: [...sorted],
        message: "Shifted",
        phase: "shifted",
      };
    }
    a[j + 1] = key;
    sorted.push(i);
    yield {
      array: [...a],
      highlights: [j + 1],
      sorted: [...sorted],
      message: `Inserted ${key} at position ${j + 1}`,
      phase: "inserted",
    };
  }
  yield {
    array: [...a],
    highlights: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: "Insertion Sort complete!",
    phase: "done",
  };
}

export function* mergeSortSteps(arr: number[]): Generator<VisualizationStep> {
  const a = [...arr];
  const n = a.length;
  const sortedSet = new Set<number>();

  function* merge(
    l: number,
    m: number,
    r: number,
  ): Generator<VisualizationStep> {
    const left = a.slice(l, m + 1);
    const right = a.slice(m + 1, r + 1);
    let i = 0,
      j = 0,
      k = l;

    yield {
      array: [...a],
      highlights: Array.from({ length: r - l + 1 }, (_, x) => l + x),
      sorted: [...sortedSet],
      message: `Merging [${l}..${m}] and [${m + 1}..${r}]`,
      pointers: { L: l, M: m, R: r },
      phase: "merge",
    };

    while (i < left.length && j < right.length) {
      yield {
        array: [...a],
        highlights: [k],
        sorted: [...sortedSet],
        message: `Comparing ${left[i]} and ${right[j]}`,
        pointers: { L: l + i, R: m + 1 + j, write: k },
        phase: "compare",
      };
      if (left[i] <= right[j]) {
        a[k] = left[i++];
      } else {
        a[k] = right[j++];
      }
      yield {
        array: [...a],
        highlights: [k],
        sorted: [...sortedSet],
        message: `Placed ${a[k]} at index ${k}`,
        phase: "place",
      };
      k++;
    }
    while (i < left.length) {
      a[k] = left[i++];
      yield {
        array: [...a],
        highlights: [k],
        sorted: [...sortedSet],
        message: `Copy remaining ${a[k]} at index ${k}`,
        phase: "place",
      };
      k++;
    }
    while (j < right.length) {
      a[k] = right[j++];
      yield {
        array: [...a],
        highlights: [k],
        sorted: [...sortedSet],
        message: `Copy remaining ${a[k]} at index ${k}`,
        phase: "place",
      };
      k++;
    }

    if (l === 0 && r === n - 1) {
      for (let x = l; x <= r; x++) sortedSet.add(x);
    }

    yield {
      array: [...a],
      highlights: Array.from({ length: r - l + 1 }, (_, x) => l + x),
      sorted: [...sortedSet],
      message: `Merged: [${a.slice(l, r + 1).join(", ")}]`,
      phase: "merged",
    };
  }

  function* sort(l: number, r: number): Generator<VisualizationStep> {
    if (l >= r) {
      if (l === r) {
        yield {
          array: [...a],
          highlights: [l],
          sorted: [...sortedSet],
          message: `Single element ${a[l]} at index ${l}`,
          phase: "base",
        };
      }
      return;
    }
    const m = Math.floor((l + r) / 2);
    yield {
      array: [...a],
      highlights: Array.from({ length: r - l + 1 }, (_, x) => l + x),
      sorted: [...sortedSet],
      message: `Dividing [${l}..${r}] at mid ${m}`,
      pointers: { L: l, M: m, R: r },
      phase: "divide",
    };
    yield* sort(l, m);
    yield* sort(m + 1, r);
    yield* merge(l, m, r);
  }

  yield {
    array: [...a],
    highlights: [],
    sorted: [],
    message: "Starting Merge Sort",
    phase: "init",
  };
  yield* sort(0, n - 1);
  yield {
    array: [...a],
    highlights: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: "Merge Sort complete!",
    phase: "done",
  };
}

export function* quickSortSteps(arr: number[]): Generator<VisualizationStep> {
  const a = [...arr];
  const n = a.length;
  const sortedSet = new Set<number>();

  function* qs(low: number, high: number): Generator<VisualizationStep> {
    if (low > high) return;
    if (low === high) {
      sortedSet.add(low);
      yield {
        array: [...a],
        highlights: [low],
        sorted: [...sortedSet],
        message: `Single element ${a[low]} — already in place`,
        phase: "base",
      };
      return;
    }

    const pivot = a[high];
    yield {
      array: [...a],
      highlights: [high],
      sorted: [...sortedSet],
      message: `Pivot: ${pivot} (index ${high})`,
      pointers: { pivot: high },
      phase: "pivot",
    };

    let i = low - 1;
    for (let j = low; j < high; j++) {
      yield {
        array: [...a],
        highlights: [j, high],
        sorted: [...sortedSet],
        message: `Comparing ${a[j]} with pivot ${pivot}`,
        pointers: { i, j, pivot: high },
        phase: "compare",
      };
      if (a[j] < pivot) {
        i++;
        if (i !== j) {
          yield {
            array: [...a],
            swapping: [i, j],
            sorted: [...sortedSet],
            message: `Swapping ${a[i]} and ${a[j]}`,
            phase: "swap",
          };
          [a[i], a[j]] = [a[j], a[i]];
          yield {
            array: [...a],
            highlights: [i, j],
            sorted: [...sortedSet],
            message: "After swap",
            phase: "after-swap",
          };
        }
      }
    }
    const pi = i + 1;
    if (pi !== high) {
      [a[pi], a[high]] = [a[high], a[pi]];
    }
    sortedSet.add(pi);
    yield {
      array: [...a],
      highlights: [pi],
      sorted: [...sortedSet],
      message: `Pivot ${pivot} placed at index ${pi}`,
      phase: "pivot-placed",
    };

    yield* qs(low, pi - 1);
    yield* qs(pi + 1, high);
  }

  yield {
    array: [...a],
    highlights: [],
    sorted: [],
    message: "Starting Quick Sort",
    phase: "init",
  };
  yield* qs(0, n - 1);
  yield {
    array: [...a],
    highlights: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: "Quick Sort complete!",
    phase: "done",
  };
}

// ─── Searching ───────────────────────────────────────────────────────────────

export function* binarySearchSteps(
  arr: number[],
  target?: number,
): Generator<VisualizationStep> {
  const a = [...arr].sort((x, y) => x - y);
  const t = target ?? a[Math.floor(Math.random() * a.length)];
  const allIdx = Array.from({ length: a.length }, (_, i) => i);

  yield {
    array: [...a],
    highlights: [],
    sorted: allIdx,
    message: `Binary Search for ${t}`,
    pointers: { left: 0, right: a.length - 1 },
    phase: "init",
  };

  let lo = 0,
    hi = a.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    yield {
      array: [...a],
      highlights: [mid],
      sorted: allIdx,
      message: `mid=${mid}, value=${a[mid]}`,
      pointers: { low: lo, mid, high: hi },
      phase: "check",
    };
    if (a[mid] === t) {
      yield {
        array: [...a],
        highlights: [mid],
        sorted: allIdx,
        message: `Found ${t} at index ${mid}!`,
        pointers: { found: mid },
        phase: "found",
      };
      return;
    }
    if (a[mid] < t) {
      yield {
        array: [...a],
        highlights: [mid],
        sorted: allIdx,
        message: `${a[mid]} < ${t} — search right half`,
        pointers: { low: mid + 1, high: hi },
        phase: "go-right",
      };
      lo = mid + 1;
    } else {
      yield {
        array: [...a],
        highlights: [mid],
        sorted: allIdx,
        message: `${a[mid]} > ${t} — search left half`,
        pointers: { low: lo, high: mid - 1 },
        phase: "go-left",
      };
      hi = mid - 1;
    }
  }
  yield {
    array: [...a],
    highlights: [],
    sorted: allIdx,
    message: `${t} not found`,
    phase: "not-found",
  };
}

// ─── Graph (BFS / DFS) ──────────────────────────────────────────────────────

function buildAdj(
  nodes: string[],
  edges: [string, string, number?][],
): Record<string, string[]> {
  const adj: Record<string, string[]> = {};
  for (const nd of nodes) adj[nd] = [];
  for (const [u, v] of edges) {
    if (!adj[u]) adj[u] = [];
    adj[u].push(v);
  }
  return adj;
}

export function* bfsSteps(
  nodes: string[],
  edges: [string, string, number?][],
): Generator<VisualizationStep> {
  const adj = buildAdj(nodes, edges);
  const visited = new Set<string>();
  const queue = [nodes[0]];
  visited.add(nodes[0]);

  yield {
    array: [],
    highlights: [],
    sorted: [],
    message: `BFS from ${nodes[0]}`,
    graphVisited: [],
    graphCurrent: nodes[0],
    graphQueue: [...queue],
    graphEdgeHighlight: [],
    phase: "init",
  };

  while (queue.length > 0) {
    const cur = queue.shift()!;
    yield {
      array: [],
      highlights: [],
      sorted: [],
      message: `Visiting ${cur}`,
      graphVisited: [...visited],
      graphCurrent: cur,
      graphQueue: [...queue],
      graphEdgeHighlight: [],
      phase: "visit",
    };
    for (const nb of adj[cur] ?? []) {
      if (!visited.has(nb)) {
        visited.add(nb);
        queue.push(nb);
        yield {
          array: [],
          highlights: [],
          sorted: [],
          message: `Discovered ${nb} via ${cur}`,
          graphVisited: [...visited],
          graphCurrent: cur,
          graphQueue: [...queue],
          graphEdgeHighlight: [[cur, nb]],
          phase: "discover",
        };
      }
    }
  }
  yield {
    array: [],
    highlights: [],
    sorted: [],
    message: "BFS complete!",
    graphVisited: [...visited],
    graphCurrent: "",
    graphQueue: [],
    graphEdgeHighlight: [],
    phase: "done",
  };
}

export function* dfsSteps(
  nodes: string[],
  edges: [string, string, number?][],
): Generator<VisualizationStep> {
  const adj = buildAdj(nodes, edges);
  const visited = new Set<string>();
  const stack = [nodes[0]];

  yield {
    array: [],
    highlights: [],
    sorted: [],
    message: `DFS from ${nodes[0]}`,
    graphVisited: [],
    graphCurrent: nodes[0],
    graphQueue: [...stack],
    graphEdgeHighlight: [],
    phase: "init",
  };

  while (stack.length > 0) {
    const cur = stack.pop()!;
    if (visited.has(cur)) continue;
    visited.add(cur);

    yield {
      array: [],
      highlights: [],
      sorted: [],
      message: `Visiting ${cur}`,
      graphVisited: [...visited],
      graphCurrent: cur,
      graphQueue: [...stack],
      graphEdgeHighlight: [],
      phase: "visit",
    };

    for (const nb of (adj[cur] ?? []).slice().reverse()) {
      if (!visited.has(nb)) {
        stack.push(nb);
        yield {
          array: [],
          highlights: [],
          sorted: [],
          message: `Push ${nb} to stack`,
          graphVisited: [...visited],
          graphCurrent: cur,
          graphQueue: [...stack],
          graphEdgeHighlight: [[cur, nb]],
          phase: "push",
        };
      }
    }
  }
  yield {
    array: [],
    highlights: [],
    sorted: [],
    message: "DFS complete!",
    graphVisited: [...visited],
    graphCurrent: "",
    graphQueue: [],
    graphEdgeHighlight: [],
    phase: "done",
  };
}

// ─── Tree Traversals ─────────────────────────────────────────────────────────

export function* inorderSteps(root: any): Generator<VisualizationStep> {
  const result: number[] = [];

  function* walk(node: any): Generator<VisualizationStep> {
    if (!node) return;
    yield {
      array: [],
      highlights: [],
      sorted: [],
      message: `Going left from ${node.value}`,
      treeHighlight: [node.value],
      phase: "go-left",
    };
    yield* walk(node.left);
    result.push(node.value);
    yield {
      array: [...result],
      highlights: [],
      sorted: [],
      message: `Visit ${node.value} -> [${result.join(", ")}]`,
      treeHighlight: [node.value],
      phase: "visit",
    };
    yield* walk(node.right);
  }

  yield {
    array: [],
    highlights: [],
    sorted: [],
    message: "Inorder Traversal (Left, Root, Right)",
    treeHighlight: [],
    phase: "init",
  };
  yield* walk(root);
  yield {
    array: [...result],
    highlights: [],
    sorted: [],
    message: `Inorder: [${result.join(", ")}]`,
    treeHighlight: [],
    phase: "done",
  };
}

export function* preorderSteps(root: any): Generator<VisualizationStep> {
  const result: number[] = [];

  function* walk(node: any): Generator<VisualizationStep> {
    if (!node) return;
    result.push(node.value);
    yield {
      array: [...result],
      highlights: [],
      sorted: [],
      message: `Visit ${node.value} -> [${result.join(", ")}]`,
      treeHighlight: [node.value],
      phase: "visit",
    };
    yield* walk(node.left);
    yield* walk(node.right);
  }

  yield {
    array: [],
    highlights: [],
    sorted: [],
    message: "Preorder Traversal (Root, Left, Right)",
    treeHighlight: [],
    phase: "init",
  };
  yield* walk(root);
  yield {
    array: [...result],
    highlights: [],
    sorted: [],
    message: `Preorder: [${result.join(", ")}]`,
    treeHighlight: [],
    phase: "done",
  };
}

export function* postorderSteps(root: any): Generator<VisualizationStep> {
  const result: number[] = [];

  function* walk(node: any): Generator<VisualizationStep> {
    if (!node) return;
    yield {
      array: [],
      highlights: [],
      sorted: [],
      message: `Going left from ${node.value}`,
      treeHighlight: [node.value],
      phase: "go-left",
    };
    yield* walk(node.left);
    yield* walk(node.right);
    result.push(node.value);
    yield {
      array: [...result],
      highlights: [],
      sorted: [],
      message: `Visit ${node.value} -> [${result.join(", ")}]`,
      treeHighlight: [node.value],
      phase: "visit",
    };
  }

  yield {
    array: [],
    highlights: [],
    sorted: [],
    message: "Postorder Traversal (Left, Right, Root)",
    treeHighlight: [],
    phase: "init",
  };
  yield* walk(root);
  yield {
    array: [...result],
    highlights: [],
    sorted: [],
    message: `Postorder: [${result.join(", ")}]`,
    treeHighlight: [],
    phase: "done",
  };
}

// ─── Dynamic Programming ─────────────────────────────────────────────────────

export function* dpFibonacciSteps(n?: number): Generator<VisualizationStep> {
  const N = n ?? 10;
  const dp = new Array(N + 1).fill(0);
  dp[1] = 1;

  yield {
    array: [...dp],
    highlights: [0, 1],
    sorted: [],
    message: `Fibonacci(${N}) — base: F(0)=0, F(1)=1`,
    phase: "init",
  };

  for (let i = 2; i <= N; i++) {
    yield {
      array: [...dp],
      highlights: [i - 1, i - 2],
      sorted: [],
      message: `F(${i}) = F(${i - 1}) + F(${i - 2}) = ${dp[i - 1]} + ${dp[i - 2]}`,
      pointers: { computing: i },
      phase: "compute",
    };
    dp[i] = dp[i - 1] + dp[i - 2];
    yield {
      array: [...dp],
      highlights: [i],
      sorted: [],
      message: `F(${i}) = ${dp[i]}`,
      phase: "set",
    };
  }

  yield {
    array: [...dp],
    highlights: [N],
    sorted: Array.from({ length: N + 1 }, (_, i) => i),
    message: `Fibonacci(${N}) = ${dp[N]}`,
    phase: "done",
  };
}

export function* dpCoinChangeSteps(): Generator<VisualizationStep> {
  const coins = [1, 3, 4];
  const amount = 6;
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  const display = (v: number) => (v === Infinity ? -1 : v);
  const label = (v: number) => (v === Infinity ? "INF" : String(v));

  yield {
    array: dp.map(display),
    highlights: [0],
    sorted: [],
    message: `Coin Change: coins=[${coins}], amount=${amount}`,
    phase: "init",
  };

  for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {
      const prev = dp[i];
      yield {
        array: dp.map(display),
        highlights: [i, i - coin],
        sorted: [],
        message: `Coin ${coin}: dp[${i}] = min(${label(prev)}, ${label(dp[i - coin])}+1)`,
        phase: "try",
      };
      dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      yield {
        array: dp.map(display),
        highlights: [i],
        sorted: [],
        message: `dp[${i}] = ${dp[i]}`,
        phase: "set",
      };
    }
  }

  yield {
    array: dp.map(display),
    highlights: [amount],
    sorted: Array.from({ length: amount + 1 }, (_, i) => i),
    message: `Min coins for ${amount} = ${dp[amount]}`,
    phase: "done",
  };
}

// ─── Linked List ─────────────────────────────────────────────────────────────

export function* linkedListReverseSteps(): Generator<VisualizationStep> {
  const values = [1, 2, 3, 4, 5];
  const list = values.map((v, i) => ({
    value: v,
    next: i < values.length - 1,
  }));

  yield {
    array: [],
    highlights: [],
    sorted: [],
    message: "Reversing linked list: 1->2->3->4->5",
    linkedList: list.map((nd) => ({ ...nd })),
    llHighlight: -1,
    phase: "init",
  };

  let prev = -1;
  let curr = 0;

  while (curr < values.length) {
    yield {
      array: [],
      highlights: [],
      sorted: [],
      message: `curr=${values[curr]}, prev=${prev >= 0 ? values[prev] : "null"}`,
      linkedList: list.map((nd) => ({ ...nd })),
      llHighlight: curr,
      llPointers: { prev, curr, next: curr + 1 },
      phase: "step",
    };

    list[curr].next = prev >= 0;
    prev = curr;
    curr = curr + 1;

    yield {
      array: [],
      highlights: [],
      sorted: [],
      message: "Reversed link — moving forward",
      linkedList: list.map((nd) => ({ ...nd })),
      llHighlight: prev,
      phase: "reversed",
    };
  }

  yield {
    array: [],
    highlights: [],
    sorted: [],
    message: "Reversed: 5->4->3->2->1",
    linkedList: list.map((nd) => ({ ...nd })).reverse(),
    llHighlight: -1,
    phase: "done",
  };
}

// ─── Stack ───────────────────────────────────────────────────────────────────

export function* stackSteps(): Generator<VisualizationStep> {
  const ops = ["push 10", "push 20", "push 30", "pop", "push 40", "pop", "pop"];
  const stack: number[] = [];

  yield {
    array: [],
    highlights: [],
    sorted: [],
    message: "Stack Operations (LIFO)",
    phase: "init",
  };

  for (const op of ops) {
    if (op.startsWith("push")) {
      const val = parseInt(op.split(" ")[1]);
      stack.push(val);
      yield {
        array: [...stack],
        highlights: [stack.length - 1],
        sorted: [],
        message: `Push ${val} -> [${stack.join(", ")}]`,
        phase: "push",
      };
    } else {
      const val = stack.pop();
      yield {
        array: [...stack],
        highlights: stack.length > 0 ? [stack.length - 1] : [],
        sorted: [],
        message: `Pop ${val} -> [${stack.join(", ")}]`,
        phase: "pop",
      };
    }
  }
  yield {
    array: [...stack],
    highlights: [],
    sorted: [],
    message: `Final stack: [${stack.join(", ")}]`,
    phase: "done",
  };
}

// ─── Two Pointers ────────────────────────────────────────────────────────────

export function* twoPointersSteps(arr: number[]): Generator<VisualizationStep> {
  const a = [...arr].sort((x, y) => x - y);
  const target = a[2] + a[a.length - 2];
  const allIdx = Array.from({ length: a.length }, (_, i) => i);

  yield {
    array: [...a],
    highlights: [],
    sorted: allIdx,
    message: `Two-pointer sum, target=${target}`,
    pointers: { left: 0, right: a.length - 1 },
    phase: "init",
  };

  let left = 0,
    right = a.length - 1;
  while (left < right) {
    const sum = a[left] + a[right];
    yield {
      array: [...a],
      highlights: [left, right],
      sorted: allIdx,
      message: `${a[left]}+${a[right]}=${sum} (target ${target})`,
      pointers: { left, right },
      phase: "check",
    };
    if (sum === target) {
      yield {
        array: [...a],
        highlights: [left, right],
        sorted: allIdx,
        message: `Found! ${a[left]}+${a[right]}=${target}`,
        pointers: { left, right },
        phase: "found",
      };
      return;
    }
    if (sum < target) {
      left++;
      yield {
        array: [...a],
        highlights: [left, right],
        sorted: allIdx,
        message: "Sum too small — move left pointer right",
        pointers: { left, right },
        phase: "move-left",
      };
    } else {
      right--;
      yield {
        array: [...a],
        highlights: [left, right],
        sorted: allIdx,
        message: "Sum too large — move right pointer left",
        pointers: { left, right },
        phase: "move-right",
      };
    }
  }
}

// ─── Sliding Window ──────────────────────────────────────────────────────────

export function* slidingWindowSteps(
  arr: number[],
): Generator<VisualizationStep> {
  const a = arr.length > 0 ? arr : [2, 1, 5, 1, 3, 2];
  const k = 3;

  yield {
    array: [...a],
    highlights: [],
    sorted: [],
    message: `Max-sum subarray of size ${k}`,
    phase: "init",
  };

  let windowSum = 0;
  let maxSum = 0;
  let maxStart = 0;

  for (let i = 0; i < k; i++) {
    windowSum += a[i];
    yield {
      array: [...a],
      highlights: Array.from({ length: i + 1 }, (_, j) => j),
      sorted: [],
      message: `Building window: sum=${windowSum}`,
      phase: "build",
    };
  }
  maxSum = windowSum;

  for (let i = k; i < a.length; i++) {
    windowSum += a[i] - a[i - k];
    const win = Array.from({ length: k }, (_, j) => i - k + 1 + j);
    yield {
      array: [...a],
      highlights: win,
      sorted: [],
      message: `Window [${a.slice(i - k + 1, i + 1).join(",")}] sum=${windowSum}, max=${maxSum}`,
      pointers: { start: i - k + 1, end: i },
      phase: "slide",
    };
    if (windowSum > maxSum) {
      maxSum = windowSum;
      maxStart = i - k + 1;
      yield {
        array: [...a],
        highlights: win,
        sorted: [],
        message: `New max! sum=${maxSum}`,
        phase: "new-max",
      };
    }
  }

  yield {
    array: [...a],
    highlights: Array.from({ length: k }, (_, j) => maxStart + j),
    sorted: [],
    message: `Max sum=${maxSum} at [${maxStart}..${maxStart + k - 1}]`,
    phase: "done",
  };
}
