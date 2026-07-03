---
api:
    Aspect:
        cva: false
        default: auto
        enum:
            - auto
            - square
            - video
        role: aspect-ratio
        type: string
    Decorative:
        cva: false
        default: false
        role: accessibility
        type: bool
    Fit:
        cva: false
        default: cover
        enum:
            - contain
            - cover
            - fill
            - none
            - scale-down
        role: object-fit
        type: string
    Position:
        cva: false
        default: center
        enum:
            - bottom
            - center
            - left
            - right
            - top
            - left-bottom
            - left-top
            - right-bottom
            - right-top
        role: object-position
        type: string
    Size:
        allow-list-source: image.variants.json#size
        cva: true
        default: auto
        enum:
            - auto
            - default
            - xs
            - sm
            - md
            - lg
            - xl
            - full
        role: density
        type: string
    Variant:
        allow-list-source: image.variants.json#variant
        cva: true
        default: default
        enum:
            - default
            - rounded
            - avatar
            - thumbnail
            - logo
        role: appearance
        type: string
data: image.data.json
facade: github.com/fastygo/templ/ui
id: ui.image
kind: media
layer: primitive
package: github.com/fastygo/templ/ui/image
parts:
    - props:
        - Variant
        - Size
        - Class
        - Src
        - SrcSet
        - Sizes
        - Alt
        - Width
        - Height
        - Fit
        - Position
        - Aspect
        - Loading
        - Decoding
        - FetchPriority
        - Decorative
        - ID
        - Attrs
      templ: Image
    - props:
        - Class
        - Attrs
      slot: responsive-wrapper
      templ: Picture
    - props:
        - SrcSet
        - Src
        - Media
        - Type
        - Sizes
        - Attrs
      slot: source
      templ: Source
semantics:
    behavior: static
    data: image.data.json
    root: img | picture | source
showcase:
    - id: variant.avatar
      props:
        Alt: User avatar
        Size: md
        Src: /avatar.png
        Variant: avatar
      ref: variant.avatar
    - id: layout.picture
      ref: layout.picture
targets:
    react:
        component: Image
        test: ../../examples/vite/tests/ui/image.smoke.test.tsx
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/image'
    templ:
        component: Image
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/image
templ: Image
variants: image.variants.json
---
## Summary

Image renders accessible img, picture, and source primitives.
Use Decorative for purely visual images.

## Use Cases

- Render product screenshots, avatars, logos, and thumbnails
- Render responsive image sources with picture

## Semantics

- Decorative images render an empty alt and aria-hidden true
- Image defaults to loading lazy and decoding async

## Example variant.avatar

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Image(ui.ImageProps{Variant: "avatar", Size: "md", Src: "/avatar.png", Alt: "User avatar"})
}
```

## Example layout.picture

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Picture(ui.PictureProps{}) {
		@ui.Source(ui.SourceProps{SrcSet: "/hero.webp", Type: "image/webp"})
		@ui.Image(ui.ImageProps{Variant: "rounded", Src: "/hero.jpg", Alt: "Hero image"})
	}
}
```
