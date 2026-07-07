import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

type WorkItemStatus = 'queued' | 'active' | 'done';
type WorkItemPriority = 'low' | 'medium' | 'high';

interface WorkItem {
  readonly id: number;
  readonly title: string;
  readonly owner: string;
  readonly status: WorkItemStatus;
  readonly priority: WorkItemPriority;
}

interface WorkItemDraft {
  readonly title: string;
  readonly owner: string;
  readonly priority: WorkItemPriority;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-crud-lab-section',
  imports: [],
  templateUrl: './crud-lab-section.component.html',
  styleUrl: './crud-lab-section.component.scss',
})
export class CrudLabSectionComponent {
  private readonly nextId = signal(104);

  protected readonly query = signal('');
  protected readonly draft = signal<WorkItemDraft>({
    title: 'Add refresh-token rotation',
    owner: 'Backend',
    priority: 'high',
  });

  protected readonly workItems = signal<readonly WorkItem[]>([
    {
      id: 101,
      title: 'Protect recruiter dashboard route',
      owner: 'Frontend',
      status: 'done',
      priority: 'high',
    },
    {
      id: 102,
      title: 'Expose paginated projects endpoint',
      owner: 'API',
      status: 'active',
      priority: 'medium',
    },
    {
      id: 103,
      title: 'Create reading_metrics index',
      owner: 'Database',
      status: 'queued',
      priority: 'medium',
    },
  ]);

  protected readonly filteredItems = computed(() => {
    const query = this.query().trim().toLowerCase();

    if (!query) {
      return this.workItems();
    }

    return this.workItems().filter((item) =>
      [item.title, item.owner, item.status, item.priority]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  });

  protected readonly stats = computed(() => {
    const items = this.workItems();
    return {
      total: items.length,
      active: items.filter((item) => item.status === 'active').length,
      done: items.filter((item) => item.status === 'done').length,
      high: items.filter((item) => item.priority === 'high').length,
    };
  });

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected updateTitle(event: Event): void {
    const title = (event.target as HTMLInputElement).value;
    this.draft.update((draft) => ({ ...draft, title }));
  }

  protected updateOwner(event: Event): void {
    const owner = (event.target as HTMLInputElement).value;
    this.draft.update((draft) => ({ ...draft, owner }));
  }

  protected updatePriority(event: Event): void {
    const priority = (event.target as HTMLSelectElement)
      .value as WorkItemPriority;
    this.draft.update((draft) => ({ ...draft, priority }));
  }

  protected createItem(): void {
    const draft = this.draft();

    if (!draft.title.trim() || !draft.owner.trim()) {
      return;
    }

    const id = this.nextId();
    this.workItems.update((items) => [
      {
        id,
        title: draft.title.trim(),
        owner: draft.owner.trim(),
        priority: draft.priority,
        status: 'queued',
      },
      ...items,
    ]);
    this.nextId.set(id + 1);
    this.draft.set({ title: '', owner: 'API', priority: 'medium' });
  }

  protected cycleStatus(itemId: number): void {
    const nextStatus: Record<WorkItemStatus, WorkItemStatus> = {
      queued: 'active',
      active: 'done',
      done: 'queued',
    };

    this.workItems.update((items) =>
      items.map((item) =>
        item.id === itemId
          ? { ...item, status: nextStatus[item.status] }
          : item,
      ),
    );
  }

  protected deleteItem(itemId: number): void {
    this.workItems.update((items) =>
      items.filter((item) => item.id !== itemId),
    );
  }
}
