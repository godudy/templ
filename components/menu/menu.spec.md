---
id: components.menu
layer: composite
kind: navigation
package: github.com/fastygo/templ/components/menu
facade: github.com/fastygo/templ/components
templ: Menu
parts:
  - templ: MenuButton
    props: [ID, MenuID, Class, Variant, Size, Open, Behavior, AriaLabel, Attrs]
  - templ: Menu
    props: [ID, Variant, Class, Open, Behavior, Attrs]
  - templ: MenuItem
    props: [ID, Disabled, Class, Attrs]
api:
  Variant:
    role: appearance
    type: string
    cva: true
    enum: [default, card]
    allow-list-source: menu.variants.json#variant
    default: default
  Behavior:
    role: behavior-hook
    type: string
    cva: false
    enum: ["", ui8kit]
    default: ""
  Open:
    role: state
    type: bool
    cva: false
    default: false
    notes: 'Initial state for SSR + first client-side render. With Behavior=ui8kit runtime is owned by @ui8kit/aria.'
  MenuID:
    role: id-reference
    type: string
    cva: false
    notes: 'ID of the Menu this MenuButton controls. Emits aria-controls and, with Behavior=ui8kit, data-menubutton-target. React prop: menuId.'
showcase:
  - id: default
    props: { ID: demo-menu, AriaLabel: "Open actions menu" }
  - id: behavior.ui8kit
    props: { ID: demo-menu, Behavior: ui8kit }
semantics:
  root: div[role=menu]
  role: menu
  behavior: optional
targets:
  react:
    component: Menu
    facade: '@fastygo/templ-react'
    test: ../../examples/vite/tests/menu-ui8kit-contract.test.tsx
    describe: 'Menu ui8kit markup contract'
    package: '@fastygo/templ-react/components/menu'
    notes:
      - 'Declarative open?: boolean sets initial hidden/data-state only; runtime uses @ui8kit/aria when behavior="ui8kit".'
      - 'MenuButton uses menuId (React) / MenuID (Go) — same id-reference field, PascalCase-normalized like every other prop.'
      - 'behavior="ui8kit" emits data-ui8kit="menubutton" on the trigger and data-ui8kit="menu" plus data-menu-item hooks on the list, combining the APG Menu and Menu Button patterns.'
      - 'MenuButton supports asChild (Radix-style Slot) for anchor triggers.'
  templ:
    component: Menu
    facade: github.com/fastygo/templ/components
    package: github.com/fastygo/templ/components/menu
---

## Summary

Menu composes a button-triggered action menu, combining the APG Menu Button
(trigger) and Menu (list) patterns. Behavior hooks are opt-in through
Behavior.

## Use Cases

- Render dropdown action menus (row actions, overflow menus)
- Render application-level command menus triggered from a toolbar button

## Semantics

- MenuButton wires aria-haspopup="menu", aria-controls, and aria-expanded
- Menu root has role menu; MenuItem has role menuitem
- Behavior ui8kit adds data-ui8kit="menubutton" on the trigger and data-ui8kit="menu" plus data-menu-item hooks on the list; @ui8kit/aria owns open/close and roving-tabindex navigation on every runtime port
- Open sets initial hidden/data-state/aria-expanded only. With Behavior=ui8kit, do not bind Open to a runtime's own reactive component state — re-renders must not overwrite attributes that @ui8kit/aria toggles at runtime

## Example default

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.MenuButton(cmp.MenuButtonProps{MenuID: "demo-menu", AriaLabel: "Open actions menu"}) { Actions }
	@cmp.Menu(cmp.MenuProps{ID: "demo-menu"}) {
		@cmp.MenuItem(cmp.MenuItemProps{}) { Edit }
		@cmp.MenuItem(cmp.MenuItemProps{}) { Duplicate }
		@cmp.MenuItem(cmp.MenuItemProps{Disabled: true}) { Delete }
	}
}
```

## Example behavior.ui8kit

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.MenuButton(cmp.MenuButtonProps{MenuID: "demo-menu", Behavior: "ui8kit"}) { Actions }
	@cmp.Menu(cmp.MenuProps{ID: "demo-menu", Behavior: "ui8kit"}) {
		@cmp.MenuItem(cmp.MenuItemProps{}) { Edit }
		@cmp.MenuItem(cmp.MenuItemProps{}) { Duplicate }
	}
}
```
