import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import type { BlogPostSummary } from '@portfolio/contracts';
import { LocaleService } from '../i18n/locale.service';
import { RevealDirective } from '../reveal/reveal.directive';

const CONTENT = {
  es: { min: 'min' },
  en: { min: 'min' },
} as const;

/** One post row — shared by the blog index and the home teaser. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-post-row',
  imports: [RouterLink, RevealDirective],
  templateUrl: './post-row.component.html',
  styleUrl: './post-row.component.scss',
})
export class PostRowComponent {
  private readonly i18n = inject(LocaleService);

  readonly post = input.required<BlogPostSummary>();
  readonly delay = input(0);

  protected readonly locale = this.i18n.locale;
  protected readonly t = computed(() => CONTENT[this.i18n.locale()]);
  protected readonly date = computed(
    () => this.post().publishedAt?.slice(0, 10) ?? '',
  );
}
