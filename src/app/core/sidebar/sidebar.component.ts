import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenav } from '@angular/material/sidenav';
import { ViewChild } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    TranslateModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @ViewChild('drawer') drawer!: MatSidenav;
  private breakpointObserver = inject(BreakpointObserver);
  authService: AuthService = inject(AuthService);
  translate: TranslateService = inject(TranslateService);

  languages = ['en', 'de', 'fr', 'it']; // Verfügbare Sprachen
  currentLanguage = this.translate.currentLang || 'en'; // Standard auf 'en'

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  switchLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLanguage = lang;

    // Sprache im LocalStorage speichern
    localStorage.setItem('preferredLanguage', lang);
  }
}
