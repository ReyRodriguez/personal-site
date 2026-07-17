import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { httpResource } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import type { BlogPostSummary } from '@portfolio/contracts';
import { LocaleService } from '../../../shared/i18n/locale.service';
import { RevealDirective } from '../../../shared/reveal/reveal.directive';
import { SectionHeaderComponent } from '../../../shared/section-header/section-header.component';
import { PostRowComponent } from '../../../shared/post-row/post-row.component';
import { API } from '../../../shared/api/api';

const HEADER = {
  es: {
    title: 'Del blog',
    lede: 'Notas técnicas sobre lo que voy construyendo: arquitectura, rendimiento y decisiones honestas.',
    viewAll: 'Ver todas las entradas',
    empty: 'La primera entrada está en camino.',
  },
  en: {
    title: 'From the blog',
    lede: 'Technical notes about what I am building: architecture, performance and honest trade-offs.',
    viewAll: 'View all posts',
    empty: 'The first post is on its way.',
  },
} as const;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-blog-teaser',
  imports: [RouterLink, SectionHeaderComponent, RevealDirective, PostRowComponent],
  templateUrl: './blog-teaser.component.html',
  styleUrl: './blog-teaser.component.scss',
})
export class BlogTeaserComponent {
  private readonly i18n = inject(LocaleService);
  protected readonly t = computed(() => HEADER[this.i18n.locale()]);
  protected readonly all = httpResource<BlogPostSummary[]>(
    () => API.publishedPosts,
  );
  protected readonly posts = computed(() => (this.all.value() ?? []).slice(0, 3));
}
