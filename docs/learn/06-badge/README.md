# Lesson 06: Badge brick

Compare the smallest **static** primitive on React and Go Templ. Badge has no
click handlers, no behavior hooks, and no `asChild` — only variant, size,
children, and optional `Class` / `Attrs`.

**Level: Primitive.** Read this right after [`05-button`](../05-button/) to see
the same JSON-recipe pattern without interaction complexity.

## What you'll learn

- Minimal registry API: `Variant`, `Size`, `Class`, `Attrs`, children.
- Same `*.variants.json` contract powering thin runtime ports.
- Why static bricks are the easiest place to verify parity before composites.

## The contract and ports

| Artifact | Path |
|----------|------|
| Spec | [`ui/badge/badge.spec.md`](../../../ui/badge/badge.spec.md) |
| Variant recipe | [`ui/badge/badge.variants.json`](../../../ui/badge/badge.variants.json) |
| React | [`ui/badge/badge.tsx`](../../../ui/badge/badge.tsx) |
| Go Templ | [`ui/badge/badge.templ`](../../../ui/badge/badge.templ) |

Open the React and Templ files in a split editor before reading the table below.

## Read them side by side

| # | React (TSX) | Go Templ | Rule |
|---|-------------|----------|------|
| 1 | `composeRecipe(badgeRecipe, { variant, size }, className)` | `uiutils.Compose(BadgeVariants, map[string]string{"variant": p.Variant, "size": p.Size}, p.Class)` | Identical recipe keys; one JSON file. |
| 2 | `<Badge variant="secondary">New</Badge>` | `@ui.Badge(ui.BadgeProps{Variant: "secondary"}) { New }` | Children model matches Button. |
| 3 | Root is `<div>` | Root is `<div>` | No interactive role; see spec semantics. |
| 4 | No `asChild`, no `Disabled` | No `asChild`, no `Disabled` | Static label only — behavior lives elsewhere. |
| 5 | Extra DOM attrs via `...rest` | `Attrs templ.Attributes` | Go lists catch-all explicitly. |

## Variant JSON flow

Badge follows the same pipeline as Button:

```text
badge.variants.json → badge.tsx / badge.templ
```

To add a visual preset, extend `byKey.variant` in JSON, sync `badge.spec.md`
`api.Variant.enum`, and run `bun run generate` for Go. No port-specific class
maps.

## Try it yourself

### Exercise A — React to Templ

1. Open [`badge.tsx`](../../../ui/badge/badge.tsx).
2. Write a templ call for `<Badge variant="outline" size="sm">Beta</Badge>`.
3. Compare with [`badge.templ`](../../../ui/badge/badge.templ).

### Exercise B — Used inside a block

1. Open [`hero.tsx`](../../../examples/vite/src/blocks/home/hero.tsx) and find
   the suggestions list.
2. Find the matching `for _, suggestion := range` loop in
   [`hero.templ`](../../../examples/templ/ui/blocks/home/hero.templ).
3. Note how the same `Badge` API appears inside a block scaffold.

## Preview locally

From the repository root:

```bash
bun install
bun run dev:vite    # React — http://127.0.0.1:5173
bun run dev:templ   # Go Templ — http://127.0.0.1:8080
```

The registry demo lists Badge variants on the default page. Compare the same
labels in the current React/Templ ports.

## Where to look next

- [`05-button`](../05-button/) — interaction, `asChild`, and `ButtonClasses`.
- [`07-card`](../07-card/) — composite parts and semantic root delegation.
- [`01-hero`](../01-hero/) — Badge used inside a real block.
