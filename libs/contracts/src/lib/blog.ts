/**
 * Shared blog contracts used by both the NestJS API (`apps/api`) and the
 * Angular web app (`apps/web`). These are the canonical wire shapes: the API
 * maps its bilingual sibling columns (`titleEs`/`titleEn`, ...) into `Bi`
 * objects so the frontend can read `post.title[locale()]` directly.
 */

/** The two locales the site supports. Mirrors `LocaleService.Locale`. */
export type Locale = 'es' | 'en';

/** A value provided in both locales. */
export type Bi<T = string> = Readonly<Record<Locale, T>>;

/** List/summary shape — no body, used by list endpoints and cards. */
export interface BlogPostSummary {
  readonly id: string;
  readonly slug: string;
  readonly tag: string;
  readonly title: Bi;
  readonly excerpt: Bi;
  readonly published: boolean;
  /** ISO timestamp; null while the post is a draft. */
  readonly publishedAt: string | null;
  readonly readingMinutes: number;
}

/** Full post including the raw Markdown body in both locales. */
export interface BlogPost extends BlogPostSummary {
  /** Raw Markdown, rendered client-side to sanitized HTML. */
  readonly body: Bi;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** Payload accepted by create/update admin endpoints. */
export interface PostInput {
  /** Optional on create — the API slugifies the ES title when blank. */
  slug?: string;
  tag: string;
  title: Bi;
  excerpt: Bi;
  /** Raw Markdown in both locales. */
  body: Bi;
  published?: boolean;
}

export type CreatePostInput = PostInput;
export type UpdatePostInput = PostInput;

export interface PublishInput {
  published: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  email: string;
}
