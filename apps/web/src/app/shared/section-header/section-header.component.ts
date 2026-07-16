import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Canonical section header used by every home section so the eyebrow → index →
 * title → lede rhythm is identical site-wide. Pass an index like "02" and a
 * kicker like "PROJECTS.INDEX"; `lede` is optional.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-section-header',
  imports: [],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss',
})
export class SectionHeaderComponent {
  readonly index = input.required<string>();
  readonly kicker = input.required<string>();
  readonly title = input.required<string>();
  readonly lede = input<string>('');
}
