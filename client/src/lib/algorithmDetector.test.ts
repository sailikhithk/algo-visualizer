import { describe, expect, it } from "vitest";
import {
  detectAlgorithm,
  extractArrayFromCode,
  extractGraphFromCode,
  extractTreeFromCode,
} from "./algorithmDetector";

describe("detectAlgorithm", () => {
  it("returns category 'unknown' (not 'sorting') when nothing matches", () => {
    const result = detectAlgorithm("print('hello world')");
    expect(result.type).toBe("unknown");
    expect(result.category).toBe("unknown");
    expect(result.dataStructure).toBe("unknown");
  });

  it("detects bubble sort by function name", () => {
    const code = `
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr
`;
    const result = detectAlgorithm(code);
    expect(result.type).toBe("bubble_sort");
    expect(result.category).toBe("sorting");
  });

  it("detects merge sort over generic DP fallback (priority resolution)", () => {
    const code = `
def merge_sort(arr):
    dp = [0] * len(arr)
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    return merge(merge_sort(arr[:mid]), merge_sort(arr[mid:]))
`;
    const result = detectAlgorithm(code);
    expect(result.type).toBe("merge_sort");
  });

  it("detects BFS by deque + visited pattern", () => {
    const code = `
from collections import deque
def bfs(graph, start):
    visited = set()
    queue = deque([start])
    while queue:
        node = queue.popleft()
`;
    const result = detectAlgorithm(code);
    expect(result.category).toBe("graph");
  });

  it("detects binary search by name", () => {
    const result = detectAlgorithm("def binary_search(arr, target): pass");
    expect(result.type).toBe("binary_search");
  });
});

describe("extractArrayFromCode", () => {
  it("extracts the first integer array literal", () => {
    const code = "arr = [5, 3, 8, 1, 9]\nbubble_sort(arr)";
    expect(extractArrayFromCode(code)).toEqual([5, 3, 8, 1, 9]);
  });

  it("falls back to default when no array literal present", () => {
    const arr = extractArrayFromCode("def foo(): pass");
    expect(arr.length).toBeGreaterThan(0);
    expect(arr).toContain(64); // default first element
  });
});

describe("extractGraphFromCode (regression for stray-space regex bug)", () => {
  it("parses a real adjacency list, NOT the default sample graph", () => {
    const code = `
graph = {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': ['D', 'E'],
    'D': [],
    'E': ['F'],
    'F': []
}
`;
    const { nodes, edges } = extractGraphFromCode(code);
    expect(nodes).toContain("A");
    expect(nodes).toContain("F");
    // Edges from the actual code (not the default A→B, A→C, B→D, C→E, D→F, E→F)
    expect(edges).toContainEqual(["A", "B"]);
    expect(edges).toContainEqual(["A", "C"]);
    expect(edges).toContainEqual(["C", "E"]);
    expect(edges).toContainEqual(["E", "F"]);
    // The bug previously caused this exact graph to be silently replaced
    // with the default sample. Asserting we have C->E (not in default) proves
    // we parsed the user's graph.
  });

  it("returns default sample when no adjacency list is found", () => {
    const { nodes, edges } = extractGraphFromCode("def foo(): pass");
    expect(nodes).toEqual(["A", "B", "C", "D", "E", "F"]);
    expect(edges.length).toBe(6);
  });
});

describe("extractTreeFromCode", () => {
  it("builds a BST from insert() calls", () => {
    const code = "tree.insert(10)\ntree.insert(5)\ntree.insert(15)";
    const root = extractTreeFromCode(code);
    expect(root.value).toBe(10);
    expect(root.left?.value).toBe(5);
    expect(root.right?.value).toBe(15);
  });

  it("falls back to default BST when no inserts are present", () => {
    const root = extractTreeFromCode("def foo(): pass");
    expect(root.value).toBe(50);
  });
});
