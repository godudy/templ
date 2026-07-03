---
api:
    Attrs:
        cva: false
        role: html-attrs
        type: templ.Attributes
    Class:
        cva: false
        role: style-extension
        type: string
    HTMLFor:
        cva: false
        role: control-id
        type: string
data: label.data.json
facade: github.com/fastygo/templ/ui
id: ui.label
kind: input
layer: primitive
package: github.com/fastygo/templ/ui/label
semantics:
    behavior: static
    data: label.data.json
    role: none
    root: label
showcase:
    - id: layout.with-control
      props:
        HTMLFor: demo-email
      ref: layout.with-control
slots:
    default:
        accepts: text
        required: true
targets:
    react:
        component: Label
        test: ../../examples/vite/tests/ui/label.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/label'
    templ:
        component: Label
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/label
templ: Label
variants: label.variants.json
---
## Summary

Label links visible text to one form control.
Label sets for attribute when HTMLFor is set.

## Use Cases

- Name an email input field
- Name a checkbox in a form item

## Semantics

- Root element is label
- for attribute references control id from HTMLFor

## Example layout.with-control

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Label(ui.LabelProps{HTMLFor: "demo-email"}) {
		Email
	}
}
```
