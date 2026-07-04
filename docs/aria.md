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
| `Behavior: "ui8kit"` | Sheet, Tabs, Popover, Combobox, Menu, Toast families | emits pattern-specific `data-ui8kit-*` hooks |

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

## Tabs Contract

`Tabs` follows the APG Tabs pattern directly — `@ui8kit/aria` owns tab
activation, `hidden` toggling on panels, and arrow-key roving focus.

Root and trigger/panel contract:

```html
<div id="demo-tabs" data-ui8kit="tabs" data-tabs-value="account">
  <div role="tablist">
    <button role="tab" data-tabs-trigger data-tabs-value="account" aria-selected="true" aria-controls="panel-account">
      Account
    </button>
    <button role="tab" data-tabs-trigger data-tabs-value="billing" aria-selected="false" aria-controls="panel-billing">
      Billing
    </button>
  </div>
  <div id="panel-account" role="tabpanel" data-tabs-panel data-tabs-value="account">Account settings</div>
  <div id="panel-billing" role="tabpanel" data-tabs-panel data-tabs-value="billing" hidden>Billing settings</div>
</div>
```

When `behavior="ui8kit"` is active, `Value` is an initial SSR selection only;
`@ui8kit/aria` owns activation, `aria-selected`, `tabindex`, and panel
`hidden` state after mount.

## Popover Contract

APG has no dedicated "popover" pattern. `Popover` reuses the `dialog`
non-modal contract (same hook set as Sheet, minus `aria-modal` and focus
trapping) with a `data-ui8kit="popover"` marker.

Root contract:

```html
<div
  id="panel-id"
  role="dialog"
  data-ui8kit="popover"
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

## Combobox Contract

`Combobox` follows the APG Combobox pattern — `@ui8kit/aria` owns filtering,
open/close, and arrow-key option navigation.

```html
<div id="demo-combobox" data-ui8kit="combobox" data-state="closed">
  <input
    id="demo-combobox-input"
    role="combobox"
    aria-expanded="false"
    aria-autocomplete="list"
    aria-controls="demo-combobox-list"
  />
  <button data-combobox-toggle data-ui8kit-dialog-target="demo-combobox-input" aria-controls="demo-combobox-list">
    ▾
  </button>
  <ul id="demo-combobox-list" role="listbox" hidden>
    <li role="option" data-combobox-option data-combobox-value="apple" aria-selected="true">Apple</li>
    <li role="option" data-combobox-option data-combobox-value="banana" aria-selected="false">Banana</li>
  </ul>
</div>
```

When `behavior="ui8kit"` is active, `Open` is an initial SSR state only;
`@ui8kit/aria` owns list visibility, filtering, and selection.

## Menu Contract

`Menu` combines the APG Menu Button (trigger) and Menu (list) patterns.
`@ui8kit/aria` owns open/close and roving-tabindex arrow-key navigation.

```html
<button
  id="trigger"
  data-ui8kit="menubutton"
  data-menubutton-target="menu"
  aria-haspopup="menu"
  aria-controls="menu"
  aria-expanded="false"
>
  Actions
</button>
<div id="menu" role="menu" data-ui8kit="menu" data-state="closed" hidden>
  <div role="menuitem" data-menu-item tabindex="-1">Edit</div>
  <div role="menuitem" data-menu-item tabindex="-1" aria-disabled="true">Delete</div>
</div>
```

When `behavior="ui8kit"` is active, `Open` is an initial SSR state only;
`@ui8kit/aria` owns visibility, focus, and `aria-expanded` after mount.

## Toast Contract

APG has no dedicated "toast" pattern; it classifies toasts under Alert (live
region). `Toast` reuses the `alert` contract with a `data-ui8kit="toast"`
marker so the application (not `@ui8kit/aria`) owns auto-dismiss timing.

```html
<div id="demo-toast" role="status" aria-live="polite" data-ui8kit="toast" data-state="open">
  <div>Saved</div>
  <div>Your changes have been saved.</div>
  <button data-ui8kit-dialog-close="true" data-ui8kit-dialog-target="demo-toast">×</button>
</div>
```

Use `role="alert"` and `aria-live="assertive"` for urgent, interruptive
messages instead of the polite `status` default.

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
