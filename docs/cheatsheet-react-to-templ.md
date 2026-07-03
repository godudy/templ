# Templ Cheat Sheet for React Developers

One page for developers coming from shadcn/React. The registry ships **two
ports today** (React TSX, Go Templ) and is designed for more (Svelte 5, Vue 3,
PHP Latte, Liquid, …). The **stable contract** is always `*.spec.md` +
`*.variants.json` — runtime files are thin projectors.

For the full guide see [`coming-from-shadcn.md`](coming-from-shadcn.md). For
split-view lessons see [`learn/`](learn/).

## Naming (props → fields)

| React (TSX) | Go Templ | Notes |
|-------------|----------|-------|
| `className` | `Class` | Drop `Name`, PascalCase |
| `variant` | `Variant` | From `*.variants.json` |
| `size` | `Size` | From `*.variants.json` |
| `htmlFor` | `HTMLFor` | Label only |
| `aria-label` | `AriaLabel` | kebab → PascalCase |
| `data-ui8kit` | `DataUI8Kit` | Behavior hook |
| `behavior` | `Behavior` | Opt-in client layer |
| `panelId` | `PanelID` | Sheet id-reference (trigger/overlay/close -> panel) |
| `id` | `ID` | |
| `disabled` | `Disabled` | |
| other DOM attrs | `Attrs` | Go catch-all (`templ.Attributes`) |

## Invocation

| React | Go Templ |
|-------|----------|
| `<Button variant="outline">Save</Button>` | `@ui.Button(ui.ButtonProps{Variant: "outline"}) { Save }` |
| `<Card><CardHeader>…</CardHeader></Card>` | `@cmp.Card(cmp.CardProps{}) { @cmp.CardHeader(...) { … } }` |
| `import { Button } from "@registry/ui"` | `import "github.com/fastygo/templ/ui"` then `@ui.Button` |

## Children and lists

| React | Go Templ |
|-------|----------|
| `{children}` | `{ children... }` |
| `{items.map((x) => <Badge>{x}</Badge>)}` | `for _, x := range items { @ui.Badge(...) { x } }` |
| Self-closing `<Input />` | `@ui.Input(ui.InputProps{...})` (no body) |

## Variants (not `cva()` in TS)

| Habit | Registry rule |
|-------|----------------|
| `cva()` in component file | Classes live in `*.variants.json` only |
| `unstyled` escape hatch | **Forbidden** — add a named variant key |
| Change design | Edit JSON once → all ports pick it up |

```text
brick.variants.json → composeRecipe (React) / Compose (Go) / future port helper
```

After JSON edits: `bun run generate` (Go codegen) + `bash .validate/scripts/validate-spec.sh`.

## Composition escape hatches

| Need | React | Universal (Go, Svelte, Vue, PHP, …) |
|------|-------|--------------------------------------|
| Button-styled link | `<Button asChild><a href="…">` | `<a class={ ui.ButtonClasses(p) }>` |
| Card on `<section>` | `<Card asChild><section>` | `<section class={ cmp.CardClasses(p) }>` |

`asChild` + `Slot` is **React-only** (requires `cloneElement`). Other ports use
`*Classes()` on a manual semantic wrapper — not a missing feature.

## Behavior boundary (`@ui8kit/aria`)

| Topic | Rule |
|-------|------|
| Sheet / dialog open state | `open` / `Open` = **initial SSR render only** when `behavior="ui8kit"` |
| Runtime visibility | `@ui8kit/aria` owns `hidden`, `data-state`, ARIA after load |
| App state | `useState`, Svelte runes, Vue refs — **do not** bind registry `Open` for Sheet |
| Registry bricks | Static markup + opt-in `data-ui8kit-*` hooks; no custom widget JS inside `ui/` |

## Layout grammar (current ports)

| Use | Primitive |
|-----|-----------|
| File entry / landmark | `Block` (once per file) |
| Inner container | `Box` |
| Vertical stack | `Stack` |
| Horizontal row | `Group` |

No raw `<div>` / `<aside>` in bricks or example blocks. See [`learn/04-layout-grammar/`](learn/04-layout-grammar/).

## Quick commands

```bash
bun install              # once, repo root
bun run dev:vite         # React preview http://127.0.0.1:5173
bun run dev:templ        # Go preview http://127.0.0.1:8080
bun run generate         # after variants/data/block changes
bun run verify           # full validation pipeline
```

## Lesson map

| # | Topic |
|---|-------|
| [05](learn/05-button/) | Button + variant JSON |
| [06](learn/06-badge/) | Badge (static primitive) |
| [07](learn/07-card/) | Card composite + `CardClasses` |
| [01](learn/01-hero/) | Hero block |
| [04](learn/04-layout-grammar/) | Layout rules |
| [03](learn/03-sheet/) | Sheet + `@ui8kit/aria` |
