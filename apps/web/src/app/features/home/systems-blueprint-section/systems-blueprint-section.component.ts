import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { LocaleService } from '../../../shared/i18n/locale.service';
import { RevealDirective } from '../../../shared/reveal/reveal.directive';
import { SectionHeaderComponent } from '../../../shared/section-header/section-header.component';

type BlueprintTab = 'api' | 'database' | 'delivery' | 'ops';
type PipelineKind = 'ci' | 'planned';

interface BlueprintPanelCopy {
  readonly id: BlueprintTab;
  readonly label: string;
  readonly title: string;
  readonly summary: string;
}

interface BlueprintPanel extends BlueprintPanelCopy {
  readonly code: readonly string[];
}

interface PipelineStep {
  readonly label: string;
  readonly command: string;
  readonly kind: PipelineKind;
}

interface BudgetRow {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}

interface BlueprintCopy {
  readonly title: string;
  readonly lede: string;
  readonly tablistLabel: string;
  readonly qualityCaption: string;
  readonly budgetCaption: string;
  readonly pipelineNote: Readonly<Record<PipelineKind, string>>;
  readonly panels: readonly BlueprintPanelCopy[];
  readonly budget: readonly BudgetRow[];
}

/**
 * Language-neutral code / command samples. These stay identical across locales
 * because they are literal API contracts, DDL, shell commands and DTO names.
 */
const PANEL_CODE: Readonly<Record<BlueprintTab, readonly string[]>> = {
  api: [
    'GET /api/posts?tag=angular&page=1',
    'POST /api/contact -> ContactMessageDto',
    'POST /api/auth/login -> JwtTokenDto',
    'Query.post(slug) { title tags readingMetrics }',
    'ErrorEnvelope { code, message, requestId }',
  ],
  database: [
    'posts(id, slug unique, title, body, published_at)',
    'tags(id, slug unique, name, color_token)',
    'post_tags(post_id fk, tag_id fk)',
    'reading_metrics(post_id fk, views, avg_depth)',
    'index posts_slug_idx on posts(slug)',
  ],
  delivery: [
    'npm ci',
    'npm run lint',
    'npm run build',
    'npm run e2e',
    'npm audit --omit=dev',
  ],
  ops: [
    'GET /health -> { status: "ok", db: "up" }',
    'requestId propagated through logger context',
    'worker: contact-email + reading-metrics-rollup',
    'SSE /api/events/deployments',
    'docker compose up web api postgres redis',
  ],
};

/**
 * Quality gates: the commands are real (`nx lint/build/e2e`), but the honest
 * framing is "wired into CI" — not a live green PASSED verdict.
 */
const PIPELINE: readonly PipelineStep[] = [
  { label: 'lint', command: 'nx lint web', kind: 'ci' },
  { label: 'build', command: 'nx build web', kind: 'ci' },
  { label: 'e2e', command: 'nx e2e web-e2e', kind: 'ci' },
  { label: 'audit', command: 'npm audit --omit=dev', kind: 'ci' },
  { label: 'api', command: 'nest/prisma scaffold', kind: 'planned' },
];

const CONTENT: Record<'es' | 'en', BlueprintCopy> = {
  es: {
    title: 'Backend, datos y entrega',
    lede: 'La arquitectura backend hacia la que está diseñado este portafolio: contratos tipados, persistencia, controles de calidad en CI y despliegue — planificados, todavía no desplegados.',
    tablistLabel: 'Pestañas del blueprint',
    qualityCaption: 'Comandos preparados para CI',
    budgetCaption: 'Presupuesto de build configurado (CI)',
    pipelineNote: { ci: 'en CI', planned: 'planeado' },
    panels: [
      {
        id: 'api',
        label: 'API',
        title: 'Superficie de contratos REST + GraphQL',
        summary:
          'Contratos tipados para blog, contacto, métricas y rutas protegidas por JWT.',
      },
      {
        id: 'database',
        label: 'DB',
        title: 'Modelo relacional en PostgreSQL',
        summary:
          'Esquema planificado para posts, tags, comentarios, métricas de lectura y mensajes de contacto.',
      },
      {
        id: 'delivery',
        label: 'CI',
        title: 'Puerta de calidad antes del despliegue',
        summary:
          'Pipeline reproducible: lint, build, e2e, audit, budgets y deploy preview.',
      },
      {
        id: 'ops',
        label: 'OPS',
        title: 'Operación en runtime',
        summary:
          'Health checks, logs estructurados, colas, eventos en tiempo real y Docker compose.',
      },
    ],
    budget: [
      { id: 'initial', label: 'JS inicial', value: '500 kB warn · 1 MB error' },
      {
        id: 'styles',
        label: 'Estilos por componente',
        value: '4 kB warn · 8 kB error',
      },
    ],
  },
  en: {
    title: 'Backend, Data & Delivery',
    lede: 'The backend architecture this portfolio is designed to grow into: typed contracts, persistence, CI quality gates and delivery — planned, not yet shipped.',
    tablistLabel: 'Blueprint tabs',
    qualityCaption: 'Commands wired into CI',
    budgetCaption: 'Configured build budget (CI)',
    pipelineNote: { ci: 'in CI', planned: 'planned' },
    panels: [
      {
        id: 'api',
        label: 'API',
        title: 'REST + GraphQL contract surface',
        summary:
          'Typed contracts for blog, contact, metrics and JWT-protected routes.',
      },
      {
        id: 'database',
        label: 'DB',
        title: 'PostgreSQL relational model',
        summary:
          'Schema planned for posts, tags, comments, reading metrics and contact messages.',
      },
      {
        id: 'delivery',
        label: 'CI',
        title: 'Quality gate before deploy',
        summary:
          'Reproducible pipeline: lint, build, e2e, audit, budgets and deploy preview.',
      },
      {
        id: 'ops',
        label: 'OPS',
        title: 'Runtime operations',
        summary:
          'Health checks, structured logs, queues, realtime events and Docker compose.',
      },
    ],
    budget: [
      { id: 'initial', label: 'Initial JS', value: '500 kB warn · 1 MB error' },
      {
        id: 'styles',
        label: 'Component styles',
        value: '4 kB warn · 8 kB error',
      },
    ],
  },
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-systems-blueprint-section',
  imports: [SectionHeaderComponent, RevealDirective],
  templateUrl: './systems-blueprint-section.component.html',
  styleUrl: './systems-blueprint-section.component.scss',
})
export class SystemsBlueprintSectionComponent {
  private readonly i18n = inject(LocaleService);

  protected readonly activeTab = signal<BlueprintTab>('api');
  protected readonly pipeline = PIPELINE;

  protected readonly t = computed(() => CONTENT[this.i18n.locale()]);

  protected readonly panels = computed<readonly BlueprintPanel[]>(() =>
    this.t().panels.map((panel) => ({ ...panel, code: PANEL_CODE[panel.id] })),
  );

  protected readonly activePanel = computed<BlueprintPanel>(() => {
    const panels = this.panels();
    return panels.find((panel) => panel.id === this.activeTab()) ?? panels[0];
  });

  protected setActiveTab(tab: BlueprintTab): void {
    this.activeTab.set(tab);
  }
}
