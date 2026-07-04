---
id: components.tabs
layer: composite
kind: navigation
package: github.com/fastygo/templ/components/tabs
facade: github.com/fastygo/templ/components
templ: Tabs
parts:
  - templ: Tabs
    props: [ID, Variant, Class, Value, Behavior, Attrs]
  - templ: TabsList
    props: [Class, AriaLabel, Attrs]
  - templ: TabsTrigger
    props: [ID, Value, PanelID, Active, Disabled, Class, Attrs]
  - templ: TabsPanel
    props: [ID, Value, LabelledBy, Active, Class, Attrs]
api:
  Variant:
    role: appearance
    type: string
    cva: true
    enum: [default, card]
    allow-list-source: tabs.variants.json#variant
    default: default
  Behavior:
    role: behavior-hook
    type: string
    cva: false
    enum: ["", ui8kit]
    default: ""
  Value:
    role: state
    type: string
    cva: false
    notes: 'Initially active tab value on Tabs/TabsTrigger/TabsPanel. With Behavior=ui8kit, @ui8kit/aria owns switching after mount — pass Value only as initial SSR state.'
  PanelID:
    role: id-reference
    type: string
    cva: false
    notes: 'ID of the TabsPanel this TabsTrigger controls. Emits aria-controls. React prop: panelId.'
  Active:
    role: state
    type: bool
    cva: false
    default: false
    notes: 'Marks the currently selected trigger/visible panel. TabsPanel renders hidden when Active is false.'
showcase:
  - id: default
    props: { ID: demo-tabs, Value: "account" }
  - id: behavior.ui8kit
    props: { ID: demo-tabs, Behavior: ui8kit, Value: "account" }
semantics:
  root: div[role=tablist-container]
  role: tablist
  behavior: optional
targets:
  react:
    component: Tabs
    facade: '@fastygo/templ-react'
    test: ../../examples/vite/tests/tabs-ui8kit-contract.test.tsx
    describe: 'Tabs ui8kit markup contract'
    package: '@fastygo/templ-react/components/tabs'
    notes:
      - 'Declarative value? sets initial selection only; runtime uses @ui8kit/aria when behavior="ui8kit".'
      - 'TabsTrigger uses panelId (React) / PanelID (Go) — same id-reference field, PascalCase-normalized like every other prop.'
      - 'behavior="ui8kit" emits data-ui8kit="tabs" on root and data-tabs-trigger/data-tabs-panel/data-tabs-value hooks matching Templ markup.'
  templ:
    component: Tabs
    facade: github.com/fastygo/templ/components
    package: github.com/fastygo/templ/components/tabs
---

## Summary

Tabs composes a tablist with triggers and panels following the APG Tabs
pattern. Behavior hooks are opt-in through Behavior.

## Use Cases

- Render switchable settings sections
- Render dashboard panel groups without navigation

## Semantics

- TabsList root has role tablist; TabsTrigger has role tab with aria-selected
- TabsTrigger wires aria-controls to its TabsPanel; TabsPanel wires aria-labelledby back
- Behavior ui8kit adds data-ui8kit="tabs" plus data-tabs-trigger/data-tabs-panel/data-tabs-value hooks; @ui8kit/aria owns activation runtime on every runtime port
- Value sets initial selection only. With Behavior=ui8kit, do not bind Value to a runtime's own reactive component state — re-renders must not overwrite attributes that @ui8kit/aria toggles at runtime

## Example default

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.Tabs(cmp.TabsProps{ID: "demo-tabs", Value: "account"}) {
		@cmp.TabsList(cmp.TabsListProps{AriaLabel: "Settings"}) {
			@cmp.TabsTrigger(cmp.TabsTriggerProps{Value: "account", PanelID: "panel-account", Active: true}) { Account }
			@cmp.TabsTrigger(cmp.TabsTriggerProps{Value: "billing", PanelID: "panel-billing"}) { Billing }
		}
		@cmp.TabsPanel(cmp.TabsPanelProps{ID: "panel-account", Value: "account", LabelledBy: "account", Active: true}) {
			Account settings
		}
		@cmp.TabsPanel(cmp.TabsPanelProps{ID: "panel-billing", Value: "billing", LabelledBy: "billing"}) {
			Billing settings
		}
	}
}
```

## Example behavior.ui8kit

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.Tabs(cmp.TabsProps{ID: "demo-tabs", Behavior: "ui8kit", Value: "account"}) {
		@cmp.TabsList(cmp.TabsListProps{AriaLabel: "Settings"}) {
			@cmp.TabsTrigger(cmp.TabsTriggerProps{Value: "account", PanelID: "panel-account", Active: true}) { Account }
			@cmp.TabsTrigger(cmp.TabsTriggerProps{Value: "billing", PanelID: "panel-billing"}) { Billing }
		}
		@cmp.TabsPanel(cmp.TabsPanelProps{ID: "panel-account", Value: "account", LabelledBy: "account", Active: true}) {
			Account settings
		}
		@cmp.TabsPanel(cmp.TabsPanelProps{ID: "panel-billing", Value: "billing", LabelledBy: "billing"}) {
			Billing settings
		}
	}
}
```
