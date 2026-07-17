import type { Post } from '@prisma/client';
import type { BlogPost, BlogPostSummary } from '@portfolio/contracts';

/** Turn a title into a URL-safe slug (accent-folded, kebab-case). */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Estimate reading minutes from the bilingual bodies at ~200 wpm. Uses the
 * longer of the two locales so the estimate is never optimistically low.
 */
export function estimateReadingMinutes(bodyEs: string, bodyEn: string): number {
  const count = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
  const words = Math.max(count(bodyEs), count(bodyEn));
  return Math.max(1, Math.round(words / 200));
}

/** Map a Prisma row to the summary wire shape (no body). */
export function toSummary(p: Post): BlogPostSummary {
  return {
    id: p.id,
    slug: p.slug,
    tag: p.tag,
    title: { es: p.titleEs, en: p.titleEn },
    excerpt: { es: p.excerptEs, en: p.excerptEn },
    published: p.published,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    readingMinutes: p.readingMinutes,
  };
}

/** Map a Prisma row to the full detail wire shape (includes Markdown body). */
export function toDetail(p: Post): BlogPost {
  return {
    ...toSummary(p),
    body: { es: p.bodyEs, en: p.bodyEn },
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}
