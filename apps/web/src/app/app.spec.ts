import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render the portfolio hero and section scaffolding', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    // Name is locale-independent.
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Reyderson Rodriguez',
    );

    // Section kickers are code-style labels shared by both locales.
    expect(compiled.textContent).toContain('PROJECTS.INDEX');
    expect(compiled.textContent).toContain('CAPABILITIES');
    expect(compiled.textContent).toContain('SYSTEM.BLUEPRINT');

    // Default (SSR) locale is Spanish.
    expect(compiled.textContent).toContain('Trabajo desplegado');
  });
});
