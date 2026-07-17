import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { marked } from 'marked';

/**
 * Renders Markdown to HTML and binds it via [innerHTML], which runs Angular's
 * built-in DomSanitizer automatically — on both the browser and the server (no
 * jsdom, no extra dependency). Scripts, event handlers and unsafe URLs are
 * stripped; standard prose/formatting tags are preserved. Uses
 * ViewEncapsulation.None so `.md-body` styles reach the injected nodes.
 */
@Component({
  selector: 'app-markdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<div class="md-body" [innerHTML]="html()"></div>`,
  styleUrl: './markdown.component.scss',
})
export class MarkdownComponent {
  readonly source = input.required<string>();

  protected readonly html = computed<string>(() =>
    marked.parse(this.source() ?? '', { async: false }),
  );
}
