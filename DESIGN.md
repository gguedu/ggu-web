---
version: 1.0
name: GGU-Design-System
description: 'A dark-canvas institutional web system for Galaxy Global University (GGU), built on a pure-black ground (#000000) with translucent surface elevation and a single cool-blue accent (#3b82f6 / blue-500). Display type uses LXGW WenKai for brand headlines and vivo Sans for all other text; weight hierarchy is 300/500/700 with tight 1.2–1.3 line-heights on display and relaxed 1.6–1.8 on body. Cards are charcoal surfaces with 1px translucent white borders; the signature device is radial-gradient light orbs that provide ambient depth without explicit shadows. The system reads as academic, calm, and intentionally monochrome — the blue accent appears only on interactive and mail-module elements.'

colors:
  primary: '#000000'
  on-primary: '#ffffff'
  accent-blue: '#3b82f6'
  accent-blue-light: '#93c5fd'
  accent-blue-dark: '#2563eb'
  ink: '#ffffff'
  ink-muted: '#9ca3af'
  ink-subtle: '#6b7280'
  ink-faint: '#4b5563'
  canvas: '#000000'
  surface-1: '#11161c'
  surface-2: '#0b1118'
  surface-3: '#070b10'
  surface-mail: '#1c1c1e'
  surface-mail-hover: '#2c2c2e'
  surface-mail-input: '#141414'
  hairline: 'rgba(255,255,255,0.10)'
  hairline-soft: 'rgba(255,255,255,0.06)'
  hairline-strong: 'rgba(255,255,255,0.15)'
  inverse-canvas: '#ffffff'
  inverse-ink: '#000000'
  semantic-success: '#00dc82'
  semantic-warning: '#f59e0b'
  semantic-error: '#ef4444'
  link: '#93c5fd'
  link-hover: '#ffffff'

typography:
  display-hero:
    fontFamily: 'LXGW WenKai, vivo Sans, sans-serif'
    fontSize: 80px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: 0.1em
  display-lg:
    fontFamily: 'LXGW WenKai, vivo Sans, sans-serif'
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: 0.08em
  display-md:
    fontFamily: 'vivo Sans, sans-serif'
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.1em
  headline:
    fontFamily: 'vivo Sans, sans-serif'
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0
  card-title:
    fontFamily: 'vivo Sans, sans-serif'
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  body-lg:
    fontFamily: 'vivo Sans, sans-serif'
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body:
    fontFamily: 'vivo Sans, sans-serif'
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: 0
  body-sm:
    fontFamily: 'vivo Sans, sans-serif'
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: 0
  caption:
    fontFamily: 'vivo Sans, sans-serif'
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.04em
  eyebrow:
    fontFamily: 'vivo Sans, sans-serif'
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.4em
  label:
    fontFamily: 'vivo Sans, sans-serif'
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.18em
  button:
    fontFamily: 'vivo Sans, sans-serif'
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0.1em

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 24px
  pill: 9999px
  full: 9999px

spacing:
  hair: 1px
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

elevation:
  orb-white: 'radial-gradient(circle, rgba(255,255,255,0.12), rgba(0,0,0,0))'
  orb-blue: 'radial-gradient(circle, rgba(0,148,255,0.18), rgba(0,0,0,0))'
  orb-fade: 'radial-gradient(circle, rgba(0,0,0,0), rgba(0,0,0,0.85))'
  card-shadow: '0 18px 36px rgba(0,0,0,0.35)'
  deep-shadow: '0 18px 40px rgba(0,0,0,0.4)'
  nav-shadow: '0 8px 40px rgba(0,0,0,0.4)'
  hero-text-shadow: '0 4px 50px rgba(255,255,255,0.15)'
  button-glow: '0 10px 30px rgba(255,255,255,0.2)'

transition:
  default: 'duration-300 ease-out'
  smooth: 'duration-500 cubic-bezier(0.25,1,0.5,1)'
  micro: 'duration-160 ease'
  hover-lift: 'translateY(-4px) scale(1.05)'

components:
  button-primary:
    backgroundColor: '{colors.inverse-canvas}'
    textColor: '{colors.inverse-ink}'
    typography: '{typography.button}'
    rounded: '{rounded.md}'
    padding: 14px 40px
    border: 1px solid {colors.inverse-canvas}
    hover:
      backgroundColor: '#e5e7eb'
      transform: '{transition.hover-lift}'
      shadow: '{elevation.button-glow}'
  button-secondary:
    backgroundColor: transparent
    textColor: '{colors.ink}'
    typography: '{typography.button}'
    rounded: '{rounded.md}'
    padding: 14px 40px
    border: 1px solid {colors.ink}
    hover:
      backgroundColor: 'rgba(255,255,255,0.1)'
      transform: '{transition.hover-lift}'
  button-mail-primary:
    backgroundColor: '{colors.accent-blue}'
    textColor: '{colors.ink}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.md}'
    padding: 8px 16px
    hover:
      backgroundColor: '{colors.accent-blue-dark}'
  button-mail-secondary:
    backgroundColor: '{colors.surface-mail-hover}'
    textColor: '{colors.ink}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.md}'
    padding: 8px 16px
    hover:
      backgroundColor: '#3a3a3d'
  card-post:
    backgroundColor: 'rgba(17,22,28,0.9)'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.xxl}'
    padding: 24px
    border: 1px solid {colors.hairline}
    shadow: '{elevation.card-shadow}'
    backdropBlur: true
  card-mail:
    backgroundColor: '{colors.surface-mail}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.xl}'
    padding: 16px
    border: 1px solid "#333"
  card-content:
    backgroundColor: 'rgba(255,255,255,0.05)'
    textColor: '{colors.ink-muted}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.xxl}'
    padding: 40px 24px
    border: 1px solid {colors.hairline}
    backdropBlur: true
  card-error:
    backgroundColor: 'rgba(239,68,68,0.1)'
    textColor: '#fca5a5'
    typography: '{typography.body-sm}'
    rounded: '{rounded.xxl}'
    padding: 40px 24px
    border: 1px solid "rgba(239,68,68,0.3)"
  text-input:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.md}'
    padding: 12px 16px
    border: 1px solid "#4b5563"
    focus:
      borderColor: '{colors.ink}'
  text-input-mail:
    backgroundColor: '{colors.surface-mail-input}'
    textColor: '{colors.ink}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.md}'
    padding: 8px 12px
    border: 1px solid "#333"
  pill-badge:
    backgroundColor: 'rgba(255,255,255,0.05)'
    textColor: '{colors.ink-muted}'
    typography: '{typography.caption}'
    rounded: '{rounded.pill}'
    padding: 4px 12px
    border: 1px solid {colors.hairline}
  pill-active:
    backgroundColor: 'rgba(255,255,255,0.18)'
    textColor: '{colors.ink}'
    typography: '{typography.caption}'
    rounded: '{rounded.pill}'
  top-nav:
    backgroundColor: 'rgba(0,0,0,0.6)'
    textColor: '{colors.ink-muted}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.pill}'
    padding: 8px 12px
    border: 1px solid {colors.hairline-soft}
    backdropBlur: 2xl
    shadow: '{elevation.nav-shadow}'
  sidebar:
    backgroundColor: 'rgba(0,0,0,0.4)'
    textColor: '{colors.ink-muted}'
    typography: '{typography.body-sm}'
    width: 256px
    borderRight: 1px solid {colors.hairline}
    backdropBlur: md
  sidebar-item-active:
    backgroundColor: 'rgba(59,130,246,0.2)'
    textColor: '#60a5fa'
    typography: '{typography.body-sm}'
    rounded: '{rounded.lg}'
    padding: 10px 12px
    fontWeight: 500
  sidebar-item:
    backgroundColor: transparent
    textColor: '{colors.ink-muted}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.lg}'
    padding: 10px 12px
    hover:
      backgroundColor: '{colors.surface-mail-hover}'
      textColor: '#e5e7eb'
  footer:
    backgroundColor: 'rgba(0,0,0,0.8)'
    textColor: '{colors.ink-faint}'
    typography: '{typography.caption}'
    padding: 32px 24px
    borderTop: 1px solid "#111827"
---

## Overview

GGU's web system is a pure-black canvas that serves both a public-facing institutional site and an internal mail application. The dominant surface is `{colors.canvas}` (pure black) layered with charcoal `{colors.surface-1}` cards and 1px translucent white hairlines. Depth is provided by **radial-gradient light orbs** — soft white and blue glows positioned at page corners — rather than by drop shadows. The only chromatic accent is `{colors.accent-blue}` (blue-500), reserved for interactive elements in the mail module and hyperlink emphasis.

Display type uses **LXGW WenKai** (a literary Chinese typeface) for brand headlines on the homepage and application page; all other text runs in **vivo Sans**. Weight hierarchy is 300 / 500 / 700 — body defaults to 400 with relaxed 1.8 line-height, while display runs at 600–700 with tight 1.1–1.3 line-height. The contrast between the literary display face and the technical body face is the brand's voice: academic depth meeting institutional clarity.

The signature device is the **ambient light orb** — soft radial gradients at `rgba(255,255,255,0.12)` (white) and `rgba(0,148,255,0.18)` (blue) placed at corners of every major page. These aren't functional illumination — they're atmospheric, giving the dark canvas a sense of dimensional depth without any explicit shadow system.

**Key Characteristics:**

- Black-canvas institutional system: `{colors.canvas}` is the surface for hero, body, posts, mail, and footer alike.
- **Single cool-blue accent**: `{colors.accent-blue}` appears only on interactive mail elements and link highlights. The public-facing surface is monochrome (white + gray on black).
- **Literary + technical type pairing**: LXGW WenKai for brand headlines; vivo Sans for everything else. The pairing reads as cultured, not corporate.
- Cards lift via **translucent surface elevation** (canvas → surface-1 → surface-2) combined with subtle `{elevation.card-shadow}`. No heavy drop shadows.
- 1px translucent white hairlines (`{colors.hairline}` = `rgba(255,255,255,0.1)`) define cards and dividers — borders are felt more than seen.
- **Ambient light orbs** on every page provide depth without literal lighting. They are always `pointer-events-none` and `absolute`-positioned.
- Eyebrow typography (12px, 500 weight, 0.4em positive tracking, uppercase) marks every section as a category label.
- Pill-shaped badges (`{components.pill-badge}`) and the floating pill navigation (`{components.top-nav}`) give the system a soft, approachable geometry.

## Colors

### Brand & Accent

- **Black** ({colors.primary}): The system primary surface. Canvas, footer, sidebar, login — all black.
- **White** ({colors.on-primary}): Inverse text on black; canvas of `{components.button-primary}`.
- **Accent Blue** ({colors.accent-blue}): Interactive elements in the mail module — sidebar active state, compose button, primary mail actions.
- **Accent Blue Light** ({colors.accent-blue-light}): Hyperlinks in prose content and post body text.
- **Accent Blue Dark** ({colors.accent-blue-dark}): Hover state for mail primary buttons.

### Surface

- **Canvas** ({colors.canvas}): Default page background. Pure black.
- **Surface 1** ({colors.surface-1}): Charcoal one step above canvas — post cards, code block headers, app.config card surfaces.
- **Surface 2** ({colors.surface-2}): Slightly lighter charcoal — callout backgrounds, table containers, accordion roots.
- **Surface 3** ({colors.surface-3}): Deepest charcoal — pre/code block backgrounds, code collapse footer gradients.
- **Surface Mail** ({colors.surface-mail}): Mail-module card background — a neutral dark gray distinct from the blue-tinted public surfaces.
- **Surface Mail Hover** ({colors.surface-mail-hover}): Hover state for mail buttons and sidebar items.
- **Surface Mail Input** ({colors.surface-mail-input}): Form input background in mail settings.
- **Hairline** ({colors.hairline}): 1px borders on cards, dividers, and nav outline — `rgba(255,255,255,0.1)`.
- **Hairline Soft** ({colors.hairline-soft}): Subtler borders — nav outline uses `0.08` opacity.
- **Hairline Strong** ({colors.hairline-strong}): Emphasized borders — pagination buttons use `0.15` opacity.
- **Inverse Canvas** ({colors.inverse-canvas}): Pure white — used as the surface of `{components.button-primary}` only.

### Text

- **Ink** ({colors.ink}): All headline and emphasized body type — pure white.
- **Ink Muted** ({colors.ink-muted}): Secondary type at #9ca3af (gray-400) — description text, metadata, sidebar items.
- **Ink Subtle** ({colors.ink-subtle}): Tertiary type at #6b7280 (gray-500) — timestamps, helper text, footnotes.
- **Ink Faint** ({colors.ink-faint}): Quaternary type at #4b5563 (gray-600) — footer links, least-emphasized labels.

### Semantic

- **Success** ({colors.semantic-success}): Positive states — reuse of the Nuxt green primary.
- **Warning** ({colors.semantic-warning}): Warning states.
- **Error** ({colors.semantic-error}): Error states — form validation, danger zones, delete buttons.
- **Link** ({colors.link}): Inline hyperlinks in prose — `#93c5fd` (blue-300).
- **Link Hover** ({colors.link-hover}): Hovered inline links — pure white.

## Typography

### Font Families

- **LXGW WenKai** — A literary Chinese typeface used exclusively for brand headlines on the homepage (`星河环球大学`) and the application page (`线上申请`, `欢迎申请星河环球大学`). It carries the institution's cultural identity. Applied via `.font-custom` class.
- **vivo Sans** — The default body typeface for all other text. A clean geometric sans-serif. Fallback stack: `vivo Sans, sans-serif`.

The pairing is intentional: LXGW WenKai for moments of institutional identity (hero headlines, page titles), vivo Sans for everything else. The contrast between a literary face and a technical face IS the brand voice.

### Hierarchy

| Token                       | Size | Weight | Line Height | Letter Spacing | Use                                           |
| --------------------------- | ---- | ------ | ----------- | -------------- | --------------------------------------------- |
| `{typography.display-hero}` | 80px | 700    | 1.1         | 0.1em          | Homepage hero headline (星河环球大学)         |
| `{typography.display-lg}`   | 48px | 600    | 1.15        | 0.08em         | Mail login headline (星河邮箱)                |
| `{typography.display-md}`   | 36px | 600    | 1.2         | 0.1em          | Page section headlines (星河文库)             |
| `{typography.headline}`     | 24px | 600    | 1.25        | 0              | Mail compose heading, post detail title       |
| `{typography.card-title}`   | 20px | 600    | 1.3         | 0              | Post card titles, mail sidebar heading        |
| `{typography.body-lg}`      | 18px | 400    | 1.6         | 0              | Login description, lead paragraphs            |
| `{typography.body}`         | 16px | 400    | 1.8         | 0              | Default body, post content                    |
| `{typography.body-sm}`      | 14px | 400    | 1.7         | 0              | Card body, mail items, sidebar labels         |
| `{typography.caption}`      | 12px | 500    | 1.4         | 0.04em         | Metadata, footer text                         |
| `{typography.eyebrow}`      | 12px | 500    | 1.3         | 0.4em          | Uppercase section eyebrows (GGU Post Archive) |
| `{typography.label}`        | 12px | 500    | 1.3         | 0.18em         | Form labels, login field labels               |
| `{typography.button}`       | 14px | 700    | 1.3         | 0.1em          | Primary and secondary CTA buttons             |

### Principles

- **Literary for identity, technical for function.** LXGW WenKai appears only on hero headlines and institutional titles. Everything else is vivo Sans.
- **Tight on display, relaxed on body.** Display sits at line-height 1.1–1.3; body lifts to 1.6–1.8. The contrast carries hierarchy.
- **Weight hierarchy is small.** 300/400 body, 500 labels/captions, 600 emphasis, 700 display. No extreme weight jumps.
- **Positive tracking on display and labels.** Hero headlines use 0.1em, eyebrows use 0.4em uppercase, form labels use 0.18em. Body text uses 0 tracking.
- **No monospace in marketing.** Monospace is reserved for code blocks only (`{surface-3}` background).

## Layout

### Spacing System

- **Base unit**: 8px (increments of 4 / 8 / 12 / 16 / 24 / 32 / 48).
- **Tokens**: `{spacing.hair}` 1px · `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- Card interior padding: `{spacing.lg}` 24px on post cards; `{spacing.md}` 16px on mail cards; `{spacing.xl}` 40px on content placeholder cards.
- Button padding: 14px vertical · 40px horizontal on `{components.button-primary}`; 8px vertical · 16px horizontal on mail buttons.

### Grid & Container

- Max content width: `max-w-7xl` (1280px) for the application page; `max-w-6xl` (1152px) for post listing; `max-w-4xl` (896px) for post detail and compose; `max-w-3xl` (768px) for settings; `max-w-5xl` (1024px) for login.
- Post card grid is single-column with full-width cards (horizontal layout on desktop).
- Login uses a two-column grid: `1fr 430px` on desktop, stacking on mobile.

### Whitespace Philosophy

The dark canvas IS the whitespace. Sections separate by surface elevation (canvas → surface-1) rather than by gaps in white. The ambient light orbs provide a sense of spatial depth without adding literal whitespace.

## Elevation & Depth

| Level                   | Treatment                                                                                    | Use                                               |
| ----------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 0 (flat)                | No shadow, no border                                                                         | Canvas-mounted display type, hero, footer         |
| 1 (translucent surface) | `{colors.surface-1}` background + 1px `{colors.hairline}` border + `{elevation.card-shadow}` | Post cards, mail cards, content placeholder cards |
| 2 (surface-2 lift)      | `{colors.surface-2}` background + 1px `{colors.hairline}` border                             | Callouts, table containers, accordion roots       |
| 3 (surface-3 deep)      | `{colors.surface-3}` background + 1px `{colors.hairline}` border                             | Pre/code blocks, syntax highlighting              |
| A (ambient orbs)        | Radial gradient light orbs at page corners                                                   | Every major page — provides atmospheric depth     |

### Ambient Light Orbs

The signature depth device. Every major page includes 2–3 `pointer-events-none absolute` radial-gradient circles:

- **White orb**: `radial-gradient(circle, rgba(255,255,255,0.12), transparent)` — positioned top-right, provides a warm highlight.
- **Blue orb**: `radial-gradient(circle, rgba(0,148,255,0.18), transparent)` — positioned mid-left, provides a cool ambient glow.
- **Fade orb**: `radial-gradient(circle, transparent, rgba(0,0,0,0.85))` — positioned bottom-right, provides a natural vignette.

These orbs are purely atmospheric. They should never be interactive or compete with content.

## Shapes

### Border Radius Scale

| Token            | Value  | Use                                                            |
| ---------------- | ------ | -------------------------------------------------------------- |
| `{rounded.xs}`   | 4px    | Small chips                                                    |
| `{rounded.sm}`   | 6px    | Inline code, small badges                                      |
| `{rounded.md}`   | 8px    | CTA buttons, form inputs, mail action buttons                  |
| `{rounded.lg}`   | 12px   | Sidebar nav items, file attachment items                       |
| `{rounded.xl}`   | 16px   | Mail cards, post content images                                |
| `{rounded.xxl}`  | 24px   | Post listing cards, content placeholder cards, login container |
| `{rounded.pill}` | 9999px | Top navigation, pagination buttons, metadata badges            |

### Photography & Illustration Geometry

- Post cover images use `{rounded.xxl}` (16px) corners with `{elevation.deep-shadow}`.
- Cover image fallback (initial letter) uses a gradient background from slate-800 → slate-900 → black.
- Login hero illustration area is a full-bleed section with no inner rounding.

## Components

### Buttons

**`button-primary`** — White rounded-rect CTA. Primary action on public pages.

- Background `{colors.inverse-canvas}`, text `{colors.inverse-ink}`, type `{typography.button}`, padding 14px 40px, rounded `{rounded.md}`, border 1px solid white.
- Hover: background `#e5e7eb`, lift `{transition.hover-lift}`, shadow `{elevation.button-glow}`.

**`button-secondary`** — Transparent ghost CTA. Secondary action on public pages.

- Background transparent, text `{colors.ink}`, type `{typography.button}`, padding 14px 40px, rounded `{rounded.md}`, border 1px solid white.
- Hover: background `rgba(255,255,255,0.1)`, lift `{transition.hover-lift}`.

**`button-mail-primary`** — Blue CTA for mail module. Compose, send, save.

- Background `{colors.accent-blue}`, text `{colors.ink}`, type `{typography.body-sm}`, rounded `{rounded.md}`, padding 8px 16px.
- Hover: background `{colors.accent-blue-dark}`.

**`button-mail-secondary`** — Dark gray CTA for mail module. Refresh, cancel, save draft.

- Background `{colors.surface-mail-hover}`, text `{colors.ink}`, type `{typography.body-sm}`, rounded `{rounded.md}`, padding 8px 16px.
- Hover: background `#3a3a3d`.

### Cards & Containers

**`card-post`** — Post listing card on `/post`.

- Background `rgba(17,22,28,0.9)`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.xxl}`, padding 24px, border 1px solid `{colors.hairline}`, shadow `{elevation.card-shadow}`, backdrop-blur enabled.

**`card-mail`** — Mail module card for email items.

- Background `{colors.surface-mail}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.xl}`, padding 16px, border 1px solid `#333`.

**`card-content`** — Content placeholder / empty state card.

- Background `rgba(255,255,255,0.05)`, text `{colors.ink-muted}`, type `{typography.body-sm}`, rounded `{rounded.xxl}`, padding 40px 24px, border 1px solid `{colors.hairline}`, backdrop-blur enabled.

**`card-error`** — Error state card.

- Background `rgba(239,68,68,0.1)`, text `#fca5a5`, type `{typography.body-sm}`, rounded `{rounded.xxl}`, padding 40px 24px, border 1px solid `rgba(239,68,68,0.3)`.

### Inputs & Forms

**`text-input`** — Form fields on login and public pages.

- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.md}`, padding 12px 16px, border 1px solid `#4b5563`.
- Focus: border color transitions to `{colors.ink}` (white).

**`text-input-mail`** — Form fields in mail module (settings, compose).

- Background `{colors.surface-mail-input}`, text `{colors.ink}`, type `{typography.body-sm}`, rounded `{rounded.md}`, padding 8px 12px, border 1px solid `#333`.

### Pills & Badges

**`pill-badge`** — Metadata badges on post cards (date, category, tags).

- Background `rgba(255,255,255,0.05)`, text `{colors.ink-muted}`, type `{typography.caption}`, rounded `{rounded.pill}`, padding 4px 12px, border 1px solid `{colors.hairline}`.

**`pill-active`** — Active indicator behind selected nav item.

- Background `rgba(255,255,255,0.18)`, text `{colors.ink}`, type `{typography.caption}`, rounded `{rounded.pill}`.

### Navigation

**`top-nav`** — Floating pill navigation, fixed at top center.

- Background `rgba(0,0,0,0.6)`, text `{colors.ink-muted}`, type `{typography.body-sm}`, rounded `{rounded.pill}`, padding 8px 12px, border 1px solid `{colors.hairline-soft}`, backdrop-blur 2xl, shadow `{elevation.nav-shadow}`.
- Hover: padding expands slightly (both sides), indicator pill slides to hovered item, selected item indicator scales up.
- Indicator: `{pill-active}` background, transitions via `cubic-bezier(0.25,1,0.5,1)` over 300ms.

**`sidebar`** — Mail module sidebar navigation.

- Background `rgba(0,0,0,0.4)`, text `{colors.ink-muted}`, type `{typography.body-sm}`, width 256px, border-right 1px solid `{colors.hairline}`, backdrop-blur md.
- Items: `{sidebar-item}` default, `{sidebar-item-active}` when selected.

### Footer

**`footer`** — Simple link bar at page bottom.

- Background `rgba(0,0,0,0.8)`, text `{colors.ink-faint}`, type `{typography.caption}`, padding 32px 24px, border-top 1px solid `#111827`.

## Consistency Notes (Inconsistencies Found)

The following inconsistencies were identified during the audit and should be gradually normalized:

| Area                      | Current State                          | Recommended Standard                                                                                                |
| ------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Mail card borders         | Hardcoded `#333`                       | Use `{colors.hairline}` (`rgba(255,255,255,0.1)`) for consistency with public pages                                 |
| Mail card backgrounds     | Hardcoded `#1c1c1e`                    | Use `{colors.surface-1}` (`#11161c`) or a documented `{colors.surface-mail}`                                        |
| Mail input borders        | Hardcoded `#333`                       | Use `{colors.hairline}` or a documented input border token                                                          |
| Mail hover states         | Hardcoded `#2c2c2e`                    | Use a documented `{colors.surface-mail-hover}`                                                                      |
| Mail button corners       | Mixed `rounded` (4px) and `rounded-lg` | Standardize to `{rounded.md}` (8px) for all buttons                                                                 |
| Post pagination corners   | `{rounded.pill}`                       | Consistent — keep                                                                                                   |
| Joindosc container border | `border-gray-800`                      | Use `{colors.hairline}` for consistency                                                                             |
| Login input border        | `border-gray-700`                      | Use `{colors.hairline}` for consistency                                                                             |
| Font usage                | `font-custom` only on index + joindosc | Expand `{typography.display-hero}` and `{typography.display-lg}` to use LXGW WenKai wherever brand headlines appear |

## Do's and Don'ts

### Do

- Reserve `{colors.canvas}` (black) as the system's anchor surface. Every major page is built on it.
- Use ambient light orbs on every full-page view to provide atmospheric depth.
- Use `{rounded.pill}` on the top navigation, metadata badges, and pagination buttons.
- Use `{rounded.md}` (8px) on all CTA buttons and form inputs.
- Use `{typography.eyebrow}` (uppercase, 0.4em tracking) above every meaningful section.
- Use surface elevation (canvas → surface-1 → surface-2 → surface-3) to express hierarchy.
- Use `{colors.accent-blue}` only for interactive mail elements and link highlights.
- Keep the public-facing surface monochrome — white and gray on black.

### Don't

- Don't introduce mid-tone gray text outside the documented `ink` / `ink-muted` / `ink-subtle` / `ink-faint` set.
- Don't use `{colors.accent-blue}` on public-facing pages — the institutional surface is monochrome.
- Don't add heavy drop shadows on dark surfaces — use translucent surface elevation and subtle `{elevation.card-shadow}` instead.
- Don't use purple/indigo gradient colors anywhere.
- Don't use emoji as functional icons — use the Lucide icon set consistently.
- Don't use linear ease-in-out animations — prefer `cubic-bezier(0.25,1,0.5,1)` for smooth motion.
- Don't use Hero + three-card layout patterns.
- Don't use fake numbers/statistics for product features.
- Don't mix hardcoded hex colors with Tailwind opacity-based classes — normalize to the documented token system.

## Responsive Behavior

### Breakpoints

| Name    | Width        | Key Changes                                                                                   |
| ------- | ------------ | --------------------------------------------------------------------------------------------- |
| Desktop | 1280px+      | Default layout — two-column login, horizontal post cards                                      |
| Tablet  | 768px–1279px | Login stacks to single column; post cards remain horizontal                                   |
| Mobile  | <768px       | Mail sidebar becomes hamburger overlay; post cards stack vertically; display type scales down |

### Touch Targets

- CTA buttons maintain ≥44px tap height across viewports.
- Sidebar items maintain ≥40px tap height.
- Form inputs maintain ≥44px tap height on touch viewports.

### Collapsing Strategy

- **Nav**: Horizontal pill nav remains visible at all sizes; scrolls horizontally if needed.
- **Mail sidebar**: Off-canvas on mobile with hamburger toggle; always visible on desktop (md+).
- **Post card layout**: Horizontal (text left, image right) on desktop; stacks vertically on mobile.
- **Login layout**: Two-column grid → single column below `lg` breakpoint.

## Iteration Guide

1. Normalize hardcoded hex colors in the mail module to use the documented token system.
2. When introducing a new page, include ambient light orbs as the first decorative layer.
3. Default body to `{typography.body}` at 400 weight; use `{typography.body-lg}` only for lead paragraphs.
4. Use LXGW WenKai (`.font-custom`) only for brand identity headlines — never for body text.
5. Every section with a headline should have an `{typography.eyebrow}` label above it.
6. Reserve `{colors.accent-blue}` for interactive mail elements — public pages stay monochrome.
7. All new cards should use `{colors.hairline}` borders, not hardcoded hex values.

## Known Gaps

- The mail module uses a separate color system (hardcoded hex `#1c1c1e`, `#2c2c2e`, `#333`, `#141414`) that diverges from the public-facing Tailwind opacity system. These should be gradually migrated to the token system.
- The post content styles (`main.css` `.post-content`) use hardcoded hex values (#d1d5db, #0b1118, etc.) that duplicate tokens defined in `app.config.ts`. These should be consolidated.
- Animation/transition tokens are not fully extracted — most transitions are inline Tailwind classes. A formalized token set would improve consistency.
- Dark mode is the only mode — light-mode adaptation is not designed.
- The green primary color (from Nuxt UI / `app.config.ts`) is defined but not actively used in the current UI. Its role in the system is unclear.
