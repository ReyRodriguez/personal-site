import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../shared/i18n/locale.service';
import { RevealDirective } from '../../shared/reveal/reveal.directive';
import { findPost } from '../../shared/blog/posts';

const CONTENT = {
  es: {
    back: 'blog',
    soon: 'Próximamente',
    min: 'min de lectura',
    notFoundTitle: 'Entrada no encontrada',
    notFoundBody:
      'Esta nota aún no existe o cambió de dirección. Vuelve al índice del blog.',
    notFoundLink: 'Volver al blog',
  },
  en: {
    back: 'blog',
    soon: 'Coming soon',
    min: 'min read',
    notFoundTitle: 'Post not found',
    notFoundBody:
      'This note does not exist yet or moved. Head back to the blog index.',
    notFoundLink: 'Back to the blog',
  },
} as const;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-blog-post-page',
  imports: [RouterLink, RevealDirective],
  templateUrl: './blog-post.page.html',
  styleUrl: './blog-post.page.scss',
})
export class BlogPostPage {
  private readonly i18n = inject(LocaleService);

  readonly slug = input.required<string>();

  protected readonly locale = this.i18n.locale;
  protected readonly t = computed(() => CONTENT[this.i18n.locale()]);
  protected readonly post = computed(() => findPost(this.slug()));
}
