---
name: Synthetic Intelligence Portfolio
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#b9ccb2'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#84967e'
  outline-variant: '#3b4b37'
  surface-tint: '#00e639'
  primary: '#ebffe2'
  on-primary: '#003907'
  primary-container: '#00ff41'
  on-primary-container: '#007117'
  inverse-primary: '#006e16'
  secondary: '#ddfcff'
  on-secondary: '#00363a'
  secondary-container: '#00f1fe'
  on-secondary-container: '#006a70'
  tertiary: '#fdf7ff'
  on-tertiary: '#3c0090'
  tertiary-container: '#e4d6ff'
  on-tertiary-container: '#741dff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#72ff70'
  primary-fixed-dim: '#00e639'
  on-primary-fixed: '#002203'
  on-primary-fixed-variant: '#00530e'
  secondary-fixed: '#74f5ff'
  secondary-fixed-dim: '#00dbe7'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f54'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d1bcff'
  on-tertiary-fixed: '#23005b'
  on-tertiary-fixed-variant: '#5700c9'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 80px
  max-width: 1440px
---

## Brand & Style

This design system embodies a high-tech, sophisticated cyberpunk aesthetic tailored for a senior technical professional. The brand personality balances the "hacker" ethos with corporate-grade precision—shifting away from chaotic neon tropes toward a refined, atmospheric "Deep Tech" visual language.

The style is a hybrid of **Minimalism** and **Refined Glassmorphism**. It utilizes extreme dark modes to create a sense of infinite depth, where content floats on semi-transparent planes. The emotional response should be one of competence, cutting-edge technical proficiency, and high-end craftsmanship. Key visual drivers include ultra-thin lines, deliberate monospaced accents, and "Holographic" light sources that suggest energy rather than just decoration.

## Colors

The palette is rooted in **Absolute Dark** to maximize contrast with vibrant technical accents. 

- **Primary (Matrix Green):** Reserved for success states, terminal prompts, and active code execution indicators.
- **Secondary (Electric Cyan):** Used for primary actions, links, and "Data Flow" visualizations.
- **Tertiary (Deep Purple):** Employed for "Aurora" background glows and secondary depth layers.
- **Neutral/Surface:** The system uses a tiered dark approach. Backgrounds sit at `#030014`, while elevated containers use `#09090b` or semi-transparent white overlays to create the glass effect.

Use **Tech Auroras**—large, low-opacity radial gradients—to break the void of the background. These should be positioned behind main content areas at 5-10% opacity using the Tertiary and Secondary colors.

## Typography

The typography system relies on the intersection of "The Machine" and "The Interface." 

- **Geist** provides the structural, ultra-sharp sans-serif needed for high-legibility body text and massive, impactful headlines. It should be typeset with tight letter-spacing in large formats to feel "engineered."
- **JetBrains Mono** serves as the functional layer. Use this for all "meta" information: timestamps, tags, terminal outputs, and small labels. 

Always render monospaced elements in the Primary or Secondary accent colors to differentiate them from prose. For large headlines, a subtle 1px text-stroke or a faint "glitch" shadow (Cyan offset left, Magenta offset right) can be applied during hover states.

## Layout & Spacing

This design system uses a **Fixed Grid** on desktop and a **Fluid Grid** on mobile. 

- **Desktop:** A 12-column grid with a wide 80px margin to emphasize the "letterboxed" cinematic feel. 
- **Rhythm:** All spacing must be a multiple of 4px. Use generous whitespace between sections (160px+) to maintain the minimalist, premium atmosphere.
- **Alignment:** Content should feel structurally "locked" to the grid. Use 1px vertical and horizontal lines (rules) to occasionally divide sections, mimicking technical blueprints or HUD overlays.

## Elevation & Depth

Depth is achieved through **Glassmorphism** and **Backdrop Blurs** rather than traditional shadows.

- **Surface Layers:** Objects do not cast shadows. Instead, they "glow" or "occlude." Use `backdrop-filter: blur(12px)` on all card surfaces.
- **Holographic Borders:** Surfaces are defined by 1px solid borders (`#ffffff10`). On hover, these borders should transition to a subtle gradient stroke (Cyan to Purple).
- **Z-Axis:** 
  - **Level 0:** Background (`#030014`) with faint radial "aurora" glows.
  - **Level 1:** Content cards with semi-transparent fills.
  - **Level 2:** Modals and tooltips with increased blur (20px) and a slightly brighter border (`#ffffff20`).

## Shapes

To maintain a "Hacky" and "Corporate-grade" precision, the shape language is strictly **Sharp (0px)**. 

Avoid all rounded corners. The sharp 90-degree angles reinforce the digital, grid-based nature of the system. If an element requires a "softer" feel (like a tag or a pill), use a **clipped corner** (45-degree chamfer) rather than a radius. This adds to the futuristic, industrial aesthetic.

## Components

- **Buttons:** Sharp corners. Default state: 1px border with monochromatic text. Hover state: Inverse fill (Primary color) with a "glitch" transition effect (0.1s jitter) and a faint outer glow (`box-shadow: 0 0 15px primary`).
- **Terminal Cards:** Use the glass surface. Include a top bar with three "dots" (technical symbols) and a label in **label-caps**. Text inside should be **code-sm**.
- **Inputs:** Simple bottom-border only (1px). When focused, the border should glow Cyan, and a small "Focus Square" icon should appear in the corner.
- **Holographic Cards:** For featured projects. These should have an "Active" state where a 5% opacity noise texture is visible, and the 1px border pulses slowly between Cyan and Matrix Green.
- **Status Indicators:** Use small glowing pips. A "Live" status should be a Primary Green dot with a concentric "ping" animation.
- **Links:** No underlines. Instead, use a "forward-slash" prefix (e.g., `// View Project`) that changes color on hover.