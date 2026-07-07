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

## Backend Siguiente Paso

```bash
npx nx add @nx/nest
npx nx g @nx/nest:app api --directory=apps/api
npm install @prisma/client
npm install -D prisma
npx prisma init
```

Durante este arranque, `npx nx add @nx/nest` quedo bloqueado en `npm install @nx/nest@23.0.1`; por eso el backend queda como estructura objetivo documentada y no como codigo parcial.
