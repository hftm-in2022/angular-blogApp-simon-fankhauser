import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BlogOverviewCardComponent,
  Blog,
} from './blog-overview-card.component';
import { By } from '@angular/platform-browser';
import {
  TranslateModule,
  TranslateService,
  TranslateStore,
} from '@ngx-translate/core';

describe('BlogOverviewCardComponent', () => {
  let component: BlogOverviewCardComponent;
  let fixture: ComponentFixture<BlogOverviewCardComponent>;

  const mockBlog: Blog = {
    author: 'John Doe',
    comments: 5,
    contentPreview: 'This is a preview of the blog content.',
    createdByMe: false,
    id: 1,
    likedByMe: true,
    likes: 42,
    title: 'Test Blog Title',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BlogOverviewCardComponent,
        TranslateModule.forRoot(), // Fix für `TranslateStore`-Fehler
      ],
      providers: [TranslateService, TranslateStore],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogOverviewCardComponent);
    component = fixture.componentInstance;
    component.blog = mockBlog;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the blog title', () => {
    const titleElement = fixture.debugElement.query(By.css('.card-title'));
    expect(titleElement).toBeTruthy();
    expect(titleElement.nativeElement.textContent).toContain(mockBlog.title);
  });

  it('should display the blog author', () => {
    const authorElement = fixture.debugElement.query(By.css('.blog-author'));
    expect(authorElement).toBeTruthy();
    expect(authorElement.nativeElement.textContent).toContain(mockBlog.author);
  });
});
