# ARIA And Behavior Hooks

The registry owns markup, styling, and static accessibility. Runtime behavior
for APG-style widgets belongs to the consuming app through `@ui8kit/aria`.

## Three Layers

| Layer | Owner | Examples |
|-------|-------|----------|
| Static semantics | Registry | native elements, roles, labels, `aria-current` |
| Explicit ARIA props | Brick API | `AriaLabel`, `AriaLabelledBy`, `AriaDescribedBy` |
| Behavior hooks | App runtime | `Behavior: "ui8kit"`, `data-ui8kit-*` |

Layer 3 must never be required for valid SSR HTML. Behavior hooks are opt-in.

## `@ui8kit/aria` Boundary

`@ui8kit/aria` owns client behavior:

- opening and closing;
- focus management;
- keyboard routing;
- ARIA state sync;
- pattern-specific DOM mutation such as `hidden` and `data-state`.

The registry only emits the DOM contract. It must not implement custom widget
JavaScript inside bricks.

Apps decide which `@ui8kit/aria` patterns they ship. The examples currently use
a dialog subset bundle validated by:

```bash
bun run validate:aria
```

## Behavior Props

| Prop | Scope | Effect |
|------|-------|--------|
| `DataUI8Kit` | primitives/composites with generic hooks | emits `data-ui8kit="..."` when non-empty |
| `Behavior: "ui8kit"` | Sheet family | emits dialog/sheet open/close hooks |

Default values emit no behavior attributes unless a brick's spec explicitly
documents otherwise.

## Sheet Contract

`Sheet` is a side panel controlled by `@ui8kit/aria`. It is not a native
`<dialog>`.

Root contract:

```html
<div
  id="panel-id"
  role="dialog"
  aria-modal="true"
  data-ui8kit="sheet"
  data-ui8kit-dialog="true"
  data-state="closed"
  hidden
>
  ...
</div>
```

Trigger contract:

```html
<button
  data-ui8kit-dialog-open="true"
  data-ui8kit-dialog-target="panel-id"
  aria-controls="panel-id"
  aria-haspopup="dialog"
  aria-expanded="false"
>
  Open
</button>
```

Close and overlay contract:

```html
<button data-ui8kit-dialog-close="true" data-ui8kit-dialog-target="panel-id">
  Close
</button>
```

When `behavior="ui8kit"` is active:

- `open` is an initial SSR state only.
- `@ui8kit/aria` owns runtime visibility.
- React freezes `open` on first commit and warns in dev if a parent changes it
  later.
- Runtime toggles happen through `hidden`, `data-state`, and ARIA state.

Native centered `Dialog` remains separate and may use native `<dialog>` control.

`bash .validate/scripts/validate-spec.sh` enforces this contract at the
documentation level: it scans every `*.spec.md` and `docs/**/*.md` file for
phrasing that would teach a runtime-specific controlled-`Open` pattern (a
framework hook wired directly to the `Open` prop, described as owning it
across re-renders) and fails the build if found, unless the guidance is
explicitly negative (e.g. "do not ..."). See
[`.validate/cmd/validate-spec/sheet_contract_validate.go`](../.validate/cmd/validate-spec/sheet_contract_validate.go).

## CSS-Only Scroll Lock

Consuming apps can lock body scroll without custom JS by reacting to the Sheet
`hidden` state:

```css
body:has(#mobile-sheet-panel:not([hidden])) {
  overflow: hidden;
}
```

This works because Sheet uses `<div hidden>` rather than native `<dialog>`.

## Authoring Rules

- Prefer typed `Aria*` props over raw `Attrs` for public API.
- Icon-only controls must expose an accessible name.
- Do not enable behavior hooks in default showcase examples unless the example
  demonstrates client wiring.
- Keep behavior implementation out of `ui/` and `components/`.
- Update `examples/web/static/js/manifest.json` when the example bundle ships a
  different `@ui8kit/aria` subset.
