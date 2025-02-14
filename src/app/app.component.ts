import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], // korrigierter Name von styleUrl zu styleUrls
})
export class AppComponent implements OnInit {
  title = 'blog-app';

  private readonly authService = inject(AuthService);
  private readonly translate = inject(TranslateService);

  ngOnInit(): void {
    // Initialisiere Authentifizierung
    this.authService.initializeAuth();

    // Initialisiere Übersetzungen
    this.translate.addLangs(['en', 'de', 'fr', 'it']); // Verfügbare Sprachen
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en'; // Sprache aus LocalStorage oder Fallback auf Englisch
    this.translate.setDefaultLang(savedLanguage); // Standard-Sprache setzen
    this.translate.use(savedLanguage); // Aktive Sprache setzen
  }
}
