import type { Locale } from '../i18n/locale.service';

export type Bi<T = string> = Readonly<Record<Locale, T>>;

export interface BlogBlock {
  readonly type: 'p' | 'h2' | 'code';
  readonly text: Bi;
  /** language label for code blocks */
  readonly lang?: string;
}

export interface BlogPost {
  readonly slug: string;
  readonly tag: string;
  /** ISO date; formatted for display in the components */
  readonly date: string;
  readonly readingMinutes: number;
  /** Not published yet — these are previews of planned writing. */
  readonly upcoming: boolean;
  readonly title: Bi;
  readonly excerpt: Bi;
  readonly body: readonly BlogBlock[];
}

const p = (es: string, en: string): Bi => ({ es, en });

export const BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: 'zoneless-angular-signals',
    tag: 'frontend',
    date: '2026-06-28',
    readingMinutes: 7,
    upcoming: true,
    title: p(
      'Angular sin zone.js: arquitectura con Signals',
      'Zoneless Angular: architecture with Signals',
    ),
    excerpt: p(
      'Cómo construí este portafolio sin zone.js, apoyándome en Signals y OnPush para un render predecible y barato.',
      'How I built this portfolio without zone.js, leaning on Signals and OnPush for cheap, predictable rendering.',
    ),
    body: [
      {
        type: 'p',
        text: p(
          'Quitar zone.js cambia el modelo mental: la detección de cambios deja de ser mágica y pasa a ser explícita, gobernada por señales.',
          'Removing zone.js changes the mental model: change detection stops being magic and becomes explicit, driven by signals.',
        ),
      },
      {
        type: 'h2',
        text: p('Estado con signals', 'State with signals'),
      },
      {
        type: 'p',
        text: p(
          'Cada componente mantiene su estado en signals y expone valores derivados con computed. El render solo ocurre cuando una señal leída cambia.',
          'Each component holds its state in signals and exposes derived values via computed. Rendering only happens when a read signal changes.',
        ),
      },
      {
        type: 'code',
        lang: 'ts',
        text: p(
          "readonly count = signal(0);\nreadonly doubled = computed(() => this.count() * 2);",
          "readonly count = signal(0);\nreadonly doubled = computed(() => this.count() * 2);",
        ),
      },
      {
        type: 'p',
        text: p(
          'Para timers y animaciones se trabaja fuera de Angular y solo se entra a la zona para confirmar una actualización de señal.',
          'Timers and animations run outside Angular, entering the zone only to commit a signal update.',
        ),
      },
    ],
  },
  {
    slug: 'jwt-guards-roles',
    tag: 'backend',
    date: '2026-06-20',
    readingMinutes: 9,
    upcoming: true,
    title: p(
      'JWT, guards y roles sin sorpresas',
      'JWT, guards and roles without surprises',
    ),
    excerpt: p(
      'Un recorrido honesto por emisión de tokens, claims, expiración y verificación de roles en el borde de la API.',
      'An honest tour of token issuance, claims, expiry and role checks at the API edge.',
    ),
    body: [
      {
        type: 'p',
        text: p(
          'Un JWT no es seguridad por sí mismo: lo importante es qué claims incluyes, cómo los verificas y dónde cortas el acceso.',
          'A JWT is not security by itself: what matters is which claims you include, how you verify them and where you cut access.',
        ),
      },
      {
        type: 'h2',
        text: p('El guard como frontera', 'The guard as a boundary'),
      },
      {
        type: 'p',
        text: p(
          'Cada ruta protegida valida firma, expiración y scope antes de tocar la lógica de negocio. Si algo falla, se responde 401/403 sin filtrar detalles.',
          'Every protected route validates signature, expiry and scope before touching business logic. On failure it returns 401/403 without leaking detail.',
        ),
      },
      {
        type: 'code',
        lang: 'ts',
        text: p(
          '@UseGuards(JwtGuard, RolesGuard)\n@Roles("recruiter")\ngetDashboard() { /* ... */ }',
          '@UseGuards(JwtGuard, RolesGuard)\n@Roles("recruiter")\ngetDashboard() { /* ... */ }',
        ),
      },
    ],
  },
  {
    slug: 'core-web-vitals-ssr',
    tag: 'performance',
    date: '2026-06-12',
    readingMinutes: 6,
    upcoming: true,
    title: p(
      'De 57 a 98 en Lighthouse: notas de campo',
      'From 57 to 98 in Lighthouse: field notes',
    ),
    excerpt: p(
      'Compresión, un LCP que se escondía tras una animación y un canvas que había que abaratar: cómo subió la puntuación.',
      'Compression, an LCP hiding behind an animation, and a canvas that needed to get cheaper: how the score climbed.',
    ),
    body: [
      {
        type: 'p',
        text: p(
          'La primera lección: mide el build de producción, no el servidor de desarrollo. El resto fue quitar bloqueos reales uno por uno.',
          'First lesson: measure the production build, not the dev server. The rest was removing real blockers one by one.',
        ),
      },
      {
        type: 'h2',
        text: p('El culpable del LCP', 'The LCP culprit'),
      },
      {
        type: 'p',
        text: p(
          'Una animación de entrada dejaba el texto del héroe en opacidad 0 hasta que hidrataba el JS. Sacarla del above-the-fold bajó el LCP a la mitad.',
          'An entrance animation kept the hero text at opacity 0 until JS hydrated. Taking it off the above-the-fold cut LCP in half.',
        ),
      },
    ],
  },
];

export function findPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
