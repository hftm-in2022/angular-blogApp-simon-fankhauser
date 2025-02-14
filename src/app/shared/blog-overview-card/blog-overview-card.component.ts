/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

export type Blog = {
  author: string;
  comments: number;
  contentPreview: string;
  createdByMe: boolean;
  id: number;
  likedByMe: boolean;
  likes: number;
  title: string;
};

@Component({
  selector: 'app-blog-overview-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIcon, TranslateModule],
  templateUrl: './blog-overview-card.component.html',
  styleUrls: ['./blog-overview-card.component.scss'],
})
export class BlogOverviewCardComponent {
  @Input({ required: true }) blog!: Blog;
}
