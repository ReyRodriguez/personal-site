import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface GlyphPoint {
  readonly char: string;
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly drift: number;
  readonly phase: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-hacky-background',
  imports: [],
  templateUrl: './hacky-background.component.html',
  styleUrl: './hacky-background.component.scss',
})
export class HackyBackgroundComponent implements AfterViewInit, OnDestroy {
  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('canvas', { static: true })
  private readonly canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly glyphs = [
    '.',
    ':',
    ';',
    '+',
    '*',
    '>',
    '<',
    '/',
    '_',
    '$',
    '#',
    '{',
    '}',
    '[',
    ']',
    '(',
    ')',
    '=',
    '~',
    '!',
    '?',
    '&',
    '%',
    '0',
    '1',
  ];
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private animationFrameId = 0;
  private devicePixelRatio = 1;
  private points: GlyphPoint[] = [];
  private width = 0;
  private height = 0;
  private pointerX = 0;
  private pointerY = 0;
  private targetX = 0;
  private targetY = 0;
  private reducedMotion = false;

  private readonly onPointerMove = (event: PointerEvent): void => {
    this.targetX = event.clientX;
    this.targetY = event.clientY;
  };

  private readonly onResize = (): void => {
    this.resize();
    this.draw(0);
  };

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      this.targetX = window.innerWidth * 0.64;
      this.targetY = window.innerHeight * 0.36;
      this.pointerX = this.targetX;
      this.pointerY = this.targetY;

      this.resize();
      this.draw(0);

      window.addEventListener('pointermove', this.onPointerMove, {
        passive: true,
      });
      window.addEventListener('resize', this.onResize, { passive: true });

      if (!this.reducedMotion) {
        this.animationFrameId = window.requestAnimationFrame((time) =>
          this.animate(time),
        );
      }
    });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) {
      return;
    }

    window.cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('resize', this.onResize);
  }

  private animate(time: number): void {
    this.pointerX += (this.targetX - this.pointerX) * 0.12;
    this.pointerY += (this.targetY - this.pointerY) * 0.12;
    this.draw(time);
    this.animationFrameId = window.requestAnimationFrame((nextTime) =>
      this.animate(nextTime),
    );
  }

  private resize(): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    this.devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.width = Math.floor(rect.width);
    this.height = Math.floor(rect.height);

    canvas.width = Math.floor(this.width * this.devicePixelRatio);
    canvas.height = Math.floor(this.height * this.devicePixelRatio);

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.setTransform(
      this.devicePixelRatio,
      0,
      0,
      this.devicePixelRatio,
      0,
      0,
    );
    this.points = this.createGlyphGrid();
  }

  private createGlyphGrid(): GlyphPoint[] {
    const gap = this.width < 640 ? 18 : 20;
    const points: GlyphPoint[] = [];
    const columns = Math.ceil(this.width / gap) + 2;
    const rows = Math.ceil(this.height / gap) + 2;

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const seed = this.hash(column * 928371 + row * 689287 + 137);
        const seedB = this.hash(seed * 100000 + column * 31 + row * 17);
        const seedC = this.hash(seedB * 100000 + column * 13 + row * 43);
        const jitterX = (seed - 0.5) * gap * 0.82;
        const jitterY = (seedB - 0.5) * gap * 0.82;
        const glyphIndex =
          Math.floor(seedC * this.glyphs.length) % this.glyphs.length;

        points.push({
          char: this.glyphs[glyphIndex],
          x: column * gap + jitterX,
          y: row * gap + jitterY,
          size: 8.5 + seed * 3.2,
          drift: seedB,
          phase: seedC * Math.PI * 2,
        });
      }
    }

    return points;
  }

  private hash(value: number): number {
    const x = Math.sin(value * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }

  private draw(time: number): void {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    context.clearRect(0, 0, this.width, this.height);
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    const spotlightRadius = this.width < 640 ? 96 : 158;
    const magnetRadius = spotlightRadius * 0.72;
    const magnetStrength = this.width < 640 ? 12 : 20;
    const pulse = this.reducedMotion ? 0 : Math.sin(time / 900) * 0.06;

    for (const point of this.points) {
      const dx = point.x - this.pointerX;
      const dy = point.y - this.pointerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const intensity = Math.max(0, 1 - distance / spotlightRadius);
      const magnetIntensity = Math.max(0, 1 - distance / magnetRadius);
      const safeDistance = Math.max(distance, 0.001);
      const magneticPull = this.reducedMotion
        ? 0
        : magnetIntensity * magnetIntensity * magnetIntensity * magnetStrength;
      const floatOffset = this.reducedMotion
        ? 0
        : Math.sin(time / 700 + point.phase) * 0.65 * point.drift;
      const drawX = point.x - (dx / safeDistance) * magneticPull;
      const drawY = point.y - (dy / safeDistance) * magneticPull - floatOffset;
      const baseAlpha = 0.14 + point.drift * 0.08;
      const alpha = Math.min(0.9, baseAlpha + intensity * (0.62 + pulse));

      context.font = `${point.size + magnetIntensity * 3.6}px "Geist Mono Variable", SFMono-Regular, Consolas, monospace`;

      if (intensity > 0.58) {
        context.fillStyle = `rgba(114, 255, 112, ${alpha})`;
      } else if (intensity > 0.26) {
        context.fillStyle = `rgba(0, 241, 254, ${alpha})`;
      } else {
        context.fillStyle = `rgba(229, 225, 228, ${baseAlpha})`;
      }

      context.fillText(point.char, drawX, drawY);
    }

    const gradient = context.createRadialGradient(
      this.pointerX,
      this.pointerY,
      0,
      this.pointerX,
      this.pointerY,
      spotlightRadius * 1.08,
    );
    gradient.addColorStop(0, 'rgba(0, 241, 254, 0.08)');
    gradient.addColorStop(0.42, 'rgba(0, 230, 57, 0.035)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, this.width, this.height);
  }
}
