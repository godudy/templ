# Lesson 09: Tool cards

Compare the home-page tool-cards grid on React and Go Templ. Both files render
a responsive grid of compact cards with tone-colored icon badges from the same
`home.data.json` fixture.

**Level: Block.** Short lesson — focuses on `blockVariant` / `BlockVariant` for
dynamic tone classes and the `CardClasses` root pattern without action buttons.

## What you'll learn

- `ToolCards({ items })` — a list-only block with no section header.
- `blockVariant(homeVariants, "toolTone", item.Tone)` (React) vs
  `BlockVariant("toolTone", item.Tone)` (Go) for block-level variant maps.
- `IconBadge` with a dynamic `variant` / tone class from `@blocks/home-variants`.
- Twin helper `toolIconLetter` in `helpers.ts` / `helpers.go`.
- `Card asChild` + `<article>` vs `<article class={ cmp.CardClasses(...) }>`.

## The two files

| Runtime | Path |
|---------|------|
| React | [`examples/vite/src/blocks/home/tools.tsx`](../../../examples/vite/src/blocks/home/tools.tsx) |
| Go Templ | [`examples/templ/ui/blocks/home/tools.templ`](../../../examples/templ/ui/blocks/home/tools.templ) |

Open both files in a split editor before reading the table below.

## Read them side by side

| # | React (TSX) | Go Templ | Rule |
|---|-------------|----------|------|
| 1 | `ToolCards({ items })` | `templ ToolCards(items []ToolCard)` | Props are the card slice only — no wrapper title. |
| 2 | `import homeVariants from "@blocks/home-variants"` | `BlockVariant("toolTone", item.Tone)` | Block-scoped variant JSON; Go reads via generated helper. |
| 3 | `className={blockVariant(homeVariants, "toolTone", item.Tone)}` on `IconBadge` | `Variant: BlockVariant("toolTone", item.Tone)` on `IconBadgeProps` | Tone drives badge chrome, not a registry `variant=` enum. |
| 4 | `toolIconLetter(item.Icon)` | `toolIconLetter(item.Icon)` | Twin helper for icon initials. |
| 5 | `<Card asChild variant="default" className="h-full hover:bg-muted/20"><article>…</article></Card>` | `<article class={ cmp.CardClasses(cmp.CardProps{Variant: "default", Class: "h-full hover:bg-muted/20"}) }>` | Same raised surface + hover utility on semantic root. |
| 6 | `export { Badge }` re-export | — | React-only tree-shaking convenience; Go has no equivalent export. |

## Try it yourself

### Exercise A — Add a tone

1. Open [`home.data.json`](../../../examples/data/home.data.json) and add a new
   tool card with a unique `Tone` value.
2. If the tone is new, extend the `toolTone` map in the home block variants JSON.
3. Run `bun run generate` and reload both preview ports.

### Exercise B — Templ to React

1. Open [`tools.templ`](../../../examples/templ/ui/blocks/home/tools.templ).
2. Write the equivalent `ToolCards` component in TSX.
3. Compare with [`tools.tsx`](../../../examples/vite/src/blocks/home/tools.tsx).

## Preview locally

```bash
bun install
bun run dev:vite    # React — http://127.0.0.1:5173
bun run dev:templ   # Go Templ — http://127.0.0.1:8080
```

Find the tool-cards grid on the home page below the showcase section.

## Where to look next

- [`08-showcase`](../08-showcase/) — richer card with actions and capabilities list.
- [`10-notice`](../10-notice/) — `Alert` composite instead of `Card`.
- [`04-layout-grammar`](../04-layout-grammar/) — `Grid` / `Group` / `Stack` inside cards.
