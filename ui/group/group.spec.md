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
    Tag:
        allow-list-source: utils.tags.TagGroupGroup
        cva: false
        default: div
        enum:
            - div
            - fieldset
            - dl
        role: group-tag
        type: string
data: group.data.json
facade: github.com/fastygo/templ/ui
id: ui.group
kind: layout
layer: primitive
package: github.com/fastygo/templ/ui/group
semantics:
    behavior: static
    data: group.data.json
    layout: flex-row
    role: none
    root: resolved from Tag
showcase:
    - id: tag.default
      props:
        Class: gap-2
        Tag: div
      ref: tag.default
    - id: tag.fieldset
      props:
        Class: gap-2
        Tag: fieldset
      ref: tag.fieldset
slots:
    default:
        accepts: any
        required: true
targets:
    react:
        component: Group
        test: ../../examples/vite/tests/ui/group.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/group'
    templ:
        component: Group
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/group
templ: Group
variants: group.variants.json
---
## Summary

Group arranges children in a horizontal flex row.
Group supports fieldset for related form controls.

## Use Cases

- Place buttons side by side with gap utilities
- Group radio options inside a fieldset

## Semantics

- Base classes include flex min-w-0
- ResolveTag uses TagGroupGroup from utils

## Example tag.default

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Group(ui.GroupProps{Class: "gap-2"}) {
		@ui.Button(ui.ButtonProps{Variant: "default"}) { Save }
		@ui.Button(ui.ButtonProps{Variant: "outline"}) { Cancel }
	}
}
```

## Example tag.fieldset

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Group(ui.GroupProps{Tag: "fieldset", Class: "gap-2"}) {
		@ui.Radio(ui.RadioProps{Name: "plan", Value: "free", ID: "plan-free"})
		@ui.Radio(ui.RadioProps{Name: "plan", Value: "pro", ID: "plan-pro"})
	}
}
```
