# Learn

Split-view lessons for the FastyGo Templ registry. Each lesson mirrors a real
`examples/` scaffold or brick so you can open the current React and Go Templ
files side by side and see one design contract expressed through runtime ports.

## Lessons

| # | Topic | React file | Templ file | Level | Status |
|---|-------|------------|------------|-------|--------|
| [01](01-hero/) | Hero block | [`examples/vite/src/blocks/home/hero.tsx`](../../examples/vite/src/blocks/home/hero.tsx) | [`examples/templ/ui/blocks/home/hero.templ`](../../examples/templ/ui/blocks/home/hero.templ) | Block | done |
| [02](02-sidebar/) | Sidebar | [`examples/vite/src/blocks/home/sidebar.tsx`](../../examples/vite/src/blocks/home/sidebar.tsx) | [`examples/templ/ui/blocks/home/sidebar.templ`](../../examples/templ/ui/blocks/home/sidebar.templ) | Block | done |
| [03](03-sheet/) | Sheet mobile menu | [`examples/vite/src/blocks/home/mobile-sheet.tsx`](../../examples/vite/src/blocks/home/mobile-sheet.tsx) | [`examples/templ/ui/blocks/home/mobile-sheet.templ`](../../examples/templ/ui/blocks/home/mobile-sheet.templ) | Composite / behavior | done |
| [04](04-layout-grammar/) | Layout grammar | `Block`, `Box`, `Stack`, `Group` | `Block`, `Box`, `Stack`, `Group` | Concept | done |
| [05](05-button/) | Button brick | [`ui/button/button.tsx`](../../ui/button/button.tsx) | [`ui/button/button.templ`](../../ui/button/button.templ) | Primitive | done |
| [06](06-badge/) | Badge brick | [`ui/badge/badge.tsx`](../../ui/badge/badge.tsx) | [`ui/badge/badge.templ`](../../ui/badge/badge.templ) | Primitive | done |
| [07](07-card/) | Card composite | [`components/card/card.tsx`](../../components/card/card.tsx) | [`components/card/card.templ`](../../components/card/card.templ) | Composite | done |

Suggested order for a first pass:

1. **05 Button** — variant JSON mental model (simplest interactive brick).
2. **06 Badge** — static primitive, same JSON pattern.
3. **04 Layout grammar** — rules used by block lessons.
4. **01 Hero** → **02 Sidebar** → **03 Sheet** — real home scaffolds.
5. **07 Card** — composite parts and `CardClasses` escape hatch.

Or follow the original block-first path: 01 → 04 → 02 → 03, then 05–07.

## How to use these lessons

1. Open the React file in the left pane of your editor.
2. Open the matching Templ file in the right pane.
3. Read the lesson `README.md` for annotated differences.
4. Try the exercises at the bottom of each lesson.

For onboarding context, start with [`coming-from-shadcn.md`](../coming-from-shadcn.md)
or the one-page [`cheatsheet-react-to-templ.md`](../cheatsheet-react-to-templ.md).

## Preview Current Ports

```bash
bun install          # once, repository root
bun run dev:vite     # React — http://127.0.0.1:5173
bun run dev:templ    # Go Templ — http://127.0.0.1:8080
```

## Related docs

- [`architecture.md`](../architecture.md) — multi-runtime brick contract
- [`coming-from-shadcn.md`](../coming-from-shadcn.md) — shadcn migration guide
- [`cheatsheet-react-to-templ.md`](../cheatsheet-react-to-templ.md) — one-page syntax map
