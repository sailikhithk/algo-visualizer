import { useState } from "react";
import { traceCode, type TraceEvent } from "@/lib/pyodideTracer";

const DEMO_CODE = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

result = bubble_sort([5, 3, 8, 1, 9])
print(result)
`;

/**
 * Pyodide spike UI — paste Python, see the trace stream.
 *
 * Mount at /spike/pyodide via a route in App.tsx to demo.
 * This validates the v2.0 architecture before refactoring
 * visualizationEngine.ts.
 */
export function PyodideSpike() {
  const [code, setCode] = useState(DEMO_CODE);
  const [events, setEvents] = useState<TraceEvent[]>([]);
  const [stdout, setStdout] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0);

  const run = async () => {
    setLoading(true);
    setError(undefined);
    setEvents([]);
    setStdout("");
    try {
      const result = await traceCode(code);
      setEvents(result.events);
      setStdout(result.stdout);
      setError(result.error);
      setDuration(result.durationMs);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-sm">
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold">Pyodide Trace Spike</h2>
        <p className="text-xs text-muted-foreground">
          Paste Python. Runs in WASM sandbox. Every line + locals captured via
          sys.settrace.
        </p>
        <textarea
          className="border rounded p-3 h-96 bg-card"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
        />
        <button
          onClick={run}
          disabled={loading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
        >
          {loading ? "Loading Pyodide… (first run takes ~5s)" : "▶ Trace"}
        </button>
        {error && (
          <pre className="text-destructive whitespace-pre-wrap text-xs">
            {error}
          </pre>
        )}
        {stdout && (
          <div>
            <div className="text-xs text-muted-foreground mb-1">stdout</div>
            <pre className="bg-muted p-2 rounded text-xs">{stdout}</pre>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">
            Trace ({events.length} events)
          </h2>
          {duration > 0 && (
            <span className="text-xs text-muted-foreground">
              {duration.toFixed(0)}ms
            </span>
          )}
        </div>
        <div className="border rounded h-[34rem] overflow-auto bg-card">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-card border-b">
              <tr className="text-left">
                <th className="p-2 w-12">#</th>
                <th className="p-2 w-14">line</th>
                <th className="p-2 w-20">event</th>
                <th className="p-2 w-24">func</th>
                <th className="p-2">locals</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.step} className="border-b border-border/50">
                  <td className="p-2 text-muted-foreground">{e.step}</td>
                  <td className="p-2">{e.line}</td>
                  <td className="p-2">
                    <span
                      className={
                        e.event === "call"
                          ? "text-primary"
                          : e.event === "return"
                            ? "text-accent"
                            : e.event === "exception"
                              ? "text-destructive"
                              : ""
                      }
                    >
                      {e.event}
                    </span>
                  </td>
                  <td className="p-2">{e.func}</td>
                  <td className="p-2 font-mono text-xs">
                    {JSON.stringify(e.locals)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
