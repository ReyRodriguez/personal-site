import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';

/**
 * Fades/slides an element in the first time it scrolls into view. SSR-safe and
 * honours `prefers-reduced-motion` (in which case content shows immediately).
 * Use `[appReveal]` on a container and set `[revealDelay]` (ms) to stagger.
 */
@Directive({
  selector: '[appReveal]',
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  readonly revealDelay = input(0);

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;
  private fallbackId?: ReturnType<typeof setTimeout>;

  ngAfterViewInit(): void {
    const el = this.host.nativeElement;

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      this.renderer.addClass(el, 'is-revealed');
      return;
    }

    this.renderer.addClass(el, 'reveal-init');
    this.renderer.setStyle(el, 'transition-delay', `${this.revealDelay()}ms`);

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.reveal();
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    this.observer.observe(el);

    // Safety net: never leave content stuck invisible if the observer never
    // fires (edge browsers, background tabs, expanded-viewport captures).
    this.fallbackId = setTimeout(() => this.reveal(), 2500);
  }

  private reveal(): void {
    const el = this.host.nativeElement;
    this.renderer.addClass(el, 'is-revealed');
    this.observer?.disconnect();
    if (this.fallbackId) {
      clearTimeout(this.fallbackId);
      this.fallbackId = undefined;
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.fallbackId) {
      clearTimeout(this.fallbackId);
    }
  }
}
