# Lesson 07: Card composite

Compare the Card family on React and Go Templ. Card is a **composite**: named
parts (`CardHeader`, `CardTitle`, …) compose inside a bordered surface, all
driven by [`card.variants.json`](../../../components/card/card.variants.json).

**Level: Composite.** Read after [`05-button`](../05-button/) and
[`06-badge`](../06-badge/).

## What you'll learn

- Named exports only — no `Card.Header` dot notation.
- `CardTitle` heading level via `as` (React) / `As` (Go).
- Semantic root delegation: React `asChild` vs universal `CardClasses` on a
  manual `<section>` / `<article>` wrapper.
- When a “raw” semantic tag is legitimate if it carries `CardClasses` classes.

## The contract and ports

| Artifact | Path |
|----------|------|
| Spec | [`components/card/card.spec.md`](../../../components/card/card.spec.md) |
| Variant recipe | [`components/card/card.variants.json`](../../../components/card/card.variants.json) |
| React | [`components/card/card.tsx`](../../../components/card/card.tsx) |
| Go Templ | [`components/card/card.templ`](../../../components/card/card.templ) |

Open the React and Templ files in a split editor before reading the table below.

## Read them side by side

| # | React (TSX) | Go Templ | Rule |
|---|-------------|----------|------|
| 1 | `<Card variant="default">` | `@cmp.Card(cmp.CardProps{Variant: "default"})` | Root variant from shared JSON. |
| 2 | `<CardHeader>…</CardHeader>` | `@cmp.CardHeader(cmp.CardHeaderProps{})` | Named part; children in body. |
| 3 | `<CardTitle as={2}>…</CardTitle>` | `@cmp.CardTitle(cmp.CardTitleProps{As: 2})` | Heading level 1–6; default h2. |
| 4 | `<CardDescription>…</CardDescription>` | `@cmp.CardDescription(...)` | Renders `<p>` with muted styles. |
| 5 | `<Card asChild><section>…</section></Card>` | `<section class={ cmp.CardClasses(p) }>…</section>` | React `asChild`+`Slot`; universal `*Classes()` wrapper. |
| 6 | `import { Card, CardHeader, … }` | `import cmp "github.com/fastygo/templ/components"` | Facade import shape. |

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
<section class={ cmp.CardClasses(cmp.CardProps{Variant: "default"}) } aria-labelledby="revenue-title">
  @cmp.CardHeader(cmp.CardHeaderProps{}) { … }
</section>
```

The inner parts still use `@cmp.CardHeader`, `@cmp.CardContent`, etc. Only the
**root surface classes** move to `CardClasses` on the semantic element.

This is not a hack — it is the documented composition pattern for every runtime
that lacks `cloneElement`.

## Try it yourself

### Exercise A — Compose a KPI card

1. Read the `variant.kpi` example in [`card.spec.md`](../../../components/card/card.spec.md).
2. Build the same structure in TSX using named exports.
3. Build the same structure in templ using `@cmp.*` parts.

### Exercise B — Semantic section root

1. Without `asChild`, write a Go templ block where the outer element is
   `<section class={ cmp.CardClasses(...) }>`.
2. Compare with the `composition.aschild-section` showcase in the spec.

### Exercise C — React to Templ

1. Open [`card.tsx`](../../../components/card/card.tsx).
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
