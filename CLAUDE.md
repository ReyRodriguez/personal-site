# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio for Reyderson Rodriguez — an Nx-managed Angular 21 monorepo. Two apps exist: the Angular SSR `web` app, and a NestJS `api` (`apps/api`) that powers the blog — backed by PostgreSQL via Prisma, with a shared types lib (`libs/contracts`, alias `@portfolio/contracts`). The remaining backend surface in `docs/architecture.md` (comments, metrics, contact) is still target architecture, not built.

## Commands

```bash
npm start                 # nx serve web (SSR dev server, http://localhost:4200; proxies /api → :3000)
npm run build             # nx build web (production, SSR output to dist/apps/web)
npm run lint              # nx lint web
npm run e2e               # nx e2e web-e2e (Playwright)
npx nx affected -t lint   # run a target only on affected projects

# Blog backend (apps/api + PostgreSQL)
npm run db:up             # docker compose up -d (Postgres on :5432)
npm run prisma:migrate    # apply Prisma migrations (loads apps/api/.env)
npm run prisma:seed       # seed admin user + migrate the 3 original posts as drafts
npm run api:serve         # nx serve api (NestJS on :3000, /api prefix)
npm run api:build         # nx build api (webpack, tsc compiler for decorator metadata)
npm run prisma:studio     # inspect the DB
```

Local dev needs three things running: Postgres (`db:up`), the API (`api:serve`), and the web app (`start`). Copy `apps/api/.env.example` → `apps/api/.env` first. The web dev server proxies `/api` to the API (`apps/web/proxy.conf.json`), so the browser stays same-origin.

Playwright targets are inferred by the `@nx/playwright` Nx plugin (not declared in `project.json`). To run a single e2e test: `npx nx e2e web-e2e -- --grep "test name"`.

**Unit tests are not runnable.** The workspace was scaffolded requesting Vitest, but no `test` target was generated. `apps/web/src/app/app.spec.ts` exists using `TestBed`/`describe`/`it`, but there is no runner wired up — do not assume `nx test` works. See `docs/setup.md`.

## Architecture

Single-page, SSR-enabled Angular app. Everything renders on one route (`app.routes.ts` is empty); the page is a vertical stack of section components composed in `apps/web/src/app/app.html` and imported by the standalone root `App` component (`app.ts`).

- **`features/home/*-section/`** — one standalone component per page section (hero, ai-flux, projects, experience, capability-matrix, auth-lab, crud-lab, systems-blueprint, logs). Each is a folder with `.ts` / `.html` / `.scss`.
- **`shared/`** — cross-section components: `hacky-background` (animated backdrop), `top-nav`, `site-footer`.
- **SSR**: `main.ts` (browser) + `main.server.ts` + `server.ts` (Express). `app.config.ts` uses `provideClientHydration(withEventReplay())` and `provideHttpClient(withFetch())`. Blog routes are dynamic: `app.routes.server.ts` marks `blog` and `blog/:slug` as `RenderMode.Server` (per-request SSR, fetched from the API) and `admin/**` as `RenderMode.Client` (never prerender authed pages); everything else prerenders.
- **Standalone SSR server host check**: Angular 21's SSR engine validates the `Host` header (SSRF guard). When running the built server directly (`node dist/apps/web/server/server.mjs`), set `NG_ALLOWED_HOSTS` (comma-separated) to the serving host(s), and `API_BASE_URL` to the API origin the SSR process should fetch from — otherwise SSR silently falls back to client rendering.

### Blog & backend (`apps/api`)

The blog is full-stack. `apps/api` is a NestJS app (webpack build, `compiler: 'tsc'` so decorator metadata is emitted) exposing under `/api`:

- **Public** (`modules/blog`): `GET /api/blog/posts` (published, newest first, `?tag=` filter) and `GET /api/blog/posts/:slug`.
- **Auth** (`modules/auth`): `POST /api/auth/login` (bcrypt + Passport-JWT, token set as an httpOnly cookie), `POST /api/auth/logout`, `GET /api/auth/me`. Single admin, seeded from `ADMIN_EMAIL`/`ADMIN_PASSWORD`.
- **Admin** (`modules/admin`, all behind `JwtAuthGuard`): CRUD + `PATCH :id/publish`. DTOs use `class-validator`; `readingMinutes` and the slug are computed server-side.

Data model (`apps/api/prisma/schema.prisma`): a single `Post` (bilingual sibling columns `titleEs`/`titleEn`/… + Markdown `bodyEs`/`bodyEn`, `published`, `publishedAt`) and a `User`. The API maps rows to the `Bi<T>` (`{ es, en }`) wire shapes in `libs/contracts` (`@portfolio/contracts`), shared by both apps.

Frontend data flow: `shared/api/api.ts` holds the `API_BASE_URL` token + interceptor (prefixes the origin, `withCredentials`); public pages read via `httpResource` (SSR-transferred); the admin panel (`pages/admin/*`, first `ReactiveFormsModule` use) writes via `BlogAdminService` and `AuthStore`, guarded by `shared/auth/admin-auth.guard.ts`. Markdown bodies render through `shared/markdown/markdown.component.ts` — `marked` → `[innerHTML]`, which runs Angular's built-in sanitizer (isomorphic, no external sanitizer/jsdom). **Do not** bypass it with `DomSanitizer.bypassSecurityTrustHtml`, and do not add a DOMPurify/jsdom dependency (it bloated the SSR bundle ~6 MB).

### Conventions (follow these when adding/editing components)

- **Standalone components only** — no NgModules. Add new sections to the `imports` array in `app.ts` and place the tag in `app.html`.
- **`ChangeDetectionStrategy.OnPush`** on every component, with state held in **signals** (`signal`, `computed`). This is a zoneless app (`provideBrowserGlobalErrorListeners`, no zone.js) — CD relies on signals; imperative DOM/timers won't trigger renders on their own.
- **Selectors** are `app-` prefixed kebab-case for components, `app` camelCase for directives (enforced by ESLint).
- **Static content** is either inlined as typed `readonly` signal literals in the component (see `hero-section`) or loaded from JSON under `apps/web/public/data/` and imported directly (see `experience-section` importing `experience.json`). JSON in `public/` is also served as a static asset.
- **Animations/timers** that shouldn't churn change detection run via `ngZone.runOutsideAngular(...)`, calling `ngZone.run(...)` only to commit signal updates (see the terminal typing effect in `hero-section.component.ts`).

### Shared UI library (`shared/`)

- **i18n is bilingual (ES/EN), signal-based** — `shared/i18n/locale.service.ts` (`LocaleService`) holds `locale = signal<'es'|'en'>()`. Each component co-locates a `const CONTENT = { es: {...}, en: {...} }` dict and exposes `protected readonly t = computed(() => CONTENT[this.i18n.locale()])`; templates read `t().foo`. Data-driven prose (e.g. `public/data/experience.json`) uses `{ es, en }` field shapes picked by `locale()`. **SSR correctness**: the signal starts at `DEFAULT_LOCALE` ('es') so server and first client render match; the stored/`navigator` preference is applied *after* hydration via `afterNextRender` — do not read localStorage/navigator during construction or you'll reintroduce a hydration mismatch. The nav has the ES/EN toggle.
- **Every home section uses `SectionHeaderComponent`** (`shared/section-header/`) — `<app-section-header index="NN" kicker="MONO.LABEL" [title]="..." [lede]="..." />`. This is the single source of the eyebrow→title→lede rhythm; don't hand-roll section headers.
- **Scroll-reveal**: `shared/reveal/reveal.directive.ts` (`[appReveal]`, optional `[revealDelay]` ms) fades content in on scroll via IntersectionObserver. It is SSR-safe (no `reveal-init` on server, so content is visible without JS), honours `prefers-reduced-motion`, has a 2.5s fallback so content never stays hidden, and a print override. Stagger siblings with `[revealDelay]="i * 70"`.
- **Canonical section rhythm & primitives** (defined in `styles.scss`): wrap each section as `<section class="section-shell scroll-mt-28">` + `<div class="section-inner">` for consistent vertical/horizontal padding and max-width. Use the global `.chip` for tech tags and `var(--font-mono)` for the mono stack (never re-inline the font-family string).

### Performance (guardrails — don't regress these)

Measured with Lighthouse mobile against the **production build** (never the dev server — `nx serve` is unminified + unbundled and scores ~50; prod scores 98). Current: Perf 98 / A11y 100 / BP 100 / SEO 100.

- **The Express SSR server gzips responses** via `compression` middleware (`server.ts`). Without it Lighthouse loses ~1.5s to "text compression".
- **The hero must render immediately from SSR** — do NOT put `[appReveal]` on above-the-fold hero content. The reveal sets `opacity:0` until client JS runs, which made the hero paragraph the LCP element and pushed LCP to 4s+. Reveal is for below-the-fold sections only.
- **The background canvas is TBT-sensitive.** Its animation loop is deferred to `requestIdleCallback` (post-hydration), throttled to ~30fps, DPR-capped at 1.5, and — critically — glyphs are pre-sorted by quantized size so `context.font` is reassigned a few times per frame, not ~5000. Reintroducing a per-glyph font string turns every frame into a long task and TBT jumps from ~30ms to 1000ms+.
- `@defer (hydrate on viewport)` incremental hydration was tried and **regressed** this app (the prerendered/SSG route didn't server-render the deferred blocks, forcing client render and worse TBT). Don't re-add it without verifying the deferred content is present in the SSR HTML.

To re-measure: `nx build web`, run `PORT=4300 node dist/apps/web/server/server.mjs`, then `CHROME_PATH="<playwright chromium>" npx lighthouse http://localhost:4300/ --chrome-flags="--headless=new"`. Quiet other node processes first — TBT is noisy under CPU contention.

### Content integrity

The site must present only honest, verifiable claims — no fabricated metrics, fake "live/deployed" status, or filler. Aspirational/backend work is explicitly framed as planned (see the systems-blueprint lede and its "IN CI"/"PLANNED" labels, and the real configured budgets from `apps/web/project.json`). Keep it this way when editing copy.

### Styling

- **Tailwind CSS 3** (config in `tailwind.config.js`) for layout/utilities, plus per-component SCSS for effects. `styles.scss` holds globals; fonts (Geist / Geist Mono Variable via Fontsource) are wired through `project.json` styles.
- The design language is defined in **`DESIGN.md`** — a dark cyberpunk/glassmorphism system. Key rules: **sharp corners only** (0px radius; use 45° clipped chamfers, never `border-radius`), backdrop-blur glass surfaces instead of shadows, and the custom Tailwind tokens (`void`, `matrix-green`, `electric-cyan`, `signal-purple`, `*-glow` shadows, `hero-grid`/`scan-line` backgrounds, `scan`/`pulse-glow` animations). Consult `DESIGN.md` before adding visual styles.
- `anyComponentStyle` budget is capped at 4kb warn / 8kb error per component — keep SCSS lean.

### TypeScript

Strict everywhere (`apps/web/tsconfig.app.json`): `strict`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, plus Angular `strictTemplates` and `strictInjectionParameters`. Note `noPropertyAccessFromIndexSignature` means index-signature access must use brackets (e.g. `process.env['PORT']`).

Prettier uses single quotes.
