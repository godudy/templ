---
id: ui.form
layer: composite
kind: input
package: github.com/fastygo/templ/ui/form
facade: github.com/fastygo/templ/ui

targets:
  templ:
    package: github.com/fastygo/templ/ui/form
    facade: github.com/fastygo/templ/ui
    component: Form
  react:
    package: "@fastygo/templ-react/ui/form"
    facade: "@fastygo/templ-react"
    component: Form
    test: ../../examples/vite/tests/ui/form.smoke.test.tsx

variants: form.variants.json
variant_recipes:
  form-item: form-item.variants.json
  form-description: form-description.variants.json
  form-message: form-message.variants.json
data: form.data.json

parts:
  - templ: Form
    props: [ID, Class, Action, Method, Enctype, Autocomplete, Name, Target, NoValidate, Attrs]
    slot: root
    recipe: form.variants.json
  - templ: FormItem
    props: [Class, Attrs]
    slot: item
    recipe: form-item.variants.json
  - templ: FormDescription
    props: [Class, Attrs]
    slot: description
    recipe: form-description.variants.json
  - templ: FormMessage
    props: [Class, Attrs]
    slot: message
    recipe: form-message.variants.json

api:
  Action:
    role: submit-url
    type: string
    cva: false
  Method:
    role: http-method
    type: string
    enum: [get, post]
    cva: false
  NoValidate:
    role: validation
    type: bool
    cva: false
  Class:
    role: style-extension
    type: string
    cva: false
  Attrs:
    role: html-attrs
    type: templ.Attributes
    cva: false

showcase:
  - id: layout.field-with-label
    ref: layout.field-with-label
  - id: layout.with-message
    ref: layout.with-message

semantics:
  root: form
  role: form
  behavior: interactive
  message-role: alert
  data: form.data.json
---

## Summary

Form wraps fields in a vertical grid container.
FormItem groups label, control, and helper text.
Each part has its own variant recipe file in this folder.

## Variant recipes

| Part | Recipe file | Keys |
|------|-------------|------|
| Form | form.variants.json | base only |
| FormItem | form-item.variants.json | base only |
| FormDescription | form-description.variants.json | base only |
| FormMessage | form-message.variants.json | base only |

## Use Cases

- Submit user data with Method post
- Show field hint with FormDescription
- Show validation error with FormMessage

## Semantics

- Form root uses grid gap-4 layout from form.variants.json
- FormMessage renders role alert on p element

## Example layout.field-with-label

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Form(ui.FormProps{Action: "/signup", Method: "post"}) {
		@ui.FormItem(ui.FormItemProps{}) {
			@ui.Label(ui.LabelProps{HTMLFor: "email"}) { Email }
			@ui.Input(ui.InputProps{ID: "email", Name: "email", Type: "email"})
			@ui.FormDescription(ui.FormDescriptionProps{}) { { "We never share your email." } }
		}
	}
}
```

## Example layout.with-message

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Form(ui.FormProps{}) {
		@ui.FormItem(ui.FormItemProps{}) {
			@ui.Label(ui.LabelProps{HTMLFor: "name"}) { Name }
			@ui.Input(ui.InputProps{ID: "name", Name: "name", Required: true})
			@ui.FormMessage(ui.FormMessageProps{}) { { "Name is required." } }
		}
	}
}
```
