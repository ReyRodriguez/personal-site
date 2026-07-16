import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { LocaleService } from '../../../shared/i18n/locale.service';
import { RevealDirective } from '../../../shared/reveal/reveal.directive';
import { SectionHeaderComponent } from '../../../shared/section-header/section-header.component';

interface Bi {
  readonly es: string;
  readonly en: string;
}

interface Capability {
  readonly id: string;
  readonly title: Bi;
  readonly proof: Bi;
  readonly stack: readonly string[];
}

const HEADER = {
  es: {
    title: 'Lo que construyo',
    lede: 'Un mapa de capacidades fullstack. Cada área representa trabajo que he entregado en producción o demostrado de forma verificable.',
  },
  en: {
    title: 'What I build',
    lede: 'A map of fullstack capabilities. Each area reflects work I have shipped to production or can demonstrate verifiably.',
  },
} as const;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-capability-matrix-section',
  imports: [SectionHeaderComponent, RevealDirective],
  templateUrl: './capability-matrix-section.component.html',
  styleUrl: './capability-matrix-section.component.scss',
})
export class CapabilityMatrixSectionComponent {
  private readonly i18n = inject(LocaleService);
  protected readonly header = computed(() => HEADER[this.i18n.locale()]);
  protected readonly locale = this.i18n.locale;

  protected readonly capabilities: readonly Capability[] = [
    {
      id: 'AUTH',
      title: { es: 'Autenticación y roles', en: 'Auth & roles' },
      proof: {
        es: 'JWT, bearer tokens, claims, expiración, scopes y guard checks por rol.',
        en: 'JWT, bearer tokens, claims, expiry, scopes and role-based guard checks.',
      },
      stack: ['JWT', 'Guards', 'Roles'],
    },
    {
      id: 'CRUD',
      title: { es: 'CRUD operacional', en: 'Operational CRUD' },
      proof: {
        es: 'Alta, búsqueda, estados y métricas derivadas sobre estado reactivo con Signals.',
        en: 'Create, search, states and derived metrics over reactive state with Signals.',
      },
      stack: ['Signals', 'Forms', 'UX states'],
    },
    {
      id: 'API',
      title: { es: 'APIs REST y GraphQL', en: 'REST & GraphQL APIs' },
      proof: {
        es: 'Endpoints, DTOs, manejo de errores, paginación, filtros y contratos tipados.',
        en: 'Endpoints, DTOs, error handling, pagination, filters and typed contracts.',
      },
      stack: ['REST', 'GraphQL', 'DTOs'],
    },
    {
      id: 'DATA',
      title: { es: 'Modelado de datos', en: 'Data modeling' },
      proof: {
        es: 'Relaciones, índices y migraciones sobre PostgreSQL y MySQL.',
        en: 'Relations, indexes and migrations across PostgreSQL and MySQL.',
      },
      stack: ['PostgreSQL', 'Prisma', 'SQL'],
    },
    {
      id: 'TEST',
      title: { es: 'Testing y E2E', en: 'Testing & E2E' },
      proof: {
        es: 'Lint, build y flujos end-to-end con Playwright ejecutados en CI.',
        en: 'Lint, build and end-to-end flows with Playwright, wired into CI.',
      },
      stack: ['Playwright', 'Nx', 'ESLint'],
    },
    {
      id: 'PERF',
      title: { es: 'Rendimiento', en: 'Performance' },
      proof: {
        es: 'SSR, hidratación, lazy loading y presupuestos de bundle para Core Web Vitals.',
        en: 'SSR, hydration, lazy loading and bundle budgets aimed at Core Web Vitals.',
      },
      stack: ['SSR', 'Budgets', 'Signals'],
    },
    {
      id: 'AI',
      title: { es: 'Flujo con IA', en: 'AI workflow' },
      proof: {
        es: 'Prompting estructurado, refactor humano y QA asistido para acelerar la entrega.',
        en: 'Structured prompting, human refactor and assisted QA to speed up delivery.',
      },
      stack: ['Prompting', 'Review', 'QA'],
    },
    {
      id: 'SHIP',
      title: { es: 'Entrega y despliegue', en: 'Delivery & deploy' },
      proof: {
        es: 'Contenedores, variables de entorno y pipelines de deploy-preview.',
        en: 'Containers, environment configuration and deploy-preview pipelines.',
      },
      stack: ['Docker', 'CI/CD', 'Nx'],
    },
  ];
}
