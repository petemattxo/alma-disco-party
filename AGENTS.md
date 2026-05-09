# AGENTS.md

This file applies to the whole `alma-60-invitation` project.

## Project goal

- Build a statically deployed one-page invitation for Alma's 60th disco party.
- Treat `DESIGN.md` as the source of truth for design-system decisions.
- Treat `Design Reference/Page Design.png` as the approved visual reference for composition, artwork direction, and mood.
- Do not invent replacement hero artwork; use approved exports from `Design Reference/` or real text/CSS UI until final assets are available.

## Styling contract (required)

- Keep all styling Tailwind-first in components/pages.
- Use project styles only from `src/styles/`.
- Do not use inline `style` for tokenized UI styling.
- Keep pages/components static-friendly unless an interactive island is explicitly needed.

## Required style file structure

- `src/styles/global.css`
- `src/styles/shadcn.css`
- `src/styles/tokens/index.css`
- `src/styles/tokens/colors.css`
- `src/styles/tokens/typography.css`

## File responsibilities

- `global.css`
  - Imports framework/style entry files and token bundles.
  - Contains only global/base styles.
  - Must not define token values directly.

- `shadcn.css`
  - Central place for shadcn semantic variables (existing + future).
  - Maps semantic variables to project tokens.

- `tokens/colors.css`
  - Project-specific color tokens only.
  - Exposes project token utilities via `@theme`.

- `tokens/typography.css`
  - Project-specific typography tokens only.
  - Exposes font + text scale tokens via `@theme`.

## Token/source rules

- `tokens/*` are custom, project-specific tokens for this starter.
- Keep token values aligned to `DESIGN.md` and the approved design reference.
- Use the Midnight Signal palette from `DESIGN.md`: deep page/surface neutrals, ivory text, champagne/cyan/ultraviolet/pulse accents.
- Do not add dark-mode tokens unless explicitly requested.

## Astro font rule

- Configure fonts through Astro Fonts API in `astro.config.*`.
- Include `<Font cssVariable="..." preload />` in the main layout `<head>` for configured fonts.
- Do not import font packages directly in CSS when Astro Fonts API is in use.

## Tailwind class composition

- Use `cn` from `src/lib/utils.ts` when composing class strings.
- In data objects, store labels/content only; keep styling decisions in code.

## Accessibility and motion

- Use real HTML text for dates, RSVP labels, countdown labels, CTAs, and navigation.
- Keep decorative artwork `aria-hidden="true"` unless it is the only representation of meaningful content.
- Respect `prefers-reduced-motion`; disable rotation, shimmer, parallax, and scroll sequencing when reduced motion is requested.
