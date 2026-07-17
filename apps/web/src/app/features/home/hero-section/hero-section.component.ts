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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LocaleService } from '../../../shared/i18n/locale.service';
import { TECH_ICONS } from '../../../shared/tech-icons';

interface HeroMetric {
  readonly value: string;
  readonly label: string;
}

interface HeroCopy {
  readonly eyebrow: string;
  readonly roleTag: string;
  readonly locationLine: string;
  readonly headline: string;
  readonly summary: string;
  readonly ctaContact: string;
  readonly ctaLinkedin: string;
  readonly stackMain: string;
  readonly stackOther: string;
  readonly metrics: readonly HeroMetric[];
}

interface Tech {
  readonly name: string;
  readonly icon: string;
}

interface TerminalLine {
  readonly id: number;
  readonly text: string;
}

const IDENTITY = {
  name: 'Reyderson Rodriguez',
  email: 'r.reydev@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/reydersonrodriguez/',
} as const;

/** Core stack — Angular-centric frontend plus the Java/Spring + SQL backend. */
const MAIN_STACK: readonly Tech[] = [
  { name: 'Angular', icon: 'angular' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'RxJS', icon: 'rxjs' },
  { name: 'SCSS', icon: 'sass' },
  { name: 'Java', icon: 'java' },
  { name: 'Spring Boot', icon: 'spring' },
  { name: 'PostgreSQL', icon: 'postgresql' },
  { name: 'MySQL', icon: 'mysql' },
];

/** Everything else in the toolbox. */
const OTHER_STACK: readonly Tech[] = [
  { name: 'Node.js', icon: 'nodejs' },
  { name: 'GraphQL', icon: 'graphql' },
  { name: 'Laravel', icon: 'laravel' },
  { name: 'AWS', icon: 'aws' },
  { name: 'Azure', icon: 'azure' },
  { name: 'Docker', icon: 'docker' },
];

const CONTENT: Record<'es' | 'en', HeroCopy> = {
  es: {
    eyebrow: 'SYSTEM_INITIALIZED',
    roleTag: 'Desarrollador Fullstack Senior',
    locationLine: 'Barquisimeto, Venezuela · GMT-4 · Remoto',
    headline:
      'Arquitectura web robusta, interfaces precisas y flujos potenciados por IA.',
    summary:
      'Más de 10 años construyendo aplicaciones web escalables, con alta adaptabilidad entre frontend y backend. Especializado en Angular durante 7 años, con experiencia sólida en Node.js, GraphQL, Laravel y servicios backend para integraciones con IA.',
    ctaContact: 'Iniciar contacto',
    ctaLinkedin: 'Ver LinkedIn',
    stackMain: 'stack principal',
    stackOther: 'otras tecnologías',
    metrics: [
      { value: '+10', label: 'años desarrollando software web' },
      { value: '7', label: 'años especializado en Angular' },
      { value: '25%', label: 'menos espera migrando flujos a GraphQL' },
    ],
  },
  en: {
    eyebrow: 'SYSTEM_INITIALIZED',
    roleTag: 'Senior Fullstack Developer',
    locationLine: 'Barquisimeto, Venezuela · GMT-4 · Remote',
    headline:
      'Robust web architecture, precise interfaces and AI-assisted delivery.',
    summary:
      'Over 10 years building scalable web applications, moving fluidly between frontend and backend. Specialized in Angular for 7 years, with solid experience in Node.js, GraphQL, Laravel and backend services for AI integrations.',
    ctaContact: 'Start a conversation',
    ctaLinkedin: 'View LinkedIn',
    stackMain: 'core stack',
    stackOther: 'other technologies',
    metrics: [
      { value: '+10', label: 'years building web software' },
      { value: '7', label: 'years specialized in Angular' },
      { value: '25%', label: 'less latency after migrating to GraphQL' },
    ],
  },
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-hero-section',
  imports: [],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
})
export class HeroSectionComponent implements AfterViewInit, OnDestroy {
  private readonly ngZone = inject(NgZone);
  private readonly i18n = inject(LocaleService);
  private readonly sanitizer = inject(DomSanitizer);
  private typeTimeoutId: ReturnType<typeof setTimeout> | undefined;
  private lineIndex = 0;
  private charIndex = 0;

  protected readonly identity = IDENTITY;
  protected readonly mainStack = MAIN_STACK;
  protected readonly otherStack = OTHER_STACK;
  protected readonly t = computed(() => CONTENT[this.i18n.locale()]);

  // Pre-trust the bundled glyph markup once so the template can bind it safely.
  private readonly trustedIcons: Readonly<Record<string, SafeHtml>> =
    Object.fromEntries(
      Object.entries(TECH_ICONS).map(([key, svg]) => [
        key,
        this.sanitizer.bypassSecurityTrustHtml(svg),
      ]),
    );

  protected icon(key: string): SafeHtml {
    return this.trustedIcons[key];
  }

  private readonly terminalScript = [
    'boot --profile=reyderson --mode=senior-fullstack',
    'source ~/.zshrc && activate ai_delivery_workflow',
    'whoami',
    'Reyderson Rodriguez :: Senior Fullstack Developer',
    'scan-stack --focus angular,node,graphql,laravel,postgres',
    'jwt-lab status --guards --claims --roles',
    'nx affected --target=build --parallel=3',
    'deploy-preview --core-web-vitals=strict',
    'ready: robust UI + resilient APIs + AI-assisted delivery',
  ];

  // Committed lines carry a stable id so each new line is a fresh DOM node that
  // plays the scroll-in animation — tracking by index would reuse nodes and the
  // animation would stop firing once the buffer is full.
  private lineSeq = 0;
  protected readonly typedLines = signal<readonly TerminalLine[]>([]);
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
    const script = this.terminalScript;
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
        this.typedLines.update((lines) =>
          [...lines, { id: this.lineSeq++, text: currentLine }].slice(-8),
        );
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
