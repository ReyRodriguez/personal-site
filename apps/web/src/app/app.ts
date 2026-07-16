import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HackyBackgroundComponent } from './shared/hacky-background/hacky-background.component';
import { SiteFooterComponent } from './shared/site-footer/site-footer.component';
import { TopNavComponent } from './shared/top-nav/top-nav.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    HackyBackgroundComponent,
    TopNavComponent,
    SiteFooterComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = 'Reyderson Rodriguez Portfolio';
}
