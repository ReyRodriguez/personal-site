import { Injectable, NotFoundException } from '@nestjs/common';
import type { BlogPost, BlogPostSummary } from '@portfolio/contracts';
import { PrismaService } from '../../prisma/prisma.service';
import { toDetail, toSummary } from '../../common/post.util';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  /** Published posts only, newest first, optionally filtered by tag. */
  async listPublished(tag?: string): Promise<BlogPostSummary[]> {
    const posts = await this.prisma.post.findMany({
      where: { published: true, ...(tag ? { tag } : {}) },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });
    return posts.map(toSummary);
  }

  /** A single published post by slug, or 404. */
  async getPublishedBySlug(slug: string): Promise<BlogPost> {
    const post = await this.prisma.post.findFirst({
      where: { slug, published: true },
    });
    if (!post) {
      throw new NotFoundException(`Post "${slug}" not found`);
    }
    return toDetail(post);
  }
}
