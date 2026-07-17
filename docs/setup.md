# Setup Inicial

## Comandos Ejecutados

```bash
npx create-nx-workspace@latest portfolio \
  --name=portfolio \
  --preset=angular-monorepo \
  --appName=web \
  --style=scss \
  --standaloneApi=true \
  --routing=true \
  --unitTestRunner=vitest \
  --e2eTestRunner=playwright \
  --workspaceType=integrated \
  --pm=npm \
  --nxCloud=skip \
  --skipGit \
  --interactive=false \
  --zoneless=true

npm install -D tailwindcss@3.4.17 postcss autoprefixer
npm install @fontsource-variable/geist @fontsource-variable/geist-mono
npx tailwindcss init
```

## Comandos De Desarrollo

```bash
npm install
npx nx serve web
npx nx build web
npx nx lint web
npx nx e2e web-e2e
```

El target de unit tests queda pendiente de configuracion explicita; la plantilla actual de Nx/Angular no lo genero aunque se solicito Vitest.

## Backend Del Blog (`apps/api`) — Implementado

El backend del blog ya está construido: NestJS (`apps/api`) + PostgreSQL vía Prisma, con tipos compartidos en `libs/contracts` (`@portfolio/contracts`). El bloqueo original de `npx nx add @nx/nest@23.0.1` ya no aplica; se instaló correctamente.

### Puesta en marcha local

```bash
cp apps/api/.env.example apps/api/.env   # ajusta secretos y credenciales de admin
npm run db:up            # levanta Postgres (docker compose, puerto 5432)
npm run prisma:migrate   # aplica migraciones
npm run prisma:seed      # crea el usuario admin + migra los 3 posts como borradores
npm run api:serve        # NestJS en http://localhost:3000/api
npm start                # web en http://localhost:4200 (proxy /api → :3000)
```

- **Auth**: un único admin (Passport-JWT + bcrypt, token en cookie httpOnly). El panel vive en `/admin` (login en `/admin/login`).
- **Contenido**: los posts se escriben en Markdown bilingüe (ES/EN) desde el panel. Los 3 posts sembrados quedan como **borradores** hasta que se publiquen.
- **Prisma**: se fijó a la v6 (la v7 exige driver adapters + `prisma.config.ts`, incompatible con el build webpack de Nest sin fricción). `@prisma/client` se genera a `node_modules/@prisma/client`.
- **Ejecución del servidor SSR standalone**: exporta `NG_ALLOWED_HOSTS` (host permitido) y `API_BASE_URL` (origen de la API) — ver CLAUDE.md.

### Pendiente (arquitectura objetivo, no construido)

Comentarios, métricas de lectura y formulario de contacto (ver `docs/architecture.md`).
