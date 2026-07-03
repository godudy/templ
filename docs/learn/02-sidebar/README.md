# Lesson 02: Sidebar

Compare the home-page catalog sidebar on React and Go Templ. Both files render
the same brand header, primary navigation, and a "Dashboard block" link from
the same `home.data.json` fixture.

## What you'll learn

- `Block tag="aside"` opens the file exactly once — the sidebar landmark.
- `Box` for every inner non-landmark section (brand header, nav slot, footer).
- `Stack` for the brand name / subtitle vertical pair.
- Composing a sub-brick (`CatalogPrimaryNav`) instead of inlining markup.
- The one documented layout-grammar escape hatch: rendering a manual `<a>`
  styled with `ButtonClasses` (Go) vs. `asChild` on `Button` (React) when a
  link needs to look like a button.

## The two files

| Runtime | Path |
|---------|------|
| React | [`examples/vite/src/blocks/home/sidebar.tsx`](../../../examples/vite/src/blocks/home/sidebar.tsx) |
| Go Templ | [`examples/templ/ui/blocks/home/sidebar.templ`](../../../examples/templ/ui/blocks/home/sidebar.templ) |

Open both files in a split editor before reading the table below.

## Read them side by side

| # | React (TSX) | Go Templ | Rule |
|---|-------------|----------|------|
| 1 | `<Block tag="aside" className="hidden w-64 ...">` | `@ui.Block(ui.BlockProps{Tag: "aside", Class: "hidden w-64 ..."})` | `Block` opens the file exactly once and carries the landmark tag. See [`04-layout-grammar`](../04-layout-grammar/). |
| 2 | `<Box className="flex h-16 items-center gap-4 border-b ...">` | `@ui.Box(ui.BoxProps{Class: "flex h-16 items-center gap-4 border-b ..."})` | `Box` is the inner container for the brand header row — never a landmark tag. |
| 3 | `<IconBadge size="sm" variant="accent">BY</IconBadge>` | `@cmp.IconBadge(cmp.IconBadgeProps{Size: "sm", Variant: "accent"}) { BY }` | Composite import from `@registry/components` / `cmp` facade, not a raw `<span>`. |
| 4 | `<Stack className="gap-0">` wraps brand + subtitle | `@ui.Stack(ui.StackProps{Class: "gap-0"})` wraps the same two lines | `Stack` for vertical rhythm — brand name over subtitle, no explicit direction needed. |
| 5 | `<Inline className="text-sm font-semibold ...">{props.Brand}</Inline>` | `@ui.Inline(ui.InlineProps{Class: "text-sm font-semibold ..."}) { { props.Brand } }` | `Inline` renders a `<span>`; data comes from the shared fixture (`props.Brand` / `{props.Brand}`). |
| 6 | `<Box className="flex-1 py-2">` wraps `<CatalogPrimaryNav items={props.Sidebar} />` | `@ui.Box(...)` wraps `@CatalogPrimaryNav(props.Sidebar, "")` | Second `Box` — a sibling section, not nested inside the first. Delegates to a sub-brick instead of inlining nav markup. |
| 7 | `<Box className="border-t border-border p-4">` | `@ui.Box(ui.BoxProps{Class: "border-t border-border p-4"})` | Third `Box` — footer section. Three `Box` siblings inside one `Block`, each with a single responsibility. |
| 8 | `<Button asChild variant="outline" size="sm" className="w-full"><a href="/">Dashboard block</a></Button>` | `<a href="/" class={ ui.ButtonClasses(ui.ButtonProps{Variant: "outline", Size: "sm", Class: "w-full"}) }>Dashboard block</a>` | The one documented escape hatch for "link that looks like a button": React uses `asChild` to merge Button classes onto a real `<a>`; Go calls `ButtonClasses` directly on a manual `<a>`. This is the same pattern as `ui/button/button.spec.md`'s `composition.aschild-link` showcase. |

## Why three `Box` and not three `Stack`

Each `Box` here is a horizontally-distinct section of the sidebar (header,
nav area, footer) stacked by the parent `Block`'s own flex-column layout —
not by an explicit `Stack`. Per
[`templ-layout-grammar.mdc`](../../../.cursor/rules/templ-layout-grammar.mdc):
"two `Box` in a row inside one `Block` is a smell — usually `Stack` or `Group`
was meant." Here it is not a smell because `Block`'s own class
(`md:flex md:flex-col`) already provides the vertical rhythm between the three
sections; `Stack` is reserved for the *inner* brand/subtitle pair that has no
other layout owner.

## Try it yourself

### Exercise A — React to Templ

1. Open [`sidebar.tsx`](../../../examples/vite/src/blocks/home/sidebar.tsx).
2. Without looking at `sidebar.templ`, write a `sidebar.templ` that renders
   the same structure using `@ui.*` and `@cmp.*` primitives.
3. Compare your result with
   [`sidebar.templ`](../../../examples/templ/ui/blocks/home/sidebar.templ).

### Exercise B — Templ to React

1. Open [`sidebar.templ`](../../../examples/templ/ui/blocks/home/sidebar.templ).
2. Translate it to a `CatalogSidebar` function component using
   `@registry/ui` and `@registry/components` imports.
3. Compare with [`sidebar.tsx`](../../../examples/vite/src/blocks/home/sidebar.tsx).

## Preview locally

From the repository root:

```bash
bun install
bun run dev:vite    # React — http://127.0.0.1:5173
bun run dev:templ   # Go Templ — http://127.0.0.1:8080
```

The current React/Templ home scaffolds use this lesson's `CatalogSidebar` block.

## Where to look next

- [`04-layout-grammar`](../04-layout-grammar/) — the four layout primitives
  explained on their own, with a "spot the violation" exercise.
- [`03-sheet`](../03-sheet/) — the mobile counterpart of this sidebar, using
  the same navigation sub-bricks inside a `Sheet`.
- [`docs/mental-model.md`](../../mental-model.md) — five core ideas behind the
  shared runtime contract.
- [`01-hero`](../01-hero/) — the previous lesson, if you have not done it yet.
