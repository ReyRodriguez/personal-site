import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../../shared/i18n/locale.service';
import { RevealDirective } from '../../../shared/reveal/reveal.directive';
import { SectionHeaderComponent } from '../../../shared/section-header/section-header.component';
import { BLOG_POSTS } from '../../../shared/blog/posts';

const HEADER = {
  es: {
    title: 'Del blog',
    lede: 'Notas técnicas en preparación sobre lo que voy construyendo. Próximamente.',
    viewAll: 'Ver todas las entradas',
    soon: 'Próximamente',
  },
  en: {
    title: 'From the blog',
    lede: 'Technical notes in the works about what I am building. Coming soon.',
    viewAll: 'View all posts',
    soon: 'Coming soon',
  },
} as const;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-blog-teaser',
  imports: [RouterLink, SectionHeaderComponent, RevealDirective],
  templateUrl: './blog-teaser.component.html',
  styleUrl: './blog-teaser.component.scss',
})
export class BlogTeaserComponent {
  private readonly i18n = inject(LocaleService);
  protected readonly t = computed(() => HEADER[this.i18n.locale()]);
  protected readonly locale = this.i18n.locale;
  protected readonly posts = BLOG_POSTS.slice(0, 3);
}
