# Templ component registry

shadcn-style **copy-paste** bricks for building Go interfaces and React SPAs from
the same design contract. Props, variants, children, and composition work the
way you expect — on both runtimes.

## One recipe, two runtimes

| React (Vite) | Go Templ (SSR) |
|--------------|----------------|
| ```tsx | ```templ |
| import { Button } from "@registry/ui"; | import "github.com/fastygo/templ/ui" |
| | |
| <Button variant="outline" size="sm"> | @ui.Button(ui.ButtonProps{ |
|   Save |   Variant: "outline", |
| </Button> |   Size: "sm", |
| | }) { |
| |   Save |
| | } |
| ``` | ``` |

New here? Read [`docs/mental-model.md`](docs/mental-model.md) first — five ideas
that explain the whole registry. Coming from shadcn? See
[`docs/coming-from-shadcn.md`](docs/coming-from-shadcn.md). For a guided
split-view lesson, start at [`docs/learn/`](docs/learn/).

### Three files, one contract

Every brick colocates its design contract:

```text
ui/button/
  button.spec.md         # API, semantics, showcase
  button.variants.json   # shared variant recipe (both runtimes read this)
  button.templ           # Go Templ runtime
  button.tsx             # React runtime
```

`button.variants.json` is the single source of variant class strings. Both
`button.templ` and `button.tsx` compose classes from the same JSON.

## About the name

> **Not [a-h/templ](https://github.com/a-h/templ).** This repository is a separate **component library** for Go UI: copy-paste `.templ` bricks, helpers, and specs. It is built **on top of** Adrian Hacker's excellent [templ](https://github.com/a-h/templ) project and uses the official code generator [`github.com/a-h/templ/cmd/templ`](https://github.com/a-h/templ) (via `go tool templ` in `go.mod`). We are grateful for that foundation — templ's design and tooling make a typed, server-rendered component workflow practical.
>
> The module path is **`github.com/fastygo/templ`** so imports read naturally in application code — for example `import "github.com/fastygo/templ/ui"` and `import cmp "github.com/fastygo/templ/components"`. That name reflects **where these components live**, not a claim to be the templ language or compiler. When you need templ itself, depend on **`github.com/a-h/templ`**; when you need this registry, depend on **`github.com/fastygo/templ`**.

## Layout

| Path | Role |
|------|------|
| [`utils/`](utils/) | **Only shared Go helpers** — CVA (`Compose`), `Cn`, attrs, ARIA, `tags.go`, form recipes |
| [`ui/`](ui/) | Primitives: button, badge, input, form controls, layout, media, links, dialog, disclosure, card, alert, breadcrumb, icon badge |
| [`components/`](components/) | Behavior-driven composites: sheet, nav, tabs, popover, combobox, menu, toast |
| [`components.json`](components.json) | Registry manifest (shadcn-style) |
| [`examples/`](examples/) | Optional local preview — [`templ/`](examples/templ/) (Go) and [`vite/`](examples/vite/) (React) share [`web/static/`](examples/web/static/) |
| [`.validate/docs/component.spec.template.md`](.validate/docs/component.spec.template.md) | Spec template: `api` + `showcase` per brick |
| [`.validate/docs/README.md`](.validate/docs/README.md) | Local `validate-spec` command and registry checks |
| [`.cursor/rules/templ-component-spec.mdc`](.cursor/rules/templ-component-spec.mdc) | Authoring rule for specs and STE comments |
| [`.cursor/rules/`](.cursor/rules/) | Agent rules — registry structure, ui8px, ARIA, examples, validation |
| [`.ui8px/policy/`](.ui8px/policy/) | Tailwind class policy (`ui/`, `components/`, `utils/`, `examples/`) |
| [`docs/`](docs/) | Long-lived architecture, ARIA, shadcn onboarding, publishing docs |
| [`docs/publishing.md`](docs/publishing.md) | `go get` vs npm, `export-ignore`, release |
| [`docs/architecture.md`](docs/architecture.md) | Dual-stack brick contract |
| [`docs/aria.md`](docs/aria.md) | `@ui8kit/aria`, opt-in behavior hooks, Sheet contract |
| [`utils/utils.spec.md`](utils/utils.spec.md) | Helper module export catalog (classes, attrs, recipes) |

Default bricks avoid app-specific runtime dependencies. Behavior hooks such as `data-ui8kit` are opt-in per component, so each consuming app can choose its own client layer.

## Coming from shadcn?

The migration guide is now documented in
[`docs/coming-from-shadcn.md`](docs/coming-from-shadcn.md).

Quick mapping:

- `cva` recipes -> colocated `*.variants.json` shared by Go + React.
- `cn` -> same `clsx + tailwind-merge` behavior.
- `asChild` -> Radix-style `Slot` for clickable bricks.
- `Title as={n}` -> prefer `H1`...`H6` when heading level is static.
- Card uses named exports only (`CardHeader`, `CardTitle`, ...).

## Copy into your app

1. Copy [`utils/`](utils/) once (import `github.com/fastygo/templ/utils`, package `uiutils`).
2. Copy folders from `ui/button/`, `ui/input/`, `ui/card/`, etc.
3. Update the `uiutils` import path in each `.templ` file to match your module.
4. Run `templ generate` and include `ui/**/*.templ` in your Tailwind `@source`.
5. Install peer deps in your app runtime: `react`, `react-dom`, `clsx`, and `tailwind-merge`.
6. Define **your own** shadcn-compatible CSS variables (`--background`, `--primary`, …) in the consuming app — the library does not ship tokens.

## Local preview

The repository is a Bun workspace root (`examples` is the only workspace
member today). A single `bun install` run from the repository root installs
both the registry devDependencies and the `examples` workspace in one shared
`node_modules` — no separate install step inside `examples/`.

```bash
bun install
bun run dev:vite   # React preview at http://127.0.0.1:5173/
bun run dev:templ  # Go Templ preview at http://127.0.0.1:8080/
```

See [`examples/README.md`](examples/README.md) for the full preview server and Tailwind setup.

## Usage

**Facade (recommended):**

```templ
import "github.com/fastygo/templ/ui"
import cmp "github.com/fastygo/templ/components"

@ui.Button(ui.ButtonProps{Variant: "outline", Size: "sm"}) {
  Save
}
@ui.Card(ui.CardProps{Variant: "default"}) {
  …
}
@cmp.Sheet(cmp.SheetProps{ID: "panel", Side: "right", Behavior: "ui8kit"}) {
  …
}
```

**Granular (optional):**

```templ
import "your/module/ui/button"

@button.Button(button.ButtonProps{Variant: "outline", Size: "sm"}) {
  Save
}
```

- **Variants:** `ButtonVariants` + `ButtonClasses(props)` — same mental model as `buttonVariants()` in React.
- **className:** `Class` field (additive; do not override size/variant utilities).
- **children:** `{ children... }` in the component body.
- **attrs:** `Attrs templ.Attributes` plus `ID`, `AriaLabel`, `Href`, etc.

## Generate templ

From the repository root:

```bash
go tool templ generate ./...
```

Or per package, e.g. `go tool templ generate ./ui/button`.

## Validate specs

Before CI, run the full registry check:

```bash
bun install
bun run verify
```

Or step by step:

```bash
bash .validate/scripts/validate-spec.sh --with-tests
bun run lint:ui8px
bun run validate:aria
go test ./...
```

`lint:ui8px` covers **`ui/`**, **`components/`**, **`utils/`**, and **`examples/`** against [`.ui8px/policy/`](.ui8px/policy/).

See [`.validate/docs/README.md`](.validate/docs/README.md) for spec checks and `components.json` alias expectations.

## License

MIT — see [LICENSE](LICENSE). Copyright (c) FastyGo.

This registry depends on [a-h/templ](https://github.com/a-h/templ); use and attribution for that project follow its own license and documentation.
