import { InjectionToken, inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Absolute origin the NestJS API is reachable at, prefixed onto any request
 * whose URL starts with `/api`.
 *
 * - Browser: '' (empty) so calls stay same-origin — the dev server proxies
 *   `/api` to the API (see apps/web/proxy.conf.json) and in production the API
 *   is expected to sit behind the same origin / reverse proxy.
 * - Server (SSR): an absolute origin (e.g. http://localhost:3000) so the
 *   `blog/:slug` server render and prerender can reach the API. Provided in
 *   app.config.server.ts from the API_BASE_URL env var.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  factory: () => '',
});

/** Prefix the API origin and attach credentials to every `/api` request. */
export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/api')) {
    const base = inject(API_BASE_URL);
    return next(
      req.clone({ url: `${base}${req.url}`, withCredentials: true }),
    );
  }
  return next(req);
};

/** Blog API endpoint paths (relative — the interceptor prefixes the origin). */
export const API = {
  publishedPosts: '/api/blog/posts',
  publishedPost: (slug: string) => `/api/blog/posts/${encodeURIComponent(slug)}`,
  adminPosts: '/api/admin/posts',
  adminPost: (id: string) => `/api/admin/posts/${encodeURIComponent(id)}`,
  adminPublish: (id: string) => `/api/admin/posts/${encodeURIComponent(id)}/publish`,
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  me: '/api/auth/me',
} as const;
