import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type {
  BlogPost,
  BlogPostSummary,
  PostInput,
} from '@portfolio/contracts';
import { API } from '../api/api';

/** Authenticated admin CRUD over the blog API (cookie sent by the interceptor). */
@Injectable({ providedIn: 'root' })
export class BlogAdminService {
  private readonly http = inject(HttpClient);

  list(): Observable<BlogPostSummary[]> {
    return this.http.get<BlogPostSummary[]>(API.adminPosts);
  }

  get(id: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(API.adminPost(id));
  }

  create(input: PostInput): Observable<BlogPost> {
    return this.http.post<BlogPost>(API.adminPosts, input);
  }

  update(id: string, input: PostInput): Observable<BlogPost> {
    return this.http.put<BlogPost>(API.adminPost(id), input);
  }

  setPublished(id: string, published: boolean): Observable<BlogPost> {
    return this.http.patch<BlogPost>(API.adminPublish(id), { published });
  }

  remove(id: string): Observable<{ id: string }> {
    return this.http.delete<{ id: string }>(API.adminPost(id));
  }
}
