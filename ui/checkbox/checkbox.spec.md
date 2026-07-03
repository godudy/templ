---
api:
    AriaLabel:
        cva: false
        role: accessible-name
        type: string
    Checked:
        cva: false
        role: state
        type: bool
    Disabled:
        cva: false
        role: state
        type: bool
    Name:
        cva: false
        role: form-name
        type: string
    Required:
        cva: false
        role: state
        type: bool
    Size:
        allow-list-source: checkbox.variants.json#size
        cva: true
        default: default
        enum:
            - default
            - sm
            - lg
            - xs
        role: density
        type: string
    Value:
        cva: false
        role: submit-value
        type: string
    Variant:
        allow-list-source: checkbox.variants.json#variant
        cva: true
        default: default
        enum:
            - default
            - outline
            - ghost
        role: appearance
        type: string
data: checkbox.data.json
facade: github.com/fastygo/templ/ui
id: ui.checkbox
kind: input
layer: primitive
package: github.com/fastygo/templ/ui/checkbox
semantics:
    behavior: interactive
    data: checkbox.data.json
    input-type: checkbox
    role: checkbox
    root: input
showcase:
    - id: state.unchecked
      props:
        ID: terms
        Name: terms
      ref: state.unchecked
    - id: state.checked
      props:
        Checked: true
        ID: terms
        Name: terms
      ref: state.checked
    - id: state.disabled
      props:
        Checked: true
        Disabled: true
        Name: locked
      ref: state.disabled
targets:
    react:
        component: Checkbox
        test: ../../examples/vite/tests/ui/checkbox.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/checkbox'
    templ:
        component: Checkbox
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/checkbox
templ: Checkbox
variants: checkbox.variants.json
---
## Summary

Checkbox renders a native boolean form control.
Checkbox uses checkbox.variants.json via Compose.

## Use Cases

- Accept terms in a signup form
- Toggle one optional setting in a list

## Semantics

- type attribute is always checkbox
- ControlAttrs merges aria-label without duplicate id

## Example state.unchecked

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Checkbox(ui.CheckboxProps{Name: "terms", ID: "terms"})
}
```

## Example state.checked

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Checkbox(ui.CheckboxProps{Name: "terms", ID: "terms", Checked: true})
}
```

## Example state.disabled

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Checkbox(ui.CheckboxProps{Name: "locked", Disabled: true, Checked: true})
}
```
