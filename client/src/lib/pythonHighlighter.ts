/**
 * Lightweight Python syntax highlighter — produces HTML spans
 * with classes for keywords, builtins, strings, comments, numbers,
 * decorators, function/class names.
 *
 * Designed for overlay rendering (pre over transparent textarea).
 */

const KEYWORDS = new Set([
  "False",
  "None",
  "True",
  "and",
  "as",
  "assert",
  "async",
  "await",
  "break",
  "class",
  "continue",
  "def",
  "del",
  "elif",
  "else",
  "except",
  "finally",
  "for",
  "from",
  "global",
  "if",
  "import",
  "in",
  "is",
  "lambda",
  "nonlocal",
  "not",
  "or",
  "pass",
  "raise",
  "return",
  "try",
  "while",
  "with",
  "yield",
]);

const BUILTINS = new Set([
  "print",
  "range",
  "len",
  "int",
  "float",
  "str",
  "list",
  "dict",
  "set",
  "tuple",
  "bool",
  "type",
  "input",
  "open",
  "map",
  "filter",
  "zip",
  "enumerate",
  "sorted",
  "reversed",
  "min",
  "max",
  "sum",
  "abs",
  "round",
  "all",
  "any",
  "isinstance",
  "issubclass",
  "hasattr",
  "getattr",
  "setattr",
  "super",
  "property",
  "staticmethod",
  "classmethod",
  "ValueError",
  "TypeError",
  "IndexError",
  "KeyError",
  "StopIteration",
  "Exception",
  "RuntimeError",
  "append",
  "extend",
  "pop",
  "insert",
  "remove",
  "sort",
  "join",
  "split",
  "strip",
  "replace",
  "format",
  "items",
  "keys",
  "values",
  "update",
]);

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Tokenise a single line and return an HTML string with <span> wrappers. */
function highlightLine(line: string): string {
  // Token patterns (order matters — first match wins)
  const TOKEN_RE =
    /(?<comment>#.*)|(?<tripleStr>"""[\s\S]*?"""|'''[\s\S]*?''')|(?<string>(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'))|(?<decorator>@\w+)|(?<number>\b(?:0[xXoObB])?[\d_]+(?:\.[\d_]+)?(?:[eE][+-]?\d+)?\b)|(?<word>[A-Za-z_]\w*)|(?<op>[^\s\w])|(?<space>\s+)/g;

  let result = "";
  let match: RegExpExecArray | null;

  while ((match = TOKEN_RE.exec(line)) !== null) {
    const text = match[0];

    if (match.groups?.comment) {
      result += `<span class="syn-comment">${escapeHtml(text)}</span>`;
    } else if (match.groups?.tripleStr || match.groups?.string) {
      result += `<span class="syn-string">${escapeHtml(text)}</span>`;
    } else if (match.groups?.decorator) {
      result += `<span class="syn-decorator">${escapeHtml(text)}</span>`;
    } else if (match.groups?.number) {
      result += `<span class="syn-number">${escapeHtml(text)}</span>`;
    } else if (match.groups?.word) {
      if (KEYWORDS.has(text)) {
        result += `<span class="syn-keyword">${escapeHtml(text)}</span>`;
      } else if (BUILTINS.has(text)) {
        result += `<span class="syn-builtin">${escapeHtml(text)}</span>`;
      } else {
        // Check if next non-space char is '(' — then it's a function call/def
        const rest = line.slice(TOKEN_RE.lastIndex);
        if (/^\s*\(/.test(rest)) {
          result += `<span class="syn-function">${escapeHtml(text)}</span>`;
        } else {
          result += escapeHtml(text);
        }
      }
    } else {
      result += escapeHtml(text);
    }
  }

  return result;
}

/** Highlight full Python source code. Returns HTML string. */
export function highlightPython(code: string): string {
  return code
    .split("\n")
    .map((line) => highlightLine(line))
    .join("\n");
}
