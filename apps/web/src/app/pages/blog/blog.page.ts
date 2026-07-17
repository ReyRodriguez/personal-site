import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import type { BlogPostSummary } from '@portfolio/contracts';
import { LocaleService } from '../../shared/i18n/locale.service';
import { SectionHeaderComponent } from '../../shared/section-header/section-header.component';
import { PostRowComponent } from '../../shared/post-row/post-row.component';
import { API } from '../../shared/api/api';

const CONTENT = {
  es: {
    title: 'Blog',
    lede: 'Notas técnicas sobre lo que voy construyendo: arquitectura, rendimiento y decisiones honestas de ingeniería.',
    loading: 'Cargando entradas…',
    empty: 'Aún no hay entradas publicadas. Vuelve pronto.',
    error: 'No se pudieron cargar las entradas.',
  },
  en: {
    title: 'Blog',
    lede: 'Technical notes about what I am building: architecture, performance and honest engineering trade-offs.',
    loading: 'Loading posts…',
    empty: 'No published posts yet. Check back soon.',
    error: 'Could not load posts.',
  },
} as const;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-blog-page',
  imports: [SectionHeaderComponent, PostRowComponent],
  templateUrl: './blog.page.html',
  styleUrl: './blog.page.scss',
})
export class BlogPage {
  private readonly i18n = inject(LocaleService);
  protected readonly t = computed(() => CONTENT[this.i18n.locale()]);
  protected readonly posts = httpResource<BlogPostSummary[]>(
    () => API.publishedPosts,
  );
}
