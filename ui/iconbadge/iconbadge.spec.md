---
id: ui.iconbadge
layer: composite
kind: media
package: github.com/fastygo/templ/ui/iconbadge
facade: github.com/fastygo/templ/ui
templ: IconBadge
targets:
  templ:
    package: github.com/fastygo/templ/ui/iconbadge
    facade: github.com/fastygo/templ/ui
    component: IconBadge
  react:
    package: '@fastygo/templ-react/ui/iconbadge'
    facade: '@fastygo/templ-react'
    component: IconBadge
    test: ../../examples/vite/tests/ui/iconbadge.smoke.test.tsx
api:
  Variant:
    role: appearance
    type: string
    cva: true
    enum: [default, accent, secondary, outline, destructive]
    allow-list-source: iconbadge.variants.json#variant
    default: default
  Size:
    role: density
    type: string
    cva: true
    enum: [xs, sm, default, lg]
    default: default
  Class:
    role: style-extension
    type: string
    cva: false
  Attrs:
    role: html-attributes
    type: templ.Attributes
    cva: false
  Name:
    role: icon-name
    type: string
    cva: false
    deprecated: true
    deprecated-reason: "Pass content (letter, glyph, or <Icon/>) as children. Removed in next major."
  BaseClass:
    role: icon-pack-base-class
    type: string
    cva: false
    deprecated: true
    deprecated-reason: "Pass an <Icon/> as children instead. Removed in next major."
  Prefix:
    role: icon-name-prefix
    type: string
    cva: false
    deprecated: true
    deprecated-reason: "Pass an <Icon/> as children instead. Removed in next major."
  IconType:
    role: icon-type
    type: string
    cva: false
    deprecated: true
    deprecated-reason: "Pass an <Icon/> as children instead. Removed in next major."
  Text:
    role: text-fallback
    type: string
    cva: false
    deprecated: true
    deprecated-reason: "Pass the letter or glyph as children. Removed in next major."
  Title:
    role: icon-title
    type: string
    cva: false
    deprecated: true
    deprecated-reason: "Pass an <Icon/> as children instead. Removed in next major."
  AriaLabel:
    role: icon-aria-label
    type: string
    cva: false
    deprecated: true
    deprecated-reason: "Pass an <Icon/> as children instead. Removed in next major."
slots:
  default:
    required: true
    accepts: text-or-icon
showcase:
  - id: variant.default
    props: { Variant: default, Size: default }
    children: BY
  - id: icon.pack
    props: { Variant: accent, Size: sm }
    children: <Icon name="home" />
semantics:
  root: span
  behavior: static
---

## Summary

IconBadge renders a small icon surface for nav rows, cards, and status blocks.
Pass the letter, glyph, or `<Icon/>` as children.

## Use Cases

- Render navigation icons with a consistent surface
- Render workflow and feature card pictograms

## Semantics

- Root element is `<span>`
- Children are the content slot (letter, glyph, or `<Icon/>`)
- Legacy `Text`/`Name`/`IconType`/`BaseClass`/`Prefix`/`Title`/`AriaLabel` props are deprecated and only used as a fallback when no children are supplied

## Example variant.default

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.IconBadge(ui.IconBadgeProps{Variant: "default", Size: "default"}) { BY }
}
```

## Example icon.pack

Pass an `Icon` as children to render an SVG pictogram:

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.IconBadge(ui.IconBadgeProps{Variant: "accent", Size: "sm"}) {
		@ui.Icon(ui.IconProps{Name: "home"})
	}
}
```
