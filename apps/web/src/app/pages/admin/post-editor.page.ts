import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import type { Locale, PostInput } from '@portfolio/contracts';
import { LocaleService } from '../../shared/i18n/locale.service';
import { MarkdownComponent } from '../../shared/markdown/markdown.component';
import { BlogAdminService } from '../../shared/blog/blog-admin.service';

const CONTENT = {
  es: {
    kicker: 'ADMIN.EDITOR',
    newTitle: 'Nueva entrada',
    editTitle: 'Editar entrada',
    back: 'entradas',
    slug: 'Slug',
    slugHint: 'se genera del título si lo dejas vacío',
    tag: 'Etiqueta',
    title: 'Título',
    excerpt: 'Resumen',
    body: 'Contenido (Markdown)',
    preview: 'Vista previa',
    publishedLabel: 'Publicada (visible en el blog público)',
    save: 'Guardar',
    saving: 'Guardando…',
    deleteLabel: 'Eliminar',
    loading: 'Cargando entrada…',
    invalid: 'Revisa los campos requeridos en ES y EN.',
    slugTaken: 'Ese slug ya está en uso.',
    saveError: 'No se pudo guardar la entrada.',
    loadError: 'No se pudo cargar la entrada.',
    confirmDelete: '¿Eliminar esta entrada de forma permanente?',
  },
  en: {
    kicker: 'ADMIN.EDITOR',
    newTitle: 'New post',
    editTitle: 'Edit post',
    back: 'posts',
    slug: 'Slug',
    slugHint: 'generated from the title if left blank',
    tag: 'Tag',
    title: 'Title',
    excerpt: 'Excerpt',
    body: 'Content (Markdown)',
    preview: 'Preview',
    publishedLabel: 'Published (visible on the public blog)',
    save: 'Save',
    saving: 'Saving…',
    deleteLabel: 'Delete',
    loading: 'Loading post…',
    invalid: 'Check the required fields in both ES and EN.',
    slugTaken: 'That slug is already in use.',
    saveError: 'Could not save the post.',
    loadError: 'Could not load the post.',
    confirmDelete: 'Delete this post permanently?',
  },
} as const;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-post-editor-page',
  imports: [ReactiveFormsModule, RouterLink, MarkdownComponent],
  templateUrl: './post-editor.page.html',
  styleUrl: './admin.scss',
})
export class PostEditorPage {
  private readonly fb = inject(FormBuilder);
  private readonly admin = inject(BlogAdminService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly i18n = inject(LocaleService);

  protected readonly editId = this.route.snapshot.paramMap.get('id');
  protected readonly isEdit = this.editId !== null;

  protected readonly t = computed(() => CONTENT[this.i18n.locale()]);
  protected readonly editLocale = signal<Locale>('es');
  protected readonly saving = signal(false);
  protected readonly loading = signal(this.isEdit);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    slug: [''],
    tag: ['', Validators.required],
    title: this.fb.nonNullable.group({
      es: ['', Validators.required],
      en: ['', Validators.required],
    }),
    excerpt: this.fb.nonNullable.group({
      es: ['', Validators.required],
      en: ['', Validators.required],
    }),
    body: this.fb.nonNullable.group({
      es: ['', Validators.required],
      en: ['', Validators.required],
    }),
    published: [false],
  });

  private readonly bodyChanges = toSignal(this.form.controls.body.valueChanges, {
    initialValue: this.form.controls.body.getRawValue(),
  });
  protected readonly preview = computed(
    () => this.bodyChanges()[this.editLocale()] ?? '',
  );

  constructor() {
    if (this.editId) {
      this.loadPost(this.editId);
    }
  }

  setLocale(locale: Locale): void {
    this.editLocale.set(locale);
  }

  private loadPost(id: string): void {
    this.admin.get(id).subscribe({
      next: (post) => {
        this.form.patchValue({
          slug: post.slug,
          tag: post.tag,
          title: { es: post.title.es, en: post.title.en },
          excerpt: { es: post.excerpt.es, en: post.excerpt.en },
          body: { es: post.body.es, en: post.body.en },
          published: post.published,
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.t().loadError);
        this.loading.set(false);
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set(this.t().invalid);
      return;
    }
    const raw = this.form.getRawValue();
    const input: PostInput = {
      slug: raw.slug.trim() ? raw.slug.trim() : undefined,
      tag: raw.tag,
      title: raw.title,
      excerpt: raw.excerpt,
      body: raw.body,
      published: raw.published,
    };
    this.saving.set(true);
    this.error.set(null);
    const op = this.editId
      ? this.admin.update(this.editId, input)
      : this.admin.create(input);
    op.subscribe({
      next: () => this.router.navigateByUrl('/admin'),
      error: (err: { status?: number }) => {
        this.saving.set(false);
        this.error.set(
          err?.status === 409 ? this.t().slugTaken : this.t().saveError,
        );
      },
    });
  }

  remove(): void {
    if (!this.editId || !confirm(this.t().confirmDelete)) {
      return;
    }
    this.saving.set(true);
    this.admin.remove(this.editId).subscribe({
      next: () => this.router.navigateByUrl('/admin'),
      error: () => {
        this.saving.set(false);
        this.error.set(this.t().saveError);
      },
    });
  }
}
