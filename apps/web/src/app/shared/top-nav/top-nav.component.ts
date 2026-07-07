import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface NavItem {
  readonly id: string;
  readonly label: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-top-nav',
  imports: [],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss',
})
export class TopNavComponent {
  protected readonly activeSection = signal('root');

  protected readonly navItems: readonly NavItem[] = [
    { id: 'root', label: '_root' },
    { id: 'projects', label: '_projects' },
    { id: 'labs', label: '_labs' },
    { id: 'auth', label: '_auth_lab' },
    { id: 'crud', label: '_crud' },
    { id: 'systems', label: '_systems' },
    { id: 'stack', label: '_stack' },
    { id: 'logs', label: '_logs' },
  ];

  protected activate(sectionId: string): void {
    this.activeSection.set(sectionId);
  }
}
