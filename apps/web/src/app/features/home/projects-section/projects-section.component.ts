import { ChangeDetectionStrategy, Component } from '@angular/core';

interface PortfolioProject {
  readonly icon: string;
  readonly company: string;
  readonly title: string;
  readonly period: string;
  readonly impact: string;
  readonly stack: readonly string[];
  readonly signals: readonly string[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-projects-section',
  imports: [],
  templateUrl: './projects-section.component.html',
  styleUrl: './projects-section.component.scss',
})
export class ProjectsSectionComponent {
  protected readonly projects: readonly PortfolioProject[] = [
    {
      icon: 'API',
      company: 'Fundación Salware',
      title: 'Modernización Angular e integraciones IA',
      period: '2023 - Actualidad',
      impact:
        'Rediseño UX/UI, modernización de componentes Angular y coordinación con APIs Java Spring Boot para servicios con IA.',
      stack: [
        'Angular',
        'TypeScript',
        'SCSS',
        'Node.js',
        'Java',
        'Spring Boot',
      ],
      signals: ['UX modernization', 'AI integrations', 'Fullstack delivery'],
    },
    {
      icon: 'GQL',
      company: 'Granada Software',
      title: 'Migración de flujos críticos a GraphQL',
      period: '2019 - 2021',
      impact:
        'Reducción de 25% en tiempos de espera al optimizar peticiones y consolidar estado con NgRx.',
      stack: ['Angular', 'GraphQL', 'NgRx', 'AWS', 'Node.js'],
      signals: ['Performance', 'State management', 'API optimization'],
    },
    {
      icon: 'UX',
      company: 'MO Technologies',
      title: 'Onboarding financiero y evaluación crediticia',
      period: '2022',
      impact:
        'Implementación de formularios de registro multipaso para evaluación de perfil y decisión de crédito.',
      stack: ['Angular', 'TypeScript', 'GraphQL', 'NgRx', 'AWS'],
      signals: ['Complex forms', 'Fintech workflows', 'Data validation'],
    },
    {
      icon: 'ADM',
      company: 'Bromus Software',
      title: 'Interfaces administrativas de alta usabilidad',
      period: '2022',
      impact:
        'Construcción de pantallas administrativas enfocadas en claridad operativa, UX/UI y procesos más amigables.',
      stack: ['Angular', 'TypeScript', 'SCSS', 'Node.js', 'Azure', '.NET'],
      signals: ['Admin UX', 'Enterprise UI', 'Azure delivery'],
    },
  ];
}
