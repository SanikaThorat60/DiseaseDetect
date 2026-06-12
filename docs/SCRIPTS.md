# Scripts (backend/scripts)

This repository includes several small scripts to inspect and migrate `SearchHistory` data in the development environment. Use these for debugging or data repair. Back up your database before running any script that modifies data.

Read-only scripts
- `inspectLatest.js` — Prints a compact summary of the most recent `SearchHistory` document. Useful to quickly inspect the latest saved detection.
- `dumpHistory.js` — Prints recent history documents to stdout as JSON.
- `dumpHistoryToFile.js` — Writes recent history (up to 50) into `backend/recent_history.json` for offline inspection.
- `listNamePresence.js` — Lists recent history `_id`s and whether `result.name` and `result.disease` keys exist.

Migration / write scripts (CAUTION)
- `fixHistoryNames.js` — Attempts to infer a `result.name` from `result.description` and update documents. Older attempt; may not have updated all records.
- `populateNamesFallback.js` — Heuristic migration that populates missing `result.name` and `result.disease` from `result.description` (regex match or first-two-words fallback). This was used to repair existing records where names were missing.

How to run
1. Change into the backend directory:
   ```bash
   cd backend
   ```
2. Run any script with Node.js, for example:
   ```bash
   node scripts/inspectLatest.js
   node scripts/dumpHistoryToFile.js
   ```
3. For migration scripts that modify the DB, back up your MongoDB collection first. Example (mongodump):
   ```bash
   mongodump --db form --out ./backup-$(date +%F)
   node scripts/populateNamesFallback.js
   ```

Safety & tips
- Read-only scripts are safe and do not change data.
- Migration scripts change the DB — run them only when you understand their heuristics and have a backup.
- To preview changes, you can modify a migration to log planned updates without applying them (or add a `--dry-run` flag).

If you'd like, I can:
- Add a `--dry-run` option to `populateNamesFallback.js` so it prints proposed changes without writing them.
- Move these scripts into an npm script group in `backend/package.json` for convenience.
