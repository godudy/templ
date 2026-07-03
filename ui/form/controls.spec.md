---
id: ui.form.controls
layer: primitive
kind: form
package: github.com/fastygo/templ/ui/form
facade: github.com/fastygo/templ/ui
templ: Fieldset

targets:
  templ:
    package: github.com/fastygo/templ/ui/form
    facade: github.com/fastygo/templ/ui
    component: Fieldset
  react:
    package: "@fastygo/templ-react/ui/form"
    facade: "@fastygo/templ-react"
    component: Fieldset
    test: ../../examples/vite/tests/ui/form-controls.smoke.test.tsx

variants: fieldset.variants.json
variant_recipes:
  legend: legend.variants.json
  meter: meter.variants.json
  progress: progress.variants.json
data: controls.data.json

parts:
  - templ: Fieldset
    props: [Variant, Size, Class, Name, Form, Disabled, Attrs]
    recipe: fieldset.variants.json
  - templ: Legend
    props: [Variant, Size, Class, Attrs]
    recipe: legend.variants.json
  - templ: DataList
    props: [ID, Class, Attrs]
  - templ: DataOption
    props: [Value, Label, Attrs]
  - templ: Output
    props: [ID, Class, Name, For, Value, Attrs]
  - templ: Meter
    props: [Variant, Size, ID, Class, Value, Min, Max, Low, High, Optimum, Attrs]
    recipe: meter.variants.json
  - templ: Progress
    props: [Variant, Size, ID, Class, Value, Max, Attrs]
    recipe: progress.variants.json

api:
  Variant:
    role: appearance
    type: string
    cva: true
    enum: [default, card, inline]
    allow-list-source: fieldset.variants.json#variant
    applies-to: Fieldset
    default: default
  Size:
    role: density
    type: string
    cva: true
    enum: [sm, default, lg]
    allow-list-source: fieldset.variants.json#size
    applies-to: Fieldset
    default: default
  LegendVariant:
    role: appearance
    type: string
    cva: true
    enum: [default, muted]
    allow-list-source: legend.variants.json#variant
    applies-to: Legend
    default: default
  LegendSize:
    role: density
    type: string
    cva: true
    enum: [sm, default, lg]
    allow-list-source: legend.variants.json#size
    applies-to: Legend
    default: default
  MeterVariant:
    role: appearance
    type: string
    cva: true
    enum: [default, muted]
    allow-list-source: meter.variants.json#variant
    applies-to: Meter
    default: default
  MeterSize:
    role: density
    type: string
    cva: true
    enum: [sm, default, lg]
    allow-list-source: meter.variants.json#size
    applies-to: Meter
    default: default
  ProgressVariant:
    role: appearance
    type: string
    cva: true
    enum: [default, muted]
    allow-list-source: progress.variants.json#variant
    applies-to: Progress
    default: default
  ProgressSize:
    role: density
    type: string
    cva: true
    enum: [sm, default, lg]
    allow-list-source: progress.variants.json#size
    applies-to: Progress
    default: default
  Class:
    role: style-extension
    type: string
    cva: false

showcase:
  - id: group.fieldset
    ref: group.fieldset
  - id: status.progress
    ref: status.progress

semantics:
  root: fieldset | legend | datalist | option | output | meter | progress
  behavior: native-form
  data: controls.data.json
---

## Summary

Form controls covers fieldset, legend, datalist, output, meter, and progress.
Fieldset, Legend, Meter, and Progress each have distinct variant recipe files.

## Variant recipes

| Part | Recipe file | Variant keys | Size keys |
|------|-------------|--------------|-----------|
| Fieldset | fieldset.variants.json | default, card, inline | sm, default, lg |
| Legend | legend.variants.json | default, muted | sm, default, lg |
| Meter | meter.variants.json | default, muted | sm, default, lg |
| Progress | progress.variants.json | default, muted | sm, default, lg |

DataList, DataOption, and Output are base-class only (no variant recipe).

## Use Cases

- Group related form controls
- Render autocomplete values, calculated output, quotas, and progress

## Semantics

- Fieldset and Legend preserve native grouping semantics
- Meter and Progress use native status elements

## Example group.fieldset

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Fieldset(ui.FieldsetProps{Variant: "card"}) {
		@ui.Legend(ui.LegendProps{}) { Account }
		@ui.Input(ui.InputProps{Name: "email"})
	}
}
```

## Example status.progress

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Progress(ui.ProgressProps{Value: "40", Max: "100"})
}
```
