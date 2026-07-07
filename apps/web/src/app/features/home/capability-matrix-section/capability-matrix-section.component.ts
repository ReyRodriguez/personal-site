import { ChangeDetectionStrategy, Component } from '@angular/core';

interface CapabilityProof {
  readonly id: string;
  readonly title: string;
  readonly proof: string;
  readonly stack: readonly string[];
  readonly status: 'live' | 'blueprint' | 'next';
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-capability-matrix-section',
  imports: [],
  templateUrl: './capability-matrix-section.component.html',
  styleUrl: './capability-matrix-section.component.scss',
})
export class CapabilityMatrixSectionComponent {
  protected readonly capabilities: readonly CapabilityProof[] = [
    {
      id: 'AUTH',
      title: 'JWT Auth + Roles',
      proof: 'Login, bearer token, claims, expiracion, scopes y guard checks.',
      stack: ['JWT', 'Guards', 'Roles'],
      status: 'live',
    },
    {
      id: 'CRUD',
      title: 'CRUD Operacional',
      proof:
        'Alta, busqueda, estado, borrado y metricas derivadas en una tabla viva.',
      stack: ['Signals', 'Forms', 'UX states'],
      status: 'live',
    },
    {
      id: 'API',
      title: 'REST / GraphQL Contracts',
      proof:
        'Endpoints, DTOs, errores, paginacion, filtros y contratos compartidos.',
      stack: ['REST', 'GraphQL', 'OpenAPI'],
      status: 'blueprint',
    },
    {
      id: 'DB',
      title: 'PostgreSQL Modeling',
      proof: 'Relaciones, indices, migraciones y lectura de metricas del blog.',
      stack: ['PostgreSQL', 'Prisma', 'Indexes'],
      status: 'blueprint',
    },
    {
      id: 'TEST',
      title: 'Testing + E2E',
      proof: 'Build, lint, Playwright y validacion de flujo JWT en CI.',
      stack: ['Playwright', 'Nx', 'ESLint'],
      status: 'live',
    },
    {
      id: 'PERF',
      title: 'Performance Budget',
      proof:
        'Bundles medidos, SSR-ready, lazy strategy y Core Web Vitals como objetivo.',
      stack: ['Angular', 'Budgets', 'SSR'],
      status: 'live',
    },
    {
      id: 'REALTIME',
      title: 'Realtime Events',
      proof:
        'SSE/WebSocket para notificaciones, logs de despliegue o progreso async.',
      stack: ['SSE', 'WebSocket', 'RxJS'],
      status: 'next',
    },
    {
      id: 'QUEUE',
      title: 'Background Jobs',
      proof:
        'Emails, reportes, colas y reintentos fuera del request lifecycle.',
      stack: ['Queues', 'Workers', 'Retries'],
      status: 'next',
    },
    {
      id: 'OBS',
      title: 'Observability',
      proof:
        'Health checks, logs estructurados, request ids y errores trazables.',
      stack: ['Logs', 'Tracing', 'Metrics'],
      status: 'blueprint',
    },
    {
      id: 'OPS',
      title: 'Docker + Deploy',
      proof: 'Compose local, variables de entorno y pipeline deploy-preview.',
      stack: ['Docker', 'CI/CD', 'Env'],
      status: 'blueprint',
    },
    {
      id: 'AI',
      title: 'AI Workflow',
      proof: 'Prompting estructurado, refactor humano y QA asistido por IA.',
      stack: ['AI Ops', 'Review', 'Automation'],
      status: 'live',
    },
    {
      id: 'DOCS',
      title: 'Technical Docs',
      proof:
        'Arquitectura, setup reproducible, decisiones y roadmap de backend.',
      stack: ['ADR', 'README', 'Diagrams'],
      status: 'live',
    },
  ];
}
