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
    Placeholder:
        cva: false
        role: placeholder
        type: string
    Required:
        cva: false
        role: state
        type: bool
    Rows:
        cva: false
        default: 4
        role: visible-lines
        type: int
    Size:
        allow-list-source: textarea.variants.json#size
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
        role: value
        type: string
    Variant:
        allow-list-source: textarea.variants.json#variant
        cva: true
        default: default
        enum:
            - default
            - outline
            - ghost
        role: appearance
        type: string
data: textarea.data.json
facade: github.com/fastygo/templ/ui
id: ui.textarea
kind: input
layer: primitive
package: github.com/fastygo/templ/ui/textarea
semantics:
    behavior: interactive
    data: textarea.data.json
    role: textbox
    root: textarea
showcase:
    - id: variant.default
      props:
        Name: message
        Placeholder: Your message
      ref: variant.default
    - id: state.disabled
      props:
        Disabled: true
        Name: locked
        Value: Fixed text
      ref: state.disabled
    - id: rows.custom
      props:
        Name: bio
        Placeholder: Bio
        Rows: 6
      ref: rows.custom
targets:
    react:
        component: Textarea
        test: ../../examples/vite/tests/ui/textarea.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/textarea'
    templ:
        component: Textarea
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/textarea
templ: Textarea
variants: textarea.variants.json
---
## Summary

Textarea renders a multi-line native text field.
TextareaRows defaults Rows to four when zero.

## Use Cases

- Collect long feedback in a contact form
- Collect bio text with custom row count

## Semantics

- TextareaVariants from textarea.variants.json styles the surface
- Value renders as textarea body content

## Example variant.default

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Textarea(ui.TextareaProps{
		Name:        "message",
		Placeholder: "Your message",
	})
}
```

## Example state.disabled

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Textarea(ui.TextareaProps{
		Disabled: true,
		Name:     "locked",
		Value:    "Fixed text",
	})
}
```

## Example rows.custom

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Textarea(ui.TextareaProps{
		Rows:        6,
		Name:        "bio",
		Placeholder: "Bio",
	})
}
```
