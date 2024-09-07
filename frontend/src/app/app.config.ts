

import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http'; // New way to provide HttpClient
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),  // Replacing HttpClientModule
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration()
  ]
};
