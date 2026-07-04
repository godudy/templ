---
id: components.popover
layer: composite
kind: overlay
package: github.com/fastygo/templ/components/popover
facade: github.com/fastygo/templ/components
templ: Popover
parts:
  - templ: Popover
    props: [ID, Variant, Class, Open, AriaLabel, AriaLabelledBy, Behavior, Attrs]
  - templ: PopoverTrigger
    props: [ID, PanelID, Class, Variant, Size, Open, Behavior, AriaLabel, Attrs]
  - templ: PopoverContent
    props: [ID, Class, Attrs]
api:
  Variant:
    role: appearance
    type: string
    cva: true
    enum: [default, card]
    allow-list-source: popover.variants.json#variant
    default: default
  Behavior:
    role: behavior-hook
    type: string
    cva: false
    enum: ["", ui8kit]
    default: ""
  Open:
    role: state
    type: bool
    cva: false
    default: false
    notes: 'Initial state for SSR + first client-side render. With Behavior=ui8kit runtime is owned by @ui8kit/aria.'
  PanelID:
    role: id-reference
    type: string
    cva: false
    notes: 'ID of the Popover panel this PopoverTrigger controls. Emits aria-controls and, with Behavior=ui8kit, data-ui8kit-dialog-target. React prop: panelId.'
showcase:
  - id: default
    props: { ID: demo-popover, AriaLabel: "More info" }
  - id: behavior.ui8kit
    props: { ID: demo-popover, Behavior: ui8kit }
semantics:
  root: div[role=dialog]
  role: dialog
  behavior: optional
targets:
  react:
    component: Popover
    facade: '@fastygo/templ-react'
    test: ../../examples/vite/tests/popover-ui8kit-contract.test.tsx
    describe: 'Popover ui8kit markup contract'
    package: '@fastygo/templ-react/components/popover'
    notes:
      - 'Declarative open?: boolean sets initial hidden/data-state only; runtime uses @ui8kit/aria when behavior="ui8kit".'
      - 'PopoverTrigger uses panelId (React) / PanelID (Go) — same id-reference field, PascalCase-normalized like every other prop.'
      - 'behavior="ui8kit" emits data-ui8kit="popover" plus data-ui8kit-dialog-* hooks, reusing the dialog non-modal contract.'
      - 'PopoverTrigger supports asChild (Radix-style Slot) for anchor triggers.'
  templ:
    component: Popover
    facade: github.com/fastygo/templ/components
    package: github.com/fastygo/templ/components/popover
---

## Summary

Popover composes a non-modal floating panel with trigger and content parts.
APG has no dedicated "popover" pattern — this brick reuses the `dialog`
non-modal contract (no `aria-modal`, no focus trap by default) with a
`data-ui8kit="popover"` marker so the runtime can apply popover-specific
positioning while keeping the same open/close hook set as Sheet/Dialog.
Behavior hooks are opt-in through Behavior.

## Use Cases

- Render inline help and info bubbles anchored to a control
- Render lightweight menus or previews that do not need modal focus trapping

## Semantics

- Popover root is a div with role dialog (non-modal — no aria-modal, unlike Sheet)
- For modal panels use components/sheet (side panel) or ui/dialog (centered) instead
- Trigger wires aria-haspopup, aria-controls, and aria-expanded
- Behavior ui8kit adds data-ui8kit="popover" plus data-ui8kit-dialog hooks; @ui8kit/aria owns open/close runtime on every runtime port
- Open sets initial hidden/data-state/aria-expanded only. With Behavior=ui8kit, do not bind Open to a runtime's own reactive component state — re-renders must not overwrite attributes that @ui8kit/aria toggles at runtime

## Example default

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.PopoverTrigger(cmp.PopoverTriggerProps{PanelID: "demo-popover", AriaLabel: "More info"}) { Info }
	@cmp.Popover(cmp.PopoverProps{ID: "demo-popover", AriaLabel: "More info"}) {
		@cmp.PopoverContent(cmp.PopoverContentProps{}) {
			Additional details
		}
	}
}
```

## Example behavior.ui8kit

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.PopoverTrigger(cmp.PopoverTriggerProps{PanelID: "demo-popover", Behavior: "ui8kit"}) { Info }
	@cmp.Popover(cmp.PopoverProps{ID: "demo-popover", Behavior: "ui8kit", AriaLabel: "More info"}) {
		@cmp.PopoverContent(cmp.PopoverContentProps{}) { Additional details }
	}
}
```
