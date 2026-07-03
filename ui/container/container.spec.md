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
        allow-list-source: utils.tags.TagGroupContainer
        cva: false
        default: div
        enum:
            - div
            - main
            - section
        role: shell-tag
        type: string
data: container.data.json
facade: github.com/fastygo/templ/ui
id: ui.container
kind: layout
layer: primitive
package: github.com/fastygo/templ/ui/container
semantics:
    behavior: static
    data: container.data.json
    role: none
    root: resolved from Tag
showcase:
    - id: tag.default
      props:
        Class: mx-auto max-w-5xl px-6
        Tag: div
      ref: tag.default
    - id: tag.main
      props:
        Class: mx-auto max-w-5xl px-6
        Tag: main
      ref: tag.main
slots:
    default:
        accepts: any
        required: true
targets:
    react:
        component: Container
        test: ../../examples/vite/tests/ui/container.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/container'
    templ:
        component: Container
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/container
templ: Container
variants: container.variants.json
---
## Summary

Container wraps page content in a width shell.
Container supports div, main, or section root tags.

## Use Cases

- Center content with max width utilities on Class
- Wrap main element for app shell layouts

## Semantics

- ResolveTag uses TagGroupContainer from utils
- Invalid Tag falls back to div

## Example tag.default

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Container(ui.ContainerProps{Class: "mx-auto max-w-5xl px-6"}) {
		Page width content
	}
}
```

## Example tag.main

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Container(ui.ContainerProps{Tag: "main", Class: "mx-auto max-w-5xl px-6"}) {
		Main shell content
	}
}
```
