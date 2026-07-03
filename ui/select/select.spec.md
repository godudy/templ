---
api:
    Disabled:
        cva: false
        role: state
        type: bool
    Name:
        cva: false
        role: form-name
        type: string
    OptGroup:
        cva: false
        role: grouped-choices
        type: OptGroupProps
    Option:
        cva: false
        role: slot-choice
        type: OptionProps
    Options:
        cva: false
        role: choices
        type: '[]Option'
    Required:
        cva: false
        role: state
        type: bool
    Size:
        allow-list-source: select.variants.json#size
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
        role: selected-value
        type: string
    Variant:
        allow-list-source: select.variants.json#variant
        cva: true
        default: default
        enum:
            - default
            - outline
            - ghost
        role: appearance
        type: string
data: select.data.json
facade: github.com/fastygo/templ/ui
id: ui.select
kind: input
layer: primitive
package: github.com/fastygo/templ/ui/select
parts:
    - props:
        - Variant
        - Size
        - Class
        - Name
        - Value
        - Disabled
        - Required
        - Options
        - ID
        - Role
        - TabIndex
        - AriaLabel
        - Attrs
      templ: Select
    - props:
        - Value
        - Label
        - Selected
        - Disabled
        - Attrs
      slot: option
      templ: SelectOption
    - props:
        - Class
        - Label
        - Disabled
        - Attrs
      slot: option-group
      templ: OptGroup
semantics:
    behavior: interactive
    data: select.data.json
    option-root: option | optgroup
    role: combobox
    root: select
showcase:
    - id: variant.default
      props:
        Name: country
        Options:
            - Label: United States
              Value: us
            - Label: Canada
              Value: ca
        Value: us
      ref: variant.default
    - id: state.disabled
      props:
        Disabled: true
        Name: locked
        Options:
            - Label: Option A
              Value: a
      ref: state.disabled
targets:
    react:
        component: Select
        test: ../../examples/vite/tests/ui/select.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/select'
    templ:
        component: Select
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/select
templ: Select
variants: select.variants.json
---
## Summary

Select renders a native dropdown from Options slice.
Select marks selected option when Value matches Option Value.

## Use Cases

- Pick one country in an address form
- Pick one category in a filter form

## Semantics

- SelectVariants from select.variants.json styles the surface
- Options render as option elements inside select

## Example variant.default

```templ
import "github.com/fastygo/templ/ui"
import "github.com/fastygo/templ/ui/select"

templ Example() {
	@ui.Select(ui.SelectProps{
		Name:  "country",
		Value: "us",
		Options: []selectfield.Option{
			{Value: "us", Label: "United States"},
			{Value: "ca", Label: "Canada"},
		},
	})
}
```

## Example state.disabled

```templ
import "github.com/fastygo/templ/ui"
import "github.com/fastygo/templ/ui/select"

templ Example() {
	@ui.Select(ui.SelectProps{
		Disabled: true,
		Name:     "locked",
		Options: []selectfield.Option{
			{Value: "a", Label: "Option A"},
		},
	})
}
```
