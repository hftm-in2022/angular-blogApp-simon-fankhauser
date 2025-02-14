import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { ErrorHandler } from '@angular/core';
import { APP_ROUTES } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { GlobalErrorHandler } from './core/services/global-error-handler.service';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {
  provideAuth,
  StsConfigLoader,
  StsConfigStaticLoader,
} from 'angular-auth-oidc-client';
import { authConfig } from './core/auth/auth.config';
import { HttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideAnimationsAsync(),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    provideAuth({
      loader: {
        provide: StsConfigLoader,
        useFactory: () => new StsConfigStaticLoader(authConfig.config || {}),
      },
    }),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
};

// Funktion für den TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// Bootstrap mit HttpClient und anderen Konfigurationen
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
});
