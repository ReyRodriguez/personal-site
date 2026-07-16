import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LocaleService } from '../../../shared/i18n/locale.service';
import { RevealDirective } from '../../../shared/reveal/reveal.directive';
import { SectionHeaderComponent } from '../../../shared/section-header/section-header.component';

interface FluxNode {
  readonly icon: string;
  readonly title: string;
  readonly summary: string;
  readonly tone: 'green' | 'cyan' | 'purple';
}

interface AiFluxCopy {
  readonly title: string;
  readonly lede: string;
  readonly nodes: readonly FluxNode[];
}

const CONTENT: Record<'es' | 'en', AiFluxCopy> = {
  es: {
    title: 'Cómo entrego con IA',
    lede: 'Un flujo con la persona en el centro: prompting estructurado, generación asistida, refactor manual y una revisión de calidad antes de dar algo por terminado.',
    nodes: [
      {
        icon: '>',
        title: 'PROMPTING',
        summary: 'Defino contexto, restricciones y criterios de aceptación.',
        tone: 'green',
      },
      {
        icon: 'AI',
        title: 'GENERACION',
        summary: 'La IA propone un primer borrador que itero rápido.',
        tone: 'cyan',
      },
      {
        icon: '{}',
        title: 'REFACTOR MANUAL',
        summary: 'Reescribo a mano para que encaje con la arquitectura.',
        tone: 'purple',
      },
      {
        icon: 'OK',
        title: 'CALIDAD VERIFICADA',
        summary: 'Reviso, pruebo y valido antes de integrar.',
        tone: 'green',
      },
    ],
  },
  en: {
    title: 'How I ship with AI',
    lede: 'A human-in-the-loop workflow: structured prompting, assisted generation, manual refactoring and a real quality pass before anything is called done.',
    nodes: [
      {
        icon: '>',
        title: 'PROMPTING',
        summary: 'I set the context, constraints and acceptance criteria.',
        tone: 'green',
      },
      {
        icon: 'AI',
        title: 'GENERATION',
        summary: 'The AI drafts a first pass that I iterate on fast.',
        tone: 'cyan',
      },
      {
        icon: '{}',
        title: 'MANUAL REFACTOR',
        summary: 'I rewrite by hand so it fits the architecture.',
        tone: 'purple',
      },
      {
        icon: 'OK',
        title: 'VERIFIED QUALITY',
        summary: 'I review, test and validate before it ships.',
        tone: 'green',
      },
    ],
  },
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ai-flux-section',
  imports: [SectionHeaderComponent, RevealDirective],
  templateUrl: './ai-flux-section.component.html',
  styleUrl: './ai-flux-section.component.scss',
})
export class AiFluxSectionComponent {
  private readonly i18n = inject(LocaleService);
  protected readonly t = computed(() => CONTENT[this.i18n.locale()]);
}
