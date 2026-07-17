import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import type { BlogPostSummary } from '@portfolio/contracts';
import { LocaleService } from '../../shared/i18n/locale.service';
import { AuthStore } from '../../shared/auth/auth.store';
import { BlogAdminService } from '../../shared/blog/blog-admin.service';

const CONTENT = {
  es: {
    kicker: 'ADMIN.BLOG',
    title: 'Entradas',
    lede: 'Crea, edita, publica y elimina entradas del blog.',
    newPost: 'Nueva entrada',
    logout: 'Salir',
    loading: 'Cargando…',
    empty: 'Todavía no hay entradas. Crea la primera.',
    error: 'No se pudieron cargar las entradas.',
    published: 'Publicada',
    draft: 'Borrador',
    edit: 'Editar',
    publish: 'Publicar',
    unpublish: 'Despublicar',
    delete: 'Eliminar',
    confirmDelete: '¿Eliminar esta entrada de forma permanente?',
    min: 'min',
  },
  en: {
    kicker: 'ADMIN.BLOG',
    title: 'Posts',
    lede: 'Create, edit, publish and delete blog posts.',
    newPost: 'New post',
    logout: 'Log out',
    loading: 'Loading…',
    empty: 'No posts yet. Create the first one.',
    error: 'Could not load posts.',
    published: 'Published',
    draft: 'Draft',
    edit: 'Edit',
    publish: 'Publish',
    unpublish: 'Unpublish',
    delete: 'Delete',
    confirmDelete: 'Delete this post permanently?',
    min: 'min',
  },
} as const;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-posts-page',
  imports: [RouterLink],
  templateUrl: './admin-posts.page.html',
  styleUrl: './admin.scss',
})
export class AdminPostsPage {
  private readonly admin = inject(BlogAdminService);
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly i18n = inject(LocaleService);

  protected readonly t = computed(() => CONTENT[this.i18n.locale()]);
  protected readonly locale = this.i18n.locale;

  protected readonly posts = signal<BlogPostSummary[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly busyId = signal<string | null>(null);

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.admin.list().subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.t().error);
        this.loading.set(false);
      },
    });
  }

  date(post: BlogPostSummary): string {
    return post.publishedAt?.slice(0, 10) ?? '—';
  }

  togglePublish(post: BlogPostSummary): void {
    this.busyId.set(post.id);
    this.admin.setPublished(post.id, !post.published).subscribe({
      next: () => {
        this.busyId.set(null);
        this.load();
      },
      error: () => this.busyId.set(null),
    });
  }

  remove(post: BlogPostSummary): void {
    if (!confirm(this.t().confirmDelete)) {
      return;
    }
    this.busyId.set(post.id);
    this.admin.remove(post.id).subscribe({
      next: () => {
        this.busyId.set(null);
        this.load();
      },
      error: () => this.busyId.set(null),
    });
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => this.router.navigateByUrl('/admin/login'),
      error: () => this.router.navigateByUrl('/admin/login'),
    });
  }
}
