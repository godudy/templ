---
id: ui.breadcrumb
layer: composite
kind: navigation
package: github.com/fastygo/templ/ui/breadcrumb
facade: github.com/fastygo/templ/ui
templ: Breadcrumb
targets:
  templ:
    package: github.com/fastygo/templ/ui/breadcrumb
    facade: github.com/fastygo/templ/ui
    component: Breadcrumb
  react:
    package: '@fastygo/templ-react/ui/breadcrumb'
    facade: '@fastygo/templ-react'
    component: Breadcrumb
    test: ../../examples/vite/tests/ui/breadcrumb.smoke.test.tsx
api:
  Items:
    role: trail
    type: "[]BreadcrumbItem"
    cva: false
  Class:
    role: style-extension
    type: string
    cva: false
  AriaLabel:
    role: accessible-name
    type: string
    cva: false
  DataUI8Kit:
    role: behavior-hook
    type: string
    cva: false
    enum: ["", ui8kit]
    default: ""
  Attrs:
    role: html-attrs
    type: templ.Attributes
    cva: false
item-props:
  Label:
    role: crumb-label
    type: string
  Href:
    role: crumb-link
    type: string
  Current:
    role: current-page
    type: bool
  Disabled:
    role: disabled-crumb
    type: bool
showcase:
  - id: layout.standard
    props:
      Items:
        - { Label: Home, Href: / }
        - { Label: Docs, Href: /docs }
        - { Label: Button, Current: true }
  - id: state.disabled
    props:
      Items:
        - { Label: Home, Href: / }
        - { Label: Locked, Disabled: true }
semantics:
  root: nav
  list-root: ol
  role: navigation
  aria-label: from AriaLabel prop
  behavior: static
  current-attr: aria-current page

---
## Summary

Breadcrumb shows the current page trail.
Breadcrumb sets aria-current on the active item.

## Use Cases

- Show docs hierarchy above page title
- Mark the current page without a link

## Semantics

- Root element is nav
- AriaLabel and DataUI8Kit are explicit opt-in props
- Items render as ol li elements
- Href renders anchor when link is enabled

## Example layout.standard

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Breadcrumb(ui.BreadcrumbProps{
		AriaLabel: "Breadcrumb",
		Items: []ui.BreadcrumbItem{
			{Label: "Home", Href: "/"},
			{Label: "Docs", Href: "/docs"},
			{Label: "Button", Current: true},
		},
	})
}
```

## Example state.disabled

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Breadcrumb(ui.BreadcrumbProps{
		AriaLabel: "Breadcrumb",
		Items: []ui.BreadcrumbItem{
			{Label: "Home", Href: "/"},
			{Label: "Locked", Disabled: true},
		},
	})
}
```
