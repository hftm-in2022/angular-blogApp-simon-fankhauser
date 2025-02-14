import { Injectable } from '@angular/core';
import {
  OidcSecurityService,
  AuthenticatedResult,
} from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private translate: TranslateService, // Inject TranslateService
  ) {}

  initializeAuth(): void {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated }) => {
      console.log('Auth Status:', isAuthenticated);

      // Setze Sprache basierend auf gespeicherter Sprache oder Standard
      const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
      this.translate.use(savedLanguage);

      this.oidcSecurityService.userData$.subscribe((userData) => {
        console.log('Benutzerdaten direkt aus userData$:', userData); // Debugging
      });
    });
  }

  login(): void {
    this.oidcSecurityService.authorize();

    // Setze Sprache nach Login
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    this.translate.use(savedLanguage);
  }

  logout(): void {
    this.oidcSecurityService.logoff().subscribe({
      next: () => {
        console.log('Logout erfolgreich');

        // Setze Sprache nach Logout
        const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
        this.translate.use(savedLanguage);
      },
      error: (err) => {
        console.error('Logout Fehler:', err);
      },
    });
  }

  get isAuthenticated(): Observable<boolean> {
    return this.oidcSecurityService.isAuthenticated$.pipe(
      map((result: AuthenticatedResult) => result.isAuthenticated),
    );
  }

  get userName$(): Observable<string | null> {
    return this.oidcSecurityService.userData$.pipe(
      map((userData) => {
        console.log('Benutzerdaten im AuthService:', userData); // Debugging
        return userData?.userData?.preferred_username || null;
      }),
    );
  }
}
