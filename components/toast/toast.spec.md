---
id: components.toast
layer: composite
kind: feedback
package: github.com/fastygo/templ/components/toast
facade: github.com/fastygo/templ/components
templ: Toast
parts:
  - templ: Toast
    props: [ID, Variant, Class, Role, AriaLive, Open, Behavior, Attrs]
  - templ: ToastTitle
    props: [ID, Class, Attrs]
  - templ: ToastDescription
    props: [ID, Class, Attrs]
  - templ: ToastClose
    props: [PanelID, Class, Variant, Size, Behavior, AriaLabel, Attrs]
api:
  Variant:
    role: appearance
    type: string
    cva: true
    enum: [default, destructive]
    allow-list-source: toast.variants.json#variant
    default: default
  Role:
    role: semantics
    type: string
    cva: false
    enum: [status, alert]
    default: status
    notes: 'Reuses the APG Alert live-region contract — status for polite updates, alert for assertive/urgent ones.'
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
    notes: 'Initial visibility for SSR + first client-side render. With Behavior=ui8kit runtime is owned by @ui8kit/aria; auto-dismiss timing stays app-owned via the data-ui8kit="toast" marker.'
  PanelID:
    role: id-reference
    type: string
    cva: false
    notes: 'ID of the Toast this ToastClose dismisses. Emits, with Behavior=ui8kit, data-ui8kit-dialog-target. React prop: panelId.'
showcase:
  - id: default
    props: { ID: demo-toast, Open: true }
  - id: behavior.ui8kit
    props: { ID: demo-toast, Behavior: ui8kit, Open: true }
semantics:
  root: div[role=status]
  role: status
  behavior: optional
targets:
  react:
    component: Toast
    facade: '@fastygo/templ-react'
    test: ../../examples/vite/tests/toast-ui8kit-contract.test.tsx
    describe: 'Toast ui8kit markup contract'
    package: '@fastygo/templ-react/components/toast'
    notes:
      - 'Declarative open?: boolean sets initial hidden/data-state only; the app (not @ui8kit/aria) owns auto-dismiss timing.'
      - 'ToastClose uses panelId (React) / PanelID (Go) — same id-reference field, PascalCase-normalized like every other prop.'
      - 'behavior="ui8kit" emits data-ui8kit="toast" on the root, reusing the alert live-region contract with a toast-specific marker for app-side auto-dismiss wiring.'
      - 'ToastClose supports asChild (Radix-style Slot) for icon-button dismiss controls.'
  templ:
    component: Toast
    facade: github.com/fastygo/templ/components
    package: github.com/fastygo/templ/components/toast
---

## Summary

Toast composes a transient status message. APG has no dedicated "toast"
pattern — it classifies toasts under Alert (live region), so this brick
reuses the `alert` contract (`role="status"`/`role="alert"`, `aria-live`)
with a `data-ui8kit="toast"` marker that lets the application own
auto-dismiss timing. Behavior hooks are opt-in through Behavior.

## Use Cases

- Render transient success/error notifications
- Render background task completion messages

## Semantics

- Toast root has role status (or alert for urgent/assertive messages) with aria-live
- For persistent inline messages use ui/alert instead
- Behavior ui8kit adds data-ui8kit="toast"; the runtime hooks into show/hide but auto-dismiss timing is application-owned on every runtime port
- Open sets initial hidden/data-state only. With Behavior=ui8kit, do not bind Open to a runtime's own reactive component state — re-renders must not overwrite attributes that the app or @ui8kit/aria toggles at runtime

## Example default

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.Toast(cmp.ToastProps{ID: "demo-toast", Open: true}) {
		@cmp.ToastTitle(cmp.ToastTitleProps{}) { Saved }
		@cmp.ToastDescription(cmp.ToastDescriptionProps{}) { Your changes have been saved. }
		@cmp.ToastClose(cmp.ToastCloseProps{PanelID: "demo-toast", AriaLabel: "Dismiss"}) { × }
	}
}
```

## Example behavior.ui8kit

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.Toast(cmp.ToastProps{ID: "demo-toast", Behavior: "ui8kit", Open: true}) {
		@cmp.ToastTitle(cmp.ToastTitleProps{}) { Saved }
		@cmp.ToastClose(cmp.ToastCloseProps{PanelID: "demo-toast", Behavior: "ui8kit", AriaLabel: "Dismiss"}) { × }
	}
}
```
