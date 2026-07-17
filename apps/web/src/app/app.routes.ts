import { Route } from '@angular/router';
import { adminAuthGuard } from './shared/auth/admin-auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
    title: 'Reyderson Rodriguez | Fullstack Developer',
  },
  {
    path: 'work',
    loadComponent: () =>
      import('./pages/work/work.page').then((m) => m.WorkPage),
    title: 'Trabajo · Reyderson Rodriguez',
  },
  {
    path: 'frontend',
    loadComponent: () =>
      import('./pages/frontend/frontend.page').then((m) => m.FrontendPage),
    title: 'Frontend · Reyderson Rodriguez',
  },
  {
    path: 'backend',
    loadComponent: () =>
      import('./pages/backend/backend.page').then((m) => m.BackendPage),
    title: 'Backend · Reyderson Rodriguez',
  },
  {
    path: 'blog',
    loadComponent: () =>
      import('./pages/blog/blog.page').then((m) => m.BlogPage),
    title: 'Blog · Reyderson Rodriguez',
  },
  {
    path: 'blog/:slug',
    loadComponent: () =>
      import('./pages/blog/blog-post.page').then((m) => m.BlogPostPage),
    title: 'Blog · Reyderson Rodriguez',
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./pages/admin/admin-login.page').then((m) => m.AdminLoginPage),
    title: 'Admin · Iniciar sesión',
  },
  {
    path: 'admin',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./pages/admin/admin-posts.page').then((m) => m.AdminPostsPage),
    title: 'Admin · Blog',
  },
  {
    path: 'admin/posts/new',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./pages/admin/post-editor.page').then((m) => m.PostEditorPage),
    title: 'Admin · Nueva entrada',
  },
  {
    path: 'admin/posts/:id/edit',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./pages/admin/post-editor.page').then((m) => m.PostEditorPage),
    title: 'Admin · Editar entrada',
  },
  { path: '**', redirectTo: '' },
];
