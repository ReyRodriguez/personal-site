import { ChangeDetectionStrategy, Component } from '@angular/core';

interface FluxNode {
  readonly icon: string;
  readonly title: string;
  readonly summary: string;
  readonly tone: 'green' | 'cyan' | 'purple';
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ai-flux-section',
  imports: [],
  templateUrl: './ai-flux-section.component.html',
  styleUrl: './ai-flux-section.component.scss',
})
export class AiFluxSectionComponent {
  protected readonly nodes: readonly FluxNode[] = [
    {
      icon: '>',
      title: '[PROMPTING]',
      summary: 'Structured context injection',
      tone: 'green',
    },
    {
      icon: 'AI',
      title: '[AI GENERATION]',
      summary: 'High-throughput iteration',
      tone: 'cyan',
    },
    {
      icon: '{}',
      title: '[MANUAL REFACTOR]',
      summary: 'Human-in-the-loop optimization',
      tone: 'purple',
    },
    {
      icon: 'OK',
      title: '[CERTIFIED QUALITY]',
      summary: 'Production-ready asset',
      tone: 'green',
    },
  ];
}
