# Arquitectura Inicial

## Decision De Repositorio

La base recomendada es un monorepo integrado con Nx. Para este portafolio es la opcion mas eficiente porque el frontend, la API y los contratos compartidos evolucionan juntos, con cache de tareas, lint/test/build centralizados y una ruta simple para compartir tipos entre Angular y NestJS.

Repos separados tendrian sentido si el blog/API vivieran con ownership independiente, despliegues desacoplados por equipos distintos o versionado publico propio. En esta fase agregan coordinacion sin aportar suficiente ventaja.

## Estructura Objetivo

```txt
.
├── apps/
│   ├── web/                    # Angular SPA/SSR-ready: portfolio, blog reader, contacto
│   ├── web-e2e/                # Playwright para journeys criticos y visual checks
│   └── api/                    # NestJS REST API para blog, contacto y metricas
├── libs/
│   ├── contracts/              # DTOs, schemas y tipos compartidos
│   ├── domain-blog/            # Casos de uso y reglas del blog
│   └── ui/                     # Componentes visuales compartidos si crece la SPA
├── prisma/
│   ├── schema.prisma           # PostgreSQL: posts, tags, comments, reading metrics
│   └── migrations/
├── docs/
│   └── architecture.md
├── DESIGN.md                   # Base visual de Google Stitch refinada para implementacion
├── tailwind.config.js
└── package.json
```

## Frontend

- Angular standalone components con TypeScript estricto.
- Estado local con Signals para datos de UI y RxJS para streams externos.
- Tailwind CSS para layout/tokens y SCSS global para efectos de fondo, glows y componentes HUD.
- Fuentes Geist/Geist Mono self-hosted con Fontsource para reducir dependencias remotas.
- Playwright para validar flujos visibles y regresiones de layout.

## Backend

Stack propuesto: NestJS + REST + Prisma + PostgreSQL.

REST es suficiente para el blog/contacto inicial y deja la API clara en OpenAPI. GraphQL puede entrar luego para busqueda avanzada, filtros compuestos o agregaciones editoriales. NestJS permite mostrar arquitectura por capas sin perder velocidad:

```txt
apps/api/src/
├── app/
├── modules/
│   ├── blog/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── dto/
│   ├── contact/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── dto/
│   └── metrics/
│       ├── controllers/
│       ├── services/
│       └── repositories/
└── infrastructure/
    ├── database/
    └── observability/
```

## Modelo De Datos Inicial

- `posts`: titulo, slug, excerpt, contenido markdown, estado, tiempos de lectura.
- `tags`: nombre, slug, color semantico.
- `post_tags`: relacion many-to-many.
- `comments`: autor, email hash, contenido, estado de moderacion.
- `reading_metrics`: post, visitas, profundidad, referrer, user agent anonimizado.
- `contact_messages`: nombre, email, mensaje, estado, metadata anti-spam.

## Mejora Sobre DESIGN.md

La base visual es fuerte. Ajustes aplicados:

- Mantener los acentos cian, verde y purpura, pero evitar que el sitio dependa de un solo color dominante.
- Usar geometria sharp y esquinas recortadas en lugar de border-radius.
- Evitar letter-spacing negativo en headers para proteger legibilidad responsive y cumplir la regla de no comprimir texto.
- Reservar glassmorphism para paneles tecnicos, no para envolver cada seccion completa.
