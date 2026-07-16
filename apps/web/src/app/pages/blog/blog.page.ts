import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../shared/i18n/locale.service';
import { RevealDirective } from '../../shared/reveal/reveal.directive';
import { SectionHeaderComponent } from '../../shared/section-header/section-header.component';
import { BLOG_POSTS } from '../../shared/blog/posts';

const CONTENT = {
  es: {
    title: 'Blog',
    lede: 'Notas técnicas en preparación sobre lo que voy construyendo: arquitectura, rendimiento y decisiones honestas. Próximamente.',
    soon: 'Próximamente',
    min: 'min',
  },
  en: {
    title: 'Blog',
    lede: 'Technical notes in the works about what I am building: architecture, performance and honest trade-offs. Coming soon.',
    soon: 'Coming soon',
    min: 'min',
  },
} as const;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-blog-page',
  imports: [RouterLink, SectionHeaderComponent, RevealDirective],
  templateUrl: './blog.page.html',
  styleUrl: './blog.page.scss',
})
export class BlogPage {
  private readonly i18n = inject(LocaleService);
  protected readonly t = computed(() => CONTENT[this.i18n.locale()]);
  protected readonly locale = this.i18n.locale;
  protected readonly posts = BLOG_POSTS;
}
