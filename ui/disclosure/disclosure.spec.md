---
api:
    Open:
        cva: false
        default: false
        role: state
        type: bool
    Size:
        allow-list-source: disclosure.variants.json#size
        cva: true
        default: default
        enum:
            - sm
            - default
            - lg
        role: density
        type: string
    SummarySize:
        allow-list-source: summary.variants.json#size
        applies-to: Summary
        cva: true
        default: default
        enum:
            - sm
            - default
            - lg
        role: density
        type: string
    SummaryVariant:
        allow-list-source: summary.variants.json#variant
        applies-to: Summary
        cva: true
        default: default
        enum:
            - default
            - ghost
            - card
        role: appearance
        type: string
    Variant:
        allow-list-source: disclosure.variants.json#variant
        cva: true
        default: default
        enum:
            - default
            - ghost
            - card
        role: appearance
        type: string
data: disclosure.data.json
facade: github.com/fastygo/templ/ui
id: ui.disclosure
kind: interactive
layer: primitive
package: github.com/fastygo/templ/ui/disclosure
variant_recipes:
    summary: summary.variants.json
parts:
    - props:
        - Variant
        - Size
        - Class
        - Open
        - Attrs
      templ: Disclosure
    - props:
        - Variant
        - Size
        - Class
        - Attrs
      slot: trigger
      templ: Summary
semantics:
    behavior: native-disclosure
    data: disclosure.data.json
    root: details
    trigger-root: summary
showcase:
    - id: variant.default
      props:
        Variant: default
      ref: variant.default
    - id: state.open
      props:
        Open: true
      ref: state.open
targets:
    react:
        component: Disclosure
        test: ../../examples/vite/tests/ui/disclosure.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/disclosure'
    templ:
        component: Disclosure
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/disclosure
templ: Disclosure
variants: disclosure.variants.json
---
## Summary

Disclosure renders native details and summary elements.
Summary uses summary.variants.json; Disclosure uses disclosure.variants.json.

## Use Cases

- Render FAQ rows
- Render compact settings and optional form sections

## Semantics

- Disclosure uses native details open state
- Summary must be the visible trigger

## Example variant.default

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Disclosure(ui.DisclosureProps{}) {
		@ui.Summary(ui.SummaryProps{}) { More options }
		@ui.Text(ui.TextProps{}) { { "Hidden content." } }
	}
}
```

## Example state.open

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Disclosure(ui.DisclosureProps{Open: true}) {
		@ui.Summary(ui.SummaryProps{}) { Details }
		@ui.Text(ui.TextProps{}) { { "Visible content." } }
	}
}
```
