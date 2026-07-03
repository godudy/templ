---
id: components.nav
layer: composite
kind: navigation
package: github.com/fastygo/templ/components/nav
facade: github.com/fastygo/templ/components
templ: Nav
targets:
  templ:
    package: github.com/fastygo/templ/components/nav
    facade: github.com/fastygo/templ/components
    component: Nav
  react:
    package: '@fastygo/templ-react/components/nav'
    facade: '@fastygo/templ-react'
    component: Nav
    test: ../../examples/vite/tests/components.smoke.test.tsx
parts:
  - templ: Nav
    props: [Class, AriaLabel, DataUI8Kit, Attrs]
  - templ: NavList
    props: [Class, Orientation, Gap, Attrs]
  - templ: NavItem
    props: [Class, Attrs]
  - templ: NavLink
    props: [Href, Variant, Size, Class, Active, Disabled, AriaCurrent, AriaLabel, Attrs]
api:
  Orientation:
    role: direction
    type: string
    cva: true
    enum: [vertical, horizontal]
    allow-list-source: nav-list.variants.json#orientation
    default: vertical
  LinkVariant:
    role: appearance
    type: string
    cva: true
    enum: [default, active, ghost, muted]
    allow-list-source: nav-link.variants.json#variant
    default: default
  Size:
    role: density
    type: string
    cva: true
    enum: [sm, default, lg]
    allow-list-source: nav-link.variants.json#size
    default: default
  Gap:
    role: layout-spacing
    type: string
    cva: true
    enum: [none, default, lg]
    allow-list-source: nav-list.variants.json#gap
    default: default
    applies-to: NavList
showcase:
  - id: layout.vertical
    props: { AriaLabel: "Primary navigation" }
  - id: state.active
    props: { Active: true }
  - id: state.disabled
    props: { Disabled: true }
semantics:
  root: nav
  list-root: ul
  item-root: li
  link-root: a | span
  behavior: static
---

## Summary

Nav composes labeled navigation lists with active and disabled links.

## Use Cases

- Render sidebars and top navigation
- Render current-page states without custom class helpers

## Semantics

- Nav root accepts an explicit AriaLabel
- Active links default aria-current to page
- Enabled links with non-empty Href render semantic anchor tags
- Disabled links or links with empty Href render span with aria-disabled
- This root switch is semantic/accessibility behavior, not `asChild` composition

## Why NavLink is polymorphic (a | span)

`NavLink` intentionally controls its own root element:

- `<a>` for interactive navigation (`Href` present and not disabled)
- `<span>` for non-interactive states (`Disabled` true or missing/empty `Href`)

This keeps disabled nav items non-navigable and avoids invalid "disabled link"
patterns. Unlike `asChild`, this is not caller-driven root delegation; it is
a built-in semantic rule of the navigation contract.

## Example layout.vertical

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.Nav(cmp.NavProps{AriaLabel: "Primary navigation"}) {
		@cmp.NavList(cmp.NavListProps{}) {
			@cmp.NavItem(cmp.NavItemProps{}) {
				@cmp.NavLink(cmp.NavLinkProps{Href: "/", Active: true}) { Home }
			}
		}
	}
}
```

## Example state.active

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.NavLink(cmp.NavLinkProps{Href: "/docs", Active: true}) { Docs }
}
```

## Example state.disabled

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.NavLink(cmp.NavLinkProps{Disabled: true}) { Disabled item }
}
```
