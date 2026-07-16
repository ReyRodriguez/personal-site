import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';

export type Locale = 'es' | 'en';

const STORAGE_KEY = 'rr.locale';
const DEFAULT_LOCALE: Locale = 'es';

/**
 * Signal-based, SSR-safe locale state. Components read `locale()` inside a
 * `computed` to pick their copy from a co-located `{ es, en }` dictionary, so
 * switching language re-renders reactively without zone.js.
 *
 * The signal always starts at DEFAULT_LOCALE so the server render and the
 * first client render agree (no hydration mismatch). The persisted / detected
 * preference is applied once, after hydration, via `afterNextRender`.
 */
@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly locale = signal<Locale>(DEFAULT_LOCALE);

  constructor() {
    afterNextRender(() => {
      const preferred = this.readPreferredLocale();
      if (preferred !== this.locale()) {
        this.locale.set(preferred);
      }
      document.documentElement.lang = this.locale();
    });
  }

  toggle(): void {
    this.set(this.locale() === 'es' ? 'en' : 'es');
  }

  set(next: Locale): void {
    this.locale.set(next);
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(STORAGE_KEY, next);
        document.documentElement.lang = next;
      } catch {
        /* storage unavailable (private mode) — keep in-memory state */
      }
    }
  }

  private readPreferredLocale(): Locale {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'es' || saved === 'en') {
        return saved;
      }
      const browser = navigator.language?.toLowerCase() ?? '';
      return browser.startsWith('en') ? 'en' : 'es';
    } catch {
      return DEFAULT_LOCALE;
    }
  }
}

/** Shorthand for a piece of bilingual copy. */
export type Bilingual<T = string> = Readonly<Record<Locale, T>>;
