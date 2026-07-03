---
api:
    AriaLabel:
        cva: false
        role: accessible-name
        type: string
    Class:
        cva: false
        role: style-extension
        type: string
    Disabled:
        cva: false
        role: state
        type: bool
    Name:
        cva: false
        role: form-name
        type: string
    Placeholder:
        cva: false
        role: placeholder
        type: string
    Required:
        cva: false
        role: state
        type: bool
    Size:
        allow-list-source: input.variants.json#size
        cva: true
        default: default
        enum:
            - default
            - sm
            - lg
            - xs
        role: density
        type: string
    Type:
        cva: false
        default: text
        enum:
            - text
            - email
            - password
            - number
            - search
            - tel
            - url
        role: input-type
        type: string
    Value:
        cva: false
        role: value
        type: string
    Variant:
        allow-list-source: input.variants.json#variant
        cva: true
        default: default
        enum:
            - default
            - outline
            - ghost
        role: appearance
        type: string
data: input.data.json
facade: github.com/fastygo/templ/ui
id: ui.input
kind: input
layer: primitive
package: github.com/fastygo/templ/ui/input
semantics:
    behavior: interactive
    data: input.data.json
    role: textbox
    root: input
showcase:
    - id: variant.default
      props:
        Name: email
        Placeholder: name@example.com
        Type: text
        Variant: default
      ref: variant.default
    - id: type.email
      props:
        ID: demo-email
        Name: email
        Type: email
      ref: type.email
    - id: size.sm
      props:
        Name: q
        Placeholder: Search
        Size: sm
      ref: size.sm
    - id: state.disabled
      props:
        Disabled: true
        Name: locked
        Value: Read only
      ref: state.disabled
    - id: state.required
      props:
        Name: name
        Placeholder: Required field
        Required: true
      ref: state.required
targets:
    react:
        component: Input
        test: ../../examples/vite/tests/ui/input.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/input'
    templ:
        component: Input
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/input
templ: Input
variants: input.variants.json
---
## Summary

Input renders a single-line native text field.
Input uses InputVariants from input.variants.json via InputClasses.

## Use Cases

- Collect email in a login form
- Collect search query in a toolbar field

## Semantics

- DefaultInputType returns text when Type is empty
- ControlAttrs merges aria-label without duplicate id
- Disabled sets native disabled attribute

## Example variant.default

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Input(ui.InputProps{
		Name:        "email",
		Placeholder: "name@example.com",
	})
}
```

## Example type.email

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Input(ui.InputProps{
		ID:   "demo-email",
		Type: "email",
		Name: "email",
	})
}
```

## Example size.sm

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Input(ui.InputProps{
		Size:        "sm",
		Name:        "q",
		Placeholder: "Search",
	})
}
```

## Example state.disabled

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Input(ui.InputProps{
		Disabled: true,
		Name:     "locked",
		Value:    "Read only",
	})
}
```

## Example state.required

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Input(ui.InputProps{
		Required:    true,
		Name:        "name",
		Placeholder: "Required field",
	})
}
```
