собрал полный контекст (все `ui/*.templ` + `*.tsx` пары, `utils/*.go`+`*.ts`, схемы `variants.json`/`data.json`, валидатор `validate-spec`, правила `.cursor/rules/templ-*`, `docs/architecture.md`, `docs/aria.md`)

# Spec-Driven Codegen for `ui/` Primitives — Technical Breakdown (Templ, React, Svelte, Vue)

Status: analysis for an implementing LLM agent. Not a plan, not a todo list —
a contract breakdown. The implementing agent decides ordering, batching, and
tooling shape from this document plus live repo state at execution time.

Scope: **only `ui/<brick>/` primitives**. `components/` composites (Sheet,
Tabs, Popover, Combobox, Menu, Toast, Nav) are explicitly out of scope — they
require a client behavior contract (`@ui8kit/aria`) that this phase does not
address. `examples/` block scaffolds are test/demo surfaces, not reusable
library code, and are out of scope except where a new runtime needs its own
smoke-test convention.

## 1. Goal

Every `ui/<brick>/` currently ships two runtime files hand-written against a
shared contract:

```
ui/<brick>/
  <brick>.spec.md        # SSOT: API, semantics, showcase, target metadata
  <brick>.variants.json   # SSOT: CVA-style class recipe (shared by all runtimes)
  <brick>.data.json       # optional: showcase fixtures
  <brick>.templ           # Go Templ runtime (SSR)
  <brick>.tsx              # React runtime (SPA)
```

The goal is to reach **4 runtime files** per brick — add `<brick>.svelte`
(Svelte 5) and `<brick>.vue` (Vue 3 SFC) — without changing the SSOT shape
(`*.spec.md` + `*.variants.json`) and without introducing a DSL layer. Svelte
ships first (closer to Templ's server-rendered, non-vDOM composition model,
simpler `class` merging, no JSX indirection). Vue ships second, potentially
semi-automated: an LLM reads the finished Svelte/React pair plus the spec and
proposes the `.vue` file, a human/agent reviews against the same contract
checklist used for Svelte.

## 2. Non-Goals (explicit)

- Do **not** touch `components/*` composites (Sheet, Tabs, Popover, Combobox,
  Menu, Toast). They need `@ui8kit/aria` behavior parity first; that is a
  separate, later effort.
- Do **not** design a DSL (`<Loop>`, `<If>`, `<Var>`, …). This was considered
  and rejected in favor of pure spec-driven generation — each runtime file is
  still hand-written (or LLM-assisted) against the same JSON/YAML contract,
  not templated from a meta-language.
- Do **not** build `examples/svelte/` or `examples/vue/` full demo scaffolds
  in this phase. Smoke tests proving the contract (see §9) are in scope;
  full block-level demo parity (`examples/templ/ui/blocks/*`,
  `examples/vite/src/*`) is a later phase once the primitive layer is frozen
  on 4 runtimes.
- Do **not** change `*.variants.json` shape or `*.spec.md` required keys
  unless a genuine cross-runtime gap is found (see §8 for the only sanctioned
  extension: `targets.svelte` / `targets.vue`).
- Do **not** add framework runtime dependencies to `ui/`/`components/` beyond
  what's already accepted per-runtime (React: `react`, `clsx`,
  `tailwind-merge`; Svelte: `svelte` only; Vue: `vue` only). No headless UI
  libraries, no state managers.

## 3. Current State — Contract Anatomy (read before writing any runtime file)

### 3.1 The SSOT files

- **`<brick>.spec.md`** — YAML front matter + STE-English prose. Required
  keys: `id`, `layer`, `kind`, `package`, `facade`, `api`, `showcase`,
  `semantics`. Every `api.<Field>` MUST declare `cva: true|false`. `cva: true`
  means the field is a key consumed by `*.variants.json` (`Variant`, `Size`,
  …); `cva: false` means it's forwarded as a plain attribute/prop
  (`Class`/`className`, `ID`, `AriaLabel`, boolean state, …). See
  `ui/button/button.spec.md` for the canonical primitive shape,
  `ui/table/table.spec.md` / `ui/card/card.spec.md` for multi-part
  (`parts[]`) primitives, `ui/form/form.spec.md` for a composite with
  per-part `variant_recipes`.
- **`<brick>.variants.json`** — schema at `schemas/variants.schema.json`.
  Shape: `{ id, base, keys[], defaults{}, byKey{ <key>: { <value>: "<tw classes>" } } }`.
  Every runtime imports **this exact file** (Go via `//go:embed` +
  `uiutils.MustParseVariantRecipe(...).ToVariants()` generated into
  `brick_gen.go` by `.validate/cmd/variantgen`; React via
  `import recipe from "./x.variants.json"` + `defineRecipe(recipe)`). Rules:
  no empty-string keys in `byKey`; every `defaults[k]` must reference a real
  key in `byKey[k]`.
- **`<brick>.data.json`** (optional) — showcase fixture payloads keyed by
  showcase id, schema at `schemas/data.schema.json`.

### 3.2 Shared Go helpers (`utils/*.go`, package `uiutils`)

Class composition: `Compose(Variants, selection, extra...) string`,
`Cn(classes...) string`. Attribute merging: `MergeAttrs`, `DOMAttrs`,
`ControlAttrs`, `SwitchAttrs`. Static ARIA: `AriaExpanded`, `AriaControls`,
`AriaCurrent`, `AriaLive`, `AriaModal`, `AriaLabel`, `AriaPressed`,
`AriaHasPopup`. Shared form-control recipes: `InputChrome`/`InputSize`
(input, textarea, select), `ControlChrome`/`ControlSize` (checkbox, radio,
switch) with wrapper `InputClasses`/`ControlClasses`. Tag resolution:
`ResolveTag(tag, fallback, TagGroup) string` + `TagGroup*` enum
(`utils/tags.go`, generated from `utils/tags.json` by `.validate/cmd/tagsgen`
— **this file is the cross-runtime SSOT for allowed root tags per primitive
group**, e.g. `TagGroupStack` allows `div|ul|ol`, `TagGroupContainer` allows
`div|main|section`). Heading/layout dispatch as shared sub-templates:
`uiutils.HeadingTag(HeadingTagProps{As, Class, Attrs})` (h1–h6 switch) and
`uiutils.LayoutTag(LayoutTagProps{Tag, Fallback, Group, Class, Attrs})`
(multi-tag switch) — both implemented as `.templ` helper components in
`utils/headingtag.templ` / `utils/layouttag.templ`, i.e. Go-only constructs
with **no direct Svelte/Vue analog file** (each runtime re-implements the
switch locally; see §6.3).

### 3.3 Shared TS helpers (`utils/*.ts`)

`cn(...) ` (clsx + tailwind-merge, `utils/cn.ts`). `compose(Variants, selection, ...extra)` /
`composeRecipe<R>(recipe, selection, ...extra)` / `defineRecipe(recipe)` —
type-level literal-union derivation via `RecipeKey<R, K>` (`utils/variants.ts`,
`utils/recipe-types.ts`). Dev-mode-only throws for missing default / unknown
variant, guarded by `isDevEnv()` (`utils/env.ts`, reads
`import.meta.env.DEV`). Tag resolution: `resolveTag(tag, fallback, TagGroup)`
+ `TagGroup` const object + `isAllowedTag` (`utils/tags.ts` — hand-mirrors
`utils/tags.go`; dev-mode `console.warn` on fallback, not present in Go).
Attr helpers: `defaultInputType`, `defaultButtonType`, `titleTag(as)`,
`textareaRows(rows)` (`utils/attrs.ts`). `BehaviorMode` type + constants
(`utils/behavior.ts`, mirrors `utils/behavior.go` — mostly irrelevant for
`ui/` primitives except `ui/dialog` which emits `data-ui8kit` and
`ui/breadcrumb` which emits it as a plain string prop, not a real behavior
hook since there's no registered pattern for breadcrumb).

### 3.4 React-only composition primitive: `Slot`

`ui/slot/slot.tsx` implements Radix-style `asChild`: merges `className` (via
`cn`), merges `ref`, chains `on*` handlers child-first-then-slot, clones the
single child element. **This is React-only** — no `cloneElement` equivalent
exists in Go/Svelte/Vue. The documented cross-runtime substitute is always
`<Brick>Classes(props)` applied to a manually-authored root element (see
`ui/button/button.templ:56` doc comment, `ui/card/card.spec.md`'s
`composition.aschild-section` showcase, `docs/architecture.md:41-49`).
**Svelte and Vue follow the Go pattern, not the React pattern** — no `Slot`
port, no `asChild` prop; consumers who need a different root element call
`ButtonClasses(props)` (or its runtime-equivalent) directly. This is
already the documented policy (`docs/architecture.md:44-49`); do not
re-litigate it per brick.

### 3.5 Facades

Go: `ui/index.ts`-equivalent is `ui/facade.templ` (single `package ui` that
imports every brick sub-package and re-exports `templ Button(...)`-style
wrappers) plus `ui/props.go` (type aliases `ButtonProps = button.ButtonProps`
and `*Classes` re-export functions). React: `ui/index.ts` barrel
(`export { Button, type ButtonProps, ... } from "./button/button"`). New
runtimes need their own barrel: Svelte typically re-exports from an
`ui/index.ts` (a second one is impossible — decide file name, e.g.
`ui/index.svelte.ts`) or per-brick default+named exports resolved via
`svelte.config`/bundler `exports` map; Vue likewise needs a barrel consumers
import from (`@registry/ui-vue` or a shared barrel with `.vue` re-exports).
**Decide this exact naming before writing brick #1** — see §7.5, §8.1.

## 4. Full Inventory of `ui/` Primitives (as of this audit)

39 brick directories under `ui/`. Categorize by **structural shape**, because
shape — not visual complexity — determines the Svelte/Vue porting pattern.

### Tier A — Single leaf element, props → classes → one tag (simplest; port first)

`badge`, `iconbadge`, `text`, `inline`, `linebreak` (2-way switch: br/wbr),
`label`, `input`, `textarea`, `checkbox`, `radio`, `switch`, `separator`
(hr + decorative/orientation attrs), `link` (anchor + target/rel resolution
logic).

### Tier B — Tag-resolved element (root tag chosen from an allow-list; needs each runtime's own switch/dispatch, no shared helper across runtimes)

`box` (`TagGroupBoxAllowed`: div only — degenerate case, still goes through
`ResolveTag`), `block` (`TagGroupLayout`: div/section/article/aside/header/
footer/main/nav/figure/search/hgroup), `stack` (`TagGroupStack`: div/ul/ol),
`group` (`TagGroupGroup`: div/fieldset/dl), `container`
(`TagGroupContainer`: div/main/section), `list` + `list.ListItem`
(`TagGroupList`: ul/ol/dl/menu; `TagGroupListItem`: li/dt/dd), `title` +
`H1`–`H6` React-only convenience wrappers (`TitleTag`/heading switch, 1–6 →
h1–h6).

### Tier C — Variant/size CVA leaf with type-specific rendering branches

`button` (type default/submit/reset + disabled state class), `icon`
(3-way switch: `svg`/`text`/class-based `span`, plus decorative/aria-label
branching), `image` + `Picture` + `Source` (alt/decorative, loading/decoding
defaults, no CVA on Picture/Source), `grid` + `GridCol` (numeric span/start/
end/order → static class-map lookups, **not** CVA — see
`ui/grid/grid.templ:32-108`; must port the exact class maps, not regenerate
them).

### Tier D — Native interactive/behavior-adjacent elements (static-only in `ui/`, no client JS)

`dialog` (native `<dialog>`, emits opt-in `data-ui8kit` string but **no**
`@ui8kit/aria` pattern wiring inside `ui/` — that only happens in
`components/sheet`), `disclosure` + `Summary` (native `<details>`/`<summary>`,
`Open` bool as static attribute only — no controlled-state contract; this
matters for Svelte where `<details open>` bindable attrs would tempt a
`bind:open`, which must be avoided per the Sheet-contract precedent in
`docs/aria.md:89-96` even though Disclosure itself has no ui8kit pattern —
keep it purely declarative to stay consistent).

### Tier E — Multi-part composite (`parts[]` in spec, several exported components sharing recipes)

`card` (Card/CardHeader/CardTitle/CardDescription/CardContent/CardFooter —
1 CVA recipe on root, static classes on parts), `table` (9 exported
components: Table/TableCaption/TableHead/TableBody/TableFoot/TableRow/
TableHeadCell/TableCell/TableColGroup/TableCol — scope/colspan/rowspan/
headers/abbr attr logic on cells only), `form` (Form/FormItem/
FormDescription/FormMessage — **4 separate `*.variants.json` files**, one per
part), `form/controls` (Fieldset/Legend/DataList/DataOption/Output/Meter/
Progress — 4 CVA recipes + 3 non-CVA passthroughs, colocated in one
`controls.templ`/`controls.tsx` pair), `select` (Select/SelectOption/
OptGroup — options loop from a `[]Option{Value,Label}` slice **and** manual
children), `alert` (single component, but with role/aria-live default
resolution logic worth flagging), `breadcrumb` (nav > ol > li loop over
`[]BreadcrumbItem{Label,Href,Current,Disabled}` — the **only** primitive
with an inline collection-render loop and conditional `<a>` vs `<span>` per
item; this is the hardest Tier-E case for Svelte/Vue templating and should
be scheduled after simpler composites, not first).

Every brick above has both `.templ` and `.tsx` today except confirm via
`Glob("ui/**/*.tsx")` at execution time — the inventory above was verified
against the live tree during this audit (39 dirs, all had a `.tsx` sibling).

## 5. Cross-Runtime Contract Dimensions (must map 1:1, every brick, every runtime)

For each brick, the following dimensions are the actual contract — not the
syntax. An LLM implementing a new runtime file must satisfy all of them,
not just "make it compile":

1. **Props naming.** Go uses `PascalCase` struct fields (`Variant`, `Class`,
   `AriaLabel`, `HTMLFor`). React uses `camelCase` DOM-ish names (`variant`,
   `className`, `aria-label` as a literal string key, `htmlFor`). Decide once
   per runtime family (not per brick) whether Svelte/Vue follow the
   HTML-native casing (React-style: `class`, `aria-label`, `for`) or a
   framework-idiomatic style. **Recommendation:** Svelte and Vue should use
   plain HTML attribute names where the framework allows direct forwarding
   (`class`, `aria-label`, `for`) since neither framework requires a
   `className`-style escape hatch — this is *closer to Go* than to React and
   should be documented as a 3rd convention in `docs/architecture.md`'s
   runtime parity table, not silently improvised per brick.
2. **Variant/size consumption.** Every CVA field (`cva: true` in spec) must
   resolve through the *same* `*.variants.json` file, not a re-typed literal
   union. Svelte/Vue need their own `composeRecipe`-equivalent helper reading
   the identical JSON shape (see §7.2/§8.2).
3. **`Class`/`className` merge order.** Recipe base → variant/size classes →
   state classes (e.g. disabled) → caller-supplied class, always in that
   order, always merged via a Tailwind-conflict-aware merge (`tailwind-merge`
   equivalent) not naive concatenation, to match `cn()` semantics.
4. **Children/slot.** Go: `{ children... }` (templ implicit children).
   React: `children` prop + `{children}`. Svelte 5: `{@render children?.()}`
   with a `children: Snippet` prop (see §7.3) — **not** `<slot>` (deprecated
   in Svelte 5 runes mode). Vue: default `<slot />`.
5. **Root tag resolution.** Bricks in Tier B resolve their root tag from an
   allow-list (`TagGroup*`). Each runtime needs its own dispatch (a `switch`/
   `match`/`if-chain` over the resolved tag string), because none of these
   frameworks can dynamically choose an arbitrary native tag from a
   `resolveTag()` return value without either (a) a big switch, or (b)
   dynamic-component syntax (`<svelte:element this={tag}>` in Svelte,
   `<component :is="tag">` in Vue). **Decide per runtime which mechanism to
   use** (§7.3/§8.3) and use it consistently across all Tier B bricks in that
   runtime — do not mix switch-based and dynamic-tag approaches within one
   runtime.
6. **Static ARIA / attribute defaults.** Any brick with default-resolution
   logic (`imageLoading`, `imageDecoding`, `defaultInputType`,
   `defaultButtonType`, `titleTag`, `textareaRows`, `linkTarget`/`linkRel`,
   `tableScope`, `iconType`/`iconIsDecorative`, `alertAttrs`
   role/aria-live default, `breadcrumbLinkClasses`) must reproduce the exact
   same decision table, not an approximation. These are enumerated per-brick
   in `.templ`/`.tsx` today — the new runtime file must port the literal
   logic, ideally by porting `utils/attrs.ts`'s functions 1:1 rather than
   inlining.
7. **Boolean/attribute presence semantics.** Go templ uses `disabled?={p.X}`
   (omits the attribute entirely when false) — this must be reproduced (not
   `disabled="false"`) in Svelte (`{disabled}` shorthand naturally omits
   falsy boolean attrs on real DOM elements) and Vue (`:disabled="x"` has the
   same native-boolean-attr behavior). No runtime should emit
   `data-x="false"` for a boolean-attribute HTML property; that only applies
   to *ARIA state* attributes (`aria-checked`, `aria-expanded`, …) which are
   always stringified `"true"`/`"false"`, never omitted — Go does this via
   `uiutils.AriaExpanded(v) → strconv.FormatBool(v)`; React does it via
   template-literal-style props (`aria-checked={Boolean(isChecked)}` renders
   as string). Keep this true/false-vs-omitted distinction correct per
   attribute, per brick.
8. **`Attrs` / rest-props escape hatch.** Go: `templ.Attributes` map spread
   via `{ p.Attrs... }`, merged so explicit props win via `MergeAttrs`
   ordering. React: `...rest` object spread, positioned so explicit named
   props are destructured out first and `...rest` naturally can't clobber
   them because they're already consumed. Svelte 5: `...rest` via
   `let { class: className, variant, ...rest } = $props()` then
   `{...rest}` spread on the element — same semantics as React. Vue: `v-bind`
   with `$attrs` (implicit) or explicit `...rest` computed from
   `useAttrs()` / a plain `defineProps` destructure — Vue's automatic
   attribute fallthrough (`inheritAttrs`) can achieve this *without* an
   explicit rest-prop in simple cases, but for multi-root or non-forwarding
   components (`disabled` merged with a class-computed div) prefer explicit
   `v-bind="$attrs"` placement to control merge order deterministically.
9. **Multi-part composites — shared recipe vs per-part recipe.** `card` uses
   one recipe for the root and static Tailwind strings for header/title/etc.
   `form` uses 4 independent recipe files. `table` uses one recipe for
   `<table>` only. Do not conflate these — port exactly what each spec's
   `parts[].recipe` (or absence thereof) declares.
10. **No behavior hooks by default.** `ui/dialog`'s `DataUI8Kit` field and
    `ui/breadcrumb`'s `DataUI8Kit` field must default to empty string /
    `undefined` and only emit `data-ui8kit="..."` when explicitly set — this
    is a hard invariant already enforced by
    `.cursor/rules/templ-registry-structure.mdc`'s "Behavior hooks enabled by
    default on bricks... must default off" rule. Verify the new runtime file
    honors this default in its own idiom (Svelte: `let { dataUi8Kit = "" } = $props()`,
    Vue: `withDefaults(defineProps<...>(), { dataUi8Kit: "" })`).

## 6. Runtime Profile — Go Templ (reference, already shipped)

No new work. Use as the canonical semantic reference when porting: it has
zero client-side ergonomics, so its `.templ` file is the purest expression of
"what must render," free of React's `forwardRef`/event-handler noise. When in
doubt about *what a brick must produce*, read the `.templ` file and the
`.spec.md` semantics block before the `.tsx` file.

## 7. Runtime Profile — React TSX (reference, already shipped)

No new work, but note these React-specific idioms that must **not** leak
into Svelte/Vue as if they were part of the contract (they're React
ergonomics, not the contract):

- `forwardRef` + `displayName` — Svelte 5 exposes DOM nodes via
  `bind:this` on the *consumer* side, not a forwarded prop; Vue exposes them
  via template refs automatically or `defineExpose`. Neither needs a
  `forwardRef`-shaped API.
- `asChild` + `Slot` — explicitly not ported (§3.4).
- Literal-union type derivation via `RecipeKey<R, K>` — TypeScript-only
  type-level trick. Svelte and Vue **do** use TypeScript for `<script lang="ts">`,
  so the same `RecipeKey<VariantRecipe, K>` generic type
  (`utils/recipe-types.ts`) can and should be reused as-is for both new
  runtimes — do not reinvent a parallel type helper.
- `isDevEnv()` dev-mode throws — reusable as-is in Svelte/Vue since it's
  framework-agnostic (`import.meta.env.DEV`), but confirm each runtime's
  bundler (Vite for both is likely — see §9) actually populates
  `import.meta.env.DEV` the same way.

## 8. Runtime Profile — Svelte 5 (target #1)

### 8.1 File & directory conventions

Colocate as `ui/<brick>/<brick>.svelte`, matching the existing
`<brick>.templ` / `<brick>.tsx` colocation — do not create a parallel
`ui-svelte/` tree; the whole point of the SSOT is that all runtime files sit
next to their spec. Barrel: add `ui/index.svelte.ts` (Svelte convention for a
non-`.svelte` entry that re-exports components — mirrors how SvelteKit/
svelte-package projects structure a component library barrel) that exports
one `export { default as Button } from "./button/button.svelte";` line per
brick, plus re-exported prop types (`export type { ButtonProps } from "./button/button.svelte";`
if using `<script module>` prop type exports, or a hand-written
`ButtonProps` type per brick — see §8.4). Confirm final barrel filename
against whatever `package.json`/`tsconfig` path aliasing scheme is chosen for
consumers (parallel to `@registry/ui` for React — likely `@registry/ui-svelte`
or a `svelte` conditional export on the same `@registry/ui` specifier; decide
before brick #1 so every subsequent brick follows one pattern).

### 8.2 Variant/class composition helper

Add `utils/variants.svelte.ts` (or extend `utils/variants.ts` if it can stay
framework-agnostic — it likely can, since `compose()`/`composeRecipe()` in
`utils/variants.ts` have zero React dependency today; **audit this before
duplicating** — if `utils/variants.ts` has no React import, Svelte/Vue can
import it directly with no new file). Reuse `cn()` from `utils/cn.ts`
as-is (clsx + tailwind-merge, framework-agnostic). Reuse `defineRecipe()`
and the `RecipeKey<R,K>` type mechanism as-is.

### 8.3 Root-tag resolution mechanism

Use `<svelte:element this={tag}>` for Tier B bricks, computing `tag` via a
ported `resolveTag(tag, fallback, group)` call against the *same*
`utils/tags.ts` (framework-agnostic, no React import — confirm and reuse
directly, do not fork). Example shape (illustrative, not final):

```svelte
<script lang="ts">
  import { resolveTag, TagGroup } from "../../utils/tags";
  import { composeRecipe } from "../../utils/variants";
  import stackRecipe from "./stack.variants.json";
  import type { Snippet } from "svelte";

  let {
    tag,
    class: className = "",
    children,
    ...rest
  }: {
    tag?: string;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  } = $props();

  const resolvedTag = resolveTag(tag, "div", TagGroup.Stack);
  const cls = composeRecipe(stackRecipe, {}, className);
</script>

<svelte:element this={resolvedTag} class={cls} {...rest}>
  {@render children?.()}
</svelte:element>
```

Note `<svelte:element>` cannot host a `bind:this` the same way a static tag
can in all Svelte versions — verify current Svelte 5 semantics against the
installed `svelte` version before committing to this pattern for every Tier
B brick; if there's a limitation, the fallback is a manual `{#if}`/`{:else if}`
chain per allowed tag (more verbose, matches Go's `layoutTagInner` switch
shape more literally, and sidesteps any `svelte:element` edge cases).

### 8.4 Props typing

Svelte 5 runes mode props are typed inline via `$props()` destructuring with
a TS type annotation, or via a named exported `type XProps = {...}` above the
script block. Prefer the **named exported type** approach
(`export type ButtonProps = {...}`) so `ui/index.svelte.ts` can re-export it
cleanly and consumers get the same `import type { ButtonProps } from "@registry/ui-svelte"`
ergonomics React consumers already have.

### 8.5 Children API

Svelte 5 uses **snippets**, not the deprecated `<slot>`. Every brick's
`children` prop must be typed `Snippet | undefined` and invoked with
`{@render children?.()}` (optional-call guards bricks with no children, e.g.
`Input`, `Checkbox`, `Separator`, `Icon` in `class`-type mode — these render
no children at all, so skip the snippet entirely rather than typing an unused
prop).

### 8.6 Multi-part composites (Tier E)

Svelte has no single-file multi-export component convention as clean as
React's "one `.tsx` file, many `export const`" — but it *can* do exactly
that: **one `.ts`/`.svelte` file cannot export multiple Svelte components**,
so Tier E bricks (`card`, `table`, `form`, `form/controls`, `select`) need
**one `.svelte` file per exported part** (`Card.svelte`, `CardHeader.svelte`,
`CardTitle.svelte`, …) colocated under `ui/card/` alongside the single
`card.templ`/`card.tsx`. Decide a naming convention up front: PascalCase
filenames matching the exported name (`CardHeader.svelte`) is the Svelte
ecosystem norm and is what this should follow, even though it breaks the
"one file per brick" pattern Go/React use — document this explicitly as a
**Svelte-specific exception** in whatever `docs/`/`.cursor/rules/` update
follows this work, so it isn't mistaken for an inconsistency later.

### 8.7 Testing

Recommended stack: `vitest` + `@testing-library/svelte` (or Svelte 5's
built-in server-side render via `svelte/server`'s `render()` for pure
markup-contract assertions, which is closer to how the existing
`renderToStaticMarkup` React smoke tests work — see
`examples/vite/tests/ui/button.smoke.test.tsx` for the pattern to mirror:
render, assert on the raw HTML string for tag name, attributes, boolean
presence/absence). Prefer the server-render + string-assertion style for
parity with the existing React smoke tests rather than DOM-interaction-style
testing-library assertions, since these are static primitives with no
interaction to test.

## 9. Runtime Profile — Vue 3 (target #2, semi-automated)

### 9.1 File & directory conventions

Colocate as `ui/<brick>/<brick>.vue` using `<script setup lang="ts">`.
Barrel: `ui/index.vue.ts` mirroring `ui/index.svelte.ts`. Same open decision
on consumer-facing package alias as §8.1 — resolve once, apply to both new
runtimes consistently (e.g. `@registry/ui-svelte` and `@registry/ui-vue`, or
subpath exports `@registry/ui/svelte`/`@registry/ui/vue` off one package).

### 9.2 Variant/class composition helper

Same reused `utils/variants.ts` + `utils/cn.ts` as Svelte (framework-agnostic
— confirm no React import exists before assuming reuse; if any subtle React
coupling is found during Svelte work, extract the framework-agnostic core
into `utils/variants.ts`/`utils/cn.ts` proper and keep only true React
bits — `Slot`, `forwardRef` wrapping — in `.tsx` files, as they already
mostly are).

### 9.3 Root-tag resolution mechanism

Use Vue's dynamic component syntax: `<component :is="resolvedTag" :class="cls" v-bind="rest"><slot /></component>`,
computing `resolvedTag` via the same `resolveTag()` call. This is Vue's
direct equivalent of Svelte's `<svelte:element>` and has no known version
caveats — prefer it uniformly across Tier B bricks.

### 9.4 Props typing

`defineProps<{ ... }>()` with `withDefaults()` for default values
(`variant`, `size`, `class`, boolean states). Reuse `RecipeKey<R,K>` typing
exactly as in React/Svelte for CVA fields.

### 9.5 Children API

Vue's default `<slot />` — direct, no snippet ceremony needed. Bricks with
no children render no `<slot />` at all.

### 9.6 Multi-part composites (Tier E)

Same constraint as Svelte: one `.vue` file per exported part
(`Card.vue`, `CardHeader.vue`, …), same PascalCase-matches-export-name
convention, documented as the shared Svelte+Vue exception to the "one file
per brick" rule.

### 9.7 Semi-automated generation strategy

Once Svelte is fully ported and validated (see §11 Definition of Done),
Vue can be generated by prompting an LLM with: the brick's `.spec.md`, its
`.variants.json`, its finished `.svelte` file (structurally closest — both
are SFC-style, both use native attribute forwarding, both resolve tags via a
dynamic-component mechanism), and this document's §9 rules. The LLM proposes
the `.vue` file; a reviewer (human or a second LLM pass) checks it against
the same Definition-of-Done checklist used for every other runtime — no
separate, looser bar for the "automated" runtime.

### 9.8 Testing

`vitest` + `@vue/test-utils`'s `mount()` with `.html()` string assertions,
mirroring the same render-and-assert-on-markup style as Svelte/React (§8.7).

## 10. Spec Schema Extension Needed (the only sanctioned SSOT change)

`*.spec.md`'s `targets:` map currently supports `templ` and `react` keys
(see `.validate/cmd/specmigrate/main.go:125-136` for the exact shape it
writes, and `ui/button/button.spec.md`'s `targets:` block for the read
shape: `{ component, facade, package, test? }`). Add `targets.svelte` and
`targets.vue` with the identical shape:

```yaml
targets:
  templ:
    component: Button
    facade: github.com/fastygo/templ/ui
    package: github.com/fastygo/templ/ui/button
  react:
    component: Button
    facade: '@fastygo/templ-react'
    package: '@fastygo/templ-react/ui/button'
    test: ../../examples/vite/tests/ui/button.smoke.test.tsx
  svelte:
    component: Button
    facade: '@registry/ui-svelte'   # confirm final alias per §8.1
    package: '@registry/ui-svelte/button'
    test: ../../examples/<svelte-test-root>/button.smoke.test.ts
  vue:
    component: Button
    facade: '@registry/ui-vue'      # confirm final alias per §9.1
    package: '@registry/ui-vue/button'
    test: ../../examples/<vue-test-root>/button.smoke.test.ts
```

Required companion validator work in `.validate/cmd/validate-spec/`:

- Extend `sources.go`/`validate.go`'s `validateReactTestTarget` pattern
  (currently React-only, `reactTestRequiredLayers` gate) into a
  runtime-generic version, or add parallel `validateSvelteTestTarget` /
  `validateVueTestTarget` functions following the exact same contract: if
  `targets.<runtime>.test` is declared, the file must exist and end in the
  runtime's test extension (`.test.ts` for both, matching Vitest convention);
  if a brick's `layer` is in the "test required" set (mirror
  `reactTestRequiredLayers = {"primitive": true, "composite": true}`) AND it
  declares `targets.<runtime>`, `test` becomes mandatory, not optional.
- Do **not** relax `validateCVAPresence` or `validateAllowLists` — those are
  already fully runtime-agnostic (they validate `api:` and
  `allow-list-source`, not `targets:`), so no change needed there.
- `validateRuntimeScopedAPIFields`'s `react-only: true` escape hatch
  (currently the only per-runtime field-scoping mechanism) may need a
  generalization to `svelte-only`/`vue-only` **only if** a genuine
  Svelte/Vue-specific field emerges during porting (unlikely for `ui/`
  primitives, since none of the identified bricks need framework-specific
  extra props the way `asChild`/`Slot` needed `react-only` handling — but
  Svelte/Vue don't have `asChild` at all, so this may simply never trigger).

## 11. Definition of Done (per brick, per new runtime)

A brick's Svelte (or Vue) file is done when **all** of the following hold —
this is the checklist to run mentally (or as an actual review pass) before
moving to the next brick:

1. Same exported name(s) as the `.tsx`/`.templ` pair (`Button`, or for Tier E,
   every part: `Card`, `CardHeader`, …).
2. Every `api.<Field>` from `.spec.md` is represented, with the same default
   value and the same `cva`-driven behavior (CVA fields resolve through
   `*.variants.json`; non-CVA fields forward as plain attrs).
3. Root tag matches the brick's Tier (A/C/D/E: fixed tag; B: resolved via
   `resolveTag`/`TagGroup`, same allow-list as Go/React).
4. Class merge order matches §5.3 (base → variant/size → state → caller).
5. Boolean attribute presence/omission matches §5.7 exactly (no
   `disabled="false"` leaking onto the DOM; ARIA state attrs always
   stringified true/false, never omitted).
6. `Attrs`/rest-prop forwarding matches §5.8 (explicit props win, rest
   spreads after).
7. Children render via the runtime's native mechanism (§8.5/§9.5), absent
   entirely on childless bricks.
8. Any default-resolution helper (`imageLoading`, `linkTarget`, `iconType`,
   `tableScope`, …) is ported byte-for-byte in logic, not approximated.
9. Behavior-hook fields (`DataUI8Kit` on `dialog`/`breadcrumb`) default to
   off and only emit `data-ui8kit` when explicitly set.
10. A smoke test exists (per §8.7/§9.8 style) asserting: correct root tag,
    correct default classes/attributes, at least one non-default
    variant/size render, and (where relevant) the boolean-attribute
    presence/absence contract from point 5.
11. `targets.<runtime>` added to the brick's `.spec.md` with a real `test`
    path that resolves (§10).
12. No new npm/framework dependency introduced beyond `svelte`/`vue`
    themselves and whatever bundler/test tooling is already standard for
    that ecosystem (Vite is already used for the React example app —
    confirm whether Svelte/Vue examples can share the existing Vite
    toolchain via `@sveltejs/vite-plugin-svelte` / `@vitejs/plugin-vue`
    rather than introducing SvelteKit/Nuxt, which would be scope creep for a
    primitives-only phase).

## 12. Suggested Implementation Order (not a schedule — a dependency order)

1. **Tooling first, one brick as a spike.** Pick `ui/button` (already the
   canonical reference brick for both Go and React docs) as the first Svelte
   port. Use it to settle: barrel file name/alias (§8.1), whether
   `utils/variants.ts`/`utils/tags.ts`/`utils/cn.ts` are reusable as-is
   (§8.2/§8.3), the `<svelte:element>` viability question (§8.3), spec schema
   extension (§10), and the smoke-test harness (§8.7). Do not parallelize
   across many bricks until these are settled — every subsequent brick
   inherits whatever is decided here.
2. **Tier A bricks** (leaf elements, no tag resolution, no multi-part) —
   mechanical repetition of the button spike's pattern minus the CVA
   type-union boilerplate varies per brick. Fast batch.
3. **Tier B bricks** (tag resolution) — second spike-worthy step: confirm
   the `<svelte:element>`/`<component :is>` pattern generalizes cleanly
   across all `TagGroup*` variants before batch-porting all of Block, Box,
   Stack, Group, Container, List/ListItem, Title.
4. **Tier C bricks** (multi-branch rendering: icon's 3-way switch, image's
   alt/loading/decoding defaults, grid's static class-map lookups) — port
   the exact decision tables; these are logic-heavy, not structurally novel.
5. **Tier D bricks** (dialog, disclosure) — native element wrappers; confirm
   the "no controlled-state contract" invariant (§4 Tier D note) holds in
   Svelte where two-way binding (`bind:open`) is idiomatic and tempting —
   resist it, stay declarative, matching Go/React's static-attribute-only
   approach.
6. **Tier E bricks** — multi-file-per-brick convention (§8.6) settles here;
   do `card` first (simplest multi-part, already has a full
   `parts[]`-annotated spec to follow), then `table`, `form`,
   `form/controls`, `select`, and `breadcrumb` last (the inline-loop-with-
   conditional-branch case, hardest to get pixel/markup-identical).
7. **Repeat 1–6 for Vue**, using the semi-automated LLM-assisted flow (§9.7)
   once every Svelte file exists and passes its Definition of Done — Vue
   generation quality depends on having a complete, validated Svelte corpus
   to reference structurally.

## 13. Open Decisions the Implementing Agent Must Resolve Before Coding

These are not answered here on purpose — they're genuine forks that need a
concrete choice recorded (in a spec, a `.cursor/rules/` update, or
`docs/architecture.md`) before bricks accumulate divergent answers:

- Exact npm package name / import alias for the Svelte and Vue barrels
  (subpath exports off one package vs. two new packages) — affects every
  brick's import statements and `tsconfig`/bundler config.
- Whether `ui/index.svelte.ts` and `ui/index.vue.ts` live at repo root
  alongside `ui/index.ts`, or whether Svelte/Vue need their own top-level
  facade directory given the one-file-per-part constraint (§8.6/§9.6) makes
  `ui/card/` contain 6 `.svelte` + 6 `.vue` files alongside the existing
  `card.templ`/`card.tsx`/`card.spec.md`/`card.variants.json` — confirm this
  doesn't make the directory unreadable; consider a `ui/card/svelte/` /
  `ui/card/vue/` subfolder instead if 12+ files in one flat directory proves
  unwieldy in practice (deviates from strict colocation but may be worth it
  purely for multi-part bricks).
- Test runner unification: does this repo want one Vitest config covering
  Svelte+Vue+shared `utils/` tests, separate from the existing Bun test
  runner used for React (`bun test`, see `package.json`'s `test:*` scripts)?
  Bun and Vitest can coexist per-workspace but the `bun run verify` pipeline
  (`package.json:29`) will need new steps either way — decide whether new
  runtime tests join that single `verify` chain or get their own `verify:svelte`/
  `verify:vue` scripts composed into it.
- `lint:ui8px` currently scans `ui components utils examples` for Tailwind
  class-string policy compliance (`package.json:15`) — confirm `ui8px` (the
  external linter) can parse `.svelte`/`.vue` template class attributes, or
  whether new-runtime class strings need a different lint entry point (they
  reuse the same `.variants.json` so in principle no *new* class strings are
  introduced — risk is limited to whatever static Tailwind classes appear
  directly in template markup, e.g. Tier E parts' hardcoded strings like
  `"border-b border-border px-4 py-2"`).
- Whether `docs/architecture.md`'s runtime-parity table (currently 2 columns:
  Templ, React) gets a 3rd/4th column now or only after Svelte/Vue are fully
  shipped — the doc's own comment says "adds a row of ported concepts, not a
  3rd column glued on" (line 33-34), implying the table should be
  restructured, not just extended; that restructuring is itself a real task
  to schedule, not an afterthought.
```

