import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { LocaleService } from '../../shared/i18n/locale.service';
import { RevealDirective } from '../../shared/reveal/reveal.directive';
import { SectionHeaderComponent } from '../../shared/section-header/section-header.component';

interface Bi {
  readonly es: string;
  readonly en: string;
}

interface FocusArea {
  readonly id: string;
  readonly label: Bi;
  readonly title: Bi;
  readonly description: Bi;
}

const CONTENT = {
  es: {
    kicker: 'ROLE · BACKEND',
    title: 'Ingeniería backend',
    lede: 'APIs resilientes, modelos de datos limpios y autenticación segura. Esta página crecerá con contratos, esquemas y detalle de implementación.',
    soon: '// más pronto',
  },
  en: {
    kicker: 'ROLE · BACKEND',
    title: 'Backend engineering',
    lede: 'Resilient APIs, clean data models and secure authentication. This page will grow with contracts, schemas and implementation detail.',
    soon: '// more soon',
  },
} as const;

const FOCUS_AREAS: readonly FocusArea[] = [
  {
    id: 'B.01',
    label: { es: 'APIS', en: 'APIS' },
    title: { es: 'APIs (REST / GraphQL)', en: 'APIs (REST / GraphQL)' },
    description: {
      es: 'Endpoints tipados, DTOs, paginación y manejo de errores consistente.',
      en: 'Typed endpoints, DTOs, pagination and consistent error handling.',
    },
  },
  {
    id: 'B.02',
    label: { es: 'DATOS', en: 'DATA' },
    title: { es: 'Modelado de datos', en: 'Data modeling' },
    description: {
      es: 'Relaciones, índices y migraciones sobre PostgreSQL y MySQL.',
      en: 'Relations, indexes and migrations across PostgreSQL and MySQL.',
    },
  },
  {
    id: 'B.03',
    label: { es: 'SEGURIDAD', en: 'SECURITY' },
    title: { es: 'Auth y seguridad (JWT)', en: 'Auth & security (JWT)' },
    description: {
      es: 'JWT, claims, expiración y control de acceso por rol.',
      en: 'JWT, claims, expiry and role-based access control.',
    },
  },
];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-backend-page',
  imports: [SectionHeaderComponent, RevealDirective],
  templateUrl: './backend.page.html',
  styleUrl: './backend.page.scss',
})
export class BackendPage {
  private readonly i18n = inject(LocaleService);
  protected readonly locale = this.i18n.locale;
  protected readonly t = computed(() => CONTENT[this.i18n.locale()]);
  protected readonly focusAreas = FOCUS_AREAS;
}
