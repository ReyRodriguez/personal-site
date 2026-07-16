import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProjectsSectionComponent } from '../../features/home/projects-section/projects-section.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-work-page',
  imports: [ProjectsSectionComponent],
  template: `<app-projects-section />`,
})
export class WorkPage {}
