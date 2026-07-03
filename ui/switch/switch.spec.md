---
api:
    AriaLabel:
        cva: false
        role: accessible-name
        type: string
    Checked:
        cva: false
        role: state
        type: bool
    Disabled:
        cva: false
        role: state
        type: bool
    Name:
        cva: false
        role: form-name
        type: string
    Size:
        allow-list-source: switch.variants.json#size
        cva: true
        default: default
        enum:
            - default
            - sm
            - lg
            - xs
        role: density
        type: string
    Variant:
        allow-list-source: switch.variants.json#variant
        cva: true
        default: default
        enum:
            - default
            - outline
            - ghost
        role: appearance
        type: string
data: switch.data.json
facade: github.com/fastygo/templ/ui
id: ui.switch
kind: input
layer: primitive
package: github.com/fastygo/templ/ui/switch
semantics:
    aria-checked: dynamic
    behavior: interactive
    data: switch.data.json
    input-type: checkbox
    role: switch
    root: input
showcase:
    - id: state.off
      props:
        AriaLabel: Notifications
        ID: notifications
        Name: notifications
      ref: state.off
    - id: state.on
      props:
        AriaLabel: Notifications
        Checked: true
        ID: notifications
        Name: notifications
      ref: state.on
    - id: state.disabled
      props:
        AriaLabel: Locked setting
        Checked: true
        Disabled: true
        Name: locked
      ref: state.disabled
targets:
    react:
        component: Switch
        test: ../../examples/vite/tests/ui/switch.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/switch'
    templ:
        component: Switch
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/switch
templ: Switch
variants: switch.variants.json
---
## Summary

Switch renders a toggle with switch ARIA semantics.
SwitchAttrs sets role switch and aria-checked.

## Use Cases

- Toggle notifications on or off
- Toggle feature flags in settings forms

## Semantics

- Native input type is checkbox
- SwitchAttrs overrides role to switch
- aria-checked mirrors Checked prop at render time

## Example state.off

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Switch(ui.SwitchProps{
		Name:      "notifications",
		ID:        "notifications",
		AriaLabel: "Notifications",
	})
}
```

## Example state.on

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Switch(ui.SwitchProps{
		Name:      "notifications",
		ID:        "notifications",
		Checked:   true,
		AriaLabel: "Notifications",
	})
}
```

## Example state.disabled

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Switch(ui.SwitchProps{
		Name:      "locked",
		Disabled:  true,
		Checked:   true,
		AriaLabel: "Locked setting",
	})
}
```
