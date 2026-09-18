# Bolt Learnings

## 2026-09-18 - Racing mirror queries with Promise.any
**Learning:** Sequential mirror looping in scrapers introduces high additive network latency if initial mirrors fail or time out.
**Action:** Use `Promise.any` to race mirror requests in parallel, returning as soon as the first valid mirror responds.
