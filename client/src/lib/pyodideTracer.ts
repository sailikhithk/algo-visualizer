// Pyodide-based Python tracer (v2.0 spike)
//
// Runs user Python in a sandboxed WASM Pyodide runtime in the browser
// and captures every line execution + local variables via sys.settrace.
//
// This is a stepping stone toward replacing the regex-based
// algorithmDetector + hand-written generator visualizationEngine with
// a universal trace-driven step generator (FUTURE_SCOPE.md §4.1).
//
// Status: EXPERIMENTAL — not wired into the UI yet.

export interface TraceEvent {
  /** 1-indexed line number of the user's code */
  line: number;
  /** Event type from sys.settrace */
  event: "call" | "line" | "return" | "exception";
  /** Function name where the event occurred */
  func: string;
  /** Local variables at this point in execution */
  locals: Record<string, unknown>;
  /** Return value (only on 'return' events) */
  returnValue?: unknown;
  /** Monotonic step counter */
  step: number;
}

export interface TraceResult {
  /** Trace events captured during execution */
  events: TraceEvent[];
  /** stdout produced by the user's code */
  stdout: string;
  /** Error message if execution failed */
  error?: string;
  /** Wall-clock execution time in ms */
  durationMs: number;
}

interface PyodideAPI {
  runPython(code: string): unknown;
  runPythonAsync(code: string): Promise<unknown>;
  globals: {
    get(name: string): unknown;
    set(name: string, val: unknown): void;
  };
  setStdout(opts: { batched: (s: string) => void }): void;
  setStderr(opts: { batched: (s: string) => void }): void;
}

declare global {
  interface Window {
    loadPyodide?: (config?: { indexURL?: string }) => Promise<PyodideAPI>;
  }
}

let pyodidePromise: Promise<PyodideAPI> | null = null;

/**
 * Lazily load the Pyodide runtime from CDN. Cached after the first call.
 */
export async function getPyodide(): Promise<PyodideAPI> {
  if (pyodidePromise) return pyodidePromise;

  pyodidePromise = (async () => {
    if (typeof window === "undefined") {
      throw new Error("Pyodide tracer only runs in the browser");
    }

    // Inject the Pyodide loader script if it's not already on the page
    if (!window.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error("Failed to load Pyodide loader"));
        document.head.appendChild(script);
      });
    }

    if (!window.loadPyodide) {
      throw new Error("loadPyodide not available after script load");
    }

    const pyodide = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
    });
    return pyodide;
  })();

  return pyodidePromise;
}

/**
 * Tracing harness — injected before the user's code.
 * Uses sys.settrace to capture every line execution with locals.
 */
const TRACE_HARNESS = `
import sys, json, copy

_ALGOVIZ_EVENTS = []
_ALGOVIZ_STEP = [0]

def _algoviz_serialize(v):
    try:
        # Only keep JSON-serializable primitives + lists/dicts of them
        if isinstance(v, (int, float, str, bool)) or v is None:
            return v
        if isinstance(v, (list, tuple)):
            return [_algoviz_serialize(x) for x in v][:64]  # cap size
        if isinstance(v, dict):
            return {str(k): _algoviz_serialize(val) for k, val in list(v.items())[:64]}
        return repr(v)[:200]
    except Exception:
        return "<unserializable>"

def _algoviz_tracer(frame, event, arg):
    # Skip frames from this harness itself
    if frame.f_code.co_filename == "<harness>":
        return _algoviz_tracer
    if event not in ("call", "line", "return", "exception"):
        return _algoviz_tracer

    locals_snapshot = {}
    for k, v in frame.f_locals.items():
        if k.startswith("_algoviz"):
            continue
        locals_snapshot[k] = _algoviz_serialize(v)

    _ALGOVIZ_STEP[0] += 1
    _ALGOVIZ_EVENTS.append({
        "line": frame.f_lineno,
        "event": event,
        "func": frame.f_code.co_name,
        "locals": locals_snapshot,
        "returnValue": _algoviz_serialize(arg) if event == "return" else None,
        "step": _ALGOVIZ_STEP[0],
    })
    return _algoviz_tracer

sys.settrace(_algoviz_tracer)
`;

const TRACE_TEARDOWN = `
sys.settrace(None)
_algoviz_result = json.dumps(_ALGOVIZ_EVENTS)
`;

/**
 * Run Python code with full tracing. Returns every line execution +
 * local variable state as a list of TraceEvents.
 *
 * Sandbox guarantees:
 *   - No network (Pyodide runs in WASM)
 *   - No host filesystem (Pyodide has its own MEMFS)
 *   - Memory is browser-tab scoped
 */
export async function traceCode(code: string): Promise<TraceResult> {
  const start = performance.now();
  const stdoutChunks: string[] = [];
  let error: string | undefined;

  try {
    const pyodide = await getPyodide();
    pyodide.setStdout({ batched: (s: string) => stdoutChunks.push(s) });
    pyodide.setStderr({ batched: (s: string) => stdoutChunks.push(s) });

    // Compose: harness → user code → teardown
    const fullProgram = `${TRACE_HARNESS}\n${code}\n${TRACE_TEARDOWN}`;
    await pyodide.runPythonAsync(fullProgram);

    const resultJson = pyodide.globals.get("_algoviz_result") as string;
    const events = JSON.parse(resultJson) as TraceEvent[];

    return {
      events,
      stdout: stdoutChunks.join(""),
      durationMs: performance.now() - start,
    };
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
    return {
      events: [],
      stdout: stdoutChunks.join(""),
      error,
      durationMs: performance.now() - start,
    };
  }
}
