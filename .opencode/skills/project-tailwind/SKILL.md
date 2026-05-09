---
name: project-tailwind
description: Enforce this project's Tailwind conventions in `.astro` and `.tsx` files. Use this whenever creating or editing Tailwind classes, especially when composing class lists with base, responsive, pseudo-element, or interaction variants. Use `src/lib/utils/cn()` only when merging multiple class groups, conditionals, or external class props.
---

# Project Tailwind Preferences

Use this skill for Tailwind authoring in this repository.

## Current conventions

1. Use plain `class="..."` / `className="..."` for a single static Tailwind class string.
2. Use `src/lib/utils/cn()` only when there are 2+ groups, conditional classes, or external class props to merge.
3. Apply this pattern in `.astro` and `.tsx` files.
4. Group `cn()` arguments by intent and ordering:
   - Base classes first.
   - Responsive classes next (`sm:*`, `md:*`, `lg:*`, etc).
   - Pseudo-element classes in their own group when present (`before:*`, `after:*`).
   - Interaction/state classes in their own group when present (`hover:*`, `focus-visible:*`, `active:*`, etc).
5. Keep groups readable as separate string arguments instead of one long class string.
6. Do not use pixel units in custom Tailwind arbitrary values (for example `w-[136px]` or `shadow-[0_8px_24px_rgba(...)]`). Use `rem` values instead.
7. Before using an arbitrary spacing value, first divide it by `--spacing` (Tailwind default: `0.25rem`) and use the canonical utility when it maps cleanly. Example: `8.5rem / 0.25rem = 34`, so prefer `h-34` over `h-[8.5rem]`.
8. Only use arbitrary `rem` values when the value cannot be represented cleanly by the spacing scale or an existing design token.
9. Tailwind built-in utilities that include `px` in the utility name (for example `h-px`, `px-4`) are allowed.

## Preferred patterns

### Base + responsive

```tsx
className={cn(
  "relative col-span-full row-start-2",
  "gap-site-gutter flex items-center",
  "lg:col-span-3 lg:row-start-1 lg:place-self-end",
)}
```

### Base + pseudo-elements + interaction

```tsx
className={cn(
  "relative inline-block no-underline",
  "after:absolute after:right-0 after:-bottom-0.5 after:left-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:ease-out after:content-['']",
  "hover:after:scale-x-100 focus-visible:after:scale-x-100",
  className,
)}
```

## Notes

- In Astro templates, use `class="..."` for single static groups and `class={cn(...)}` for merged groups.
- In React/JSX/TSX, use `className="..."` for single static groups and `className={cn(...)}` for merged groups.
- If a component accepts external classes, keep `className` (or equivalent prop) as the last `cn()` argument.

## Anti-pattern to avoid

Do not wrap a single class group in `cn()` when no merge is happening.

```astro
<!-- Avoid -->
<main class={cn("mx-auto max-w-3xl px-6 py-12")}></main>
<!-- Prefer -->
<main class="mx-auto max-w-3xl px-6 py-12"></main>
```

## Expand later

This skill is intentionally broad so future Tailwind preferences can be added here.
