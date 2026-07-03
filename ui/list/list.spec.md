---
api:
    ItemTag:
        allow-list-source: utils.tags.TagGroupListItem
        cva: false
        default: li
        enum:
            - li
            - dt
            - dd
        role: item-tag
        type: string
    Tag:
        allow-list-source: utils.tags.TagGroupList
        cva: false
        default: ul
        enum:
            - ul
            - ol
            - dl
            - menu
        role: list-tag
        type: string
    Value:
        applies-to: ListItem
        cva: false
        role: ordered-value
        type: int
data: list.data.json
facade: github.com/fastygo/templ/ui
id: ui.list
kind: layout
layer: primitive
package: github.com/fastygo/templ/ui/list
parts:
    - props:
        - Class
        - Tag
        - Attrs
      templ: List
    - props:
        - Class
        - Tag
        - Value
        - Attrs
      slot: item
      templ: ListItem
semantics:
    behavior: static
    data: list.data.json
    item-root: li | dt | dd
    root: ul | ol | dl | menu
showcase:
    - id: tag.ul
      props:
        Class: gap-2
        Tag: ul
      ref: tag.ul
    - id: tag.ol
      props:
        Class: list-decimal pl-4
        Tag: ol
      ref: tag.ol
    - id: tag.dl
      props:
        Class: grid grid-cols-[auto_1fr] gap-x-3 gap-y-2
        Tag: dl
targets:
    react:
        component: List
        test: ../../examples/vite/tests/ui/list.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/list'
    templ:
        component: List
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/list
templ: List
variants: list.variants.json
---
## Summary

List renders ul, ol, dl, or menu containers.
ListItem renders li by default and supports dt/dd rows for definition lists.

## Use Cases

- Show bullet navigation links
- Show ordered steps in a wizard
- Render glossary-style definition lists (`dl` with `dt`/`dd`)

## Semantics

- ResolveTag uses TagGroupList from utils
- ListItem Value sets li value attribute when positive
- ListItem Tag defaults to li and may be set to dt or dd for definition-list semantics

## Example tag.ul

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.List(ui.ListProps{Class: "gap-2"}) {
		@ui.ListItem(ui.ListItemProps{}) { First item }
		@ui.ListItem(ui.ListItemProps{}) { Second item }
	}
}
```

## Example tag.ol

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.List(ui.ListProps{Tag: "ol", Class: "list-decimal pl-4 gap-2"}) {
		@ui.ListItem(ui.ListItemProps{Value: 1}) { Step one }
		@ui.ListItem(ui.ListItemProps{Value: 2}) { Step two }
	}
}
```

## Example tag.dl

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.List(ui.ListProps{Tag: "dl", Class: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-2"}) {
		@ui.ListItem(ui.ListItemProps{Tag: "dt", Class: "font-medium"}) { API }
		@ui.ListItem(ui.ListItemProps{Tag: "dd", Class: "text-muted-foreground"}) { Application Programming Interface }
	}
}
```
