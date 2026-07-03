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
    ColSpan:
        applies-to: TableCell
        cva: false
        role: column-span
        type: int
    Scope:
        applies-to: TableHeadCell
        cva: false
        enum:
            - col
            - row
            - colgroup
            - rowgroup
        role: header-scope
        type: string
data: table.data.json
facade: github.com/fastygo/templ/ui
id: ui.table
kind: data
layer: composite
package: github.com/fastygo/templ/ui/table
parts:
    - props:
        - Class
        - Attrs
      templ: Table
    - props:
        - Class
        - Attrs
      slot: caption
      templ: TableCaption
    - props:
        - Class
        - Attrs
      slot: head
      templ: TableHead
    - props:
        - Class
        - Attrs
      slot: body
      templ: TableBody
    - props:
        - Class
        - Attrs
      slot: foot
      templ: TableFoot
    - props:
        - Class
        - Attrs
      slot: row
      templ: TableRow
    - props:
        - Class
        - Scope
        - Abbr
        - Attrs
      slot: head-cell
      templ: TableHeadCell
    - props:
        - Class
        - ColSpan
        - RowSpan
        - Headers
        - Attrs
      slot: cell
      templ: TableCell
    - props:
        - Class
        - Span
        - Attrs
      slot: colgroup
      templ: TableColGroup
    - props:
        - Class
        - Span
        - Attrs
      slot: col
      templ: TableCol
semantics:
    behavior: static
    data: table.data.json
    root: table
    role: table
showcase:
    - id: layout.basic
      parts:
        - Table
        - TableHead
        - TableBody
        - TableRow
        - TableHeadCell
        - TableCell
      props:
        Scope: col
      ref: layout.basic
    - id: cell.colspan
      parts:
        - Table
        - TableBody
        - TableRow
        - TableCell
      ref: cell.colspan
targets:
    react:
        component: Table
        test: ../../examples/vite/tests/ui/table.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/table'
    templ:
        component: Table
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/table
templ: Table
variants: table.variants.json
---
## Summary

Table composes caption, sections, rows, cells, and optional column definitions.
TableHeadCell supports scope on th elements.

## Use Cases

- Show user list with column headers
- Span one cell across two columns with ColSpan
- Define column widths with TableColGroup and TableCol

## Semantics

- Table root is native table element styled via table.variants.json
- TableHeadCell sets scope when Scope prop is valid

## Example layout.basic

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Table(ui.TableProps{Class: "w-full text-sm"}) {
		@ui.TableHead(ui.TableSectionProps{}) {
			@ui.TableRow(ui.TableRowProps{}) {
				@ui.TableHeadCell(ui.TableCellProps{Scope: "col"}) { Name }
				@ui.TableHeadCell(ui.TableCellProps{Scope: "col"}) { Role }
			}
		}
		@ui.TableBody(ui.TableSectionProps{}) {
			@ui.TableRow(ui.TableRowProps{}) {
				@ui.TableCell(ui.TableCellProps{}) { Alex }
				@ui.TableCell(ui.TableCellProps{}) { Admin }
			}
		}
	}
}
```

## Example cell.colspan

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Table(ui.TableProps{}) {
		@ui.TableBody(ui.TableSectionProps{}) {
			@ui.TableRow(ui.TableRowProps{}) {
				@ui.TableCell(ui.TableCellProps{ColSpan: 2}) { Spans two columns }
			}
		}
	}
}
```
