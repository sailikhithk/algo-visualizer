PORT ?= 3002

.PHONY: dev kill-port

dev: kill-port
	npm run format
	PORT=$(PORT) npm run dev

kill-port:
	@lsof -ti :$(PORT) | xargs kill -9 2>/dev/null || true
