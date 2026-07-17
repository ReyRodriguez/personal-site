import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { API_BASE_URL } from './shared/api/api';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // SSR/prerender fetches the API server-to-server, so it needs an absolute
    // origin. Configurable via API_BASE_URL for deployed environments.
    {
      provide: API_BASE_URL,
      useValue: process.env['API_BASE_URL'] ?? 'http://localhost:3000',
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
