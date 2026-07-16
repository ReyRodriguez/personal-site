import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { LocaleService } from '../i18n/locale.service';

interface NavItem {
  readonly id: string;
  readonly label: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-top-nav',
  imports: [],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss',
})
export class TopNavComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly i18n = inject(LocaleService);
  private observer?: IntersectionObserver;

  protected readonly locale = this.i18n.locale;
  protected readonly activeSection = signal('root');

  protected readonly navItems: readonly NavItem[] = [
    { id: 'root', label: '_root' },
    { id: 'projects', label: '_projects' },
    { id: 'experience', label: '_experience' },
    { id: 'labs', label: '_labs' },
    { id: 'auth', label: '_auth' },
    { id: 'crud', label: '_crud' },
    { id: 'systems', label: '_systems' },
    { id: 'logs', label: '_logs' },
  ];

  protected readonly navAria = computed(() =>
    this.locale() === 'es' ? 'Navegación principal' : 'Main navigation',
  );

  protected activate(sectionId: string): void {
    this.activeSection.set(sectionId);
  }

  protected setLocale(next: 'es' | 'en'): void {
    this.i18n.set(next);
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const targets = this.navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          this.activeSection.set(visible.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5] },
    );

    for (const target of targets) {
      this.observer.observe(target);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
