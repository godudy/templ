---
id: ui.alert
layer: composite
kind: feedback
package: github.com/fastygo/templ/ui/alert
facade: github.com/fastygo/templ/ui
templ: Alert
api:
  Variant:
    role: appearance
    type: string
    cva: true
    enum: [default, destructive, success, warning]
    allow-list-source: alert.variants.json#variant
    default: default
  Class:
    role: style-extension
    type: string
    cva: false
  Role:
    role: live-region-role
    type: string
    cva: false
    enum: [status, alert]
    default: status
  AriaLive:
    role: live-region-politeness
    type: string
    cva: false
    enum: [off, polite, assertive]
    default: polite
  Attrs:
    role: html-attrs
    type: templ.Attributes
    cva: false
slots:
  default:
    required: true
    accepts: text
showcase:
  - id: variant.default
    props: { Variant: default }
  - id: variant.destructive
    props: { Variant: destructive }
  - id: variant.success
    props: { Variant: success }
  - id: variant.warning
    props: { Variant: warning }
semantics:
  root: div
  role: status
  aria-live: polite
  behavior: static
targets:
  templ:
    package: github.com/fastygo/templ/ui/alert
    facade: github.com/fastygo/templ/ui
    component: Alert
  react:
    package: '@fastygo/templ-react/ui/alert'
    facade: '@fastygo/templ-react'
    component: Alert
    test: ../../examples/vite/tests/ui/alert.smoke.test.tsx
---

## Summary

Alert shows a short status message block.
Alert uses role status and aria-live polite.

## Use Cases

- Show form validation summary
- Show destructive action warning text
- Show success confirmation message

## Semantics

- Root element is `<div>` (matches shadcn alert)
- Role defaults to `status`; allowed values are `status` and `alert`
- AriaLive defaults to polite
- Children carry the visible message body

## Example variant.default

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Alert(ui.AlertProps{Variant: "default"}) {
		@ui.Text(ui.TextProps{Class: "text-sm"}) { { "Static alert with role status." } }
	}
}
```

## Example variant.destructive

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Alert(ui.AlertProps{Variant: "destructive"}) {
		Something went wrong.
	}
}
```

## Example variant.success

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Alert(ui.AlertProps{Variant: "success"}) {
		Changes saved.
	}
}
```

## Example variant.warning

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Alert(ui.AlertProps{Variant: "warning"}) {
		Review settings before you continue.
	}
}
```
