---
api:
    BaseClass:
        cva: false
        role: icon-pack-base-class
        type: string
    Decorative:
        cva: false
        default: false
        role: accessibility
        type: bool
    Href:
        cva: false
        role: svg-use-reference
        type: string
    Name:
        cva: false
        role: icon-name
        type: string
    Prefix:
        cva: false
        role: icon-name-prefix
        type: string
    Size:
        allow-list-source: icon.variants.json#size
        cva: true
        default: default
        enum:
            - xs
            - sm
            - default
            - md
            - lg
            - xl
        role: density
        type: string
    Title:
        cva: false
        role: accessible-name
        type: string
    Type:
        allow-list-source: icon.variants.json#type
        cva: true
        default: class
        enum:
            - class
            - svg
            - text
        role: render-mode
        type: string
data: icon.data.json
facade: github.com/fastygo/templ/ui
id: ui.icon
kind: media
layer: primitive
package: github.com/fastygo/templ/ui/icon
semantics:
    behavior: static
    data: icon.data.json
    root: span | svg
showcase:
    - id: type.class
      props:
        BaseClass: icon
        Name: home
        Prefix: icon-
        Size: sm
        Type: class
      ref: type.class
    - id: type.svg
      props:
        Href: '#check'
        Title: Done
        Type: svg
      ref: type.svg
targets:
    react:
        component: Icon
        test: ../../examples/vite/tests/ui/icon.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/icon'
    templ:
        component: Icon
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/icon
templ: Icon
variants: icon.variants.json
---
## Summary

Icon renders a class-based span, svg use reference, or text fallback.
Decorative icons are hidden from assistive technology by default.

## Use Cases

- Render navigation and toolbar icons
- Render inline SVG sprite references

## Semantics

- Empty Title and AriaLabel make the icon decorative
- Accessible icons receive role img

## Example type.class

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Icon(ui.IconProps{BaseClass: "icon", Prefix: "icon-", Name: "home", Size: "sm"})
}
```

## Example type.svg

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Icon(ui.IconProps{Type: "svg", Href: "#check", Title: "Done"})
}
```
