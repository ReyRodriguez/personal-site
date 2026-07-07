import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

interface LoginDraft {
  readonly email: string;
  readonly password: string;
}

interface JwtClaims {
  readonly sub: string;
  readonly name: string;
  readonly role: string;
  readonly scope: readonly string[];
  readonly iat: number;
  readonly exp: number;
}

interface AuthSession {
  readonly accessToken: string;
  readonly claims: JwtClaims;
}

interface GuardCheck {
  readonly label: string;
  readonly passed: boolean;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-auth-lab-section',
  imports: [],
  templateUrl: './auth-lab-section.component.html',
  styleUrl: './auth-lab-section.component.scss',
})
export class AuthLabSectionComponent {
  protected readonly draft = signal<LoginDraft>({
    email: 'recruiter@portfolio.dev',
    password: 'Portfolio2026!',
  });

  protected readonly session = signal<AuthSession | null>(null);
  protected readonly authError = signal('');

  protected readonly isAuthenticated = computed(() => this.session() !== null);

  protected readonly decodedClaims = computed(() => {
    const session = this.session();
    return session ? JSON.stringify(session.claims, null, 2) : '{}';
  });

  protected readonly visibleToken = computed(() => {
    const token = this.session()?.accessToken;

    if (!token) {
      return 'Bearer <pending.jwt.token>';
    }

    const [header, payload, signature] = token.split('.');
    return `Bearer ${header}.${payload.slice(0, 28)}...${signature.slice(-18)}`;
  });

  protected readonly guardChecks = computed<readonly GuardCheck[]>(() => {
    const claims = this.session()?.claims;
    const now = Math.floor(Date.now() / 1000);

    return [
      { label: 'Authorization header', passed: this.session() !== null },
      { label: 'JWT exp valid', passed: claims ? claims.exp > now : false },
      { label: 'role: recruiter', passed: claims?.role === 'recruiter' },
      {
        label: 'scope: projects:read',
        passed: claims?.scope.includes('projects:read') ?? false,
      },
    ];
  });

  protected readonly apiTrace = computed(() => {
    const status = this.session() ? '200 OK' : '401 READY';

    return [
      'POST /api/auth/login',
      `status=${status}`,
      'strategy=JwtStrategy + BCryptPasswordVerifier',
      'guard=JwtAuthGuard -> RolesGuard',
      'repository=UserRepository.findByEmail',
    ];
  });

  protected updateEmail(event: Event): void {
    const email = (event.target as HTMLInputElement).value;
    this.draft.update((draft) => ({ ...draft, email }));
  }

  protected updatePassword(event: Event): void {
    const password = (event.target as HTMLInputElement).value;
    this.draft.update((draft) => ({ ...draft, password }));
  }

  protected login(): void {
    const draft = this.draft();

    if (
      draft.email !== 'recruiter@portfolio.dev' ||
      draft.password !== 'Portfolio2026!'
    ) {
      this.session.set(null);
      this.authError.set('Credenciales rechazadas por la estrategia local.');
      return;
    }

    const issuedAt = Math.floor(Date.now() / 1000);
    const claims: JwtClaims = {
      sub: 'portfolio-recruiter-demo',
      name: 'Recruiter Preview',
      role: 'recruiter',
      scope: ['projects:read', 'profile:read', 'jwt:inspect'],
      iat: issuedAt,
      exp: issuedAt + 60 * 15,
    };

    this.session.set({
      accessToken: this.createDemoJwt(claims),
      claims,
    });
    this.authError.set('');
  }

  protected logout(): void {
    this.session.set(null);
    this.authError.set('');
  }

  private createDemoJwt(claims: JwtClaims): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    // Demo-only signature: the production API must sign this server-side.
    const signatureInput = `${claims.sub}.${claims.iat}.portfolio-demo-secret`;

    return [
      this.base64UrlEncode(header),
      this.base64UrlEncode(claims),
      this.base64UrlEncode(signatureInput),
    ].join('.');
  }

  private base64UrlEncode(value: unknown): string {
    const source = typeof value === 'string' ? value : JSON.stringify(value);
    const bytes = new TextEncoder().encode(source);
    const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join(
      '',
    );

    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
