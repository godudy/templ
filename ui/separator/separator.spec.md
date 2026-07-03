---
api:
    Decorative:
        cva: false
        default: false
        role: accessibility
        type: bool
    Orientation:
        cva: false
        default: horizontal
        enum:
            - horizontal
            - vertical
        role: direction
        type: string
    Variant:
        allow-list-source: separator.variants.json#variant
        cva: true
        default: default
        enum:
            - default
            - muted
            - strong
            - spaced
        role: appearance
        type: string
data: separator.data.json
facade: github.com/fastygo/templ/ui
id: ui.separator
kind: layout
layer: primitive
package: github.com/fastygo/templ/ui/separator
semantics:
    behavior: static
    data: separator.data.json
    root: hr
showcase:
    - id: variant.default
      props:
        Variant: default
      ref: variant.default
    - id: orientation.vertical
      props:
        Decorative: true
        Orientation: vertical
      ref: orientation.vertical
targets:
    react:
        component: Separator
        test: ../../examples/vite/tests/ui/separator.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/separator'
    templ:
        component: Separator
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/separator
templ: Separator
variants: separator.variants.json
---
## Summary

Separator renders a semantic or decorative hr.

## Use Cases

- Separate form sections
- Separate toolbar or navigation groups

## Semantics

- Decorative separators set role presentation and aria-hidden true

## Example variant.default

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Separator(ui.SeparatorProps{})
}
```

## Example orientation.vertical

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Separator(ui.SeparatorProps{Orientation: "vertical", Decorative: true})
}
```
