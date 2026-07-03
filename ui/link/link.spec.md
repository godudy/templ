---
api:
    AriaCurrent:
        cva: false
        role: current-state
        type: string
    External:
        cva: false
        default: false
        role: security
        type: bool
    Href:
        cva: false
        role: destination
        type: string
    Size:
        allow-list-source: link.variants.json#size
        cva: true
        default: default
        enum:
            - sm
            - default
            - md
            - lg
        role: density
        type: string
    Variant:
        allow-list-source: link.variants.json#variant
        cva: true
        default: default
        enum:
            - default
            - muted
            - nav
            - block
            - external
        role: appearance
        type: string
data: link.data.json
facade: github.com/fastygo/templ/ui
id: ui.link
kind: navigation
layer: primitive
package: github.com/fastygo/templ/ui/link
semantics:
    behavior: interactive
    data: link.data.json
    root: a
showcase:
    - id: variant.default
      props:
        Href: /docs
      ref: variant.default
    - id: variant.external
      props:
        External: true
        Href: https://example.com
      ref: variant.external
targets:
    react:
        component: Link
        test: ../../examples/vite/tests/ui/link.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/link'
    templ:
        component: Link
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/link
templ: Link
variants: link.variants.json
---
## Summary

Link renders a semantic anchor for navigation and prose.
Use Button for actions.

## Use Cases

- Render navigation links
- Render prose links and external resources

## Semantics

- External links default target blank and rel noopener noreferrer
- Disabled links set aria-disabled and tabindex -1

## Example variant.default

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Link(ui.LinkProps{Href: "/docs"}) { Docs }
}
```

## Example variant.external

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Link(ui.LinkProps{Href: "https://example.com", External: true}) { External }
}
```
