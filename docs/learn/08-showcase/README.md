# Lesson 08: Showcase grid

Compare the home-page template showcase section on React and Go Templ. Both
files render a heading row plus a responsive grid of raised cards from the same
`home.data.json` fixture.

**Level: Block.** Shorter than the P1 block lessons — closes the home-page trail
by showing how `CardClasses`, `ButtonClasses`, and layout primitives compose in
a real scaffold.

## What you'll learn

- `ShowcaseGrid` vs `ShowcaseCardView` — section header vs repeated card item.
- React `Card asChild` + `<article>` vs Go `<article class={ ui.CardClasses(...) }>`.
- React `Button asChild` + `<a>` vs Go `<a class={ ui.ButtonClasses(...) }>`.
- `Grid` / `GridCol` for a responsive card grid.
- Twin helper `showcaseIconLetter` in `helpers.ts` / `helpers.go`.

## The two files

| Runtime | Path |
|---------|------|
| React | [`examples/vite/src/blocks/home/showcase.tsx`](../../../examples/vite/src/blocks/home/showcase.tsx) |
| Go Templ | [`examples/templ/ui/blocks/home/showcase.templ`](../../../examples/templ/ui/blocks/home/showcase.templ) |

Open both files in a split editor before reading the table below.

## Read them side by side

| # | React (TSX) | Go Templ | Rule |
|---|-------------|----------|------|
| 1 | `ShowcaseGrid({ showcase })` | `templ ShowcaseGrid(props ShowcaseProps)` | Section wrapper; props from shared fixture. |
| 2 | `<H2>…</H2>` | `@ui.Title(ui.TitleProps{As: 2, …})` | Heading level 2. |
| 3 | `<Button asChild><a href="#templates">…</a></Button>` | `<a href="#templates" class={ ui.ButtonClasses(...) }>…</a>` | [Escape hatch](../../coming-from-shadcn.md#escape-hatch-aschild-vs-classes) for link-as-button. |
| 4 | `<Grid className="gap-4 md:grid-cols-2 xl:grid-cols-3">` | `@ui.Grid(ui.GridProps{Class: "gap-4 md:grid-cols-2 xl:grid-cols-3"})` | Responsive grid; prefer `Class` over legacy grid maps. |
| 5 | `<Card asChild variant="raised"><article>…</article></Card>` | `<article class={ ui.CardClasses(ui.CardProps{Variant: "raised", …}) }>` | Semantic card root via `CardClasses`. |
| 6 | `showcaseIconLetter(item.Name)` | `showcaseIconLetter(item.Name)` | Twin helper — edit both `helpers.ts` and `helpers.go`. |
| 7 | `{item.Capabilities.map(...)}` | `for _, capability := range item.Capabilities { … }` | List rendering. |

## Try it yourself

### Exercise A — React to Templ

1. Open [`showcase.tsx`](../../../examples/vite/src/blocks/home/showcase.tsx).
2. Translate `ShowcaseCardView` to templ without looking at `showcase.templ`.
3. Compare with [`showcase.templ`](../../../examples/templ/ui/blocks/home/showcase.templ).

### Exercise B — Spot the escape hatches

1. Count every `asChild` in the React file.
2. Find the matching `*Classes()` call in the Go file for each one.
3. Read [`07-card`](../07-card/) if any `CardClasses` usage is unclear.

## Preview locally

```bash
bun install
bun run dev:vite    # React — http://127.0.0.1:5173
bun run dev:templ   # Go Templ — http://127.0.0.1:8080
```

Scroll to the template showcase section on the home page in both ports.

## Where to look next

- [`07-card`](../07-card/) — `CardClasses` pattern in depth.
- [`09-tools`](../09-tools/) — simpler card grid without nested actions.
- [`coming-from-shadcn.md`](../../coming-from-shadcn.md#escape-hatch-aschild-vs-classes) — reusable `asChild` ↔ `*Classes()` framing.
