import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Bilingual, LocaleService } from '../../../shared/i18n/locale.service';
import { RevealDirective } from '../../../shared/reveal/reveal.directive';
import { SectionHeaderComponent } from '../../../shared/section-header/section-header.component';

type WorkItemStatus = 'queued' | 'active' | 'done';
type WorkItemPriority = 'low' | 'medium' | 'high';

interface WorkItem {
  readonly id: number;
  readonly title: Bilingual;
  readonly owner: string;
  readonly status: WorkItemStatus;
  readonly priority: WorkItemPriority;
}

interface WorkItemDraft {
  readonly title: string;
  readonly owner: string;
  readonly priority: WorkItemPriority;
}

interface CrudCopy {
  readonly title: string;
  readonly lede: string;
  readonly titleLabel: string;
  readonly titlePlaceholder: string;
  readonly ownerLabel: string;
  readonly ownerPlaceholder: string;
  readonly priorityLabel: string;
  readonly searchPlaceholder: string;
  readonly searchAria: string;
  readonly deleteAria: string;
  readonly emptyState: string;
  readonly draftDefaultTitle: string;
  readonly statTotal: string;
  readonly statActive: string;
  readonly statDone: string;
  readonly statHigh: string;
}

const CONTENT: Record<'es' | 'en', CrudCopy> = {
  es: {
    title: 'Laboratorio CRUD',
    lede: 'Tabla dirigida por signals: crea filas, filtra por texto, cicla el estado y elimina, mientras los totales y métricas derivadas se recalculan solos con OnPush y sin zone.js.',
    titleLabel: 'Título',
    titlePlaceholder: 'Título del work item',
    ownerLabel: 'Responsable',
    ownerPlaceholder: 'API, Frontend, Database',
    priorityLabel: 'Prioridad',
    searchPlaceholder: 'filtrar filas...',
    searchAria: 'Filtrar work items',
    deleteAria: 'Eliminar fila',
    emptyState: 'Ninguna fila coincide con el filtro actual.',
    draftDefaultTitle: 'Añadir rotación de refresh-token',
    statTotal: 'Total',
    statActive: 'Activas',
    statDone: 'Hechas',
    statHigh: 'Altas',
  },
  en: {
    title: 'Operational CRUD Lab',
    lede: 'A signal-driven table: create rows, filter by text, cycle status and delete, while totals and derived metrics recompute on their own under OnPush with no zone.js.',
    titleLabel: 'Title',
    titlePlaceholder: 'Work item title',
    ownerLabel: 'Owner',
    ownerPlaceholder: 'API, Frontend, Database',
    priorityLabel: 'Priority',
    searchPlaceholder: 'filter rows...',
    searchAria: 'Filter work items',
    deleteAria: 'Delete row',
    emptyState: 'No rows match current filter.',
    draftDefaultTitle: 'Add refresh-token rotation',
    statTotal: 'Total',
    statActive: 'Active',
    statDone: 'Done',
    statHigh: 'High',
  },
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-crud-lab-section',
  imports: [SectionHeaderComponent, RevealDirective],
  templateUrl: './crud-lab-section.component.html',
  styleUrl: './crud-lab-section.component.scss',
})
export class CrudLabSectionComponent {
  private readonly i18n = inject(LocaleService);
  private readonly nextId = signal(104);

  protected readonly locale = this.i18n.locale;
  protected readonly t = computed(() => CONTENT[this.i18n.locale()]);

  protected readonly query = signal('');
  protected readonly draft = signal<WorkItemDraft>({
    title: CONTENT[this.i18n.locale()].draftDefaultTitle,
    owner: 'Backend',
    priority: 'high',
  });

  protected readonly workItems = signal<readonly WorkItem[]>([
    {
      id: 101,
      title: {
        es: 'Proteger la ruta del panel de reclutador',
        en: 'Protect recruiter dashboard route',
      },
      owner: 'Frontend',
      status: 'done',
      priority: 'high',
    },
    {
      id: 102,
      title: {
        es: 'Exponer endpoint de proyectos paginado',
        en: 'Expose paginated projects endpoint',
      },
      owner: 'API',
      status: 'active',
      priority: 'medium',
    },
    {
      id: 103,
      title: {
        es: 'Crear índice reading_metrics',
        en: 'Create reading_metrics index',
      },
      owner: 'Database',
      status: 'queued',
      priority: 'medium',
    },
  ]);

  protected readonly filteredItems = computed(() => {
    const query = this.query().trim().toLowerCase();
    const locale = this.locale();

    if (!query) {
      return this.workItems();
    }

    return this.workItems().filter((item) =>
      [item.title[locale], item.owner, item.status, item.priority]
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
    const title = draft.title.trim();
    this.workItems.update((items) => [
      {
        id,
        title: { es: title, en: title },
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
