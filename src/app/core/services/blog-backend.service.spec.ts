import { TestBed } from '@angular/core/testing';
import {
  BlogBackendService,
  Blog,
  BlogDetails,
  Entries,
} from './blog-backend.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';

describe('BlogBackendService', () => {
  let service: BlogBackendService;
  let httpMock: HttpTestingController;
  let oidcSecurityServiceSpy: jasmine.SpyObj<OidcSecurityService>;

  const mockEnvironment = {
    serviceUrl:
      'https://d-cap-blog-backend---v2.whitepond-b96fee4b.westeurope.azurecontainerapps.io/',
  };

  beforeEach(() => {
    oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', [
      'getAccessToken',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BlogBackendService,
        { provide: OidcSecurityService, useValue: oidcSecurityServiceSpy },
        { provide: 'environment', useValue: mockEnvironment },
      ],
    });

    service = TestBed.inject(BlogBackendService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch blog posts', () => {
    const mockEntries: Entries = {
      data: [
        {
          id: 1,
          title: 'Blog 1',
          contentPreview: 'Preview',
          author: 'Author',
          likes: 10,
          comments: 2,
          likedByMe: false,
          createdByMe: true,
        },
      ],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 1,
      maxPageSize: 10,
    };

    service.getBlogPosts().subscribe((entries) => {
      expect(entries).toEqual(mockEntries);
    });

    const req = httpMock.expectOne(`${mockEnvironment.serviceUrl}/entries`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEntries);
  });

  it('should fetch blog details by ID', () => {
    const mockBlogDetails: BlogDetails = {
      id: 1,
      title: 'Blog 1',
      contentPreview: 'Preview',
      content: 'Content',
      author: 'Author',
      likes: 10,
      comments: [
        {
          id: 1,
          content: 'Great post!',
          author: 'Commenter',
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
        },
      ],
      updatedAt: '2025-01-01',
      createdAt: '2025-01-01',
      likedByMe: false,
      createdByMe: true,
    };

    service.getBlogById(1).subscribe((details) => {
      expect(details).toEqual(mockBlogDetails);
    });

    const req = httpMock.expectOne(`${mockEnvironment.serviceUrl}/entries/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBlogDetails);
  });

  it('should check if a blog title exists', () => {
    service.checkTitleExists('Test Title').subscribe((exists) => {
      expect(exists).toBeTrue();
    });

    const req = httpMock.expectOne(
      `${mockEnvironment.serviceUrl}/check-title?title=Test Title`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('should add a new blog', () => {
    const mockBlog: Blog = {
      id: 1,
      title: 'New Blog',
      contentPreview: 'Preview',
      author: 'Author',
      likes: 0,
      comments: 0,
      likedByMe: false,
      createdByMe: true,
    };

    oidcSecurityServiceSpy.getAccessToken.and.returnValue(of('mock-token'));

    service
      .addBlog({ title: 'New Blog', content: 'Content' })
      .subscribe((blog) => {
        expect(blog).toEqual(mockBlog);
      });

    const req = httpMock.expectOne(`${mockEnvironment.serviceUrl}/entries`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockBlog);
  });
});
