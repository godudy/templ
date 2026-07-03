# Lesson 03: Sheet mobile menu

Compare the home-page mobile navigation panel on React and Go Templ. Both
files compose the same `Sheet` family parts and the same navigation
sub-bricks used in [Lesson 02](../02-sidebar/), wired to `@ui8kit/aria`
behavior hooks instead of custom JavaScript.

**Level: Composite / behavior.** This is the most advanced lesson in the
series — read [`01-hero`](../01-hero/) and [`02-sidebar`](../02-sidebar/)
first if you have not already.

## What you'll learn

- `behavior="ui8kit"` / `Behavior: "ui8kit"` — the opt-in flag that switches a
  brick from static markup to a `data-ui8kit-*` DOM contract owned by
  `@ui8kit/aria` at runtime.
- `target` (React) vs. `For` (Go) — the id-reference prop that wires
  `SheetOverlay` and `SheetClose` to the panel they control.
- The twin id-constants file pattern: one `.ts` file and one `.go` file,
  same constant names, edited together.
- Why `open` / `Open` is **initial SSR state only** once `behavior="ui8kit"`
  is active, and what happens if React code tries to change it later.

## The four files

| Runtime | Path |
|---------|------|
| React sheet | [`examples/vite/src/blocks/home/mobile-sheet.tsx`](../../../examples/vite/src/blocks/home/mobile-sheet.tsx) |
| Go Templ sheet | [`examples/templ/ui/blocks/home/mobile-sheet.templ`](../../../examples/templ/ui/blocks/home/mobile-sheet.templ) |
| React id constants | [`examples/vite/src/blocks/home/sheet-ids.ts`](../../../examples/vite/src/blocks/home/sheet-ids.ts) |
| Go id constants | [`examples/templ/ui/blocks/home/sheet-ids.go`](../../../examples/templ/ui/blocks/home/sheet-ids.go) |

Open the sheet pair in a split editor before reading the table below.

## Read them side by side

| # | React (TSX) | Go Templ | Rule |
|---|-------------|----------|------|
| 1 | `<Sheet id={homeSheetPanelID} side="left" size="default" variant="card" behavior="ui8kit" ...>` | `@cmp.Sheet(cmp.SheetProps{ID: homeSheetPanelID, Side: "left", Size: "default", Variant: "card", Behavior: "ui8kit", ...})` | Same variant/side/size recipe keys on both sides; `behavior`/`Behavior` opts into the `@ui8kit/aria` DOM contract. |
| 2 | `<SheetOverlay target={homeSheetPanelID} behavior="ui8kit" .../>` | `@cmp.SheetOverlay(cmp.SheetOverlayProps{For: homeSheetPanelID, Behavior: "ui8kit", ...})` | `target` (React) and `For` (Go) both mean "id of the panel this part controls." See the naming table in [`coming-from-shadcn.md`](../../coming-from-shadcn.md#naming-conversion). |
| 3 | `<SheetContent className="p-4">` | `@cmp.SheetContent(cmp.SheetContentProps{Class: "p-4"})` | Plain content wrapper — no behavior hooks here. |
| 4 | `<SheetTitle id={homeSheetTitleID} className="text-sm font-medium">{props.Brand}</SheetTitle>` | `@cmp.SheetTitle(cmp.SheetTitleProps{ID: homeSheetTitleID, Class: "text-sm font-medium"}) { { props.Brand } }` | Content via children on both sides — no positional string argument. |
| 5 | `<SheetClose target={homeSheetPanelID} behavior="ui8kit" variant="outline" size="icon" aria-label="Close navigation menu">×</SheetClose>` | `@cmp.SheetClose(cmp.SheetCloseProps{For: homeSheetPanelID, Behavior: "ui8kit", Variant: "outline", Size: "icon", AriaLabel: "Close navigation menu"}) { × }` | `SheetClose` renders a `Button` internally on every runtime port — same variant/size vocabulary as [`ui/button`](../../../ui/button/). |
| 6 | `<CatalogPrimaryNav items={props.Sidebar} className="mt-4" />` | `@CatalogPrimaryNav(props.Sidebar, "mt-4")` | Reuses the exact sub-brick from [Lesson 02](../02-sidebar/) — the mobile sheet and the desktop sidebar share one navigation component. |
| 7 | `<CatalogHeaderNav items={props.HeaderNav} className="mt-4 border-t border-border pt-4" />` | `@CatalogHeaderNav(props.HeaderNav, "mt-4 border-t border-border pt-4")` | Second nav block, same sub-brick family. |

## The `data-ui8kit-*` DOM contract

`behavior="ui8kit"` does not add client JavaScript to the brick — it changes
which attributes the brick emits. Both runtimes emit the identical contract,
documented in [`docs/aria.md`](../../aria.md):

```html
<div id="panel-id" role="dialog" aria-modal="true"
     data-ui8kit="sheet" data-ui8kit-dialog="true"
     data-state="closed" hidden>
  ...
</div>
```

A separate `@ui8kit/aria` runtime script (registered once per consuming app —
see [`examples/scripts/ui8kit-entry.mjs`](../../../examples/scripts/ui8kit-entry.mjs))
reads these attributes to open, close, and manage focus. Neither
`mobile-sheet.tsx` nor `mobile-sheet.templ` contains any `onClick` handler or
`useState` — all interactivity is attribute-driven.

## Twin id-constants files

```ts
// examples/vite/src/blocks/home/sheet-ids.ts
export const homeSheetTriggerID = "home-mobile-sheet-trigger";
export const homeSheetPanelID = "home-mobile-sheet-panel";
export const homeSheetTitleID = "home-mobile-sheet-title";
```

```go
// examples/templ/ui/blocks/home/sheet-ids.go
package home

const (
	homeSheetTriggerID = "home-mobile-sheet-trigger"
	homeSheetPanelID   = "home-mobile-sheet-panel"
	homeSheetTitleID   = "home-mobile-sheet-title"
)
```

Same constant names, same string values, two files. This is the twin-helper
pattern already introduced in [`01-hero`](../01-hero/) (`workflowStepLabel`):
when you rename or add an id, edit both files in the same change.

## `open` is initial state only — not controlled state

Both `Sheet` and `SheetTrigger` accept an `open` / `Open` prop, but once
`behavior="ui8kit"` is active, `@ui8kit/aria` owns visibility at runtime. On
the React side, [`components/sheet/sheet.tsx`](../../../components/sheet/sheet.tsx)
freezes the prop to its value at first mount:

```tsx
function useFrozenOpen(open: boolean | undefined, behavior: BehaviorMode | undefined): boolean {
  const initialOpenRef = useRef(open ?? false);
  const warnedRef = useRef(false);
  const isUi8kit = sheetBehavior(behavior) === "ui8kit";

  if (
    isDevEnv() &&
    isUi8kit &&
    !warnedRef.current &&
    (open ?? false) !== initialOpenRef.current
  ) {
    warnedRef.current = true;
    // eslint-disable-next-line no-console
    console.warn(
      "[Sheet] `open` changed after mount with behavior=\"ui8kit\" — ignored. " +
        "`@ui8kit/aria` owns runtime visibility. Pass `open` only as initial SSR state."
    );
  }

  if (isUi8kit) return initialOpenRef.current;
  return open ?? false;
}
```

If a parent re-renders with a different `open` value while `behavior="ui8kit"`
is active, React discards the new value and logs a dev warning — it does not
silently re-open or re-close the panel. There is no Go equivalent of this
guard because Templ renders once per request; the same rule ("do not treat
`Open` as live state — it is SSR-only") is documented as a semantics note in
[`components/sheet/sheet.spec.md`](../../../components/sheet/sheet.spec.md).

## Try it yourself

### Exercise A — React to Templ

1. Open [`mobile-sheet.tsx`](../../../examples/vite/src/blocks/home/mobile-sheet.tsx)
   and [`sheet-ids.ts`](../../../examples/vite/src/blocks/home/sheet-ids.ts).
2. Without looking at the Go files, write `mobile-sheet.templ` and
   `sheet-ids.go` that render the same panel using `@cmp.Sheet*` primitives.
3. Compare your result with
   [`mobile-sheet.templ`](../../../examples/templ/ui/blocks/home/mobile-sheet.templ)
   and [`sheet-ids.go`](../../../examples/templ/ui/blocks/home/sheet-ids.go).

### Exercise B — Templ to React

1. Open [`mobile-sheet.templ`](../../../examples/templ/ui/blocks/home/mobile-sheet.templ)
   and [`sheet-ids.go`](../../../examples/templ/ui/blocks/home/sheet-ids.go).
2. Translate them to a `CatalogMobileSheet` function component and a
   `sheet-ids.ts` file using `@registry/components` imports.
3. Compare with [`mobile-sheet.tsx`](../../../examples/vite/src/blocks/home/mobile-sheet.tsx)
   and [`sheet-ids.ts`](../../../examples/vite/src/blocks/home/sheet-ids.ts).

## Preview locally

From the repository root:

```bash
bun install
bun run dev:vite    # React — http://127.0.0.1:5173
bun run dev:templ   # Go Templ — http://127.0.0.1:8080
```

Resize the browser to mobile width to see `CatalogMobileSheet` and compare
`@ui8kit/aria` behavior on both ports.

## Where to look next

- [`components/sheet/sheet.spec.md`](../../../components/sheet/sheet.spec.md) —
  the full API contract for every `Sheet` part.
- [`docs/aria.md`](../../aria.md) — the three-layer ARIA model and the full
  `data-ui8kit-*` contract for triggers, overlays, and close buttons.
- [`04-layout-grammar`](../04-layout-grammar/) — the layout primitives used
  inside `SheetContent`.
- [`02-sidebar`](../02-sidebar/) — the desktop counterpart of this mobile
  panel, sharing the same navigation sub-bricks.
