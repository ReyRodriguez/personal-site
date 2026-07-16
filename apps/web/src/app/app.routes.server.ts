import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Blog posts are parameterised — render them on the server per request.
  { path: 'blog/:slug', renderMode: RenderMode.Server },
  // Everything else is static: prerender to HTML at build time.
  { path: '**', renderMode: RenderMode.Prerender },
];
