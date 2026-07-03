# Examples

Optional **local preview** for registry bricks. Not part of the copy-paste library — each consumer app owns its own tokens, Tailwind pipeline, and server.

Two parallel previews share the same static assets under [`web/static/`](web/static/):

| Path | Stack | Dev command |
|------|-------|-------------|
| [`templ/`](templ/) | Go Templ + HTTP server | `bun run dev:templ` |
| [`vite/`](vite/) | React + Vite | `bun run dev:vite` |

Shared assets (CSS tokens, Tailwind output, UI8Kit ARIA bundle) live in [`web/static/`](web/static/) so both previews load `/static/css/app.css` and `/static/js/ui8kit.js`.

`examples/` is a Bun workspace member of the repository root — dependencies
are installed **once** from the repository root (`bun install` in
[`../`](../)), not from inside `examples/`.

Recommended workflow: run preview commands from the repository root
(`bun run dev:templ`, `bun run dev:vite`). Equivalent commands from inside
`examples/` are optional.

## Templ preview

Recommended from repository root:

```bash
bun run dev:templ
```

Equivalent inside `examples/`:

```bash
bun run dev:templ
```

Open http://127.0.0.1:8080/ (dashboard) and http://127.0.0.1:8080/home/ (home block).

The server lives at [`templ/cmd/server/main.go`](templ/cmd/server/main.go).

## Vite preview

Recommended from repository root:

```bash
bun run dev:vite
```

Equivalent inside `examples/`:

```bash
bun run dev:vite
```

Open http://127.0.0.1:5173/ and http://127.0.0.1:5173/home/

The Vite preview app uses [`react-router-dom`](https://www.npmjs.com/package/react-router-dom)
for local route switching in [`vite/src/main.tsx`](vite/src/main.tsx) and
[`vite/src/app.tsx`](vite/src/app.tsx). This dependency is preview-only and is
not a peer/runtime requirement of registry bricks.

```bash
bun run build:vite
bun run preview:vite
```

## UI8Kit ARIA runtime (preview only)

The examples preview loads a **dialog-only** [`@ui8kit/aria`](https://www.npmjs.com/package/@ui8kit/aria) bundle so mobile Sheet menus work in the browser.

| File | Role |
|------|------|
| [`scripts/ui8kit-entry.mjs`](scripts/ui8kit-entry.mjs) | Registers the `dialog` pattern and calls `init()` |
| [`web/static/js/ui8kit.js`](web/static/js/ui8kit.js) | Generated bundle (`bun run build:js`) |
| [`web/static/js/manifest.json`](web/static/js/manifest.json) | Subset runtime metadata |

Rebuild after changing the entry or upgrading `@ui8kit/aria`:

```bash
bun run build:js
```

## Tailwind CLI

Registry components use semantic utilities (`bg-background`, `text-muted-foreground`, …). The shared entry is [`web/static/css/input.css`](web/static/css/input.css); build with:

```bash
bun run build:css
```

## Layout

| Path | Role |
|------|------|
| `templ/page.templ` | Document shell + dashboard slot |
| `templ/demo.templ` | `ComponentExamples()` gallery |
| `templ/ui/blocks/` | Dashboard and home catalog blocks |
| `vite/src/` | React twins of the same pages and gallery |
| `web/static/` | Shared CSS, tokens, and UI8Kit bundle |
