---
id: components.combobox
layer: composite
kind: form
package: github.com/fastygo/templ/components/combobox
facade: github.com/fastygo/templ/components
templ: Combobox
parts:
  - templ: Combobox
    props: [ID, Variant, Class, Open, Behavior, Attrs]
  - templ: ComboboxInput
    props: [ID, ListID, Class, Value, Placeholder, Disabled, Open, AriaLabel, Attrs]
  - templ: ComboboxToggle
    props: [ID, InputID, ListID, Class, Open, Behavior, AriaLabel, Attrs]
  - templ: ComboboxList
    props: [ID, Class, Open, Attrs]
  - templ: ComboboxOption
    props: [ID, Value, Selected, Disabled, Class, Attrs]
api:
  Variant:
    role: appearance
    type: string
    cva: true
    enum: [default, outline]
    allow-list-source: combobox.variants.json#variant
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
    notes: 'Initial listbox visibility for SSR + first client-side render. With Behavior=ui8kit runtime is owned by @ui8kit/aria.'
  ListID:
    role: id-reference
    type: string
    cva: false
    notes: 'ID of the ComboboxList this ComboboxInput/ComboboxToggle controls. Emits aria-controls. React prop: listId.'
  InputID:
    role: id-reference
    type: string
    cva: false
    notes: 'ID of the ComboboxInput this ComboboxToggle drives. With Behavior=ui8kit emits data-ui8kit-dialog-target. React prop: inputId.'
showcase:
  - id: default
    props: { ID: demo-combobox }
  - id: behavior.ui8kit
    props: { ID: demo-combobox, Behavior: ui8kit }
semantics:
  root: div[data-state]
  role: combobox
  behavior: optional
targets:
  react:
    component: Combobox
    facade: '@fastygo/templ-react'
    test: ../../examples/vite/tests/combobox-ui8kit-contract.test.tsx
    describe: 'Combobox ui8kit markup contract'
    package: '@fastygo/templ-react/components/combobox'
    notes:
      - 'Declarative open? sets initial listbox visibility only; runtime uses @ui8kit/aria when behavior="ui8kit".'
      - 'ComboboxToggle uses inputId/listId (React) / InputID/ListID (Go) — id-reference fields, PascalCase-normalized like every other prop.'
      - 'behavior="ui8kit" emits data-ui8kit="combobox" on root and data-combobox-toggle/data-combobox-option hooks matching Templ markup.'
  templ:
    component: Combobox
    facade: github.com/fastygo/templ/components
    package: github.com/fastygo/templ/components/combobox
---

## Summary

Combobox composes an editable text input with a toggle button and a listbox
of options, following the APG Combobox (select-only and editable) pattern.
Behavior hooks are opt-in through Behavior.

## Use Cases

- Render searchable selects with a filterable option list
- Render autocomplete fields for tags, users, or locations

## Semantics

- ComboboxInput has role combobox with aria-expanded/aria-controls/aria-autocomplete
- ComboboxList has role listbox; ComboboxOption has role option with aria-selected
- Behavior ui8kit adds data-ui8kit="combobox" plus data-combobox-toggle/data-combobox-option hooks; @ui8kit/aria owns filtering, navigation, and open/close runtime on every runtime port
- Open sets initial listbox visibility only. With Behavior=ui8kit, do not bind Open to a runtime's own reactive component state — re-renders must not overwrite attributes that @ui8kit/aria toggles at runtime

## Example default

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.Combobox(cmp.ComboboxProps{ID: "demo-combobox"}) {
		@cmp.ComboboxInput(cmp.ComboboxInputProps{ListID: "demo-combobox-list", AriaLabel: "Choose a fruit"})
		@cmp.ComboboxToggle(cmp.ComboboxToggleProps{ListID: "demo-combobox-list", AriaLabel: "Toggle options"}) { ▾ }
		@cmp.ComboboxList(cmp.ComboboxListProps{ID: "demo-combobox-list"}) {
			@cmp.ComboboxOption(cmp.ComboboxOptionProps{Value: "apple", Selected: true}) { Apple }
			@cmp.ComboboxOption(cmp.ComboboxOptionProps{Value: "banana"}) { Banana }
		}
	}
}
```

## Example behavior.ui8kit

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.Combobox(cmp.ComboboxProps{ID: "demo-combobox", Behavior: "ui8kit"}) {
		@cmp.ComboboxInput(cmp.ComboboxInputProps{ID: "demo-combobox-input", ListID: "demo-combobox-list", AriaLabel: "Choose a fruit"})
		@cmp.ComboboxToggle(cmp.ComboboxToggleProps{InputID: "demo-combobox-input", ListID: "demo-combobox-list", Behavior: "ui8kit", AriaLabel: "Toggle options"}) { ▾ }
		@cmp.ComboboxList(cmp.ComboboxListProps{ID: "demo-combobox-list"}) {
			@cmp.ComboboxOption(cmp.ComboboxOptionProps{Value: "apple", Selected: true}) { Apple }
			@cmp.ComboboxOption(cmp.ComboboxOptionProps{Value: "banana"}) { Banana }
		}
	}
}
```
