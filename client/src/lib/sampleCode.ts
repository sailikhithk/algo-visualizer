// Sample Python code for each algorithm category

export const SAMPLE_CODES: Record<string, { title: string; code: string }> = {
  bubble_sort: {
    title: 'Bubble Sort',
    code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

arr = [64, 34, 25, 12, 22, 11, 90, 45]
print(bubble_sort(arr))`
  },
  selection_sort: {
    title: 'Selection Sort',
    code: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

arr = [64, 25, 12, 22, 11, 90, 45, 78]
print(selection_sort(arr))`
  },
  insertion_sort: {
    title: 'Insertion Sort',
    code: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

arr = [12, 11, 13, 5, 6, 45, 23, 78]
print(insertion_sort(arr))`
  },
  merge_sort: {
    title: 'Merge Sort',
    code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

arr = [38, 27, 43, 3, 9, 82, 10, 55]
print(merge_sort(arr))`
  },
  quick_sort: {
    title: 'Quick Sort',
    code: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

arr = [10, 80, 30, 90, 40, 50, 70, 20]
print(quick_sort(arr))`
  },
  binary_search: {
    title: 'Binary Search',
    code: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    
    return -1

arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
target = 23
print(binary_search(arr, target))`
  },
  bfs: {
    title: 'BFS (Breadth-First Search)',
    code: `from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result

graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': ['F'],
    'F': []
}
print(bfs(graph, 'A'))`
  },
  dfs: {
    title: 'DFS (Depth-First Search)',
    code: `def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(start)
    result = [start]
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            result.extend(dfs(graph, neighbor, visited))
    
    return result

graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': ['F'],
    'F': []
}
print(dfs(graph, 'A'))`
  },
  inorder: {
    title: 'Inorder Traversal',
    code: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def inorder_traversal(root):
    if root is None:
        return []
    return (inorder_traversal(root.left) + 
            [root.val] + 
            inorder_traversal(root.right))

# Build BST
root = TreeNode(50)
root.left = TreeNode(30)
root.right = TreeNode(70)
root.left.left = TreeNode(20)
root.left.right = TreeNode(40)
root.right.left = TreeNode(60)
root.right.right = TreeNode(80)

print(inorder_traversal(root))`
  },
  dp_fibonacci: {
    title: 'Fibonacci (DP)',
    code: `def fibonacci(n):
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]

n = 10
print(f"Fibonacci({n}) = {fibonacci(n)}")`
  },
  dp_coin_change: {
    title: 'Coin Change (DP)',
    code: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1

coins = [1, 3, 4]
amount = 6
print(coin_change(coins, amount))`
  },
  linked_list_reverse: {
    title: 'Reverse Linked List',
    code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_linked_list(head):
    prev = None
    curr = head
    
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    
    return prev

# Create: 1 -> 2 -> 3 -> 4 -> 5
head = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
reversed_head = reverse_linked_list(head)`
  },
  two_pointers: {
    title: 'Two Pointers - Two Sum',
    code: `def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    
    while left < right:
        current_sum = arr[left] + arr[right]
        
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return [-1, -1]

arr = [2, 7, 11, 15, 20, 25, 30]
target = 22
print(two_sum_sorted(arr, target))`
  },
  sliding_window: {
    title: 'Sliding Window - Max Sum',
    code: `def max_sum_subarray(arr, k):
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum

arr = [2, 1, 5, 1, 3, 2]
k = 3
print(max_sum_subarray(arr, k))`
  },
  stack: {
    title: 'Stack Operations',
    code: `class Stack:
    def __init__(self):
        self.stack = []
    
    def push(self, item):
        self.stack.append(item)
    
    def pop(self):
        if not self.is_empty():
            return self.stack.pop()
    
    def peek(self):
        return self.stack[-1] if self.stack else None
    
    def is_empty(self):
        return len(self.stack) == 0

s = Stack()
s.push(10)
s.push(20)
s.push(30)
s.pop()
s.push(40)`
  },
};

export const CATEGORY_SAMPLES: Record<string, string[]> = {
  'Sorting': ['bubble_sort', 'selection_sort', 'insertion_sort', 'merge_sort', 'quick_sort'],
  'Searching': ['binary_search'],
  'Graph': ['bfs', 'dfs'],
  'Tree': ['inorder'],
  'Dynamic Programming': ['dp_fibonacci', 'dp_coin_change'],
  'Linked List': ['linked_list_reverse'],
  'Two Pointers': ['two_pointers'],
  'Sliding Window': ['sliding_window'],
  'Stack & Queue': ['stack'],
};
