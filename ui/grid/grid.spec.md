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
    Cols:
        cva: false
        default: 1
        enum:
            - 1
            - 2
            - 3
            - 4
            - 5
            - 6
            - 7
            - 8
            - 9
            - 10
            - 11
            - 12
            - 1-2
            - 1-3
            - 1-4
        role: column-count
        type: string
data: grid.data.json
facade: github.com/fastygo/templ/ui
id: ui.grid
kind: layout
layer: primitive
package: github.com/fastygo/templ/ui/grid
parts:
    - props:
        - Class
        - Cols
        - Attrs
      templ: Grid
    - props:
        - Class
        - Span
        - Start
        - End
        - Order
        - Attrs
      slot: column
      templ: GridCol
semantics:
    behavior: static
    data: grid.data.json
    layout: grid
    role: none
    root: div
showcase:
    - id: layout.two-col
      props:
        Class: gap-4 md:grid-cols-2
      ref: layout.two-col
    - id: layout.three-col
      props:
        Class: gap-4 md:grid-cols-2 xl:grid-cols-3
      ref: layout.three-col
targets:
    react:
        component: Grid
        test: ../../examples/vite/tests/ui/grid.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/grid'
    templ:
        component: Grid
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/grid
templ: Grid
variants: grid.variants.json
---
## Summary

Grid lays out children in a CSS grid container.
GridCol wraps one column cell inside Grid.
Cols/Span/Start/End/Order remain for compatibility but are legacy convenience props.

## Use Cases

- Show two KPI cards in one row
- Split form label and control in two columns

## Semantics

- Grid root is div with grid class from grid.variants.json
- GridCol root is div without default grid class
- Cols, Span, Start, End, and Order are legacy convenience props kept for backward compatibility
- New code should prefer explicit layout utilities in Class (for example `md:grid-cols-2`, `col-span-6`, `col-start-2`)

## Example layout.two-col

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Grid(ui.GridProps{Class: "gap-4 md:grid-cols-2"}) {
		@ui.GridCol(ui.GridColProps{}) {
			@ui.Text(ui.TextProps{}) { { "Column A" } }
		}
		@ui.GridCol(ui.GridColProps{}) {
			@ui.Text(ui.TextProps{}) { { "Column B" } }
		}
	}
}
```

## Example layout.three-col

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Grid(ui.GridProps{Class: "gap-4 md:grid-cols-2 xl:grid-cols-3"}) {
		@ui.GridCol(ui.GridColProps{}) { A }
		@ui.GridCol(ui.GridColProps{}) { B }
		@ui.GridCol(ui.GridColProps{}) { C }
	}
}
```

## Legacy compatibility note

`GridProps.Cols` and `GridColProps` numeric helpers (`Span`, `Start`, `End`, `Order`)
are still accepted in existing code paths. Prefer `Class` utilities in new code,
and keep legacy props only when touching older scaffolds incrementally.
