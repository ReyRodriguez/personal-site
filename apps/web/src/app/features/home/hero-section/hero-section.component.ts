import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  NgZone,
  OnDestroy,
  signal,
} from '@angular/core';

interface HeroMetric {
  readonly label: string;
  readonly value: string;
}

interface HeroExperience {
  readonly company: string;
  readonly role: string;
  readonly period: string;
  readonly summary: string;
}

interface HeroProfile {
  readonly name: string;
  readonly role: string;
  readonly location: string;
  readonly timezone: string;
  readonly email: string;
  readonly linkedinUrl: string;
  readonly headline: string;
  readonly summary: string;
  readonly metrics: readonly HeroMetric[];
  readonly stack: readonly string[];
  readonly currentFocus: readonly string[];
  readonly recentExperience: HeroExperience;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-hero-section',
  imports: [],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
})
export class HeroSectionComponent implements AfterViewInit, OnDestroy {
  private readonly ngZone = inject(NgZone);
  private typeTimeoutId: ReturnType<typeof setTimeout> | undefined;
  private lineIndex = 0;
  private charIndex = 0;

  protected readonly profile = signal<HeroProfile>({
    name: 'Reyderson Rodriguez',
    role: 'Fullstack Developer',
    location: 'Barquisimeto, Venezuela',
    timezone: 'GMT-4',
    email: 'r.reydev@gmail.com',
    linkedinUrl: 'https://www.linkedin.com/in/reydersonrodriguez/',
    headline:
      'Arquitectura web robusta, interfaces precisas y flujos potenciados por IA.',
    summary:
      'Más de 10 años construyendo aplicaciones web escalables, con alta adaptabilidad entre Frontend y Backend. Especializado en Angular durante 7 años y con experiencia sólida en Node.js, GraphQL, Laravel y servicios backend para integraciones con IA.',
    metrics: [
      { value: '+10', label: 'años desarrollando software web' },
      { value: '7', label: 'años especializado en Angular' },
      { value: '25%', label: 'menos espera migrando flujos a GraphQL' },
    ],
    stack: [
      'Angular',
      'TypeScript',
      'RxJS',
      'Signals',
      'Node.js',
      'GraphQL',
      'Laravel',
      'PostgreSQL',
      'Spring Boot',
      'AWS',
      'Azure',
      'NgRx',
    ],
    currentFocus: [
      'SPAs modulares con Core Web Vitals altos',
      'APIs limpias para productos escalables',
      'Automatización y delivery asistido por IA',
    ],
    recentExperience: {
      company: 'Fundación Salware',
      role: 'Frontend Developer',
      period: 'Mar 2023 - Actualidad',
      summary:
        'Modernización UX/UI y componentes Angular, coordinada con servicios y APIs backend en Java Spring Boot para integraciones con IA.',
    },
  });

  private readonly terminalScript = computed(() => [
    'boot --profile=reyderson --mode=senior-fullstack',
    'source ~/.zshrc && activate ai_delivery_workflow',
    'whoami',
    `${this.profile().name} :: ${this.profile().role}`,
    'scan-stack --focus angular,node,graphql,laravel,postgres',
    'jwt-lab status --guards --claims --roles',
    'nx affected --target=build --parallel=3',
    'deploy-preview --core-web-vitals=strict',
    'tail -f /var/log/recruiter_signal.log',
    'ready: robust UI + resilient APIs + AI-assisted delivery',
  ]);

  protected readonly typedLines = signal<readonly string[]>([]);
  protected readonly currentTypedLine = signal('');

  ngAfterViewInit(): void {
    this.startTyping();
  }

  ngOnDestroy(): void {
    if (this.typeTimeoutId) {
      clearTimeout(this.typeTimeoutId);
    }
  }

  private startTyping(): void {
    this.ngZone.runOutsideAngular(() => this.typeNextCharacter());
  }

  private typeNextCharacter(): void {
    const script = this.terminalScript();
    const currentLine = script[this.lineIndex];

    if (!currentLine) {
      this.scheduleType(() => this.restartTyping(), 1400);
      return;
    }

    this.charIndex += Math.random() > 0.82 ? 2 : 1;
    const nextValue = currentLine.slice(0, this.charIndex);
    this.ngZone.run(() => this.currentTypedLine.set(nextValue));

    if (this.charIndex >= currentLine.length) {
      this.ngZone.run(() => {
        this.typedLines.update((lines) => [...lines, currentLine].slice(-9));
        this.currentTypedLine.set('');
      });
      this.lineIndex += 1;
      this.charIndex = 0;
      this.scheduleType(
        () => this.typeNextCharacter(),
        120 + Math.random() * 160,
      );
      return;
    }

    this.scheduleType(() => this.typeNextCharacter(), 12 + Math.random() * 24);
  }

  private restartTyping(): void {
    this.lineIndex = 0;
    this.charIndex = 0;
    this.ngZone.run(() => {
      this.typedLines.set([]);
      this.currentTypedLine.set('');
    });
    this.scheduleType(() => this.typeNextCharacter(), 360);
  }

  private scheduleType(callback: () => void, delay: number): void {
    this.typeTimeoutId = setTimeout(callback, delay);
  }
}
