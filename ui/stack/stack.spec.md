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
        allow-list-source: utils.tags.TagGroupStack
        cva: false
        default: div
        enum:
            - div
            - ul
            - ol
        role: stack-tag
        type: string
data: stack.data.json
facade: github.com/fastygo/templ/ui
id: ui.stack
kind: layout
layer: primitive
package: github.com/fastygo/templ/ui/stack
semantics:
    behavior: static
    data: stack.data.json
    layout: flex-col
    role: none
    root: resolved from Tag
showcase:
    - id: tag.default
      props:
        Class: gap-4
        Tag: div
      ref: tag.default
    - id: tag.ul
      props:
        Class: gap-2
        Tag: ul
      ref: tag.ul
slots:
    default:
        accepts: any
        required: true
targets:
    react:
        component: Stack
        test: ../../examples/vite/tests/ui/stack.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/stack'
    templ:
        component: Stack
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/stack
templ: Stack
variants: stack.variants.json
---
## Summary

Stack arranges children in a vertical flex column.
Stack is the default spacing primitive for sections.

## Use Cases

- Space form fields vertically with gap utilities
- Stack headings and body copy in a section

## Semantics

- Base classes from stack.variants.json include flex flex-col items-start justify-start
- ResolveTag uses TagGroupStack from utils

## Example tag.default

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Stack(ui.StackProps{Class: "gap-4"}) {
		@ui.Text(ui.TextProps{}) { { "First line" } }
		@ui.Text(ui.TextProps{}) { { "Second line" } }
	}
}
```

## Example tag.ul

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Stack(ui.StackProps{Tag: "ul", Class: "gap-2"}) {
		@ui.Text(ui.TextProps{Tag: "span"}) { { "Item one" } }
	}
}
```
