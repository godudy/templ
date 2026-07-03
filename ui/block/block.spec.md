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
    ID:
        cva: false
        role: identity
        type: string
    Tag:
        allow-list-source: utils.tags.TagGroupLayout
        cva: false
        default: div
        enum:
            - div
            - main
            - header
            - section
            - footer
            - nav
            - article
            - aside
            - figure
            - search
            - hgroup
        role: landmark-tag
        type: string
data: block.data.json
facade: github.com/fastygo/templ/ui
id: ui.block
kind: layout
layer: primitive
package: github.com/fastygo/templ/ui/block
semantics:
    behavior: static
    data: block.data.json
    role: none
    root: resolved from Tag
    rule: do-not-nest-block-in-block
showcase:
    - id: tag.main
      props:
        Class: min-h-screen
        Tag: main
      ref: tag.main
    - id: tag.section
      props:
        Class: py-8
        Tag: section
      ref: tag.section
    - id: tag.header
      props:
        Class: border-b border-border
        Tag: header
      ref: tag.header
    - id: tag.footer
      props:
        Class: border-t border-border
        Tag: footer
      ref: tag.footer
    - id: tag.nav
      props:
        Class: py-2
        Tag: nav
      ref: tag.nav
slots:
    default:
        accepts: any
        required: true
targets:
    react:
        component: Block
        test: ../../examples/vite/tests/ui/block.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/block'
    templ:
        component: Block
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/block
templ: Block
variants: block.variants.json
---
## Summary

Block renders a top-level page landmark element.
Do not nest Block inside another Block.

## Use Cases

- Define main page region with Tag main
- Define page header and footer landmarks
- Define content sections with Tag section

## Semantics

- All values in api.Tag.enum are valid landmarks
- ResolveTag uses TagGroupLayout from utils.tags
- Invalid Tag falls back to div

## Example tag.main

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Block(ui.BlockProps{Tag: "main", Class: "min-h-screen"}) {
		Page content
	}
}
```

## Example tag.section

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Block(ui.BlockProps{Tag: "section", Class: "py-8"}) {
		Section content
	}
}
```

## Example tag.header

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Block(ui.BlockProps{Tag: "header", Class: "border-b border-border"}) {
		Site header
	}
}
```

## Example tag.footer

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Block(ui.BlockProps{Tag: "footer", Class: "border-t border-border"}) {
		Site footer
	}
}
```

## Example tag.nav

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Block(ui.BlockProps{Tag: "nav", Class: "py-2"}) {
		Primary navigation
	}
}
```
