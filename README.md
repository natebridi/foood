# foood

Personal recipe cookbook. Public recipe grid + password-protected admin panel.

## Setup

```bash
cp .env.local.example .env.local  # fill in DATABASE_URL, ADMIN_PASSWORD, AUTH_SECRET
npm install
npm run dev
```

## Commands

| Command                   | Description                   |
| ------------------------- | ----------------------------- |
| `npm run dev`             | Start dev server              |
| `npm run build`           | Production build              |
| `npm test`                | Unit + component tests        |
| `npm run test:e2e`        | E2E + visual regression tests |
| `npm run test:e2e:update` | Regenerate visual snapshots   |
| `npm run lint`            | ESLint                        |
| `npm run format`          | Prettier (write)              |
| `npm run typecheck`       | TypeScript check              |

See [CLAUDE.md](./CLAUDE.md) for full architecture notes.
