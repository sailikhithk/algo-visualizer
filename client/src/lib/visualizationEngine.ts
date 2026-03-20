// Visualization step generator — creates animation frames for each algorithm

export interface VisualizationStep {
  array?: number[];
  highlights?: number[]; // indices being compared/active
  swapping?: number[];   // indices being swapped
  sorted?: number[];     // indices already sorted
  message: string;
  pointers?: Record<string, number>; // named pointers (left, right, mid, etc.)
  // For trees
  treeHighlight?: number[]; // node values being visited
  treeEdgeHighlight?: [number, number][]; // edges being traversed
  // For graphs
  graphVisited?: string[];
  graphCurrent?: string;
  graphQueue?: string[];
  graphEdgeHighlight?: [string, string][];
  // For DP
  dpTable?: number[][];
  dpHighlight?: [number, number]; // [row, col]
  dpFilled?: [number, number][];
  // For linked list
  linkedList?: { value: number; next?: boolean }[];
  llHighlight?: number;
  llPointers?: Record<string, number>;
  // Generic
  phase?: string;
}

// ============ SORTING ALGORITHMS ============

export function* bubbleSortSteps(arr: number[]): Generator<VisualizationStep> {
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [];

  yield { array: [...a], highlights: [], sorted: [], message: 'Starting Bubble Sort', phase: 'init' };

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { array: [...a], highlights: [j, j + 1], sorted: [...sorted], message: `Comparing ${a[j]} and ${a[j + 1]}`, phase: 'compare' };

      if (a[j] > a[j + 1]) {
        yield { array: [...a], highlights: [j, j + 1], swapping: [j, j + 1], sorted: [...sorted], message: `Swapping ${a[j]} and ${a[j + 1]}`, phase: 'swap' };
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        yield { array: [...a], highlights: [j, j + 1], sorted: [...sorted], message: `Swapped! Now ${a[j]}, ${a[j + 1]}`, phase: 'after-swap' };
      }
    }
    sorted.push(n - 1 - i);
    yield { array: [...a], highlights: [], sorted: [...sorted], message: `Pass ${i + 1} complete. ${a[n - 1 - i]} is in position.`, phase: 'pass-done' };
  }
  sorted.push(0);
  yield { array: [...a], highlights: [], sorted: Array.from({ length: n }, (_, i) => i), message: 'Bubble Sort complete!', phase: 'done' };
}

export function* selectionSortSteps(arr: number[]): Generator<VisualizationStep> {
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [];

  yield { array: [...a], highlights: [], sorted: [], message: 'Starting Selection Sort', phase: 'init' };

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    yield { array: [...a], highlights: [i], sorted: [...sorted], message: `Finding minimum from index ${i}`, pointers: { min: minIdx }, phase: 'find-min' };

    for (let j = i + 1; j < n; j++) {
      yield { array: [...a], highlights: [minIdx, j], sorted: [...sorted], message: `Comparing ${a[minIdx]} with ${a[j]}`, pointers: { min: minIdx, current: j }, phase: 'compare' };
      if (a[j] < a[minIdx]) {
        minIdx = j;
        yield { array: [...a], highlights: [minIdx], sorted: [...sorted], message: `New minimum found: ${a[minIdx]} at index ${minIdx}`, pointers: { min: minIdx }, phase: 'new-min' };
      }
    }

    if (minIdx !== i) {
      yield { array: [...a], swapping: [i, minIdx], sorted: [...sorted], message: `Swapping ${a[i]} and ${a[minIdx]}`, phase: 'swap' };
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    }
    sorted.push(i);
    yield { array: [...a], highlights: [], sorted: [...sorted], message: `${a[i]} placed at position ${i}`, phase: 'placed' };
  }
  sorted.push(n - 1);
  yield { array: [...a], highlights: [], sorted: Array.from({ length: n }, (_, i) => i), message: 'Selection Sort complete!', phase: 'done' };
}

export function* insertionSortSteps(arr: number[]): Generator<VisualizationStep> {
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [0];

  yield { array: [...a], highlights: [], sorted: [0], message: 'Starting Insertion Sort. First element is trivially sorted.', phase: 'init' };

  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    yield { array: [...a], highlights: [i], sorted: [...sorted], message: `Inserting ${key} into sorted portion`, pointers: { key: i }, phase: 'pick' };

    while (j >= 0 && a[j] > key) {
      yield { array: [...a], highlights: [j, j + 1], sorted: [...sorted], message: `${a[j]} > ${key}, shifting right`, phase: 'shift' };
      a[j + 1] = a[j];
      j--;
      yield { array: [...a], highlights: [j + 1], sorted: [...sorted], message: 'Shifted', phase: 'shifted' };
    }
    a[j + 1] = key;
    sorted.push(i);
    yield { array: [...a], highlights: [j + 1], sorted: [...sorted], message: `Inserted ${key} at position ${j + 1}`, phase: 'inserted' };
  }
  yield { array: [...a], highlights: [], sorted: Array.from({ length: n }, (_, i) => i), message: 'Insertion Sort complete!', phase: 'done' };
}

export function* mergeSortSteps(arr: number[]): Generator<VisualizationStep> {
  const a = [...arr];
  const steps: VisualizationStep[] = [];

  function* mergeSort(a: number[], l: number, r: number, fullArr: number[]): Generator<VisualizationStep> {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);

    yield { array: [...fullArr], highlights: Array.from({ length: r - l + 1 }, (_, i) => l + i), sorted: [], message: `Dividing [${l}..${r}] at midpoint ${m}`, phase: 'divide' };

    yield* mergeSort(a, l, m, fullArr);
    yield* mergeSort(a, m + 1, r, fullArr);

    // Merge
    const left = a.slice(l, m + 1);
    const right = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;

    yield { array: [...fullArr], highlights: Array.from({ length: r - l + 1 }, (_, i) => l + i), sorted: [], message: `Merging [${l}..${m}] and [${m + 1}..${r}]`, phase: 'merge' };

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        fullArr[k] = left[i];
        a[k] = left[i];
        i++;
      } else {
        fullArr[k] = right[j];
        a[k] = right[j];
        j++;
      }
      yield { array: [...fullArr], highlights: [k], sorted: [], message: `Placed ${fullArr[k]} at position ${k}`, phase: 'place' };
      k++;
    }
    while (i < left.length) {
      fullArr[k] = left[i]; a[k] = left[i]; i++; k++;
    }
    while (j < right.length) {
      fullArr[k] = right[j]; a[k] = right[j]; j++; k++;
    }
    yield { array: [...fullArr], highlights: Array.from({ length: r - l + 1 }, (_, i) => l + i), sorted: [], message: `Merged: [${fullArr.slice(l, r + 1).join(', ')}]`, phase: 'merged' };
  }

  yield { array: [...a], highlights: [], sorted: [], message: 'Starting Merge Sort', phase: 'init' };
  yield* mergeSort(a, 0, a.length - 1, a);
  yield { array: [...a], highlights: [], sorted: Array.from({ length: a.length }, (_, i) => i), message: 'Merge Sort complete!', phase: 'done' };
}

export function* quickSortSteps(arr: number[]): Generator<VisualizationStep> {
  const a = [...arr];

  function* quickSort(a: number[], low: number, high: number): Generator<VisualizationStep> {
    if (low >= high) return;

    const pivot = a[high];
    yield { array: [...a], highlights: [high], sorted: [], message: `Pivot: ${pivot} (index ${high})`, pointers: { pivot: high }, phase: 'pivot' };

    let i = low - 1;
    for (let j = low; j < high; j++) {
      yield { array: [...a], highlights: [j, high], sorted: [], message: `Comparing ${a[j]} with pivot ${pivot}`, pointers: { i: i, j: j, pivot: high }, phase: 'compare' };

      if (a[j] < pivot) {
        i++;
        if (i !== j) {
          yield { array: [...a], swapping: [i, j], sorted: [], message: `Swapping ${a[i]} and ${a[j]}`, phase: 'swap' };
          [a[i], a[j]] = [a[j], a[i]];
          yield { array: [...a], highlights: [i, j], sorted: [], message: 'Swapped', phase: 'after-swap' };
        }
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    const pi = i + 1;
    yield { array: [...a], highlights: [pi], sorted: [pi], message: `Pivot ${pivot} placed at index ${pi}`, phase: 'pivot-placed' };

    yield* quickSort(a, low, pi - 1);
    yield* quickSort(a, pi + 1, high);
  }

  yield { array: [...a], highlights: [], sorted: [], message: 'Starting Quick Sort', phase: 'init' };
  yield* quickSort(a, 0, a.length - 1);
  yield { array: [...a], highlights: [], sorted: Array.from({ length: a.length }, (_, i) => i), message: 'Quick Sort complete!', phase: 'done' };
}

// ============ SEARCHING ============

export function* binarySearchSteps(arr: number[], target?: number): Generator<VisualizationStep> {
  const a = [...arr].sort((a, b) => a - b);
  const t = target ?? a[Math.floor(Math.random() * a.length)];

  yield { array: [...a], highlights: [], sorted: Array.from({ length: a.length }, (_, i) => i), message: `Binary Search for ${t} in sorted array`, phase: 'init' };

  let low = 0, high = a.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    yield { array: [...a], highlights: [mid], sorted: Array.from({ length: a.length }, (_, i) => i), message: `Checking mid=${mid}, value=${a[mid]}`, pointers: { low, mid, high }, phase: 'check' };

    if (a[mid] === t) {
      yield { array: [...a], highlights: [mid], sorted: Array.from({ length: a.length }, (_, i) => i), message: `Found ${t} at index ${mid}!`, pointers: { found: mid }, phase: 'found' };
      return;
    } else if (a[mid] < t) {
      yield { array: [...a], highlights: [mid], sorted: Array.from({ length: a.length }, (_, i) => i), message: `${a[mid]} < ${t}, search right half`, pointers: { low: mid + 1, high }, phase: 'go-right' };
      low = mid + 1;
    } else {
      yield { array: [...a], highlights: [mid], sorted: Array.from({ length: a.length }, (_, i) => i), message: `${a[mid]} > ${t}, search left half`, pointers: { low, high: mid - 1 }, phase: 'go-left' };
      high = mid - 1;
    }
  }
  yield { array: [...a], highlights: [], sorted: Array.from({ length: a.length }, (_, i) => i), message: `${t} not found in the array`, phase: 'not-found' };
}

// ============ GRAPH (BFS / DFS) ============

export function* bfsSteps(nodes: string[], edges: [string, string, number?][]): Generator<VisualizationStep> {
  const adj: Record<string, string[]> = {};
  for (const n of nodes) adj[n] = [];
  for (const [u, v] of edges) {
    if (!adj[u]) adj[u] = [];
    adj[u].push(v);
  }

  const visited = new Set<string>();
  const queue = [nodes[0]];
  visited.add(nodes[0]);

  yield { array: [], highlights: [], sorted: [], message: `Starting BFS from ${nodes[0]}`, graphVisited: [], graphCurrent: nodes[0], graphQueue: [...queue], graphEdgeHighlight: [], phase: 'init' };

  while (queue.length > 0) {
    const current = queue.shift()!;
    yield { array: [], highlights: [], sorted: [], message: `Visiting ${current}`, graphVisited: Array.from(visited), graphCurrent: current, graphQueue: [...queue], graphEdgeHighlight: [], phase: 'visit' };

    for (const neighbor of (adj[current] || [])) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        yield { array: [], highlights: [], sorted: [], message: `Discovered ${neighbor} via ${current}`, graphVisited: Array.from(visited), graphCurrent: current, graphQueue: [...queue], graphEdgeHighlight: [[current, neighbor]], phase: 'discover' };
      }
    }
  }
  yield { array: [], highlights: [], sorted: [], message: 'BFS complete! All reachable nodes visited.', graphVisited: Array.from(visited), graphCurrent: '', graphQueue: [], graphEdgeHighlight: [], phase: 'done' };
}

export function* dfsSteps(nodes: string[], edges: [string, string, number?][]): Generator<VisualizationStep> {
  const adj: Record<string, string[]> = {};
  for (const n of nodes) adj[n] = [];
  for (const [u, v] of edges) {
    if (!adj[u]) adj[u] = [];
    adj[u].push(v);
  }

  const visited = new Set<string>();
  const stack = [nodes[0]];

  yield { array: [], highlights: [], sorted: [], message: `Starting DFS from ${nodes[0]}`, graphVisited: [], graphCurrent: nodes[0], graphQueue: [...stack], graphEdgeHighlight: [], phase: 'init' };

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (visited.has(current)) continue;
    visited.add(current);

    yield { array: [], highlights: [], sorted: [], message: `Visiting ${current}`, graphVisited: Array.from(visited), graphCurrent: current, graphQueue: [...stack], graphEdgeHighlight: [], phase: 'visit' };

    const neighbors = (adj[current] || []).slice().reverse();
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
        yield { array: [], highlights: [], sorted: [], message: `Pushing ${neighbor} to stack`, graphVisited: Array.from(visited), graphCurrent: current, graphQueue: [...stack], graphEdgeHighlight: [[current, neighbor]], phase: 'push' };
      }
    }
  }
  yield { array: [], highlights: [], sorted: [], message: 'DFS complete! All reachable nodes visited.', graphVisited: Array.from(visited), graphCurrent: '', graphQueue: [], graphEdgeHighlight: [], phase: 'done' };
}

// ============ TREE TRAVERSALS ============

export function* inorderSteps(root: any): Generator<VisualizationStep> {
  const result: number[] = [];

  function* inorder(node: any): Generator<VisualizationStep> {
    if (!node) return;
    yield { array: [], highlights: [], sorted: [], message: `Going left from ${node.value}`, treeHighlight: [node.value], phase: 'go-left' };
    yield* inorder(node.left);
    result.push(node.value);
    yield { array: [...result], highlights: [], sorted: [], message: `Visit ${node.value} → Result: [${result.join(', ')}]`, treeHighlight: [node.value], phase: 'visit' };
    yield* inorder(node.right);
  }

  yield { array: [], highlights: [], sorted: [], message: 'Starting Inorder Traversal (Left → Root → Right)', treeHighlight: [], phase: 'init' };
  yield* inorder(root);
  yield { array: [...result], highlights: [], sorted: [], message: `Inorder complete: [${result.join(', ')}]`, treeHighlight: [], phase: 'done' };
}

export function* preorderSteps(root: any): Generator<VisualizationStep> {
  const result: number[] = [];

  function* preorder(node: any): Generator<VisualizationStep> {
    if (!node) return;
    result.push(node.value);
    yield { array: [...result], highlights: [], sorted: [], message: `Visit ${node.value} → Result: [${result.join(', ')}]`, treeHighlight: [node.value], phase: 'visit' };
    yield* preorder(node.left);
    yield* preorder(node.right);
  }

  yield { array: [], highlights: [], sorted: [], message: 'Starting Preorder Traversal (Root → Left → Right)', treeHighlight: [], phase: 'init' };
  yield* preorder(root);
  yield { array: [...result], highlights: [], sorted: [], message: `Preorder complete: [${result.join(', ')}]`, treeHighlight: [], phase: 'done' };
}

export function* postorderSteps(root: any): Generator<VisualizationStep> {
  const result: number[] = [];

  function* postorder(node: any): Generator<VisualizationStep> {
    if (!node) return;
    yield { array: [], highlights: [], sorted: [], message: `Going left from ${node.value}`, treeHighlight: [node.value], phase: 'go-left' };
    yield* postorder(node.left);
    yield* postorder(node.right);
    result.push(node.value);
    yield { array: [...result], highlights: [], sorted: [], message: `Visit ${node.value} → Result: [${result.join(', ')}]`, treeHighlight: [node.value], phase: 'visit' };
  }

  yield { array: [], highlights: [], sorted: [], message: 'Starting Postorder Traversal (Left → Right → Root)', treeHighlight: [], phase: 'init' };
  yield* postorder(root);
  yield { array: [...result], highlights: [], sorted: [], message: `Postorder complete: [${result.join(', ')}]`, treeHighlight: [], phase: 'done' };
}

// ============ DP ============

export function* dpFibonacciSteps(n?: number): Generator<VisualizationStep> {
  const N = n ?? 10;
  const dp = new Array(N + 1).fill(0);
  dp[1] = 1;

  yield { array: [...dp], highlights: [0, 1], sorted: [], message: `Computing Fibonacci(${N}). Base: F(0)=0, F(1)=1`, phase: 'init' };

  for (let i = 2; i <= N; i++) {
    yield { array: [...dp], highlights: [i - 1, i - 2], sorted: [], message: `F(${i}) = F(${i - 1}) + F(${i - 2}) = ${dp[i - 1]} + ${dp[i - 2]}`, pointers: { computing: i }, phase: 'compute' };
    dp[i] = dp[i - 1] + dp[i - 2];
    yield { array: [...dp], highlights: [i], sorted: [], message: `F(${i}) = ${dp[i]}`, phase: 'set' };
  }

  yield { array: [...dp], highlights: [N], sorted: Array.from({ length: N + 1 }, (_, i) => i), message: `Fibonacci(${N}) = ${dp[N]}`, phase: 'done' };
}

export function* dpCoinChangeSteps(): Generator<VisualizationStep> {
  const coins = [1, 3, 4];
  const amount = 6;
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  yield { array: [...dp.map(v => v === Infinity ? -1 : v)], highlights: [0], sorted: [], message: `Coin Change: coins=[${coins}], amount=${amount}. dp[0]=0`, phase: 'init' };

  for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {
      const prev = dp[i];
      yield { array: [...dp.map(v => v === Infinity ? -1 : v)], highlights: [i, i - coin], sorted: [], message: `Trying coin ${coin}: dp[${i}] = min(dp[${i}], dp[${i - coin}]+1) = min(${prev === Infinity ? '∞' : prev}, ${dp[i - coin] === Infinity ? '∞' : dp[i - coin] + 1})`, phase: 'try' };
      dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      yield { array: [...dp.map(v => v === Infinity ? -1 : v)], highlights: [i], sorted: [], message: `dp[${i}] = ${dp[i]}`, phase: 'set' };
    }
  }

  yield { array: [...dp.map(v => v === Infinity ? -1 : v)], highlights: [amount], sorted: Array.from({ length: amount + 1 }, (_, i) => i), message: `Minimum coins for ${amount} = ${dp[amount]}`, phase: 'done' };
}

// ============ LINKED LIST ============

export function* linkedListReverseSteps(): Generator<VisualizationStep> {
  const values = [1, 2, 3, 4, 5];
  const list = values.map((v, i) => ({ value: v, next: i < values.length - 1 }));

  yield { array: [], highlights: [], sorted: [], message: 'Reversing Linked List: 1→2→3→4→5', linkedList: list.map(n => ({ ...n })), llHighlight: -1, phase: 'init' };

  let prev = -1;
  let curr = 0;

  while (curr < values.length) {
    yield { array: [], highlights: [], sorted: [], message: `Current: ${values[curr]}, Prev: ${prev >= 0 ? values[prev] : 'null'}`, linkedList: list.map(n => ({ ...n })), llHighlight: curr, llPointers: { prev, curr, next: curr + 1 }, phase: 'step' };

    const next = curr + 1;
    // Reverse the link
    list[curr].next = prev >= 0;
    prev = curr;
    curr = next;

    yield { array: [], highlights: [], sorted: [], message: `Reversed link. Moving forward.`, linkedList: list.map(n => ({ ...n })), llHighlight: prev, phase: 'reversed' };
  }

  yield { array: [], highlights: [], sorted: [], message: 'Linked List reversed: 5→4→3→2→1', linkedList: list.map(n => ({ ...n })).reverse(), llHighlight: -1, phase: 'done' };
}

// ============ STACK ============

export function* stackSteps(): Generator<VisualizationStep> {
  const ops = ['push 10', 'push 20', 'push 30', 'pop', 'push 40', 'pop', 'pop'];
  const stack: number[] = [];

  yield { array: [...stack], highlights: [], sorted: [], message: 'Stack Operations (LIFO)', phase: 'init' };

  for (const op of ops) {
    if (op.startsWith('push')) {
      const val = parseInt(op.split(' ')[1]);
      stack.push(val);
      yield { array: [...stack], highlights: [stack.length - 1], sorted: [], message: `Push ${val} → Stack: [${stack.join(', ')}]`, phase: 'push' };
    } else {
      const val = stack.pop();
      yield { array: [...stack], highlights: stack.length > 0 ? [stack.length - 1] : [], sorted: [], message: `Pop ${val} → Stack: [${stack.join(', ')}]`, phase: 'pop' };
    }
  }
  yield { array: [...stack], highlights: [], sorted: [], message: `Final stack: [${stack.join(', ')}]`, phase: 'done' };
}

// ============ TWO POINTERS ============

export function* twoPointersSteps(arr: number[]): Generator<VisualizationStep> {
  const a = [...arr].sort((a, b) => a - b);
  const target = a[2] + a[a.length - 2]; // ensure a valid target

  yield { array: [...a], highlights: [], sorted: Array.from({ length: a.length }, (_, i) => i), message: `Two Sum on sorted array, target = ${target}`, pointers: { left: 0, right: a.length - 1 }, phase: 'init' };

  let left = 0, right = a.length - 1;
  while (left < right) {
    const sum = a[left] + a[right];
    yield { array: [...a], highlights: [left, right], sorted: Array.from({ length: a.length }, (_, i) => i), message: `${a[left]} + ${a[right]} = ${sum} (target: ${target})`, pointers: { left, right }, phase: 'check' };

    if (sum === target) {
      yield { array: [...a], highlights: [left, right], sorted: Array.from({ length: a.length }, (_, i) => i), message: `Found! ${a[left]} + ${a[right]} = ${target}`, pointers: { left, right }, phase: 'found' };
      return;
    } else if (sum < target) {
      left++;
      yield { array: [...a], highlights: [left, right], sorted: Array.from({ length: a.length }, (_, i) => i), message: `Sum too small, move left pointer right`, pointers: { left, right }, phase: 'move-left' };
    } else {
      right--;
      yield { array: [...a], highlights: [left, right], sorted: Array.from({ length: a.length }, (_, i) => i), message: `Sum too large, move right pointer left`, pointers: { left, right }, phase: 'move-right' };
    }
  }
}

// ============ SLIDING WINDOW ============

export function* slidingWindowSteps(arr: number[]): Generator<VisualizationStep> {
  const a = arr.length > 0 ? arr : [2, 1, 5, 1, 3, 2];
  const k = 3;

  yield { array: [...a], highlights: [], sorted: [], message: `Max sum subarray of size ${k}`, phase: 'init' };

  let windowSum = 0;
  let maxSum = 0;
  let maxStart = 0;

  for (let i = 0; i < k; i++) {
    windowSum += a[i];
    yield { array: [...a], highlights: Array.from({ length: i + 1 }, (_, j) => j), sorted: [], message: `Building initial window: sum = ${windowSum}`, phase: 'build' };
  }
  maxSum = windowSum;

  for (let i = k; i < a.length; i++) {
    windowSum += a[i] - a[i - k];
    const windowIndices = Array.from({ length: k }, (_, j) => i - k + 1 + j);
    yield { array: [...a], highlights: windowIndices, sorted: [], message: `Window [${a.slice(i - k + 1, i + 1).join(',')}] sum=${windowSum}, max=${maxSum}`, pointers: { start: i - k + 1, end: i }, phase: 'slide' };

    if (windowSum > maxSum) {
      maxSum = windowSum;
      maxStart = i - k + 1;
      yield { array: [...a], highlights: windowIndices, sorted: [], message: `New max! sum=${maxSum}`, phase: 'new-max' };
    }
  }

  const finalIndices = Array.from({ length: k }, (_, j) => maxStart + j);
  yield { array: [...a], highlights: finalIndices, sorted: [], message: `Max sum = ${maxSum} at indices [${maxStart}..${maxStart + k - 1}]`, phase: 'done' };
}
