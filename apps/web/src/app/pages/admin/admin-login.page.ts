import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocaleService } from '../../shared/i18n/locale.service';
import { AuthStore } from '../../shared/auth/auth.store';

const CONTENT = {
  es: {
    kicker: 'ADMIN.AUTH',
    title: 'Panel del blog',
    lede: 'Inicia sesión para escribir y publicar entradas.',
    email: 'Correo',
    password: 'Contraseña',
    submit: 'Entrar',
    submitting: 'Verificando…',
    invalid: 'Credenciales inválidas.',
    required: 'Completa ambos campos.',
  },
  en: {
    kicker: 'ADMIN.AUTH',
    title: 'Blog panel',
    lede: 'Sign in to write and publish posts.',
    email: 'Email',
    password: 'Password',
    submit: 'Sign in',
    submitting: 'Checking…',
    invalid: 'Invalid credentials.',
    required: 'Fill in both fields.',
  },
} as const;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-login.page.html',
  styleUrl: './admin.scss',
})
export class AdminLoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly i18n = inject(LocaleService);

  protected readonly t = computed(() => CONTENT[this.i18n.locale()]);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set(this.t().required);
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => this.router.navigateByUrl('/admin'),
      error: () => {
        this.error.set(this.t().invalid);
        this.submitting.set(false);
      },
    });
  }
}
