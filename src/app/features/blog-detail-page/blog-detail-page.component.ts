import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  signal,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BlogStore } from '../../core/stores/blog-state.store';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-blog-detail-page',
  standalone: true,
  imports: [
    MatIcon,
    RouterLink,
    CommonModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './blog-detail-page.component.html',
  styleUrls: ['./blog-detail-page.component.scss'], // korrigiert: styleUrls (Plural)
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(BlogStore);

  // Ob Kommentare ein-/ausgeblendet sind
  showComments = signal(false);

  // Computed Signal, das nur dann Kommentare zurückgibt, wenn es einen Blog gibt:
  selectedComments = computed(() => {
    const blog = this.store.selectedBlog();
    if (!blog) {
      return [];
    }
    return blog.comments;
  });

  ngOnInit(): void {
    const blogId = Number(this.route.snapshot.paramMap.get('id'));
    if (blogId) {
      this.store.loadById(blogId);
    }
  }

  toggleComments() {
    this.showComments.update((v) => !v);
  }

  // z.B. für *ngFor trackBy:
  trackComment(index: number, comment: { id: number }) {
    return comment.id;
  }

  get isLoadingDetail() {
    return this.store.isLoadingDetail();
  }

  get errorDetail() {
    return this.store.errorDetail();
  }

  get blog() {
    return this.store.selectedBlog();
  }

  clearBlog() {
    this.store.clearSelectedBlog();
  }
}
