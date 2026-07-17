import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import type { AuthUser } from '@portfolio/contracts';
import { API } from '../api/api';

/** Frontend admin-session state. The JWT lives in an httpOnly cookie; this only
 * tracks whether we have a valid session for routing/UI. */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly http = inject(HttpClient);

  private readonly _user = signal<AuthUser | null>(null);
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  login(email: string, password: string): Observable<AuthUser> {
    return this.http
      .post<AuthUser>(API.login, { email, password })
      .pipe(tap((user) => this._user.set(user)));
  }

  logout(): Observable<{ ok: true }> {
    return this.http
      .post<{ ok: true }>(API.logout, {})
      .pipe(tap(() => this._user.set(null)));
  }

  /** Verify the cookie by hitting /auth/me. Populates the store on success. */
  me(): Observable<AuthUser> {
    return this.http
      .get<AuthUser>(API.me)
      .pipe(tap((user) => this._user.set(user)));
  }
}
