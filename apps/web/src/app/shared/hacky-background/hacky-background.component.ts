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
  char: string;
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly sizeQ: number;
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
  private lastDraw = 0;
  private points: GlyphPoint[] = [];
  private width = 0;
  private height = 0;
  private pointerX = 0;
  private pointerY = 0;
  private targetX = 0;
  private targetY = 0;
  private prevPointerX = 0;
  private prevPointerY = 0;
  private speed = 0;
  private idleFactor = 0;
  private lastMoveAt = 0;
  private lastMutationStep = 0;
  private reducedMotion = false;

  private readonly onPointerMove = (event: PointerEvent): void => {
    this.targetX = event.clientX;
    this.targetY = event.clientY;
    this.lastMoveAt = performance.now();
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
      this.prevPointerX = this.targetX;
      this.prevPointerY = this.targetY;

      this.resize();
      this.draw(0);

      window.addEventListener('pointermove', this.onPointerMove, {
        passive: true,
      });
      window.addEventListener('resize', this.onResize, { passive: true });

      // Fade the field in once it has painted its first frame.
      window.requestAnimationFrame(() =>
        this.canvasRef.nativeElement.classList.add('is-ready'),
      );

      // Defer the continuous animation loop until the main thread is idle so it
      // doesn't compete with hydration and the first paint (keeps TBT/LCP low).
      // A single static frame is already on screen from draw(0) above.
      if (!this.reducedMotion) {
        this.startAnimationWhenIdle();
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

  private startAnimationWhenIdle(): void {
    const start = () => {
      this.animationFrameId = window.requestAnimationFrame((time) =>
        this.animate(time),
      );
    };
    const ric = (
      window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void;
      }
    ).requestIdleCallback;
    if (typeof ric === 'function') {
      ric(start, { timeout: 2500 });
    } else {
      window.setTimeout(start, 1200);
    }
  }

  private animate(time: number): void {
    this.animationFrameId = window.requestAnimationFrame((next) =>
      this.animate(next),
    );

    // Cap to ~30fps: plenty for an ambient backdrop, and it halves main-thread
    // cost (keeps frames short so they don't register as long tasks / TBT).
    if (time - this.lastDraw < 32) {
      return;
    }
    this.lastDraw = time;

    // When the pointer rests, let the focal light drift on its own along a slow
    // Lissajous path so the field never feels frozen (and stays alive on touch
    // devices that never emit pointermove).
    const idle = time - this.lastMoveAt > 1800;
    this.idleFactor += (Number(idle) - this.idleFactor) * (idle ? 0.01 : 0.09);

    const ambientX = this.width * (0.5 + 0.34 * Math.sin(time * 0.00011));
    const ambientY =
      this.height * (0.45 + 0.3 * Math.sin(time * 0.00016 + 1.7));

    const focusX = this.targetX + (ambientX - this.targetX) * this.idleFactor;
    const focusY = this.targetY + (ambientY - this.targetY) * this.idleFactor;

    this.pointerX += (focusX - this.pointerX) * 0.09;
    this.pointerY += (focusY - this.pointerY) * 0.09;

    // Smoothed pointer speed drives how much the spotlight "breathes".
    const vx = this.pointerX - this.prevPointerX;
    const vy = this.pointerY - this.prevPointerY;
    this.speed += (Math.hypot(vx, vy) - this.speed) * 0.12;
    this.prevPointerX = this.pointerX;
    this.prevPointerY = this.pointerY;

    this.draw(time);
  }

  private resize(): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    this.devicePixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
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

        const size = 8.5 + seed * 3.2;
        points.push({
          char: this.glyphs[glyphIndex],
          x: column * gap + jitterX,
          y: row * gap + jitterY,
          size,
          sizeQ: Math.round(size),
          drift: seedB,
          phase: seedC * Math.PI * 2,
        });
      }
    }

    // Group by quantized size so draw() sets `context.font` a handful of times
    // per frame instead of once per glyph (font parsing is the dominant cost).
    points.sort((a, b) => a.sizeQ - b.sizeQ);
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

    const baseSpotlight = this.width < 640 ? 96 : 158;
    // Faster pointer movement gently enlarges the spotlight.
    const spotlightRadius =
      baseSpotlight * (1 + Math.min(this.speed * 0.03, 0.42));
    const magnetRadius = spotlightRadius * 0.72;
    const magnetStrength = this.width < 640 ? 12 : 20;
    const pulse = this.reducedMotion ? 0 : Math.sin(time / 900) * 0.06;

    // Throttle the decode shimmer so it is independent of frame rate.
    const mutate =
      !this.reducedMotion && time - this.lastMutationStep > 55;
    if (mutate) {
      this.lastMutationStep = time;
    }

    // Points are pre-sorted by quantized size; only reassign the font string
    // when the size actually changes (a few times per frame, not ~5000).
    let currentFont = -1;

    for (const point of this.points) {
      const dx = point.x - this.pointerX;
      const dy = point.y - this.pointerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const intensity = Math.max(0, 1 - distance / spotlightRadius);
      const magnetIntensity = Math.max(0, 1 - distance / magnetRadius);

      // Matrix-style decode: glyphs inside the beam occasionally re-roll.
      if (mutate && magnetIntensity > 0.12 && Math.random() < magnetIntensity * 0.22) {
        point.char = this.glyphs[(Math.random() * this.glyphs.length) | 0];
      }

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

      // Quantized size + a stepped boost for glyphs near the beam, so the font
      // string only changes at bucket boundaries.
      const px = point.sizeQ + (magnetIntensity > 0.45 ? 4 : 0);
      if (px !== currentFont) {
        context.font = `${px}px "Geist Mono Variable", SFMono-Regular, Consolas, monospace`;
        currentFont = px;
      }

      if (intensity > 0.58) {
        // Brightest core glyphs bloom with a soft holographic glow.
        context.shadowColor = 'rgba(114, 255, 112, 0.55)';
        context.shadowBlur = 6 + magnetIntensity * 9;
        context.fillStyle = `rgba(114, 255, 112, ${alpha})`;
      } else if (intensity > 0.26) {
        context.shadowColor = 'rgba(0, 241, 254, 0.4)';
        context.shadowBlur = 4 * intensity;
        context.fillStyle = `rgba(0, 241, 254, ${alpha})`;
      } else {
        context.shadowBlur = 0;
        context.fillStyle = `rgba(229, 225, 228, ${baseAlpha})`;
      }

      context.fillText(point.char, drawX, drawY);
    }

    context.shadowBlur = 0;

    // Tri-colour spotlight: cyan core → green mid → faint purple outer halo.
    const gradient = context.createRadialGradient(
      this.pointerX,
      this.pointerY,
      0,
      this.pointerX,
      this.pointerY,
      spotlightRadius * 1.12,
    );
    gradient.addColorStop(0, 'rgba(0, 241, 254, 0.09)');
    gradient.addColorStop(0.4, 'rgba(0, 230, 57, 0.04)');
    gradient.addColorStop(0.72, 'rgba(116, 29, 255, 0.03)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, this.width, this.height);
  }
}
