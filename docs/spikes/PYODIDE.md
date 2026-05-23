# Spike: Pyodide-based Python Tracer

**Status**: Experimental
**Branch**: `spike/pyodide`
**Target version**: v2.0 (per `docs/FUTURE_SCOPE.md` §4.1)
**Demo route**: `#/spike/pyodide`

## Goal

Validate that we can replace the regex-based `algorithmDetector` + hand-written
`visualizationEngine` generators with a single **trace-driven step generator**
fed by real Python execution in the browser.

## How it works

1. `client/src/lib/pyodideTracer.ts` lazily injects the Pyodide v0.26.4 loader
   script from jsDelivr CDN on first call.
2. The user's Python is wrapped with a `sys.settrace` harness that captures
   every `call` / `line` / `return` / `exception` event along with a JSON-safe
   snapshot of local variables.
3. Tracer returns a `TraceResult { events, stdout, error, durationMs }`.
4. `client/src/components/PyodideSpike.tsx` mounts a side-by-side editor + trace
   table at `#/spike/pyodide`.

## Sandbox guarantees

- **No network** — Pyodide runs in WASM
- **No host filesystem** — Pyodide ships with its own MEMFS
- **Memory-scoped to the browser tab**
- **Tab-killable** — runaway loops freeze the tab but cannot harm the host

## Known limitations

- First load is ~5MB / ~5s (CDN cached afterwards)
- `numpy`, `scipy` etc. require explicit `pyodide.loadPackage()` calls — not
  wired into the spike yet
- Trace harness caps locals at 64 entries and string repr at 200 chars to
  bound payload size
- The harness uses `sys.settrace` which is **only triggered for pure-Python
  frames**. C-extension code (rare in interview algorithms) is invisible

## What this unlocks (v2.0)

Once the spike proves out:

| Today (v1.x) | After v2.0 |
|---|---|
| 871-line regex `algorithmDetector.ts` | Optional — keep for fast pre-classification, but no longer required |
| 1059-line `visualizationEngine.ts` with 16+ hand-written generators | One universal step generator that maps `TraceEvent[]` → `VisualizationStep[]` |
| Visualizes only the algorithms we anticipated | Visualizes **any** valid Python |
| Pattern-extracted estimates of data | Real runtime values |
| ~30 algorithms supported | Unbounded |

## Next checkpoints

1. Wire `TraceEvent[]` → `VisualizationStep[]` mapping for one algorithm
   (recommend `bubble_sort` — already has a generator to A/B against)
2. Measure trace event count vs. current step count (target: same order of
   magnitude or accept gracefully degraded fidelity)
3. Add `pyodide.loadPackage(['numpy'])` for matrix/graph algorithms
4. Decide on regex-first vs trace-first detection strategy
   (recommend regex for known algorithms = fast UX, trace fallback = universal)
