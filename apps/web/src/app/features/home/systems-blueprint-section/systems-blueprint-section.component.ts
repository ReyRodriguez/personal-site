import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type BlueprintTab = 'api' | 'database' | 'delivery' | 'ops';

interface BlueprintPanel {
  readonly id: BlueprintTab;
  readonly label: string;
  readonly title: string;
  readonly summary: string;
  readonly code: readonly string[];
}

interface PipelineStep {
  readonly label: string;
  readonly command: string;
  readonly status: 'passed' | 'ready';
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-systems-blueprint-section',
  imports: [],
  templateUrl: './systems-blueprint-section.component.html',
  styleUrl: './systems-blueprint-section.component.scss',
})
export class SystemsBlueprintSectionComponent {
  protected readonly activeTab = signal<BlueprintTab>('api');

  protected readonly panels: readonly BlueprintPanel[] = [
    {
      id: 'api',
      label: 'API',
      title: 'REST + GraphQL contract surface',
      summary:
        'Contratos tipados para blog, contacto, metricas y rutas protegidas por JWT.',
      code: [
        'GET /api/posts?tag=angular&page=1',
        'POST /api/contact -> ContactMessageDto',
        'POST /api/auth/login -> JwtTokenDto',
        'Query.post(slug) { title tags readingMetrics }',
        'ErrorEnvelope { code, message, requestId }',
      ],
    },
    {
      id: 'database',
      label: 'DB',
      title: 'PostgreSQL relational model',
      summary:
        'Modelo listo para posts, tags, comentarios, lecturas y mensajes de contacto.',
      code: [
        'posts(id, slug unique, title, body, published_at)',
        'tags(id, slug unique, name, color_token)',
        'post_tags(post_id fk, tag_id fk)',
        'reading_metrics(post_id fk, views, avg_depth)',
        'index posts_slug_idx on posts(slug)',
      ],
    },
    {
      id: 'delivery',
      label: 'CI',
      title: 'Quality gate before deploy',
      summary:
        'Pipeline reproducible con lint, build, e2e, audit, budgets y deploy preview.',
      code: [
        'npm ci',
        'npm run lint',
        'npm run build',
        'npm run e2e',
        'npm audit --omit=dev',
      ],
    },
    {
      id: 'ops',
      label: 'OPS',
      title: 'Runtime operations',
      summary:
        'Health checks, logs estructurados, colas, realtime events y Docker compose.',
      code: [
        'GET /health -> { status: "ok", db: "up" }',
        'requestId propagated through logger context',
        'worker: contact-email + reading-metrics-rollup',
        'SSE /api/events/deployments',
        'docker compose up web api postgres redis',
      ],
    },
  ];

  protected readonly pipeline: readonly PipelineStep[] = [
    { label: 'lint', command: 'nx lint web', status: 'passed' },
    { label: 'build', command: 'nx build web', status: 'passed' },
    { label: 'e2e', command: 'nx e2e web-e2e', status: 'passed' },
    { label: 'audit', command: 'npm audit --omit=dev', status: 'passed' },
    { label: 'api', command: 'nest/prisma scaffold', status: 'ready' },
  ];

  protected get activePanel(): BlueprintPanel {
    return (
      this.panels.find((panel) => panel.id === this.activeTab()) ??
      this.panels[0]
    );
  }

  protected setActiveTab(tab: BlueprintTab): void {
    this.activeTab.set(tab);
  }
}
