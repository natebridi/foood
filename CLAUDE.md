# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal recipe cookbook web app. A public page displays recipe tiles; clicking opens a full recipe card. A password-protected admin panel allows CRUD operations on recipes.

## Dev Commands

```bash
# Start dev server
npm run dev

# Production build
npm run build
```

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **UI — public:** Global CSS (`src/app/recipes.css`), Google Fonts via `<link>` in root layout
- **UI — admin:** MUI v6 (`@mui/material`) with a custom theme in `AdminThemeProvider`. Work Sans via `next/font/google`.
- **Database:** MySQL, accessed directly via `mysql2/promise` pool singleton (`src/lib/db.ts`). Single table: `recipes`. No ORM, no migrations.
- **Auth:** Custom httpOnly cookie (`auth`). Secret stored in `AUTH_SECRET` env var.

## Environment

Copy `.env.local` and fill in:

```
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
ADMIN_PASSWORD=
AUTH_SECRET=   # any random string
```

## Architecture

### Request flow — public

`/` → `page.tsx` renders `<Cookbook />` (client component) → `fetch /api/recipes` → tile grid → click → `fetch /api/recipes/[id]` → `<IndexCard />`

### Request flow — admin

`/admin/login` → POST `/admin/api/login` → sets `auth` httpOnly cookie → redirect to `/admin/edit`

`/admin/edit` is protected by `src/proxy.ts` (Next.js proxy/middleware). The page is a server component that fetches recipe list + selected recipe from MySQL, then renders `<AdminNav>` and `<RecipeForm>` (both client components).

Saves go to POST `/admin/api/recipes` with `{ action: "create" | "update" | "delete", ...fields }`.

### Database

Single table: `recipes`. Columns: `id`, `title`, `servings`, `timetotal`, `timeactive`, `sourcename`, `sourceurl`, `notes`, `steps`, `tags`, `ingredients`.

`steps`, `tags`, and `ingredients` are stored as **JSON strings** in text columns — always `JSON.parse` on read, `JSON.stringify` on write. No SQL querying on these fields is possible.

## File map

```
src/
  proxy.ts                      # Protects /admin/edit — redirects to /admin/login if cookie missing
  types/recipe.ts               # Shared interfaces: Recipe, RecipeRow, Ingredient, Measure, etc.
  lib/
    db.ts                       # mysql2 pool singleton
    auth.ts                     # checkAuth() — reads httpOnly cookie server-side
    definitions.ts              # measures[] array (typed)
    utils.ts                    # replaceFractions()
  app/
    layout.tsx                  # Root layout — Google Fonts link, recipes.css
    page.tsx                    # Renders <Cookbook />
    recipes.css                 # Public site styles (global, no modules)
    api/recipes/route.ts        # GET /api/recipes — list (id, title, ordered by title)
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
    Cookbook.tsx                # Client component: recipe list + search + open/close card
    IndexCard.tsx               # Client component: full recipe card view
    Ingredient.tsx              # Renders a single ingredient with fraction formatting
    admin/
      AdminThemeProvider.tsx    # "use client" MUI ThemeProvider + CssBaseline
      AdminNav.tsx              # AppBar with recipe selector (MUI Select) + logout button
      RecipeForm.tsx            # Full recipe edit form (MUI)
      IngredientEditor.tsx      # Dynamic ingredient rows (MUI)
      ArrayEditor.tsx           # Dynamic string list editor for steps/tags (MUI)
```
