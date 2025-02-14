import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../core/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import {
  TranslateModule,
  TranslateService,
  TranslateStore,
} from '@ngx-translate/core';

class MockAuthService {
  isAuthenticated$ = of(false);
  userName$ = of('Test User');
  login = jasmine.createSpy('login');
  logout = jasmine.createSpy('logout');
}

describe('SidebarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SidebarComponent,
        HttpClientTestingModule,
        MatSidenavModule,
        MatToolbarModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(), // <--- Hier `ngx-translate` hinzufügen
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ActivatedRoute, useValue: {} },
        TranslateService, // <--- TranslateService explizit bereitstellen
        TranslateStore, // <--- TranslateStore explizit bereitstellen
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
