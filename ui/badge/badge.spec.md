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
    Size:
        allow-list-source: badge.variants.json#size
        cva: true
        default: default
        enum:
            - default
            - sm
            - lg
        role: density
        type: string
    Variant:
        allow-list-source: badge.variants.json#variant
        cva: true
        default: default
        enum:
            - default
            - secondary
            - destructive
            - outline
        role: appearance
        type: string
data: badge.data.json
facade: github.com/fastygo/templ/ui
id: ui.badge
kind: label
layer: primitive
package: github.com/fastygo/templ/ui/badge
semantics:
    behavior: static
    data: badge.data.json
    role: none
    root: div
showcase:
    - id: variant.default
      props:
        Size: default
        Variant: default
      ref: variant.default
    - id: variant.secondary
      props:
        Size: default
        Variant: secondary
      ref: variant.secondary
    - id: variant.destructive
      props:
        Size: default
        Variant: destructive
      ref: variant.destructive
    - id: variant.outline
      props:
        Size: default
        Variant: outline
      ref: variant.outline
    - id: size.sm
      props:
        Size: sm
        Variant: default
      ref: size.sm
    - id: size.lg
      props:
        Size: lg
        Variant: default
      ref: size.lg
slots:
    default:
        accepts: text
        required: true
targets:
    react:
        component: Badge
        test: ../../examples/vite/tests/ui/badge.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/badge'
    templ:
        component: Badge
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/badge
templ: Badge
variants: badge.variants.json
---
## Summary

Badge shows a short status label.
Badge uses variant and size presets.

## Use Cases

- Show item status in a list
- Show a count next to a title
- Show a category tag on content

## Semantics

- Root element is div
- Badge has no interactive role
- Badge content comes from children

## Example variant.default

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Badge(ui.BadgeProps{Variant: "default"}) {
		Default
	}
}
```

## Example variant.secondary

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Badge(ui.BadgeProps{Variant: "secondary"}) {
		Secondary
	}
}
```

## Example variant.destructive

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Badge(ui.BadgeProps{Variant: "destructive"}) {
		Destructive
	}
}
```

## Example variant.outline

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Badge(ui.BadgeProps{Variant: "outline"}) {
		Outline
	}
}
```

## Example size.sm

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Badge(ui.BadgeProps{Size: "sm"}) {
		Small
	}
}
```

## Example size.lg

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Badge(ui.BadgeProps{Size: "lg"}) {
		Large
	}
}
```
