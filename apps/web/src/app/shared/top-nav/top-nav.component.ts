import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LocaleService } from '../i18n/locale.service';

interface NavItem {
  readonly path: string;
  readonly label: string;
  readonly exact: boolean;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-top-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss',
})
export class TopNavComponent {
  private readonly i18n = inject(LocaleService);
  protected readonly locale = this.i18n.locale;

  protected readonly navItems: readonly NavItem[] = [
    { path: '/', label: '_home', exact: true },
    { path: '/frontend', label: '_frontend', exact: false },
    { path: '/backend', label: '_backend', exact: false },
    { path: '/work', label: '_work', exact: false },
    { path: '/blog', label: '_blog', exact: false },
  ];

  protected readonly navAria = computed(() =>
    this.locale() === 'es' ? 'Navegación principal' : 'Main navigation',
  );

  protected setLocale(next: 'es' | 'en'): void {
    this.i18n.set(next);
  }
}
