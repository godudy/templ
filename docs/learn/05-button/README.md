# Lesson 05: Button brick

Compare the smallest interactive primitive on React and Go Templ. These current
ports read the same [`button.variants.json`](../../../ui/button/button.variants.json)
recipe and the same [`button.spec.md`](../../../ui/button/button.spec.md)
contract.

**Level: Primitive.** Start here after the block lessons if you want to
understand how variant JSON drives every runtime port.

## What you'll learn

- Why `*.variants.json` is the source of truth — not inline `cva()` in TSX.
- The chain `button.variants.json` → `button.tsx` / `button.templ`.
- Registry fields (`variant`, `size`) vs DOM fields (`disabled`, `type`,
  `aria-*`) vs the `Attrs` escape hatch on Go.
- React `asChild` as sugar over the universal `ButtonClasses` manual-wrapper
  pattern used by Go and future ports (Svelte, Vue, PHP, …). See
  [Escape hatch: `asChild` vs `*Classes()`](../../coming-from-shadcn.md#escape-hatch-aschild-vs-classes)
  for the full mental model.

## The contract and ports

| Artifact | Path |
|----------|------|
| Spec | [`ui/button/button.spec.md`](../../../ui/button/button.spec.md) |
| Variant recipe | [`ui/button/button.variants.json`](../../../ui/button/button.variants.json) |
| React | [`ui/button/button.tsx`](../../../ui/button/button.tsx) |
| Go Templ | [`ui/button/button.templ`](../../../ui/button/button.templ) |

Open the React and Templ files in a split editor before reading the table below.

## Variant JSON → runtime ports

```text
button.variants.json   (one edit updates every port)
        │
        ├── button.tsx     composeRecipe(buttonRecipe, { variant, size }, className)
        └── button.templ   uiutils.Compose(ButtonVariants, map[string]string{...}, Class)
```

When you add a named variant to `byKey.variant` in JSON:

1. **React** — `defineRecipe` / `RecipeKey` picks up the new key; TypeScript
   autocomplete on `variant=` updates after the JSON change.
2. **Go** — run `bun run generate`; `variantgen` refreshes `button_variants.go`.
3. **Future ports** — import the same JSON and call their local `composeRecipe`
   equivalent (see [`docs/architecture.md`](../../architecture.md)).

There is **no `unstyled` escape hatch**. If a visual state belongs in the design
system, add a named key to `button.variants.json` and run validation — do not
bypass the recipe with a one-off `className` hack in app code.

## Read them side by side

| # | React (TSX) | Go Templ | Rule |
|---|-------------|----------|------|
| 1 | `import buttonRecipeJson from "./button.variants.json"` | `ButtonVariants` from generated `button_variants.go` | Same recipe; Go reads JSON at codegen time. |
| 2 | `composeRecipe(buttonRecipe, { variant, size }, className)` | `uiutils.Compose(ButtonVariants, map[string]string{"variant": p.Variant, "size": p.Size}, p.Class)` | Same selection keys; different helper names per language. |
| 3 | `variant="outline"` | `Variant: "outline"` | PascalCase field in Go; see [cheat sheet](../../cheatsheet-react-to-templ.md). |
| 4 | `disabled` (DOM attr) | `Disabled: true` | Registry state field on Go; React inherits from `ButtonHTMLAttributes`. |
| 5 | `asChild` + `<Slot>` | `<a class={ ui.ButtonClasses(p) }>…</a>` | React-only sugar; universal pattern is `*Classes()` on a manual semantic wrapper — see [escape hatch](../../coming-from-shadcn.md#escape-hatch-aschild-vs-classes). |
| 6 | `aria-label="Save"` | `AriaLabel: "Save"` | Typed a11y field; other `aria-*` / `data-*` go in `Attrs` on Go. |

## Try it yourself

### Exercise A — Add a named variant

1. Open [`button.variants.json`](../../../ui/button/button.variants.json).
2. Add a new key under `byKey.variant`, for example `"accent"`, with Tailwind
   classes that fit your tokens.
3. Update `api.Variant.enum` in [`button.spec.md`](../../../ui/button/button.spec.md)
   to include `"accent"`.
4. Run `bun run generate`, then `bash .validate/scripts/validate-spec.sh`.
5. Use the new variant in the current React/Templ ports:

   ```tsx
   <Button variant="accent">Accent</Button>
   ```

   ```templ
   @ui.Button(ui.ButtonProps{Variant: "accent"}) { Accent }
   ```

### Exercise B — React to Templ

1. Open [`button.tsx`](../../../ui/button/button.tsx).
2. Without looking at `button.templ`, write a templ `Button` call with
   `variant="outline"`, `size="sm"`, and child text `Save`.
3. Compare with [`button.templ`](../../../ui/button/button.templ).

### Exercise C — Templ to React

1. Open [`button.templ`](../../../ui/button/button.templ).
2. Translate an icon button with `Size: "icon"` and `AriaLabel: "Settings"`.
3. Compare with the `size.icon` showcase in [`button.spec.md`](../../../ui/button/button.spec.md).

## Preview locally

From the repository root:

```bash
bun install
bun run dev:vite    # React — http://127.0.0.1:5173
bun run dev:templ   # Go Templ — http://127.0.0.1:8080
```

The registry demo page renders every Button showcase variant in the current
React/Templ ports.
Open both URLs side by side and search for `variant.` labels in the page source.

## Where to look next

- [`06-badge`](../06-badge/) — same JSON pattern, no interaction state.
- [`07-card`](../07-card/) — composite with named part exports.
- [`cheatsheet-react-to-templ.md`](../../cheatsheet-react-to-templ.md) — one-page naming and syntax map.
- [`docs/coming-from-shadcn.md`](../../coming-from-shadcn.md) — full migration guide;
  [`Escape hatch: asChild vs *Classes()`](../../coming-from-shadcn.md#escape-hatch-aschild-vs-classes)
  for the reusable pattern beyond Button.
