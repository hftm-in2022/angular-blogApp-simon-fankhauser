import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BlogOverviewCardComponent } from '../../shared/blog-overview-card/blog-overview-card.component';
import { BlogStore } from '../../core/stores/blog-state.store';
import { ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-blog-overview-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BlogOverviewCardComponent,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './blog-overview-page.component.html',
  styleUrls: ['./blog-overview-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogOverviewPageComponent implements OnInit {
  private store = inject(BlogStore);

  private pageSize = 8; // Anzahl Blogs pro Seite
  private currentPage = 1; // Aktuelle Seite

  ngOnInit(): void {
    this.store.loadAll();
  }

  get isLoadingList() {
    return this.store.isLoadingList();
  }

  trackBlog(index: number, blog: { id: number }) {
    return blog.id;
  }

  get entries() {
    return this.store.entries();
  }

  get errorDetail() {
    return this.store.errorDetail();
  }

  get paginatedBlogs() {
    const allBlogs = this.entries?.data || [];
    return allBlogs.slice(0, this.currentPage * this.pageSize);
  }

  get hasMoreBlogs() {
    return (
      this.entries &&
      this.entries.data &&
      this.entries.data.length > this.currentPage * this.pageSize
    );
  }

  loadMoreBlogs() {
    this.currentPage++;
  }
}
