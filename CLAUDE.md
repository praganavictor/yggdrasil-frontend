# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server on port 3000
npm run build      # Build for production (vite build + tsc)
npm run test       # Run tests with Vitest
npm run lint       # Biome lint
npm run format     # Biome format
npm run check      # Biome check (lint + format combined)
```

To run a single test file:
```bash
npx vitest run src/path/to/file.test.tsx
```

## Architecture

This is a React 19 + TypeScript SPA using the TanStack ecosystem.

**Entry point:** `src/main.tsx` bootstraps the app — creates the router with TanStack Router, wraps it in a `QueryClientProvider` via `src/integrations/tanstack-query/root-provider.tsx`, and mounts to `#app`.

**Routing:** File-based routing via TanStack Router. Routes live in `src/routes/`. The router plugin auto-generates `src/routeTree.gen.ts` (do not edit manually). The root layout is `src/routes/__root.tsx`, which renders `<Header />`, `<Outlet />`, and the dev tools panel.

**Router context:** The `QueryClient` instance is passed through router context (typed in `__root.tsx` as `MyRouterContext`). Route loaders and components can access it via `route.useRouteContext()`.

**Data fetching:** TanStack Query (`@tanstack/react-query`) is the primary data-fetching layer. The integration setup is in `src/integrations/tanstack-query/`.

**Styling:** Tailwind CSS v4 (via `@tailwindcss/vite` plugin). Use Tailwind utility classes directly in JSX.

**Path alias:** `@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.json`).

**Linting/formatting:** Biome (not ESLint/Prettier). Uses tabs for indentation and double quotes for JS/TS strings. `src/routeTree.gen.ts` and `src/styles.css` are excluded from Biome.

**Dev tools:** `@tanstack/react-devtools` unifies Router and Query devtools into a single panel rendered in `__root.tsx`.

**Demo files:** Files and routes prefixed with `demo` (e.g., `src/routes/demo/`) are example/starter content and can be deleted.
