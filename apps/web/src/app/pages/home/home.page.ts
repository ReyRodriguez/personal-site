import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroSectionComponent } from '../../features/home/hero-section/hero-section.component';
import { ExperienceSectionComponent } from '../../features/home/experience-section/experience-section.component';
import { AiFluxSectionComponent } from '../../features/home/ai-flux-section/ai-flux-section.component';
import { BlogTeaserComponent } from '../../features/home/blog-teaser/blog-teaser.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home-page',
  imports: [
    HeroSectionComponent,
    ExperienceSectionComponent,
    AiFluxSectionComponent,
    BlogTeaserComponent,
  ],
  template: `
    <app-hero-section />
    <app-experience-section />
    <app-ai-flux-section />
    <app-blog-teaser />
  `,
})
export class HomePage {}
