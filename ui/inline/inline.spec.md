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
data: inline.data.json
facade: github.com/fastygo/templ/ui
id: ui.inline
kind: typography
layer: primitive
package: github.com/fastygo/templ/ui/inline
semantics:
    behavior: static
    data: inline.data.json
    role: none
    root: span
showcase:
    - id: default
      props:
        Class: text-muted-foreground
      ref: default
targets:
    react:
        component: Inline
        test: ../../examples/vite/tests/ui/inline.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/inline'
    templ:
        component: Inline
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/inline
templ: Inline
variants: inline.variants.json
---
## Summary

Inline renders inline copy as a `<span>`.
Pass content as children. Use `Text` for paragraph blocks and `Title` (or `H1`–`H6`) for headings.

## Use Cases

- Render inline brand label inside a Stack
- Render muted helper span next to a heading

## Semantics

- Root element is span
- Use Text for paragraph blocks and Title for headings

## Example default

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Inline(ui.InlineProps{Class: "text-muted-foreground"}) { { "Workspace catalog" } }
}
```
