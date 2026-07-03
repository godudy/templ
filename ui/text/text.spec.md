---
api:
    Attrs:
        cva: false
        role: html-attributes
        type: templ.Attributes
    Class:
        cva: false
        role: style-extension
        type: string
data: text.data.json
facade: github.com/fastygo/templ/ui
id: ui.text
kind: typography
layer: primitive
package: github.com/fastygo/templ/ui/text
semantics:
    behavior: static
    data: text.data.json
    role: none
    root: p
showcase:
    - id: default
      ref: default
    - id: muted
      props:
        Class: text-muted-foreground
      ref: muted
    - id: code
      props:
        Class: text-sm font-mono
      ref: code
targets:
    react:
        component: Text
        test: ../../examples/vite/tests/ui/text.smoke.test.tsx
        facade: '@fastygo/templ-react'
        notes:
          - "Renders <p>. Use Inline for <span> copy, Title for headings."
        package: '@fastygo/templ-react/ui/text'
    templ:
        component: Text
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/text
templ: Text
variants: text.variants.json
---
## Summary

Text renders a paragraph of body copy as a `<p>`.
Use `Inline` for inline `<span>` copy and `Title` (or `H1`–`H6`) for headings.

## Use Cases

- Render body paragraph copy
- Render muted helper line with `Class: text-muted-foreground`

## Semantics

- Root element is always `<p>`
- For inline copy use `Inline`; for code spans wrap `Inline` with `font-mono`

## Example default

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Text(ui.TextProps{}) { { "Body paragraph text." } }
}
```

## Example muted

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Text(ui.TextProps{Class: "text-muted-foreground"}) { { "Helper line." } }
}
```

## Example code

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Text(ui.TextProps{Class: "text-sm font-mono"}) { { "npm install" } }
}
```
