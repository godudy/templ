# Coming From shadcn

The registry keeps the familiar shadcn ergonomics: props, variants, children,
`cn`, and `asChild`. The differences exist to support Go Templ SSR and React
TSX from the same contract — the first 2 of several planned runtime ports
(see [`architecture.md`](architecture.md)). This guide compares those two
specifically because it targets developers coming from React/shadcn.

For a one-page syntax map see [`cheatsheet-react-to-templ.md`](cheatsheet-react-to-templ.md).

## Main Differences

| shadcn habit | Registry rule |
|--------------|---------------|
| Components are React-only | Every brick has a runtime-neutral spec |
| Variants live in TS | Variants live in colocated `*.variants.json` |
| `className` can do everything | `Class` / `className` is additive; named variants carry design intent |
| Raw `<div>` layout is common | Use `Block`, `Box`, `Stack`, `Group` |
| Client behavior often lives in React | APG behavior lives in `@ui8kit/aria` and is opt-in |

## 5-Minute Example: Button on Both Ports

Open this section side by side with [`ui/button/button.tsx`](../ui/button/button.tsx)
and [`ui/button/button.templ`](../ui/button/button.templ).

| React (TSX) | Go Templ |
|-------------|----------|
| ```tsx | ```templ |
| import { Button } from "@registry/ui"; | import "github.com/fastygo/templ/ui" |
| | |
| <Button | @ui.Button(ui.ButtonProps{ |
|   variant="outline" |   Variant: "outline", |
|   size="sm" |   Size: "sm", |
|   className="w-full" |   Class: "w-full", |
|   disabled |   Disabled: true, |
| > | }) { |
|   Save |   Save |
| </Button> | } |
| ``` | ``` |

Six deltas to remember (see [Naming Conversion](#naming-conversion) for the rules):

1. **Invocation** — `<Button ...>` vs `@ui.Button(ui.ButtonProps{...}) { ... }`.
2. **Variant** — `variant="outline"` vs `Variant: "outline"` (PascalCase field).
3. **Class** — `className="w-full"` vs `Class: "w-full"`.
4. **Disabled** — boolean JSX attribute vs `Disabled: true` struct field.
5. **Children** — text between tags vs `{ children... }` in the templ body.
6. **`asChild`** (TSX only) — React can delegate the root to a child via `Slot`;
   templ uses `ButtonClasses(p)` on a manual wrapper:
   `<a href="..." class={ ui.ButtonClasses(p) }>Save</a>`.

Open [`ui/button/button.tsx`](../ui/button/button.tsx) and
[`ui/button/button.templ`](../ui/button/button.templ) in a split editor to see
the full contract.

## Why Go Templ And React First?

The registry serves multiple audiences with one design contract. The first
two shipped ports are:

- **Go Templ (SSR)** — server-rendered HTML for backends that want typed,
  compile-time components without a JavaScript bundle.
- **React (SPA)** — client-rendered components for frontends that already use
  shadcn-style props, hooks, and Vite.

Every port reads the same `*.variants.json`, `*.spec.md`, and fixture
`*.data.json`. That prevents design drift: a `variant="outline"` button looks
identical whether it ships from Go, React, or a future port (Svelte, Vue,
PHP/Blazor, ...) — see [`architecture.md`](architecture.md).

Choose Templ when your app is Go-first and HTML arrives from the server. Choose
React when you need client interactivity beyond what `@ui8kit/aria` provides, or
when you are embedding bricks in an existing SPA.

## Explicit Fields on Templ Button

React `ButtonProps` extends `HTMLAttributes<HTMLButtonElement>` and only adds
four registry fields (`variant`, `size`, `asChild`, `className`). Every other
HTML attribute (`disabled`, `type`, `aria-*`, `data-*`) comes from the DOM
type for free.

Go has no `HTMLAttributes` analogue. Templ `ButtonProps` lists the common
fields explicitly (`Variant`, `Size`, `Disabled`, `Type`, `AriaLabel`, …) and
routes everything else through `Attrs templ.Attributes`:

```templ
@ui.Button(ui.ButtonProps{
    Variant: "outline",
    Attrs: templ.Attributes{"data-testid": "save"},
}) { Save }
```

When comparing stacks, count only the **registry-specific** fields — not every
HTML attribute the React type inherits.

## Where Fixtures Live

Demo copy for example blocks lives in `home.data.json` and
`dashboard.data.json` next to the templ package:

```
examples/templ/ui/blocks/home/home.data.json
examples/templ/ui/blocks/dashboard/dashboard.data.json
```

They stay colocated because `blockgen` emits `//go:embed home.data.json` beside
the generated `page_gen.go` in the same Go package.

The Vite example imports through thin re-exporters so a future move is easy:

- [`examples/vite/src/data/home.ts`](../examples/vite/src/data/home.ts)
- [`examples/vite/src/data/dashboard.ts`](../examples/vite/src/data/dashboard.ts)

Block-level presentation helpers (`navIconLetter`, `workflowStepLabel`, …) also
exist as **twin files** — see
[`examples/vite/src/lib/helpers.ts`](../examples/vite/src/lib/helpers.ts) and
`examples/templ/ui/blocks/{home,dashboard}/helpers.go`. Edit both when you
change logic.

## Layout Grammar

Use layout primitives instead of raw container markup:

```tsx
<Block tag="aside" className="hidden w-64 md:flex md:flex-col">
  <Box className="flex h-16 items-center gap-4 border-b">
    <IconBadge size="sm" variant="accent">BY</IconBadge>
    <Stack className="gap-0">
      <Inline className="text-sm font-semibold">Brand</Inline>
      <Inline className="text-xs text-muted-foreground">Workspace catalog</Inline>
    </Stack>
  </Box>
</Block>
```

Choose primitives by intent:

- `Block` starts a file/block exactly once. It may default to `<div>` when the
  widget is not a landmark.
- `Box` is an inner non-landmark container.
- `Stack` is vertical flow.
- `Group` is horizontal grouping, or `fieldset` for related form controls.

See `.cursor/rules/templ-layout-grammar.mdc`.

## Text And Headings

- `Text` renders paragraph text.
- `Inline` renders inline `<span>` text.
- Use heading helpers (`H1`-`H6`) or the documented `Title` API instead of
  ad-hoc heading order props.

## Variants

There is no `unstyled` variant.

If an appearance does not fit:

1. Add a named variant to `*.variants.json`.
2. Or use `asChild` and take responsibility for the child element's classes.

The first option is preferred because it keeps tokens and examples centralized.

## `asChild`

React uses Radix-style `asChild` composition for roots and triggers:

```tsx
<Button asChild variant="outline" size="sm">
  <a href="/docs">Docs</a>
</Button>
```

The Go side uses generated class helpers when a semantic wrapper is required:

```templ
<article class={ cmp.CardClasses(cmp.CardProps{Variant: "default"}) }>
  ...
</article>
```

## Card

Use named exports only:

```tsx
<Card variant="default">
  <CardHeader>
    <CardTitle>Revenue</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

Dot notation (`Card.Header`) is intentionally not supported. One composition
style is easier for junior developers, reviewers, and LLMs.

## Sheet

`Sheet` is declarative markup plus `@ui8kit/aria` behavior:

```tsx
<Sheet id="mobile-panel" behavior="ui8kit" aria-label="Navigation menu">
  <SheetOverlay target="mobile-panel" behavior="ui8kit" />
  <SheetContent>...</SheetContent>
</Sheet>
```

Do not write custom React state logic for runtime open/close. `open` is only
initial SSR state when `behavior="ui8kit"` is active.

## Feature Parity TSX <-> Templ

| Feature | TSX | Templ | Workaround |
|---------|-----|-------|------------|
| `asChild` / `Slot` | yes | no | use `XClasses(p)` on a manual semantic wrapper |
| `forwardRef` | yes | n/a | SSR has no refs |
| `onClick` / events | yes | n/a | SSR is event-free; use `ui8kit` ARIA hooks for behavior |
| children API | `{children}` | `{ children... }` | same model |

## Naming Conversion

| TSX prop | Templ field | Rule |
|----------|-------------|------|
| `className` | `Class` | special case (drop "Name", PascalCase) |
| `tag` | `Tag` | PascalCase |
| `htmlFor` | `HTMLFor` | acronym uppercased |
| `aria-label` | `AriaLabel` | kebab -> PascalCase |
| `data-ui8kit` | `DataUI8Kit` | kebab + acronym uppercased |

## Test Contract

New React-capable bricks should declare their test target in the spec:

```yaml
targets:
  react:
    component: Sheet
    facade: '@fastygo/templ-react'
    test: ../examples/vite/tests/sheet-ui8kit-contract.test.tsx
```

`validate-spec` verifies that the referenced test exists.
