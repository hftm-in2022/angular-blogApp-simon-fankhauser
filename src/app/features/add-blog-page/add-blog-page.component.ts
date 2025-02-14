import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BlogBackendService } from '../../core/services/blog-backend.service';
import { BlogTitleValidator } from '../../core/validators/blog-title.validator';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog-page.component.html',
  styleUrls: ['./add-blog-page.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
})
export class AddBlogPageComponent {
  blogForm: FormGroup;
  isSaving = false;
  uploadError: string | null = null;
  uploadedImage: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private blogService: BlogBackendService,
    private blogTitleValidator: BlogTitleValidator,
    private router: Router,
  ) {
    this.blogForm = this.formBuilder.group({
      title: [
        '',
        [Validators.required, Validators.minLength(3)],
        [this.blogTitleValidator.validate.bind(this.blogTitleValidator)],
      ],
      content: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  get title() {
    return this.blogForm.get('title');
  }

  get content() {
    return this.blogForm.get('content');
  }

  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.uploadError = 'Nur Bilddateien sind erlaubt.';
        this.uploadedImage = null;
      } else {
        this.uploadError = null;
        this.uploadedImage = file;
      }
    }
  }

  onSave() {
    if (this.blogForm.invalid) return;

    this.isSaving = true;

    const blogData = {
      ...this.blogForm.value,
      image: this.uploadedImage, // Bild hinzufügen
    };

    this.blogService
      .addBlog(blogData)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe(
        () => {
          const confirmed = window.confirm(
            'Blog erfolgreich gespeichert! Möchten Sie zur Übersicht zurückkehren?',
          );
          if (confirmed) {
            this.router.navigate(['/overview']);
          }
        },
        () => {
          alert('Fehler beim Speichern des Blogs.');
        },
      );
  }

  onReset() {
    this.blogForm.reset();
    this.uploadedImage = null;
    this.uploadError = null;
  }

  goBack() {
    this.router.navigate(['/overview']);
  }
}
