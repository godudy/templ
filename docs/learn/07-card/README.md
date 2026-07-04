# Lesson 07: Card primitive

Compare the Card family on React and Go Templ. Card is a **static primitive**:
named parts (`CardHeader`, `CardTitle`, …) compose inside a bordered surface,
all driven by [`card.variants.json`](../../../ui/card/card.variants.json).

**Level: Composite primitive.** Read after [`05-button`](../05-button/) and
[`06-badge`](../06-badge/).

## What you'll learn

- Named exports only — no `Card.Header` dot notation.
- `CardTitle` heading level via `as` (React) / `As` (Go).
- Semantic root delegation: React `asChild` vs universal `CardClasses` on a
  manual `<section>` / `<article>` wrapper — the canonical example of the
  [escape hatch pattern](../../coming-from-shadcn.md#escape-hatch-aschild-vs-classes).
- When a “raw” semantic tag is legitimate if it carries `CardClasses` classes.

## The contract and ports

| Artifact | Path |
|----------|------|
| Spec | [`ui/card/card.spec.md`](../../../ui/card/card.spec.md) |
| Variant recipe | [`ui/card/card.variants.json`](../../../ui/card/card.variants.json) |
| React | [`ui/card/card.tsx`](../../../ui/card/card.tsx) |
| Go Templ | [`ui/card/card.templ`](../../../ui/card/card.templ) |

Open the React and Templ files in a split editor before reading the table below.

## Read them side by side

| # | React (TSX) | Go Templ | Rule |
|---|-------------|----------|------|
| 1 | `<Card variant="default">` | `@ui.Card(ui.CardProps{Variant: "default"})` | Root variant from shared JSON. |
| 2 | `<CardHeader>…</CardHeader>` | `@ui.CardHeader(ui.CardHeaderProps{})` | Named part; children in body. |
| 3 | `<CardTitle as={2}>…</CardTitle>` | `@ui.CardTitle(ui.CardTitleProps{As: 2})` | Heading level 1–6; default h2. |
| 4 | `<CardDescription>…</CardDescription>` | `@ui.CardDescription(...)` | Renders `<p>` with muted styles. |
| 5 | `<Card asChild><section>…</section></Card>` | `<section class={ ui.CardClasses(p) }>…</section>` | React `asChild`+`Slot`; universal `*Classes()` wrapper. |
| 6 | `import { Card, CardHeader, … }` | `import "github.com/fastygo/templ/ui"` | Facade import shape. |

## Escape hatch: semantic root with `CardClasses`

Default `Card` renders `<div>`. For landmarks (`<section>`, `<article>`), do
**not** drop raw markup without the recipe:

**React (React-only sugar):**

```tsx
<Card asChild variant="default">
  <section aria-labelledby="revenue-title">…</section>
</Card>
```

**Go / universal pattern (all non-React ports use this):**

```templ
<section class={ ui.CardClasses(ui.CardProps{Variant: "default"}) } aria-labelledby="revenue-title">
  @ui.CardHeader(ui.CardHeaderProps{}) { … }
</section>
```

The inner parts still use `@ui.CardHeader`, `@ui.CardContent`, etc. Only the
**root surface classes** move to `CardClasses` on the semantic element.

This is not a hack — it is the documented composition pattern for every runtime
that lacks `cloneElement`.

### Real block example: dashboard LayerTable

See the current dashboard pair:

- React: [`examples/vite/src/blocks/dashboard/layer-table.tsx`](../../../examples/vite/src/blocks/dashboard/layer-table.tsx)
- Go Templ: [`examples/templ/ui/blocks/dashboard/layer-table.templ`](../../../examples/templ/ui/blocks/dashboard/layer-table.templ)

`LayerTable` is the same escape hatch in production-shaped block code:
React uses `<Card asChild><section>...`, while Go uses
`<section class={ ui.CardClasses(...) }>...`.
Both are legitimate because the semantic wrapper still carries Card recipe
classes and composes Card parts inside the surface.

## Try it yourself

### Exercise A — Compose a KPI card

1. Read the `variant.kpi` example in [`card.spec.md`](../../../ui/card/card.spec.md).
2. Build the same structure in TSX using named exports.
3. Build the same structure in templ using `@ui.*` parts.

### Exercise B — Semantic section root

1. Without `asChild`, write a Go templ block where the outer element is
   `<section class={ ui.CardClasses(...) }>`.
2. Compare with the `composition.aschild-section` showcase in the spec.

### Exercise C — React to Templ

1. Open [`card.tsx`](../../../ui/card/card.tsx).
2. Translate `CardFooter` with a `Button` child to templ.

## Preview locally

From the repository root:

```bash
bun install
bun run dev:vite    # React — http://127.0.0.1:5173
bun run dev:templ   # Go Templ — http://127.0.0.1:8080
```

Card variants appear in the registry demo and in dashboard/home block scaffolds
for the current React/Templ ports.

## Where to look next

- [`04-layout-grammar`](../04-layout-grammar/) — `Block` / `Box` inside cards.
- [`03-sheet`](../03-sheet/) — overlay composite with behavior hooks.
- [`cheatsheet-react-to-templ.md`](../../cheatsheet-react-to-templ.md) — `asChild` ↔ `*Classes`.
- [`coming-from-shadcn.md`](../../coming-from-shadcn.md#escape-hatch-aschild-vs-classes) — reusable escape hatch mental model (Button, Card, SheetTrigger).
