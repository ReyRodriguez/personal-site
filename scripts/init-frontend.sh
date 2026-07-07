#!/usr/bin/env bash
set -euo pipefail

if [[ -f package.json ]]; then
  echo "package.json already exists. Run this script only in an empty parent folder."
  exit 1
fi

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

cd portfolio
npm install -D tailwindcss@3.4.17 postcss autoprefixer
npx tailwindcss init
