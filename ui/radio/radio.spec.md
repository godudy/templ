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
        role: group-name
        type: string
    Size:
        allow-list-source: radio.variants.json#size
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
        role: option-value
        type: string
    Variant:
        allow-list-source: radio.variants.json#variant
        cva: true
        default: default
        enum:
            - default
            - outline
            - ghost
        role: appearance
        type: string
data: radio.data.json
facade: github.com/fastygo/templ/ui
id: ui.radio
kind: input
layer: primitive
package: github.com/fastygo/templ/ui/radio
semantics:
    behavior: interactive
    data: radio.data.json
    input-type: radio
    role: radio
    root: input
    rule: same-name-groups-options
showcase:
    - id: layout.group
      props:
        Name: plan
      ref: layout.group
    - id: state.disabled
      props:
        Disabled: true
        Name: plan
        Value: pro
      ref: state.disabled
targets:
    react:
        component: Radio
        test: ../../examples/vite/tests/ui/radio.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/radio'
    templ:
        component: Radio
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/radio
templ: Radio
variants: radio.variants.json
---
## Summary

Radio renders one option in a named radio group.
All radios in a group share the same Name value.

## Use Cases

- Pick one plan in a pricing form
- Pick one payment method in checkout

## Semantics

- type attribute is always radio
- Checked marks the selected option in the group

## Example layout.group

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Stack(ui.StackProps{Class: "gap-2"}) {
		@ui.Radio(ui.RadioProps{Name: "plan", Value: "free", ID: "plan-free", Checked: true})
		@ui.Radio(ui.RadioProps{Name: "plan", Value: "pro", ID: "plan-pro"})
	}
}
```

## Example state.disabled

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Radio(ui.RadioProps{Name: "plan", Value: "pro", ID: "plan-pro", Disabled: true})
}
```
