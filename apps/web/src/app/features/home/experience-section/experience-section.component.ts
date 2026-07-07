import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import experienceData from '../../../../../public/data/experience.json';

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

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-experience-section',
  imports: [CommonModule],
  templateUrl: './experience-section.component.html',
  styleUrl: './experience-section.component.scss',
})
export class ExperienceSectionComponent {
  protected readonly experiences = signal<readonly ExperienceItem[]>(
    experienceData as readonly ExperienceItem[]
  );
  protected readonly hoveredIndex = signal<number | null>(null);

  protected setHovered(index: number | null): void {
    this.hoveredIndex.set(index);
  }
}
