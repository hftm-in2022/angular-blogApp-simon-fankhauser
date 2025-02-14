import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogOverviewPageComponent } from './blog-overview-page.component';
import { BlogOverviewCardComponent } from '../../shared/blog-overview-card/blog-overview-card.component';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { BlogStore } from '../../core/stores/blog-state.store';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  TranslateModule,
  TranslateService,
  TranslateStore,
} from '@ngx-translate/core';

class MockBlogStore {
  entries = signal({
    pageSize: 10,
    data: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Blog Title ${i + 1}`,
      contentPreview: `Preview for Blog ${i + 1}`,
      author: `Author ${i + 1}`,
      likes: i * 2,
      comments: i + 1,
      likedByMe: i % 2 === 0,
      createdByMe: i % 2 === 0,
    })),
    pageIndex: 1,
    totalCount: 20,
    maxPageSize: 10,
  });

  isLoadingList = signal(false);
  errorDetail = signal<string | null>(null);

  loadAll = jasmine.createSpy('loadAll');
}

describe('BlogOverviewPageComponent', () => {
  let component: BlogOverviewPageComponent;
  let fixture: ComponentFixture<BlogOverviewPageComponent>;
  let mockBlogStore: MockBlogStore;

  beforeEach(async () => {
    mockBlogStore = new MockBlogStore();

    await TestBed.configureTestingModule({
      imports: [
        BlogOverviewPageComponent,
        CommonModule,
        RouterTestingModule,
        MatProgressSpinnerModule,
        BlogOverviewCardComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: BlogStore, useValue: mockBlogStore },
        TranslateService,
        TranslateStore,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogOverviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load all blogs on initialization', () => {
    expect(mockBlogStore.loadAll).toHaveBeenCalled();
  });

  it('should display the correct number of blog cards', async () => {
    // Initiales Rendering
    fixture.detectChanges();

    // Warte, bis alle async Tasks abgeschlossen sind
    await fixture.whenStable();
    fixture.detectChanges(); // Erneute Aktualisierung des Templates

    // Warte explizit, um sicherzustellen, dass Angular das DOM aktualisiert
    setTimeout(() => {
      fixture.detectChanges();

      const blogCards = fixture.debugElement.queryAll(
        By.css('app-blog-overview-card'),
      );
      expect(blogCards.length).toBe(mockBlogStore.entries().data.length);
    }, 100); // Kurze Verzögerung, um sicherzustellen, dass das Rendering abgeschlossen ist
  });

  it('should display the loading spinner when loading', () => {
    mockBlogStore.isLoadingList.set(true);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('mat-progress-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should paginate blogs correctly', () => {
    const initialCount = component.paginatedBlogs.length;
    component.loadMoreBlogs();
    fixture.detectChanges();

    expect(component.paginatedBlogs.length).toBeGreaterThan(initialCount);
  });
});
