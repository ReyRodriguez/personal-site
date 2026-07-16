import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LocaleService } from '../i18n/locale.service';

interface FooterLink {
  readonly label: string;
  readonly path: string;
}

const CONTENT = {
  es: {
    tagline:
      'Desarrollador fullstack. Arquitectura web robusta, interfaces precisas y entrega asistida por IA.',
    status: 'Abierto a oportunidades',
    navHeading: 'Navegar',
    connectHeading: 'Contacto',
    colophonHeading: 'Colofón',
    colophon: 'Hecho con Angular 21 · zoneless + signals · SSR',
    rights: 'Todos los derechos reservados.',
    top: 'Volver arriba',
    nav: [
      { label: 'Inicio', path: '/' },
      { label: 'Frontend', path: '/frontend' },
      { label: 'Backend', path: '/backend' },
      { label: 'Trabajo', path: '/work' },
      { label: 'Blog', path: '/blog' },
    ] as readonly FooterLink[],
  },
  en: {
    tagline:
      'Fullstack developer. Robust web architecture, precise interfaces and AI-assisted delivery.',
    status: 'Open to opportunities',
    navHeading: 'Navigate',
    connectHeading: 'Connect',
    colophonHeading: 'Colophon',
    colophon: 'Built with Angular 21 · zoneless + signals · SSR',
    rights: 'All rights reserved.',
    top: 'Back to top',
    nav: [
      { label: 'Home', path: '/' },
      { label: 'Frontend', path: '/frontend' },
      { label: 'Backend', path: '/backend' },
      { label: 'Work', path: '/work' },
      { label: 'Blog', path: '/blog' },
    ] as readonly FooterLink[],
  },
} as const;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-site-footer',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.scss',
})
export class SiteFooterComponent {
  private readonly i18n = inject(LocaleService);
  protected readonly t = computed(() => CONTENT[this.i18n.locale()]);
  protected readonly year = 2026;

  protected readonly social = [
    { label: 'Email', href: 'mailto:r.reydev@gmail.com', external: false },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/reydersonrodriguez/',
      external: true,
    },
    { label: 'GitHub', href: 'https://github.com/ReyRodriguez', external: true },
  ];

  protected scrollTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
