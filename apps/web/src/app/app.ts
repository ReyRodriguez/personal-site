import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AiFluxSectionComponent } from './features/home/ai-flux-section/ai-flux-section.component';
import { AuthLabSectionComponent } from './features/home/auth-lab-section/auth-lab-section.component';
import { CapabilityMatrixSectionComponent } from './features/home/capability-matrix-section/capability-matrix-section.component';
import { CrudLabSectionComponent } from './features/home/crud-lab-section/crud-lab-section.component';
import { HeroSectionComponent } from './features/home/hero-section/hero-section.component';
import { LogsSectionComponent } from './features/home/logs-section/logs-section.component';
import { ProjectsSectionComponent } from './features/home/projects-section/projects-section.component';
import { SystemsBlueprintSectionComponent } from './features/home/systems-blueprint-section/systems-blueprint-section.component';
import { HackyBackgroundComponent } from './shared/hacky-background/hacky-background.component';
import { SiteFooterComponent } from './shared/site-footer/site-footer.component';
import { TopNavComponent } from './shared/top-nav/top-nav.component';

@Component({
  imports: [
    HackyBackgroundComponent,
    TopNavComponent,
    HeroSectionComponent,
    AiFluxSectionComponent,
    ProjectsSectionComponent,
    CapabilityMatrixSectionComponent,
    AuthLabSectionComponent,
    CrudLabSectionComponent,
    SystemsBlueprintSectionComponent,
    LogsSectionComponent,
    SiteFooterComponent,
    RouterModule,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = 'Reyderson Rodriguez Portfolio';
}
