# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal recipe cookbook web app. A single-page React frontend displays recipe tiles; clicking opens a full recipe card. A PHP admin panel allows CRUD operations on recipes.

## Dev Commands

```bash
# Start local server (from repo root)
php -S localhost:8000

# Compile JSX (from scripts/ directory, run in watch mode while developing)
cd scripts && babel --presets react --watch src/ --out-dir lib/
```

There are no tests, no linter, and no npm scripts at the root level.

## Architecture

### Stack
- **Frontend:** React 0.14.2 (loaded from CDN via `index.html`), jQuery, Underscore.js
- **JSX build:** Babel CLI (manually run, not webpack). Source in `scripts/src/`, compiled output in `scripts/lib/`
- **Backend:** PHP (no framework), RedBeanPHP ORM (`database/rb.php`)
- **Database:** MySQL — single table `recipes`
- **Deployment:** FTP via Sublime SFTP (`sftp-config.json`, gitignored)

### Request Flow

**Public (read):**
`index.html` → React mounts → `$.ajax GET /fetch/list.php` → renders tile grid → tile click → `$.ajax GET /fetch/recipe.php?id=N` → renders recipe card

**Admin (write):**
`/admin/login.php` (session auth) → `/admin/addedit.php` (PHP form with embedded React editors) → POST `/admin/save.php` (RedBeanPHP R::store/R::trash) → redirect

### Database

Single table: `recipes`. Columns: `id`, `title`, `servings`, `timetotal`, `timeactive`, `sourcename`, `sourceurl`, `notes`, `steps` (text), `tags` (varchar), `ingredients` (text).

**Important:** `steps`, `tags`, and `ingredients` are stored as **JSON strings** inside text columns. The frontend serializes/deserializes with `JSON.stringify`/`JSON.parse`. No SQL querying on these fields is possible.

Database bootstrap: `database/connect.php` requires `rb.php` + `config.php`, calls `R::setup()` and `R::freeze(TRUE)` (frozen mode — no auto-migrations).

`database/config.php` is gitignored. Copy `database/config-sample.php` to set up credentials.

### React Version Note

The app uses React 0.14.2 (2015 era) with `React.createClass` and `React.render` (pre-ReactDOM API). Do not attempt to use modern React patterns — they are incompatible with this version.
