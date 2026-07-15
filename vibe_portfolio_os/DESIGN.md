---
name: VIBE Portfolio OS
colors:
  surface: '#101411'
  surface-dim: '#101411'
  surface-bright: '#363a37'
  surface-container-lowest: '#0b0f0c'
  surface-container-low: '#191d19'
  surface-container: '#1d211d'
  surface-container-high: '#272b28'
  surface-container-highest: '#323632'
  on-surface: '#e0e3de'
  on-surface-variant: '#bec9c3'
  inverse-surface: '#e0e3de'
  inverse-on-surface: '#2d312e'
  outline: '#88938d'
  outline-variant: '#3f4944'
  surface-tint: '#84d6b9'
  primary: '#84d6b9'
  on-primary: '#00382a'
  primary-container: '#0f6e56'
  on-primary-container: '#9aedcf'
  inverse-primary: '#086b53'
  secondary: '#6cdab9'
  on-secondary: '#00382b'
  secondary-container: '#2ca284'
  on-secondary-container: '#003025'
  tertiary: '#ffb4a8'
  on-tertiary: '#581d15'
  tertiary-container: '#954c41'
  on-tertiary-container: '#ffd3cc'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#a0f3d4'
  primary-fixed-dim: '#84d6b9'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#00513e'
  secondary-fixed: '#89f6d4'
  secondary-fixed-dim: '#6cdab9'
  on-secondary-fixed: '#002018'
  on-secondary-fixed-variant: '#005140'
  tertiary-fixed: '#ffdad4'
  tertiary-fixed-dim: '#ffb4a8'
  on-tertiary-fixed: '#3b0804'
  on-tertiary-fixed-variant: '#743329'
  background: '#101411'
  on-background: '#e0e3de'
  surface-variant: '#323632'
  bg-light: '#f3f1ec'
  bg-dark: '#0d1110'
  accent-warm: '#c48c3c'
  accent-warm-dark: '#785a28'
  text-muted-light: '#5a635c'
  text-muted-dark: '#9aa59e'
typography:
  hero-display:
    fontFamily: Syne
    fontSize: 6.4rem
    fontWeight: '800'
    lineHeight: '0.95'
    letterSpacing: -0.03em
  hero-display-mobile:
    fontFamily: Syne
    fontSize: 3.2rem
    fontWeight: '800'
    lineHeight: '1.0'
    letterSpacing: -0.02em
  section-title:
    fontFamily: Syne
    fontSize: 2.75rem
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  project-title:
    fontFamily: Syne
    fontSize: 1.35rem
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 1.2rem
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.65'
    letterSpacing: '0'
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 0.85rem
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.12em
  nav-link:
    fontFamily: Hanken Grotesk
    fontSize: 0.92rem
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1100px
  header-h: 72px
  section-v-padding: clamp(3.5rem, 8vh, 5.5rem)
  gutter-grid: 1.5rem
  margin-page: 1.25rem
---

## Brand & Style

The brand identity is **Technical Sophistication meets Atmospheric Minimalism**. It bridges the gap between raw code and high-end design, targeting recruiters and collaborators who value both logic and aesthetics. The system is inspired by the "Prompt Blueprint" philosophy: every element must have a functional purpose and a structured place within the hierarchy.

The design style is a blend of **Glassmorphism** and **Corporate Modern**. It utilizes translucent layers, backdrop blurs, and "glow" effects to create a sense of depth and digital "atmosphere." This is balanced by a rigid grid system and sharp typography to ensure the information remains authoritative and professional. The emotional response should be one of "effortless precision."

**Key Principles:**
- **Structured Logic:** Layouts should feel engineered, not just decorated.
- **Atmospheric Depth:** Use gradients and blurs to create a 3D space for 2D content.
- **Micro-choreography:** Motion should be staggered and purposeful, reflecting a systematic loading of data.

## Colors

The system uses a **Dual-Surface Palette** designed for seamless transitioning between Light and Dark modes.

- **Primary & Secondary:** The "Vibe Green" (`#0f6e56`) serves as the core brand anchor in Light mode, while its vibrant counterpart (`#5dcbab`) provides high-legibility highlights in Dark mode.
- **Atmosphere:** The background is never a flat color. It uses a base surface (`--bg`) overlaid with radial "glows" that mix the primary green with a warm amber accent (`#c48c3c`).
- **Contrast Strategy:** High contrast for headings (near-black or near-white) and a strictly controlled muted tier for secondary metadata to ensure a clear information hierarchy.
- **Interactive States:** Use `color-mix` with `srgb` to create hover states that feel like light illuminating a surface, rather than simple color shifts.

## Typography

The typography system pairs the avant-garde **Syne** for high-impact display moments with the precise, tech-oriented **Hanken Grotesk** (serving as the international equivalent to Pretendard's clean sans-serif profile) for functional content.

- **Syne (Display):** Used for branding, section titles, and project names. It should always be set with tight line-spacing and negative letter-spacing for a "custom-designed" feel.
- **Hanken Grotesk (Body/UI):** Used for all readability-focused content. It provides the "professional" grounding for the expressive Syne.
- **Micro-typography:** Labels and tags use increased letter-spacing and uppercase styling to denote their status as metadata, echoing the "Blueprint" categorization style.

## Layout & Spacing

The layout is governed by a **Fluid Container Model**. It prioritizes generous vertical breathing room to allow the "atmosphere" to be visible between content blocks.

- **Grid Strategy:** A 12-column fluid grid system is used for desktop. Project cards span 6 columns (2-col layout) or 12 columns depending on importance. Tech stacks use a repeating `auto-fill` grid with a minimum width of `160px`.
- **Responsive Scaling:** Use `clamp()` for all significant spacing and font sizes to ensure the UI feels tailored on every device from 320px to 2560px.
- **Breakpoints:**
    - **Mobile to Tablet (720px):** Transition from a single-column project list to a multi-column layout. Header navigation switches from a mobile drawer to a horizontal list.
    - **Tablet to Desktop (960px):** Increase grid density and scale up display typography.

## Elevation & Depth

Hierarchy is established through **Tonal Layering and Glassmorphism** rather than traditional drop shadows.

- **Background Atmosphere:** A base layer containing slow-moving radial gradients (`--hero-glow`) and a subtle, animated grid line pattern (`--grid-line`).
- **Elevated Surfaces:** Navigation bars and cards use a semi-transparent background (`rgba`) with a `14px` backdrop blur. This creates a "frosted glass" effect where the background colors bleed through.
- **Shadows:** Use extremely soft, high-spread ambient shadows (`0 18px 40px`) with low opacity (6% in light mode, 35% in dark mode) to lift cards off the atmospheric background.
- **Interactive Elevation:** On hover, cards should increase their border opacity and slightly shift their background tint, simulating a "hovering" light source.

## Shapes

The shape language is defined by **Soft Geometric Radii**.

- **Primary Cards:** Use `18px` (`rounded-lg`) to create a modern, approachable container for projects.
- **Interactive Elements:** Buttons and tags utilize a **Pill-shape** (`999px`) to distinguish them from structural containers.
- **Borders:** Borders are kept thin (`1px`) and use `color-mix` to remain subtle. They act as "light-catchers" on the edges of the glassmorphic cards.

## Components

### Buttons & Interactors
- **Primary CTA:** Solid accent color with high-contrast text. Pill-shaped.
- **Ghost Button:** `1px` border using `--line` tokens. Transitions to a soft accent background on hover.
- **Theme Toggle:** Circular button with SVG icons that rotate and scale during the transition.

### Project Cards
- **Structure:** Split layout. The `aside` contains metadata (Year, Role) using `label-caps` typography, while the `body` contains the `project-title` and summary.
- **Interactive:** The entire card should have a subtle `translateY(-4px)` lift on hover combined with a border-color shift.

### Tech Stack Badges
- **Style:** Small pill-shaped tags using `--accent-soft` background. They should be arranged in a fluid wrap-grid.
- **Logic:** Grouped by category (e.g., "AI/Vibe", "Frontend", "Tools") to reflect the logical structure of the developer's expertise.

### Information Architecture (Blueprint Style)
- **Metadata Lists:** Use Definition Lists (`dl`, `dt`, `dd`) for project details (Role, Contribution) to reinforce the structured, "Blueprint" look. Labels should be muted; values should be bold.

### Motion Logic
- **Entrance:** Use a staggered reveal for all list items. Apply a `60ms` incremental delay per item to create a choreographed "loading" effect as the user scrolls.