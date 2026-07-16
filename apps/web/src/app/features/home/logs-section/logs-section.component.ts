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

interface BuildNote {
  readonly ref: string;
  readonly tag: string;
  readonly title: Bi;
}

const HEADER = {
  es: {
    title: 'Cómo está hecho este sitio',
    lede: 'Este portafolio es en sí mismo una muestra técnica. Estas son las decisiones reales detrás de su construcción.',
  },
  en: {
    title: 'How this site is built',
    lede: 'This portfolio is itself a technical sample. These are the real decisions behind how it was built.',
  },
} as const;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-logs-section',
  imports: [SectionHeaderComponent, RevealDirective],
  templateUrl: './logs-section.component.html',
  styleUrl: './logs-section.component.scss',
})
export class LogsSectionComponent {
  private readonly i18n = inject(LocaleService);
  protected readonly header = computed(() => HEADER[this.i18n.locale()]);
  protected readonly locale = this.i18n.locale;

  protected readonly notes: readonly BuildNote[] = [
    {
      ref: 'arch',
      tag: 'frontend',
      title: {
        es: 'Angular 21 standalone y zoneless, con estado en Signals y detección OnPush.',
        en: 'Angular 21 standalone and zoneless, with Signals state and OnPush change detection.',
      },
    },
    {
      ref: 'i18n',
      tag: 'ux',
      title: {
        es: 'Bilingüe ES/EN mediante un servicio de locale basado en signals, sin recargar.',
        en: 'Bilingual ES/EN through a signal-based locale service, with no reload.',
      },
    },
    {
      ref: 'lab',
      tag: 'security',
      title: {
        es: 'Laboratorio JWT interactivo: emisión de token, claims decodificados y guards por rol.',
        en: 'Interactive JWT lab: token issuance, decoded claims and role-based guards.',
      },
    },
    {
      ref: 'ssr',
      tag: 'delivery',
      title: {
        es: 'Renderizado en servidor con Express e hidratación con replay de eventos.',
        en: 'Server-side rendering with Express and client hydration with event replay.',
      },
    },
  ];
}
