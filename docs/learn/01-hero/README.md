# Lesson 01: Hero block

Compare the home-page hero command center on React and Go Templ. Both files
render the same UI from the same `home.data.json` fixture.

## What you'll learn

- How a React component maps to a `templ` function in the same Go package.
- `className` vs `Class` for Tailwind utilities.
- `H1` sugar vs `Title(As: 1)` for heading levels.
- JSX `{children}` vs templ `{ children... }`.
- `.map()` vs `for _, x := range xs` for lists.
- `aria-label` vs `AriaLabel` for accessibility props.
- How layout primitives (`Block` for landmarks, `Box` inside) compose a section.

## The two files

| Runtime | Path |
|---------|------|
| React | [`examples/vite/src/blocks/home/hero.tsx`](../../../examples/vite/src/blocks/home/hero.tsx) |
| Go Templ | [`examples/templ/ui/blocks/home/hero.templ`](../../../examples/templ/ui/blocks/home/hero.templ) |

Open both files in a split editor before reading the table below.

## Read them side by side

| # | React (TSX) | Go Templ | Rule |
|---|-------------|----------|------|
| 1 | `export function HeroChat({ hero })` | `templ HeroChat(props HeroProps)` | Function name matches; props are a typed struct in Go. |
| 2 | `<Block tag="section" className="...">` | `@ui.Block(ui.BlockProps{Tag: "section", Class: "..."})` | Every runtime port uses `Block` for section landmarks. |
| 3 | `<H1 className="text-3xl ...">` | `@ui.Title(ui.TitleProps{As: 1, Class: "text-3xl ..."})` | React has `H1`–`H6` sugar; templ uses `Title` with `As: 1`–`6`. |
| 4 | `className="gap-6"` | `Class: "gap-6"` | See [Naming Conversion](../../coming-from-shadcn.md#naming-conversion). |
| 5 | `<Textarea rows={4} placeholder={hero.Prompt} />` | `@ui.Textarea(ui.TextareaProps{Rows: 4, Placeholder: props.Prompt})` | Self-closing in TSX; templ uses a struct literal. |
| 6 | `aria-label={hero.AttachmentLabel}` | `AriaLabel: props.AttachmentLabel` | kebab-case prop → PascalCase Go field. |
| 7 | `{hero.Suggestions.map((s) => <Badge>…</Badge>)}` | `for _, suggestion := range props.Suggestions { @ui.Badge(...) }` | List rendering syntax differs; children model is the same. |
| 8 | `workflowStepLabel(index)` in `helpers.ts` | `workflowStepLabel(index)` in `helpers.go` | Current React/Templ helpers share names; edit both until P1.13 decides generation. |

## Try it yourself

### Exercise A — React to Templ

1. Open [`hero.tsx`](../../../examples/vite/src/blocks/home/hero.tsx).
2. Without looking at `hero.templ`, write a `hero.templ` that renders the same
   structure using `@ui.*` and `@cmp.*` primitives.
3. Compare your result with
   [`hero.templ`](../../../examples/templ/ui/blocks/home/hero.templ).

### Exercise B — Templ to React

1. Open [`hero.templ`](../../../examples/templ/ui/blocks/home/hero.templ).
2. Translate it to a `HeroChat` function component using `@registry/ui` imports.
3. Compare with [`hero.tsx`](../../../examples/vite/src/blocks/home/hero.tsx).

### Exercise C — Edit the fixture and regenerate

1. Open [`home.data.json`](../../../examples/data/home.data.json)
   and change the hero prompt copy or a suggestion label under
   `showcase.default.props`.
2. Run `bun run generate` — this refreshes the Go-embedded fixture and any
   generated `*_variants.go` files that depend on it.
3. Reload both preview ports below and confirm the change appears on both.
   Skipping `bun run generate` after a fixture/spec edit is the most common
   "why isn't my change showing up on Go" mistake.

## Preview locally

From the repository root:

```bash
bun install
bun run dev:vite    # React — http://127.0.0.1:5173
bun run dev:templ   # Go Templ — http://127.0.0.1:8080
```

The current React/Templ home scaffolds use this lesson's `HeroChat` block.

## Where to look next

- [`docs/mental-model.md`](../../mental-model.md) — five core ideas behind the shared runtime contract.
- [`05-button`](../05-button/) — Button brick lesson.
- [`06-badge`](../06-badge/) — Badge brick lesson.
- [`07-card`](../07-card/) — Card composite lesson.
- [`cheatsheet-react-to-templ.md`](../../cheatsheet-react-to-templ.md) — one-page syntax map.
- [`docs/coming-from-shadcn.md`](../../coming-from-shadcn.md) — full migration guide.
