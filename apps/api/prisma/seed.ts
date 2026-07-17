/**
 * Seeds the blog database:
 *  1. Upserts the single admin user from ADMIN_EMAIL / ADMIN_PASSWORD.
 *  2. Migrates the three original portfolio posts (previously hard-coded in
 *     apps/web/src/app/shared/blog/posts.ts as a structured block model) into
 *     Markdown rows. They are seeded as DRAFTS (published: false) so nothing
 *     claims to be live until you publish it from the admin panel.
 *
 * Run with: npm run prisma:seed  (loads apps/api/.env, executes via tsx)
 */
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

interface SeedPost {
  slug: string;
  tag: string;
  titleEs: string;
  titleEn: string;
  excerptEs: string;
  excerptEn: string;
  bodyEs: string;
  bodyEn: string;
}

const SEED_POSTS: SeedPost[] = [
  {
    slug: 'zoneless-angular-signals',
    tag: 'frontend',
    titleEs: 'Angular sin zone.js: arquitectura con Signals',
    titleEn: 'Zoneless Angular: architecture with Signals',
    excerptEs:
      'Cómo construí este portafolio sin zone.js, apoyándome en Signals y OnPush para un render predecible y barato.',
    excerptEn:
      'How I built this portfolio without zone.js, leaning on Signals and OnPush for cheap, predictable rendering.',
    bodyEs: [
      'Quitar zone.js cambia el modelo mental: la detección de cambios deja de ser mágica y pasa a ser explícita, gobernada por señales.',
      '',
      '## Estado con signals',
      '',
      'Cada componente mantiene su estado en signals y expone valores derivados con computed. El render solo ocurre cuando una señal leída cambia.',
      '',
      '```ts',
      'readonly count = signal(0);',
      'readonly doubled = computed(() => this.count() * 2);',
      '```',
      '',
      'Para timers y animaciones se trabaja fuera de Angular y solo se entra a la zona para confirmar una actualización de señal.',
    ].join('\n'),
    bodyEn: [
      'Removing zone.js changes the mental model: change detection stops being magic and becomes explicit, driven by signals.',
      '',
      '## State with signals',
      '',
      'Each component holds its state in signals and exposes derived values via computed. Rendering only happens when a read signal changes.',
      '',
      '```ts',
      'readonly count = signal(0);',
      'readonly doubled = computed(() => this.count() * 2);',
      '```',
      '',
      'Timers and animations run outside Angular, entering the zone only to commit a signal update.',
    ].join('\n'),
  },
  {
    slug: 'jwt-guards-roles',
    tag: 'backend',
    titleEs: 'JWT, guards y roles sin sorpresas',
    titleEn: 'JWT, guards and roles without surprises',
    excerptEs:
      'Un recorrido honesto por emisión de tokens, claims, expiración y verificación de roles en el borde de la API.',
    excerptEn:
      'An honest tour of token issuance, claims, expiry and role checks at the API edge.',
    bodyEs: [
      'Un JWT no es seguridad por sí mismo: lo importante es qué claims incluyes, cómo los verificas y dónde cortas el acceso.',
      '',
      '## El guard como frontera',
      '',
      'Cada ruta protegida valida firma, expiración y scope antes de tocar la lógica de negocio. Si algo falla, se responde 401/403 sin filtrar detalles.',
      '',
      '```ts',
      '@UseGuards(JwtGuard, RolesGuard)',
      '@Roles("recruiter")',
      'getDashboard() { /* ... */ }',
      '```',
    ].join('\n'),
    bodyEn: [
      'A JWT is not security by itself: what matters is which claims you include, how you verify them and where you cut access.',
      '',
      '## The guard as a boundary',
      '',
      'Every protected route validates signature, expiry and scope before touching business logic. On failure it returns 401/403 without leaking detail.',
      '',
      '```ts',
      '@UseGuards(JwtGuard, RolesGuard)',
      '@Roles("recruiter")',
      'getDashboard() { /* ... */ }',
      '```',
    ].join('\n'),
  },
  {
    slug: 'core-web-vitals-ssr',
    tag: 'performance',
    titleEs: 'De 57 a 98 en Lighthouse: notas de campo',
    titleEn: 'From 57 to 98 in Lighthouse: field notes',
    excerptEs:
      'Compresión, un LCP que se escondía tras una animación y un canvas que había que abaratar: cómo subió la puntuación.',
    excerptEn:
      'Compression, an LCP hiding behind an animation, and a canvas that needed to get cheaper: how the score climbed.',
    bodyEs: [
      'La primera lección: mide el build de producción, no el servidor de desarrollo. El resto fue quitar bloqueos reales uno por uno.',
      '',
      '## El culpable del LCP',
      '',
      'Una animación de entrada dejaba el texto del héroe en opacidad 0 hasta que hidrataba el JS. Sacarla del above-the-fold bajó el LCP a la mitad.',
    ].join('\n'),
    bodyEn: [
      'First lesson: measure the production build, not the dev server. The rest was removing real blockers one by one.',
      '',
      '## The LCP culprit',
      '',
      'An entrance animation kept the hero text at opacity 0 until JS hydrated. Taking it off the above-the-fold cut LCP in half.',
    ].join('\n'),
  },
];

function estimateReadingMinutes(bodyEs: string, bodyEn: string): number {
  const count = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(Math.max(count(bodyEs), count(bodyEn)) / 200));
}

async function main() {
  const email = process.env['ADMIN_EMAIL'];
  const password = process.env['ADMIN_PASSWORD'];
  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed the admin user');
  }

  const passwordHash = await hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });
  console.log(`✓ admin user ready: ${email}`);

  for (const post of SEED_POSTS) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        published: false,
        readingMinutes: estimateReadingMinutes(post.bodyEs, post.bodyEn),
      },
    });
    console.log(`✓ draft seeded: ${post.slug}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
