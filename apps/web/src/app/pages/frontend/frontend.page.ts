import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { LocaleService } from '../../shared/i18n/locale.service';
import { RevealDirective } from '../../shared/reveal/reveal.directive';
import { SectionHeaderComponent } from '../../shared/section-header/section-header.component';

interface Bi {
  readonly es: string;
  readonly en: string;
}

interface FocusArea {
  readonly id: string;
  readonly label: Bi;
  readonly title: Bi;
  readonly description: Bi;
}

const CONTENT = {
  es: {
    kicker: 'ROLE · FRONTEND',
    title: 'Ingeniería frontend',
    lede: 'Interfaces precisas y accesibles construidas con Angular moderno: standalone, zoneless y state basado en signals. Esta página crecerá con casos y detalle técnico.',
    soon: '// más pronto',
  },
  en: {
    kicker: 'ROLE · FRONTEND',
    title: 'Frontend engineering',
    lede: 'Precise, accessible interfaces built with modern Angular: standalone, zoneless and signal-based state. This page will grow with case studies and technical detail.',
    soon: '// more soon',
  },
} as const;

const FOCUS_AREAS: readonly FocusArea[] = [
  {
    id: 'F.01',
    label: { es: 'ARQUITECTURA', en: 'ARCHITECTURE' },
    title: { es: 'Arquitectura Angular', en: 'Angular architecture' },
    description: {
      es: 'Componentes standalone, zoneless y estado reactivo con signals.',
      en: 'Standalone components, zoneless change detection and signal state.',
    },
  },
  {
    id: 'F.02',
    label: { es: 'SISTEMA UI', en: 'UI SYSTEM' },
    title: { es: 'Design systems y UI', en: 'Design systems & UI' },
    description: {
      es: 'Primitivas reutilizables, tokens y una jerarquía visual consistente.',
      en: 'Reusable primitives, tokens and a consistent visual hierarchy.',
    },
  },
  {
    id: 'F.03',
    label: { es: 'RENDIMIENTO', en: 'PERFORMANCE' },
    title: { es: 'Rendimiento y Core Web Vitals', en: 'Performance & Core Web Vitals' },
    description: {
      es: 'SSR, hidratación y presupuestos de bundle para métricas reales.',
      en: 'SSR, hydration and bundle budgets tuned for real-world metrics.',
    },
  },
];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-frontend-page',
  imports: [SectionHeaderComponent, RevealDirective],
  templateUrl: './frontend.page.html',
  styleUrl: './frontend.page.scss',
})
export class FrontendPage {
  private readonly i18n = inject(LocaleService);
  protected readonly locale = this.i18n.locale;
  protected readonly t = computed(() => CONTENT[this.i18n.locale()]);
  protected readonly focusAreas = FOCUS_AREAS;
}
