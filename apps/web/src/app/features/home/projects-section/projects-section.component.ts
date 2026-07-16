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

interface PortfolioProject {
  readonly icon: string;
  readonly company: string;
  readonly title: Bi;
  readonly period: Bi;
  readonly impact: Bi;
  readonly stack: readonly string[];
}

const HEADER = {
  es: {
    title: 'Trabajo desplegado',
    lede: 'Una selección de experiencias reales enfocadas en Angular, GraphQL, performance, UX operacional e integraciones backend.',
  },
  en: {
    title: 'Deployed work',
    lede: 'A selection of real engagements focused on Angular, GraphQL, performance, operational UX and backend integrations.',
  },
} as const;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-projects-section',
  imports: [SectionHeaderComponent, RevealDirective],
  templateUrl: './projects-section.component.html',
  styleUrl: './projects-section.component.scss',
})
export class ProjectsSectionComponent {
  private readonly i18n = inject(LocaleService);
  protected readonly locale = this.i18n.locale;
  protected readonly header = computed(() => HEADER[this.i18n.locale()]);

  protected readonly projects: readonly PortfolioProject[] = [
    {
      icon: 'API',
      company: 'Fundación Salware',
      title: {
        es: 'Modernización Angular e integraciones con IA',
        en: 'Angular modernization and AI integrations',
      },
      period: { es: '2023 — Actualidad', en: '2023 — Present' },
      impact: {
        es: 'Rediseño UX/UI, modernización de componentes Angular y coordinación con APIs Java Spring Boot para servicios con IA.',
        en: 'UX/UI redesign, modernization of Angular components and coordination with Java Spring Boot APIs for AI-powered services.',
      },
      stack: ['Angular', 'TypeScript', 'SCSS', 'Node.js', 'Java', 'Spring Boot'],
    },
    {
      icon: 'GQL',
      company: 'Granada Software',
      title: {
        es: 'Migración de flujos críticos a GraphQL',
        en: 'Migrating critical flows to GraphQL',
      },
      period: { es: '2019 — 2021', en: '2019 — 2021' },
      impact: {
        es: 'Reducción del 25% en tiempos de espera al optimizar peticiones y consolidar el estado con NgRx.',
        en: '25% reduction in wait times by optimizing requests and consolidating state with NgRx.',
      },
      stack: ['Angular', 'GraphQL', 'NgRx', 'AWS', 'Node.js'],
    },
    {
      icon: 'UX',
      company: 'MO Technologies',
      title: {
        es: 'Onboarding financiero y evaluación crediticia',
        en: 'Financial onboarding and credit assessment',
      },
      period: { es: '2022', en: '2022' },
      impact: {
        es: 'Formularios de registro multipaso para evaluación de perfil y decisión de crédito en un producto fintech.',
        en: 'Multi-step registration forms for profile assessment and credit decisions in a fintech product.',
      },
      stack: ['Angular', 'TypeScript', 'GraphQL', 'NgRx', 'AWS'],
    },
    {
      icon: 'ADM',
      company: 'Bromus Software',
      title: {
        es: 'Interfaces administrativas de alta usabilidad',
        en: 'Highly usable admin interfaces',
      },
      period: { es: '2022', en: '2022' },
      impact: {
        es: 'Pantallas administrativas enfocadas en claridad operativa, con procesos más simples y una UX/UI más amigable.',
        en: 'Admin screens focused on operational clarity, with simpler processes and a friendlier UX/UI.',
      },
      stack: ['Angular', 'TypeScript', 'SCSS', 'Node.js', 'Azure', '.NET'],
    },
  ];
}
