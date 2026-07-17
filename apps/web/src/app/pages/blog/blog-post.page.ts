import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { httpResource } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import type { BlogPost } from '@portfolio/contracts';
import { LocaleService } from '../../shared/i18n/locale.service';
import { RevealDirective } from '../../shared/reveal/reveal.directive';
import { MarkdownComponent } from '../../shared/markdown/markdown.component';
import { API } from '../../shared/api/api';

const CONTENT = {
  es: {
    back: 'blog',
    min: 'min de lectura',
    loading: 'Cargando entrada…',
    notFoundTitle: 'Entrada no encontrada',
    notFoundBody:
      'Esta nota aún no existe o cambió de dirección. Vuelve al índice del blog.',
    notFoundLink: 'Volver al blog',
  },
  en: {
    back: 'blog',
    min: 'min read',
    loading: 'Loading post…',
    notFoundTitle: 'Post not found',
    notFoundBody:
      'This note does not exist yet or moved. Head back to the blog index.',
    notFoundLink: 'Back to the blog',
  },
} as const;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-blog-post-page',
  imports: [RouterLink, RevealDirective, MarkdownComponent],
  templateUrl: './blog-post.page.html',
  styleUrl: './blog-post.page.scss',
})
export class BlogPostPage {
  private readonly i18n = inject(LocaleService);
  private readonly titleService = inject(Title);

  readonly slug = input.required<string>();

  protected readonly locale = this.i18n.locale;
  protected readonly t = computed(() => CONTENT[this.i18n.locale()]);
  protected readonly post = httpResource<BlogPost>(() =>
    API.publishedPost(this.slug()),
  );
  protected readonly date = computed(
    () => this.post.value()?.publishedAt?.slice(0, 10) ?? '',
  );

  constructor() {
    effect(() => {
      const entry = this.post.value();
      if (entry) {
        this.titleService.setTitle(
          `${entry.title[this.i18n.locale()]} · Reyderson Rodriguez`,
        );
      }
    });
  }
}
