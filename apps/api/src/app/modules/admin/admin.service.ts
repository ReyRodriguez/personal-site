import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { BlogPost, BlogPostSummary } from '@portfolio/contracts';
import { PrismaService } from '../../prisma/prisma.service';
import {
  estimateReadingMinutes,
  slugify,
  toDetail,
  toSummary,
} from '../../common/post.util';
import { PostDto } from './dto/post.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /** All posts (drafts included), newest-edited first. */
  async list(): Promise<BlogPostSummary[]> {
    const posts = await this.prisma.post.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    return posts.map(toSummary);
  }

  async getById(id: string): Promise<BlogPost> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post ${id} not found`);
    }
    return toDetail(post);
  }

  async create(dto: PostDto): Promise<BlogPost> {
    const slug = dto.slug?.trim() ? slugify(dto.slug) : slugify(dto.title.es);
    const published = dto.published ?? false;
    try {
      const post = await this.prisma.post.create({
        data: {
          slug,
          tag: dto.tag,
          titleEs: dto.title.es,
          titleEn: dto.title.en,
          excerptEs: dto.excerpt.es,
          excerptEn: dto.excerpt.en,
          bodyEs: dto.body.es,
          bodyEn: dto.body.en,
          readingMinutes: estimateReadingMinutes(dto.body.es, dto.body.en),
          published,
          publishedAt: published ? new Date() : null,
        },
      });
      return toDetail(post);
    } catch (err) {
      throw this.rethrowSlugConflict(err, slug);
    }
  }

  async update(id: string, dto: PostDto): Promise<BlogPost> {
    const existing = await this.prisma.post.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Post ${id} not found`);
    }
    const slug = dto.slug?.trim() ? slugify(dto.slug) : existing.slug;
    const published = dto.published ?? existing.published;
    try {
      const post = await this.prisma.post.update({
        where: { id },
        data: {
          slug,
          tag: dto.tag,
          titleEs: dto.title.es,
          titleEn: dto.title.en,
          excerptEs: dto.excerpt.es,
          excerptEn: dto.excerpt.en,
          bodyEs: dto.body.es,
          bodyEn: dto.body.en,
          readingMinutes: estimateReadingMinutes(dto.body.es, dto.body.en),
          published,
          // Stamp publishedAt on first publish; keep the original afterwards.
          publishedAt:
            published && !existing.publishedAt ? new Date() : existing.publishedAt,
        },
      });
      return toDetail(post);
    } catch (err) {
      throw this.rethrowSlugConflict(err, slug);
    }
  }

  async setPublished(id: string, published: boolean): Promise<BlogPost> {
    const existing = await this.prisma.post.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Post ${id} not found`);
    }
    const post = await this.prisma.post.update({
      where: { id },
      data: {
        published,
        publishedAt:
          published && !existing.publishedAt ? new Date() : existing.publishedAt,
      },
    });
    return toDetail(post);
  }

  async remove(id: string): Promise<{ id: string }> {
    try {
      await this.prisma.post.delete({ where: { id } });
      return { id };
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException(`Post ${id} not found`);
      }
      throw err;
    }
  }

  private rethrowSlugConflict(err: unknown, slug: string): unknown {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      return new ConflictException(`Slug "${slug}" is already in use`);
    }
    return err;
  }
}
