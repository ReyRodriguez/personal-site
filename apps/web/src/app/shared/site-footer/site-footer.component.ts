import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LocaleService } from '../i18n/locale.service';

const CONTENT = {
  es: {
    tagline: 'Diseñado y construido con Angular por Reyderson Rodriguez.',
    terminal: 'Terminal',
  },
  en: {
    tagline: 'Designed and built with Angular by Reyderson Rodriguez.',
    terminal: 'Terminal',
  },
} as const;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-site-footer',
  imports: [],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.scss',
})
export class SiteFooterComponent {
  private readonly i18n = inject(LocaleService);
  protected readonly t = computed(() => CONTENT[this.i18n.locale()]);
  protected readonly year = 2026;
}
