# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal recipe cookbook web app. A public page displays recipe tiles; clicking opens a full recipe card. A password-protected admin panel allows CRUD operations on recipes.

## Dev Commands

```bash
# Start dev server
npm run dev

# Production build + serve
npm run build && npm start

# Type check (no emit)
npm run typecheck

# Lint (ESLint v9 flat config — next lint removed in Next.js 16)
npm run lint

# Format all files with Prettier
npm run format

# Check formatting without writing
npm run format:check
```

## Testing Commands

```bash
# Run all unit & component tests (Vitest)
npm test

# Unit tests in watch mode
npm run test:watch

# Run E2E + visual regression tests (Playwright, requires running server)
npm run test:e2e

# Update visual snapshots after an intentional UI change
npm run test:e2e:update
```

**Always run `npm test` before committing.** The pre-commit hook runs `lint-staged` (format + lint on changed files); the pre-push hook runs `npm run typecheck`.

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **UI — public:** Global CSS (`src/app/recipes.css`), Google Fonts via `<link>` in root layout
- **UI — admin:** MUI v6 (`@mui/material`) with a custom theme in `AdminThemeProvider`. Work Sans via `next/font/google`.
- **Database:** PostgreSQL (Neon serverless), accessed via `@neondatabase/serverless` pool singleton (`src/lib/db.ts`). Single table: `recipes`. No ORM, no migrations.
- **Auth:** Custom httpOnly cookie (`auth`). Secret stored in `AUTH_SECRET` env var.

## Environment

Copy `.env.local.example` and fill in:

```
DATABASE_URL=postgresql://...   # Neon connection string
ADMIN_PASSWORD=                 # Admin panel password
AUTH_SECRET=                    # Any random string for cookie signing
```

## Architecture

### Request flow — public

`/` → `page.tsx` renders `<Cookbook />` (client component) → `fetch /api/recipes` → tile grid → click → navigates to `/{slug}` → server renders `<IndexCard />`

### Request flow — admin

`/admin/login` → POST `/admin/api/login` → sets `auth` httpOnly cookie → redirect to `/admin/edit`

`/admin/edit` is protected by `src/proxy.ts` (Next.js middleware). The page is a server component that fetches recipe list + selected recipe from PostgreSQL, then renders `<AdminNav>` and `<RecipeForm>` (both client components).

Saves go to POST `/admin/api/recipes` with `{ action: "create" | "update" | "delete", ...fields }`.

### Database

Single table: `recipes`. Columns: `id`, `title`, `slug`, `servings`, `timetotal`, `timeactive`, `sourcename`, `sourceurl`, `notes`, `steps`, `tags`, `ingredients`.

`steps`, `tags`, and `ingredients` are stored as **JSON strings** in text columns — always `JSON.parse` on read, `JSON.stringify` on write. No SQL querying on these fields is possible.

`slug` is unique and auto-generated from `title` via `generateSlug()` in `src/lib/utils.ts`.

## Conventions

### Code style

- Formatting enforced by **Prettier** (`.prettierrc`). Run `npm run format` to apply.
- Linting via **ESLint v9** flat config (`eslint.config.mjs`), extending `next/core-web-vitals` and `next/typescript`.
- TypeScript **strict mode** is on. Do not use `any` without a comment explaining why.

### UI

- **Public UI:** plain CSS only (`src/app/recipes.css`). No CSS modules, no Tailwind.
- **Admin UI:** MUI v6 components only. Do not add custom CSS to the admin panel.

### API

- API routes return JSON. Errors return `{ error: string }` with an appropriate HTTP status.
- Admin API routes must call `checkAuth()` from `src/lib/auth.ts` before doing anything.
- Write raw SQL via the Neon pool in `src/lib/db.ts`. No ORM.

### Testing

- Unit tests live next to the source file they test (`*.test.ts` / `*.test.tsx`).
- E2E tests live in `src/test/e2e/`.
- Visual snapshots are committed to `src/test/e2e/__snapshots__/`. Update them with `npm run test:e2e:update` after intentional UI changes.
- Mock `@/lib/db` in unit tests — never hit a real database from unit tests.

## Agent Workflow Notes

- After making changes, run `npm test` to verify nothing regressed.
- After any UI change, run `npm run test:e2e` and check if snapshots need updating.
- The `measures[]` array in `src/lib/definitions.ts` is the source of truth for ingredient units. Index 0 = cup. Index -1 means "no unit".
- JSON columns (`ingredients`, `steps`, `tags`): the raw DB value is a JSON string. Always parse on read, stringify on write.
- Slugs must be unique. Use `generateSlug(title)` from `src/lib/utils.ts` when creating or renaming recipes.
- Cookie name: `auth`. Set in `src/app/admin/api/login/route.ts`, validated in `src/lib/auth.ts`.
- Middleware file: `src/proxy.ts` (this is the Next.js middleware, configured to match `/admin/edit`).
- The `[slug]/page.tsx` route replaced the old `/api/recipes/[id]` approach for the public recipe view.

## File Map

```
src/
  proxy.ts                      # Next.js middleware — protects /admin/edit
  types/recipe.ts               # Shared interfaces: Recipe, RecipeRow, Ingredient, Measure, etc.
  lib/
    db.ts                       # Neon PostgreSQL pool singleton
    auth.ts                     # checkAuth() — reads httpOnly cookie server-side
    definitions.ts              # measures[] array (typed)
    utils.ts                    # generateSlug(), replaceFractions()
  test/
    setup.ts                    # Vitest global setup (@testing-library/jest-dom)
    e2e/                        # Playwright E2E specs
      homepage.spec.ts
      recipe.spec.ts
      admin.spec.ts
      __snapshots__/            # Committed visual diff baselines
  app/
    layout.tsx                  # Root layout — Google Fonts link, recipes.css
    page.tsx                    # Renders <Cookbook />
    recipes.css                 # Public site styles (global, no modules)
    [slug]/page.tsx             # Dynamic recipe detail page (server component)
    api/recipes/route.ts        # GET /api/recipes — list (id, title, slug ordered by title)
    api/recipes/[id]/route.ts   # GET /api/recipes/[id] — full recipe, JSON columns parsed
    admin/
      layout.tsx                # Wraps admin in AppRouterCacheProvider + AdminThemeProvider
      admin.css                 # (unused — kept for reference; MUI handles all admin styling)
      login/page.tsx            # Login form (client component)
      edit/page.tsx             # Server component: fetches data, renders AdminNav + RecipeForm
      api/login/route.ts        # POST — validates ADMIN_PASSWORD, sets auth cookie
      api/logout/route.ts       # POST — clears auth cookie
      api/recipes/route.ts      # POST — create/update/delete, protected by checkAuth()
  components/
    Cookbook.tsx                # Client component: recipe list + search
    IndexCard.tsx               # Client component: full recipe card view
    Ingredient.tsx              # Renders a single ingredient with fraction formatting
    TransitionLink.tsx          # Link with View Transitions API support
    admin/
      AdminThemeProvider.tsx    # "use client" MUI ThemeProvider + CssBaseline
      AdminNav.tsx              # AppBar with recipe selector (MUI Select) + logout button
      RecipeForm.tsx            # Full recipe edit form (MUI)
      IngredientEditor.tsx      # Dynamic ingredient rows (MUI)
      ArrayEditor.tsx           # Dynamic string list editor for steps/tags (MUI)
```
