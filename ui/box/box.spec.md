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
        allow-list-source: utils.tags.TagGroupBoxAllowed
        cva: false
        default: div
        enum:
            - div
        role: layout-tag
        type: string
data: box.data.json
facade: github.com/fastygo/templ/ui
id: ui.box
kind: layout
layer: primitive
package: github.com/fastygo/templ/ui/box
semantics:
    behavior: static
    data: box.data.json
    role: none
    root: resolved from Tag
    rule: internal-layout-only-not-landmark
showcase:
    - id: tag.default
      props:
        Tag: div
      ref: tag.default
    - id: class.padded
      props:
        Class: p-4 rounded-md border border-border
      ref: class.padded
slots:
    default:
        accepts: any
        required: true
targets:
    react:
        component: Box
        test: ../../examples/vite/tests/ui/box.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/box'
    templ:
        component: Box
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/box
templ: Box
variants: box.variants.json
---
## Summary

Box wraps internal layout sections inside a Block.
Box is not for top-level page landmarks.

## Use Cases

- Pad content inside a card body
- Group inline elements with flex utilities on Class

## Semantics

- ResolveTag uses TagGroupBoxAllowed from utils
- Attrs spread directly on the root element
- Prefer Block for main, header, and footer regions

## Example tag.default

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Box(ui.BoxProps{Class: "mx-auto max-w-3xl px-6"}) {
		Inner content
	}
}
```

## Example class.padded

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Box(ui.BoxProps{Class: "p-4 rounded-md border border-border"}) {
		Section body
	}
}
```
