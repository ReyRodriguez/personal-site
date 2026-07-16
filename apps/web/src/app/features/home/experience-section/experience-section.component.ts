import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocaleService, type Locale } from '../../../shared/i18n/locale.service';
import { RevealDirective } from '../../../shared/reveal/reveal.directive';
import { SectionHeaderComponent } from '../../../shared/section-header/section-header.component';
import experienceData from '../../../../../public/data/experience.json';

type Bi<T = string> = Record<Locale, T>;

interface RawExperience {
  readonly company: string;
  readonly role: Bi;
  readonly type: Bi;
  readonly period: Bi;
  readonly duration: Bi;
  readonly location: Bi;
  readonly tags: Bi<readonly string[]>;
  readonly description: Bi;
  readonly stack: readonly string[];
}

interface ExperienceItem {
  readonly company: string;
  readonly role: string;
  readonly type: string;
  readonly period: string;
  readonly duration: string;
  readonly location: string;
  readonly tags: readonly string[];
  readonly description: string;
  readonly stack: readonly string[];
}

const HEADER = {
  es: {
    title: 'Trayectoria profesional',
    lede: 'Una línea temporal de mi recorrido en desarrollo de software, desde mis inicios hasta roles senior fullstack.',
  },
  en: {
    title: 'Career timeline',
    lede: 'A timeline of my path in software development, from my early roles to senior fullstack work.',
  },
} as const;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-experience-section',
  imports: [CommonModule, SectionHeaderComponent, RevealDirective],
  templateUrl: './experience-section.component.html',
  styleUrl: './experience-section.component.scss',
})
export class ExperienceSectionComponent {
  private readonly i18n = inject(LocaleService);
  private readonly raw = experienceData as readonly RawExperience[];

  protected readonly header = computed(() => HEADER[this.i18n.locale()]);
  protected readonly experiences = computed<readonly ExperienceItem[]>(() => {
    const l = this.i18n.locale();
    return this.raw.map((item) => ({
      company: item.company,
      role: item.role[l],
      type: item.type[l],
      period: item.period[l],
      duration: item.duration[l],
      location: item.location[l],
      tags: item.tags[l],
      description: item.description[l],
      stack: item.stack,
    }));
  });

  protected readonly hoveredIndex = signal<number | null>(null);

  protected setHovered(index: number | null): void {
    this.hoveredIndex.set(index);
  }
}
