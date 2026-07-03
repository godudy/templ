---
api:
    Class:
        cva: false
        role: style-extension
        type: string
    Type:
        cva: false
        default: br
        enum:
            - br
            - wbr
            - word
        role: break-type
        type: string
data: linebreak.data.json
facade: github.com/fastygo/templ/ui
id: ui.linebreak
kind: typography
layer: primitive
package: github.com/fastygo/templ/ui/linebreak
semantics:
    behavior: static
    data: linebreak.data.json
    root: br | wbr
showcase:
    - id: type.br
      props:
        Type: br
      ref: type.br
    - id: type.wbr
      props:
        Type: wbr
      ref: type.wbr
targets:
    react:
        component: Break
        test: ../../examples/vite/tests/ui/linebreak.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/linebreak'
    templ:
        component: Break
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/linebreak
templ: Break
variants: linebreak.variants.json
---
## Summary

Break renders br or wbr for controlled inline wrapping.

## Use Cases

- Render intentional line breaks in addresses
- Add optional break points in long tokens

## Semantics

- Type br renders a line break
- Type wbr or word renders an optional word break

## Example type.br

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Break(ui.BreakProps{})
}
```

## Example type.wbr

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Break(ui.BreakProps{Type: "wbr"})
}
```
