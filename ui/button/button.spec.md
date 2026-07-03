---
api:
    AriaLabel:
        cva: false
        role: accessible-name
        type: string
    AsChild:
        cva: false
        default: false
        role: composition
        type: bool
    Attrs:
        cva: false
        role: html-attrs
        type: templ.Attributes
    Class:
        cva: false
        role: style-extension
        type: string
    Disabled:
        cva: false
        default: false
        role: state
        type: bool
    Form:
        cva: false
        role: association
        type: string
    ID:
        cva: false
        role: identity
        type: string
    Size:
        allow-list-source: button.variants.json#size
        cva: true
        default: default
        enum:
            - default
            - sm
            - lg
            - icon
        role: density
        type: string
    Type:
        cva: false
        default: button
        enum:
            - button
            - submit
            - reset
        role: control-type
        type: string
    Variant:
        allow-list-source: button.variants.json#variant
        cva: true
        default: default
        enum:
            - default
            - secondary
            - destructive
            - outline
            - ghost
            - link
        role: appearance
        type: string
data: button.data.json
facade: github.com/fastygo/templ/ui
id: ui.button
kind: action
layer: primitive
package: github.com/fastygo/templ/ui/button
semantics:
    behavior: interactive
    data: button.data.json
    role: button
    root: button
showcase:
    - id: variant.default
      props:
        Size: default
        Variant: default
      ref: variant.default
    - id: variant.secondary
      props:
        Size: default
        Variant: secondary
      ref: variant.secondary
    - id: variant.destructive
      props:
        Size: default
        Variant: destructive
      ref: variant.destructive
    - id: variant.outline
      props:
        Size: sm
        Variant: outline
      ref: variant.outline
    - id: variant.ghost
      props:
        Size: sm
        Variant: ghost
      ref: variant.ghost
    - id: variant.link
      props:
        Variant: link
      ref: variant.link
    - id: size.sm
      props:
        Size: sm
        Variant: default
      ref: size.sm
    - id: size.lg
      props:
        Size: lg
        Variant: default
      ref: size.lg
    - id: size.icon
      props:
        AriaLabel: Settings
        Size: icon
        Variant: default
      ref: size.icon
    - id: state.disabled
      props:
        Disabled: true
        Variant: default
      ref: state.disabled
    - id: state.submit
      props:
        Type: submit
        Variant: default
      ref: state.submit
    - id: state.reset
      props:
        Type: reset
        Variant: outline
      ref: state.reset
    - id: composition.aschild-link
      props:
        AsChild: true
        Variant: outline
        Size: sm
      ref: composition.aschild-link
slots:
    default:
        accepts: text
        required: true
targets:
    react:
        component: Button
        test: ../../examples/vite/tests/ui/button.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/button'
    templ:
        component: Button
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/button
templ: Button
variants: button.variants.json
---
## Summary

Button triggers an action on click.
For navigation, render an `<a>` using `ButtonClasses` (Go) or use `asChild` (React).

## Use Cases

- Submit a form action
- Open a page from a primary action via `asChild` + `<a>`
- Show a destructive confirm action
- Show a low-emphasis ghost action

## Semantics

- Root element is always a `<button>`
- Disabled sets native `disabled` attribute
- For navigation: React uses `asChild` to merge classes onto a child `<a>`; Go uses `ButtonClasses` helper to wrap a manual `<a>`

## Example variant.default

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Button(ui.ButtonProps{Variant: "default"}) {
		Primary
	}
}
```

## Example variant.secondary

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Button(ui.ButtonProps{Variant: "secondary"}) {
		Secondary
	}
}
```

## Example variant.destructive

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Button(ui.ButtonProps{Variant: "destructive"}) {
		Delete
	}
}
```

## Example variant.outline

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Button(ui.ButtonProps{Variant: "outline", Size: "sm"}) {
		Outline
	}
}
```

## Example variant.ghost

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Button(ui.ButtonProps{Variant: "ghost", Size: "sm"}) {
		Ghost
	}
}
```

## Example variant.link

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	<a href="/docs" class={ ui.ButtonClasses(ui.ButtonProps{Variant: "link"}) }>
		Learn more
	</a>
}
```

## Example size.sm

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Button(ui.ButtonProps{Size: "sm"}) {
		Small
	}
}
```

## Example size.lg

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Button(ui.ButtonProps{Size: "lg"}) {
		Large
	}
}
```

## Example size.icon

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Button(ui.ButtonProps{Size: "icon", AriaLabel: "Settings"}) {
		+
	}
}
```

## Example state.disabled

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Button(ui.ButtonProps{Disabled: true}) {
		Disabled
	}
}
```

## Example state.submit

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Button(ui.ButtonProps{Type: "submit"}) {
		Submit
	}
}
```

## Example state.reset

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Button(ui.ButtonProps{Variant: "outline", Type: "reset"}) {
		Reset
	}
}
```

## Example composition.aschild-link

For navigation, React uses `asChild` to merge Button classes onto a child anchor,
and Go wraps a manual `<a>` with `ButtonClasses`:

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	<a href="/docs" class={ ui.ButtonClasses(ui.ButtonProps{Variant: "outline", Size: "sm"}) }>
		Learn more
	</a>
}
```

React equivalent:

```tsx
import { Button } from "@registry/ui";

export function Example() {
  return (
    <Button asChild variant="outline" size="sm">
      <a href="/docs">Learn more</a>
    </Button>
  );
}
```
