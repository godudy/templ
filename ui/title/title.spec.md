---
api:
    As:
        allow-list-source: utils.helpers.TitleTag
        cva: false
        default: 2
        enum:
            - 1
            - 2
            - 3
            - 4
            - 5
            - 6
        role: heading-level
        type: int
    Class:
        cva: false
        role: style-extension
        type: string
data: title.data.json
facade: github.com/fastygo/templ/ui
id: ui.title
kind: typography
layer: primitive
package: github.com/fastygo/templ/ui/title
semantics:
    behavior: static
    data: title.data.json
    role: heading
    root: h1 | h2 | h3 | h4 | h5 | h6
showcase:
    - id: as.h1
      props:
        As: 1
      ref: as.h1
    - id: as.h2
      props:
        As: 2
      ref: as.h2
    - id: as.h3
      props:
        As: 3
        Class: text-lg
      ref: as.h3
targets:
    react:
        component: Title
        test: ../../examples/vite/tests/ui/title.smoke.test.tsx
        facade: '@fastygo/templ-react'
        notes:
          - "as?: 1 | 2 | 3 | 4 | 5 | 6 (defaults to 2). H1–H6 shortcut exports are available."
        package: '@fastygo/templ-react/ui/title'
    templ:
        component: Title
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/title
templ: Title
variants: title.variants.json
---
## Summary

Title renders a heading from the `As` prop (1–6). React additionally exports `H1`–`H6` shortcuts.

## Use Cases

- Render a page title with `As: 1` (`H1` in React)
- Render a section title with `As: 2` (`H2` in React)

## Semantics

- `As` 0 and 2 default to `<h2>`
- `As` 1 maps to `<h1>`, `As` 3 to `<h3>`, etc.

## Example as.h1

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Title(ui.TitleProps{As: 1}) { { "Page title" } }
}
```

## Example as.h2

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Title(ui.TitleProps{As: 2}) { { "Section title" } }
}
```

## Example as.h3

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Title(ui.TitleProps{As: 3, Class: "text-lg"}) { { "Subsection title" } }
}
```
