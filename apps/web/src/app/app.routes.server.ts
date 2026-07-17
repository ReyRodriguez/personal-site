import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // The blog index is dynamic (changes as posts are published) — render it
  // per request so it always reflects the current published set.
  { path: 'blog', renderMode: RenderMode.Server },
  // Blog posts are parameterised — render them on the server per request.
  { path: 'blog/:slug', renderMode: RenderMode.Server },
  // Admin is authenticated: never prerender or SSR it — render on the client.
  { path: 'admin', renderMode: RenderMode.Client },
  { path: 'admin/**', renderMode: RenderMode.Client },
  // Everything else is static: prerender to HTML at build time.
  { path: '**', renderMode: RenderMode.Prerender },
];
