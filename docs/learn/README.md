# Learn

Split-view lessons for the FastyGo Templ registry. Each lesson mirrors a real
`examples/` scaffold or brick so you can open the current React and Go Templ
files side by side and see one design contract expressed through runtime ports.

## Lessons

All ten lessons below are written and ready (✓). None are placeholders.

| # | Topic | React file | Templ file | Level | Status |
|---|-------|------------|------------|-------|--------|
| [01](01-hero/) | Hero block | [`examples/vite/src/blocks/home/hero.tsx`](../../examples/vite/src/blocks/home/hero.tsx) | [`examples/templ/ui/blocks/home/hero.templ`](../../examples/templ/ui/blocks/home/hero.templ) | Block | ✓ done |
| [02](02-sidebar/) | Sidebar | [`examples/vite/src/blocks/home/sidebar.tsx`](../../examples/vite/src/blocks/home/sidebar.tsx) | [`examples/templ/ui/blocks/home/sidebar.templ`](../../examples/templ/ui/blocks/home/sidebar.templ) | Block | ✓ done |
| [03](03-sheet/) | Sheet mobile menu | [`examples/vite/src/blocks/home/mobile-sheet.tsx`](../../examples/vite/src/blocks/home/mobile-sheet.tsx) | [`examples/templ/ui/blocks/home/mobile-sheet.templ`](../../examples/templ/ui/blocks/home/mobile-sheet.templ) | Composite / behavior | ✓ done |
| [04](04-layout-grammar/) | Layout grammar | `Block`, `Box`, `Stack`, `Group` | `Block`, `Box`, `Stack`, `Group` | Concept | ✓ done |
| [05](05-button/) | Button brick | [`ui/button/button.tsx`](../../ui/button/button.tsx) | [`ui/button/button.templ`](../../ui/button/button.templ) | Primitive | ✓ done |
| [06](06-badge/) | Badge brick | [`ui/badge/badge.tsx`](../../ui/badge/badge.tsx) | [`ui/badge/badge.templ`](../../ui/badge/badge.templ) | Primitive | ✓ done |
| [07](07-card/) | Card composite | [`components/card/card.tsx`](../../components/card/card.tsx) | [`components/card/card.templ`](../../components/card/card.templ) | Composite | ✓ done |
| [08](08-showcase/) | Showcase grid | [`examples/vite/src/blocks/home/showcase.tsx`](../../examples/vite/src/blocks/home/showcase.tsx) | [`examples/templ/ui/blocks/home/showcase.templ`](../../examples/templ/ui/blocks/home/showcase.templ) | Block | ✓ done |
| [09](09-tools/) | Tool cards | [`examples/vite/src/blocks/home/tools.tsx`](../../examples/vite/src/blocks/home/tools.tsx) | [`examples/templ/ui/blocks/home/tools.templ`](../../examples/templ/ui/blocks/home/tools.templ) | Block | ✓ done |
| [10](10-notice/) | Prototype notice | [`examples/vite/src/blocks/home/notice.tsx`](../../examples/vite/src/blocks/home/notice.tsx) | [`examples/templ/ui/blocks/home/notice.templ`](../../examples/templ/ui/blocks/home/notice.templ) | Block | ✓ done |

### Recommended path (primitives first)

Best for readers who want the simplest possible mental model before tackling
real scaffolds:

1. ✓ [`05-button`](05-button/) — variant JSON mental model (simplest interactive brick).
2. ✓ [`06-badge`](06-badge/) — static primitive, same JSON pattern, no interaction.
3. ✓ [`04-layout-grammar`](04-layout-grammar/) — the rules every block lesson relies on.
4. ✓ [`01-hero`](01-hero/) — first real home scaffold.
5. ✓ [`02-sidebar`](02-sidebar/) — second real home scaffold, layout-grammar-heavy.
6. ✓ [`03-sheet`](03-sheet/) — composite + `@ui8kit/aria` behavior hooks.
7. ✓ [`07-card`](07-card/) — composite parts and the `CardClasses` escape hatch.
8. ✓ [`08-showcase`](08-showcase/) — home grid with `CardClasses` + action links.
9. ✓ [`09-tools`](09-tools/) — tone-driven tool cards.
10. ✓ [`10-notice`](10-notice/) — `Alert` banner with live-region semantics.

### Alternative path (block-first)

Best for readers who want to see a full page scaffold before drilling into
individual bricks:

1. ✓ [`01-hero`](01-hero/)
2. ✓ [`04-layout-grammar`](04-layout-grammar/)
3. ✓ [`02-sidebar`](02-sidebar/)
4. ✓ [`03-sheet`](03-sheet/)
5. ✓ [`08-showcase`](08-showcase/) → [`09-tools`](09-tools/) → [`10-notice`](10-notice/)
6. ✓ [`05-button`](05-button/) → [`06-badge`](06-badge/) → [`07-card`](07-card/)

## How to use these lessons

1. Open the React file in the left pane of your editor.
2. Open the matching Templ file in the right pane.
3. Read the lesson `README.md` for annotated differences.
4. Try the exercises at the bottom of each lesson.
5. If an exercise edits a `*.data.json`, `*.variants.json`, or `*.spec.md`
   file, run `bun run generate` afterward — Go reads these through generated
   `*_variants.go` / embedded fixtures, so edits are invisible on the Templ
   port until you regenerate. See [`01-hero`](01-hero/) Exercise C for a
   worked example.

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
