---
api:
    DataUI8Kit:
        cva: false
        default: ""
        role: behavior-hook
        type: string
        enum: ["", ui8kit]
    Open:
        cva: false
        default: false
        role: state
        type: bool
    Size:
        allow-list-source: dialog.variants.json#size
        cva: true
        default: default
        enum:
            - sm
            - default
            - lg
            - xl
            - full
        role: density
        type: string
    Variant:
        allow-list-source: dialog.variants.json#variant
        cva: true
        default: default
        enum:
            - default
            - card
            - sheet
        role: appearance
        type: string
data: dialog.data.json
facade: github.com/fastygo/templ/ui
id: ui.dialog
kind: interactive
layer: primitive
package: github.com/fastygo/templ/ui/dialog
semantics:
    behavior: native-dialog
    data: dialog.data.json
    root: dialog
showcase:
    - id: variant.default
      props:
        AriaLabel: Dialog
        Size: default
        Variant: default
      ref: variant.default
    - id: variant.sheet
      props:
        AriaLabel: Panel
        Size: full
        Variant: sheet
      ref: variant.sheet
targets:
    react:
        component: Dialog
        test: ../../examples/vite/tests/ui/dialog.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/dialog'
    templ:
        component: Dialog
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/dialog
templ: Dialog
variants: dialog.variants.json
---
## Summary

Dialog renders a native dialog root with optional behavior hook.

## Use Cases

- Render modal content
- Render sheet-like panels with native dialog semantics

## Semantics

- DataUI8Kit is opt-in and only renders when provided
- Use AriaLabel or AriaLabelledBy for the accessible name

## Example variant.default

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Dialog(ui.DialogProps{AriaLabel: "Dialog"}) {
		@ui.Text(ui.TextProps{}) { { "Dialog body." } }
	}
}
```

## Example variant.sheet

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Dialog(ui.DialogProps{Variant: "sheet", Size: "full", AriaLabel: "Panel"}) {
		@ui.Text(ui.TextProps{}) { { "Panel body." } }
	}
}
```
