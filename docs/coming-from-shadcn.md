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

## 5-Minute Example: Button In Current Ports

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

Go has no `HTMLAttributes` analogue, so [`ui/button/button.templ`](../ui/button/button.templ)
lists 11 fields explicitly. Only 4 of them are registry-specific — the rest
are DOM attributes that React inherits for free and Go must name one by one:

| Go field (`ButtonProps`) | Kind | React equivalent |
|--------------------------|------|-------------------|
| `Variant` | registry (`*.variants.json`) | `variant` |
| `Size` | registry (`*.variants.json`) | `size` |
| `Class` | registry (style extension) | `className` |
| — | registry (composition) | `asChild` (React-only, see below) |
| `Type` | DOM attribute, named explicitly | `type` (inherited) |
| `Form` | DOM attribute, named explicitly | `form` (inherited) |
| `Disabled` | DOM attribute, named explicitly | `disabled` (inherited) |
| `ID` | DOM attribute, named explicitly | `id` (inherited) |
| `Role` | DOM attribute, named explicitly | `role` (inherited) |
| `TabIndex` | DOM attribute, named explicitly | `tabIndex` (inherited) |
| `AriaLabel` | accessible-name, named explicitly | `aria-label` (inherited) |
| `Attrs` | catch-all for everything else | `...rest` spread |

```templ
@ui.Button(ui.ButtonProps{
    Variant: "outline",
    Attrs: templ.Attributes{"data-testid": "save"},
}) { Save }
```

When comparing stacks, count only the **registry-specific** rows (`Variant`,
`Size`, `Class`, `asChild`) — not every HTML attribute the React type
inherits. The other 7 Go fields exist only because Go has no `HTMLAttributes`
analogue to inherit from; they are not extra registry surface.

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

## Escape hatch: `asChild` vs `*Classes()`

React shadcn/Radix uses `asChild` + `Slot` to **merge props and classes onto a
child element** without an extra wrapper. That works because React can call
`cloneElement` at runtime.

Go Templ, Svelte, Vue, PHP/Latte, and every other non-React port render a
**fixed element tree at compile time**. There is no runtime child merge — so
the registry's portable escape hatch is always the same:

```text
Pick the semantic tag you need → apply *Classes(props) on it → compose inner parts as children.
```

| Need | React (React-only sugar) | Universal pattern (all ports) |
|------|--------------------------|-------------------------------|
| Link styled as button | `<Button asChild><a href="…">…</a></Button>` | `<a href="…" class={ ui.ButtonClasses(p) }>…</a>` |
| Card as `<article>` landmark | `<Card asChild><article>…</article></Card>` | `<article class={ cmp.CardClasses(p) }>…</article>` |
| Sheet trigger on custom control | `<SheetTrigger asChild panelId="…"><button>…</button></SheetTrigger>` | Emit trigger markup with `data-ui8kit-*` hooks + `panelId`/`PanelID`; apply trigger classes via `SheetTriggerClasses(p)` on the chosen element |

`*Classes()` helpers are generated next to every brick that supports root
delegation. They run the same `composeRecipe` path as the component — only the
DOM wrapper is yours.

### Why no `asChild` in Go Templ?

Templ is not "missing" `asChild`. The feature depends on React's ability to
inspect and clone a single child at runtime. SSR-first ports never had that
mechanism, so they expose the **same visual and behavioral contract** through
explicit wrappers:

1. **Classes** — call `ButtonClasses`, `CardClasses`, `SheetTriggerClasses`, …
   with the same props you would pass to the component.
2. **Semantics** — choose `<a>`, `<section>`, `<button>`, or any other tag
   yourself; the recipe does not force a default root when you use `*Classes`.
3. **Behavior hooks** — for Sheet parts, the portable contract is the emitted
   `data-ui8kit-*` attributes plus `panelId`/`PanelID`, not `asChild`.

Do **not** drop a raw semantic tag without the recipe classes — that bypasses
the design system. Do **not** teach "Templ is missing asChild" to junior
developers; teach "React has convenience sugar; every port uses `*Classes()` on
a manual wrapper."

Deep dives with exercises:

- [`docs/learn/05-button`](../docs/learn/05-button/) — `ButtonClasses` on `<a>`.
- [`docs/learn/07-card`](../docs/learn/07-card/) — `CardClasses` on `<section>`.
- [`docs/learn/03-sheet`](../docs/learn/03-sheet/) — trigger semantics without React state.

## `asChild` (React-only quick reference)

React uses Radix-style `asChild` composition for roots and triggers:

```tsx
<Button asChild variant="outline" size="sm">
  <a href="/docs">Docs</a>
</Button>
```

Every non-React port uses generated class helpers when a semantic wrapper is
required; Go Templ is the current example:

```templ
<a href="/docs" class={ ui.ButtonClasses(ui.ButtonProps{Variant: "outline", Size: "sm"}) }>
  Docs
</a>
```

For Card landmarks, see the full [`07-card`](../docs/learn/07-card/) lesson.
For Sheet triggers, `asChild` is optional React sugar — the portable contract
remains `panelId`/`PanelID`, `behavior="ui8kit"`, and the `data-ui8kit-*`
attribute set documented in [`docs/aria.md`](aria.md).

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
  <SheetOverlay panelId="mobile-panel" behavior="ui8kit" />
  <SheetContent>...</SheetContent>
</Sheet>
```

`SheetTrigger`, `SheetOverlay`, and `SheetClose` all take `panelId` (React) /
`PanelID` (Go) — the same id-reference field, PascalCase-normalized like
every other prop. There is no runtime-specific split here.

Do not write custom React state logic for runtime open/close. `open` is only
initial SSR state when `behavior="ui8kit"` is active.

## React/Templ Parity Snapshot

| Feature | React TSX | Go Templ | Runtime-neutral framing |
|---------|-----------|----------|-------------------------|
| root delegation | `asChild` / `Slot` | `XClasses(p)` on a manual wrapper | `XClasses` is the portable pattern; React `Slot` is sugar |
| refs | `forwardRef` | n/a | SSR ports do not expose refs |
| events | `onClick` / events | n/a | SSR ports stay event-free; use `ui8kit` ARIA hooks for behavior |
| children API | `{children}` | `{ children... }` | same model |

## Naming Conversion

| TSX prop | Templ field | Rule |
|----------|-------------|------|
| `className` | `Class` | special case (drop "Name", PascalCase) |
| `tag` | `Tag` | PascalCase |
| `htmlFor` | `HTMLFor` | acronym uppercased |
| `aria-label` | `AriaLabel` | kebab -> PascalCase |
| `data-ui8kit` | `DataUI8Kit` | kebab + acronym uppercased |
| `panelId` | `PanelID` | Sheet id-reference (`SheetTrigger`/`SheetOverlay`/`SheetClose`); acronym uppercased |

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
