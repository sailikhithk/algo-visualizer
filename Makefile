PORT ?= 3002

.DEFAULT_GOAL := help
.PHONY: help dev restart kill kill-port up bg stop status health logs test check build install clean

help: ## Show this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

## ── Server lifecycle ──────────────────────────────────────────────

dev: kill ## Kill anything on $(PORT) and start dev server (foreground)
	npm run format
	PORT=$(PORT) npm run dev

restart: kill ## Alias for dev — kill port then run
	PORT=$(PORT) npm run dev

bg: kill ## Start dev server in background (logs → /tmp/algoviz.log)
	@PORT=$(PORT) nohup npm run dev > /tmp/algoviz.log 2>&1 &
	@sleep 2
	@echo "▶ algoviz running on http://localhost:$(PORT) (logs: /tmp/algoviz.log)"

up: bg ## Alias for bg

kill: ## Kill whatever is listening on $(PORT)
	@PIDS=$$(lsof -ti :$(PORT) 2>/dev/null); \
	if [ -n "$$PIDS" ]; then \
		echo "✖ killing PID(s) on :$(PORT): $$PIDS"; \
		kill -9 $$PIDS 2>/dev/null || true; \
	else \
		echo "✓ port $(PORT) free"; \
	fi

stop: kill ## Alias for kill
kill-port: kill ## Alias for kill (legacy)

status: ## Show what (if anything) owns $(PORT)
	@lsof -i :$(PORT) || echo "port $(PORT) free"

health: ## Curl /api/health and pretty-print
	@curl -s http://localhost:$(PORT)/api/health | python3 -m json.tool || \
		echo "✖ server not responding on :$(PORT) — run 'make dev' first"

logs: ## Tail the background log
	@test -f /tmp/algoviz.log && tail -f /tmp/algoviz.log || \
		echo "no /tmp/algoviz.log — start with 'make bg' first"

## ── Quality gates ─────────────────────────────────────────────────

test: ## Run vitest once
	npm test

check: ## TypeScript typecheck
	npm run check

build: ## Production build
	npm run build

verify: check test build ## CI gate — typecheck + test + build

## ── Workspace ─────────────────────────────────────────────────────

install: ## npm ci (clean install from lockfile)
	npm ci

clean: ## Remove dist + node_modules + caches
	rm -rf dist node_modules .vite
