import { ChangeDetectionStrategy, Component } from '@angular/core';

interface SystemLog {
  readonly timestamp: string;
  readonly title: string;
  readonly tag: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-logs-section',
  imports: [],
  templateUrl: './logs-section.component.html',
  styleUrl: './logs-section.component.scss',
})
export class LogsSectionComponent {
  protected readonly logs: readonly SystemLog[] = [
    {
      timestamp: '2026-07-05_01:30',
      title: 'JWT Auth Lab: guards, claims and recruiter-safe demo sessions',
      tag: 'security',
    },
    {
      timestamp: '2026-07-05_01:12',
      title: 'Angular standalone architecture for a senior portfolio SPA',
      tag: 'frontend',
    },
    {
      timestamp: '2026-07-05_00:58',
      title: 'Prisma + PostgreSQL schema strategy for blog and reading metrics',
      tag: 'backend',
    },
  ];
}
