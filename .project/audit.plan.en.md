# Templ Repository Audit — Work Plan

> Readonly audit. Links point to real files at time of review.  
> Note: some P0 items from `.project/audit.md` (double `bun install`, missing root `dev`) are already closed — `package.json` declares `workspaces: ["examples"]`, root `dev: cd examples && bun run dev:vite`, `examples/README.md` documents single-bun install.  
> Cross-checked against [`.project/runtimes.md`](runtimes.md) (target: 5+ runtimes) — see **Multi-runtime consistency review** below.

**Overall score:** 4.5/5. The main gap is between a browser split-view lesson format (Sololearn-style) and the current “open two files in your IDE” workflow.

---

## Duplicates found (merged below)

| Topic | Where it repeated |
|-------|-------------------|
| Broken `docs/` links after `.project/` → `docs/` move | §4, §5, §7, §9, onboarding map |
| `validate-spec` pointed at `examples/ui/blocks` instead of `examples/templ/ui/blocks` | §4, §6, §7, §9, friction E1-area, code review 3.3 |
| Box = `div` only — rules vs lesson drift | §4, §7, §9, parity report |
| Missing Button / Badge / Card lessons | §1–3, §5, §7, §9, D2, G2, top quick wins |
| Browser split-view | §4, §7, G1, executive top-3 (as P1) |
| Cheat sheet for React devs | §10, executive P2, G3 |
| Escape hatch `asChild` ↔ `*Classes()` | §5, §7, §6 LayerTable, top-3 discrepancies, G7 |
| `bun run generate` not in lessons | onboarding map, G6 |
| `page.tsx` — junior lost among 9 home files | §1, onboarding, E1, G4 |
| `react-router-dom` undocumented | §1–3 |
| Twin helpers maintained manually (`workflowStepLabel`, `sheet-ids`) | §1 P3 |
| `examples/README.md:22` ambiguous “or” | §2–3 |
| Friction F1–F4, C1–C3, E1–E3, D1–D5 | lines 88–151 and §3 code review (full duplicate) |
| Top-3 quick wins — **priority conflict** | §1: P2 lessons; executive: P1 split-view, P2 cheat sheet |
| Lesson numbering | §9: `00-button`, `05-card`; §3/G2: `05-button`, `06-badge`, `07-card` → **canonical: 05/06/07** |

---

## Multi-runtime consistency review

> Checked against `.project/runtimes.md` (informational only — target is **5+ runtimes**: React, Go Templ, Svelte 5, Vue 3, PHP/Latte or Blazor; not applying that architecture now). Goal: make sure this plan does not bake in 2-runtime assumptions that break once runtime #3 lands, and that useState/hook-shaped "fixes" for React aren't treated as the model to replicate per runtime.

| # | Finding | Where | Why it matters at N=5 | Plan change |
|---|---------|-------|------------------------|-------------|
| M1 | Contract semantics hardcode a specific runtime name | `components/sheet/sheet.spec.md`:107–108 — "on **both stacks**", "do not bind Open to **React** state" | `*.spec.md` is the single source of truth read by every port. Naming "React" inside a runtime-neutral contract is already false the day a 3rd port exists, and nothing greps for it today. | Folded into new **1.15** |
| M2 | "Dual-stack" / "Two Stacks" is baked into foundational vocabulary | `docs/architecture.md` (title), `mental-model.md`, `coming-from-shadcn.md` (`## Why Two Stacks?`), every `learn/*/README.md` ("dual-stack contract") | Cosmetic today, but every one of these files becomes literally incorrect the moment a 3rd runtime ships. A rename sweep across ~10 files is cheap now, expensive once linked from N onboarding docs. | Folded into new **1.15** |
| M3 | `target` (TSX) vs `For` (Go) naming split is treated as "explain the difference," not a decision deadline | 1.10(b), `docs/learn/03-sheet/README.md`:40 | Whichever name Svelte/Vue/PHP ports copy locks in the inconsistency for good, or forces a 3-vs-2 tiebreak. Cost of renaming grows linearly with shipped ports. | **1.10** reworded — decide before runtime #3, don't just document |
| M4 | Twin-helpers pattern (`workflowStepLabel`, `sheet-ids`) has no scaling story | `examples/vite/src/lib/helpers.ts` ↔ `examples/templ/ui/blocks/*/helpers.go` | Pure logic, not styling — the `*.variants.json` JSON-compiler trick (`runtimes.md` §1) does not cover it. At 5 runtimes this is 5 hand-synced copies with nothing catching drift. Currently filed as P3 "write a checklist," which under-rates the risk. | New **1.13** (decide strategy, P1); **3.2** kept in P3 as the follow-up execution task |
| M5 | Task 1.3 modeled the fix as replicating a React hook (`useFrozenOpen`) per runtime | `components/sheet/sheet.tsx`:92 | A hook-shaped enforcement mechanism is, by construction, a fresh implementation per runtime (React hook, Svelte rune guard, Vue watcher, Go test). That's the same "edit N files by hand" failure mode `runtimes.md` calls out for styling — it applies equally to behavioral contracts. | **1.3** reworded — enforce at spec/`validate-spec` level, not via per-runtime hook parity |
| M6 | Split-view artifact (2.1) implicitly assumes exactly 2 panes | `docs/learn/` split-view goal | A hardcoded "TSX left / Templ right" viewer means a full rebuild to add a 3rd/4th pane later instead of one config entry. | Note added to **2.1** |
| M7 | Escape-hatch framing implies Templ is "missing" `asChild` | `coming-from-shadcn.md` Feature Parity table, plan **2.2**, Reference parity table | `*Classes()` on a manual wrapper is the pattern every non-React runtime will use (Go today, Svelte/Vue/PHP tomorrow) — React's `asChild`+`Slot` is the outlier because only React has `cloneElement`. Framing it as "TSX has a feature Templ lacks" teaches the wrong mental model to the next runtime's author. | Note added to **2.2** + footnote on parity table |
| M8 | "Reference: parity on key bricks" table is structurally 2-column (TSX / Templ) | this plan, §Reference: parity | Fine as today's snapshot; needs to become per-runtime rows (not more columns) once runtime #3 ships. No action needed now — flagged so nobody treats the table shape as "the contract." | Footnote added |

No new P0 items — M1–M8 are folded into existing or new **P1** entries below so they get fixed before more runtimes get scaffolded, not after.

---

## Work order: critical and complex first, simple last

### P0 — blocks “open and go” ✅ done

| # | Task | Status | What was done |
|---|------|--------|---------------|
| 0.1 | **Linkcheck + fix relative links** | ✅ | `docs/coming-from-shadcn.md`: `../../` → `../` for `ui/` and `examples/`. `docs/learn/README.md`: `../examples|ui|components` → `../../…`; sibling docs → `../…`. `docs/learn/01-hero/README.md`: `../coming-from-shadcn` / `mental-model` → `../../…`. Linkcheck over `docs/**/*.md` — OK. |
| 0.2 | **Fix `validate-spec` block spec discovery** | ✅ | `.validate/cmd/validate-spec/validate.go`: `examples/ui/blocks` → `examples/templ/ui/blocks`. Discovery: 37 → **39 specs** (home + dashboard). `validate-spec: OK`. |
| 0.3 | **Normalize `$schema` references** | ✅ | `variant.schema.json` → `variants.schema.json` (5 composite files). `examples/data/*.data.json`: `../../../../../schemas` → `../../schemas`. `utils/tags.json`: `../../schemas` → `../schemas`. All local `$schema` refs resolve. |

---

### P1 — improves onboarding, reduces wrong mental model risk

#### P1 — complex / multi-part

| # | Task | Effort | Where / what to do |
|---|------|--------|-------------------|
| 1.1 | **Annotated lessons: Button, Badge, Card** | High (~2 h × 3) | `docs/learn/05-button/`, `06-badge/`, `07-card/` following [`docs/learn/01-hero/`](../docs/learn/01-hero/). Currently [`docs/learn/README.md`](../docs/learn/README.md):15–17 marks them “do not yet have an annotated lesson page” — first bricks juniors hit after the trail. |
| 1.2 | **Button lesson: variants mental model** | Medium | Lesson 05: chain `button.variants.json` → `button.tsx` → `button.templ`. JSON instead of inline `cva()` is unfamiliar — show explicitly. Exercise “how to add a new visual variant” (no `unstyled` escape hatch — named variant only). |
| 1.3 | **Sheet `Open` state — enforce at the contract level, not a per-runtime hook** | Medium | C1: contract enforced only in React dev mode (`useFrozenOpen`); Go `Open bool` has no warning. Fix `sheet.spec.md`:107–108 wording first (drop "React state" / "both stacks" — see **M1**), then add a `validate-spec` lint that flags binding `Open` to a runtime's own reactive state, instead of G5's original "port `useFrozenOpen` to Go" — a hook-shaped fix must be reinvented again for Svelte/Vue/PHP (see **M5**). |
| 1.4 | **Single-page “Templ cheat sheet for React devs”** | Medium | G3: 10 naming rows + 5 syntax mappings (`<X>` ↔ `@ui.X(XProps{})`, `{children}` ↔ `{ children... }`, `.map()` ↔ `for _, x := range`, `useState(open)` ↔ “don't, use ui8kit”, `asChild` ↔ `*Classes`). Currently split between [`docs/coming-from-shadcn.md`](../docs/coming-from-shadcn.md) and per-lesson READMEs. |
| 1.5 | **Wire preview URLs into each lesson** | Medium | Deep-links to `http://127.0.0.1:5173` / `:8080` preview per lesson topic. |

#### P1 — medium

| # | Task | Effort | Where / what to do |
|---|------|--------|-------------------|
| 1.6 | **Align Box = div only in rules** | Low | [`docs/learn/04-layout-grammar`](../docs/learn/04-layout-grammar/) says Box = div only; [`.cursor/rules/templ-layout-grammar.mdc`](../.cursor/rules/templ-layout-grammar.mdc) still says “`<div>` (or other layout tag)”. |
| 1.7 | **`docs/learn/README.md` — visual progression** | Low | D1: “Suggested order: 01, 04, 02, 03” with no “✓ done” / “todo”. Add status and explicit numbering. |
| 1.8 | **`page.tsx` router comment** | Low | E1/G4: [`examples/vite/src/blocks/home/page.tsx`](../examples/vite/src/blocks/home/page.tsx) — thin wrapper over 9 sub-components. Top comment: “Start from hero.tsx → sidebar.tsx → mobile-sheet.tsx”. |
| 1.9 | **`bun run generate` in lessons** | Low | G6: after editing `home.data.json` / `home.variants.json` / spec — run `bun run generate`. Currently only in `templ-examples-data.mdc`. Add to [`docs/learn/01-hero/README.md`](../docs/learn/01-hero/README.md) and follow-ups. |
| 1.10 | **Top-3 discrepancies — unify before runtime #3, not just document** | Medium-High | (a) `asChild` asymmetry — reframe as "React-only sugar over the universal `*Classes()` pattern" (see **M7**), not "TSX has, Templ lacks." (b) Sheet `target` (TSX) vs `For` (templ) — **decide one canonical field name now**; 03-sheet:40 only explains the split, and a 3rd runtime forces the decision anyway at higher migration cost (see **M3**). (c) `Open` runtime semantics — see **1.3**. |
| 1.11 | **`blockonce` — comment vs implementation** | Low | Comment says “first node”; implementation only guarantees “at most one Block”. Clarify wording or tighten check. |
| 1.13 | **Decide a duplication/generation policy for twin logic helpers** | High | `workflowStepLabel`/`navIconLetter` (`examples/vite/src/lib/helpers.ts`) and `sheet-ids.{ts,go}` are hand-synced 1:1 pairs. They are pure logic, so the `*.variants.json` JSON-compiler pattern (`runtimes.md` §1) doesn't cover them. Before scaffolding runtime #3, decide: (a) generate from a single JSON/DSL source like variants, (b) keep hand-maintained but add a `validate-spec`/lint check that fails when one twin changes without the other, or (c) explicitly scope which helpers may diverge per runtime. Feeds into **3.2** (checklist/tooling execution). See **M4**. |
| 1.15 | **Remove runtime-count hardcoding from contracts and vocabulary** | Medium | Fix `components/sheet/sheet.spec.md`:107–108 wording ("on both stacks" → "on every runtime port"; "React state" → "a runtime's own reactive state primitive"). Sweep "dual-stack" / "Two Stacks" phrasing in `docs/architecture.md` (title), `mental-model.md`, `coming-from-shadcn.md` (`## Why Two Stacks?`), and `docs/learn/*/README.md` — either generalize now or explicitly footnote "current state: 2 of N planned runtimes" so docs don't silently go stale when runtime #3 lands. See **M1**, **M2**. |

#### P1 — quick

| # | Task | Effort | Where / what to do |
|---|------|--------|-------------------|
| 1.12 | **F1: Attrs vs explicit Button fields table** | Low | [`ui/button/button.templ`](../ui/button/button.templ):15–34 — 11 fields vs TSX 4 registry + DOM. Table exists in spec, missing from [`docs/coming-from-shadcn.md`](../docs/coming-from-shadcn.md). |

---

### P2 — UX polish, closing gaps in the learning trail

#### P2 — complex / strategic

| # | Task | Effort | Where / what to do |
|---|------|--------|-------------------|
| 2.1 | **Browser split-view artifact** | Very high | G1: embedded TSX+templ codeblocks (Astro/Starlight + Shiki twoslash) or GitHub deep-links `#L12-L20` on both files per table row. Only real gap vs Sololearn format. Design the pane list as data (a runtime registry: id, label, file glob) rather than a hardcoded TSX/Templ pair, so a Svelte or Vue pane later is a config entry, not a rebuild (see **M6**). |
| 2.2 | **Escape hatch lesson: `asChild` ↔ `*Classes()`** | Medium | Button `ButtonClasses` on manual `<a>`; Card `CardClasses` on manual `<section>` — include LayerTable pattern in Card lesson. [`components/card/card.spec.md`](../components/card/card.spec.md):252–289, coming-from-shadcn:158–174. Frame `*Classes()`-on-manual-wrapper as the universal pattern (works for Go today, Svelte/Vue/PHP tomorrow); `asChild`+`Slot` is the React-only exception because only React has `cloneElement` — do not teach it as "Templ is missing asChild" (see **M7**). |
| 2.3 | **@ui8kit/aria diagram in Sheet lesson** | Medium | “markup only → app runtime owns behavior”. Sheet lesson is good but needs a diagram for `behavior="ui8kit"` mental model. |
| 2.4 | **Lessons for remaining home blocks** | Medium | E2: [`showcase.tsx`](../examples/vite/src/blocks/home/showcase.tsx), `tools.tsx`, `notice.tsx` — no lessons; trail ends after 4 lessons. |
| 2.5 | **Split `primitives.smoke.test.tsx`** | Medium | E3/G10: one file 67–300+ lines, 30+ `describe("ui/...")` — good for CI, bad for “how to test one brick”. Per-brick test next to `button.tsx` or `targets.react.test` in spec. |

#### P2 — medium / documentation

| # | Task | Effort | Where / what to do |
|---|------|--------|-------------------|
| 2.6 | **“Why no asChild in templ?” — dedicated section** | Low | G7: in coming-from-shadcn + 3 examples (Button, Card, SheetTrigger). |
| 2.7 | **F2: Form “verbs-y” perception** | Low | [`ui/form/form.templ`](../ui/form/form.templ):13–24 — 9 explicit fields vs TSX `FormHTMLAttributes`. Short note in docs. |
| 2.8 | **C2: Breadcrumb — documented exception** | Low | [`components/breadcrumb/breadcrumb.templ`](../components/breadcrumb/breadcrumb.templ) — only composite with `Items []BreadcrumbItem`, not children/slots. |
| 2.9 | **D3: coming-from-shadcn — 5-minute onboarding** | Low | 240 lines, 11 H2. “5-Minute Example: Button on Two Stacks” (lines 17–50) — move above “Main Differences”. |
| 2.10 | **D4: architecture.md — React/Templ ergonomics** | Low | [`docs/architecture.md`](../docs/architecture.md):38–40 — `htmlFor`/`onClick`/`ref` vs `HTMLFor`/`Attrs`; one sentence, needs examples. |
| 2.11 | **`react-router-dom` in examples/README** | Low | Only dep outside peers; [`examples/vite/src/main.tsx`](../examples/vite/src/main.tsx):3 imports `BrowserRouter`. One line in [`examples/README.md`](../examples/README.md). |

#### P2 — quick

| # | Task | Effort | Where / what to do |
|---|------|--------|-------------------|
| 2.12 | **Card lesson: LayerTable escape hatch** | Low | §6: manual `<section class={ CardClasses(...) }>` / `<Card asChild><section>` — legitimate pattern; without explicit mention junior sees “raw section” and gets confused. |

---

### P3 — long tail, contributor DX

| # | Task | Effort | Where / what to do |
|---|------|--------|-------------------|
| 3.1 | **F3: Grid double API** | Medium | [`ui/grid/grid.templ`](../ui/grid/grid.templ):32–108 — 5 legacy maps `Cols/Span/Start/End/Order`. [`ui/grid/grid.spec.md`](../ui/grid/grid.spec.md):96: “prefer Class”. G8: deprecate with lint or remove. |
| 3.2 | **Twin helpers — codegen or review checklist** | Medium | `workflowStepLabel` in two files/languages; `sheet-ids.{ts,go}` too. As pairs grow, need codegen or review checklist. |
| 3.3 | **G9/D5: `docs/contributing.md` for humans** | Medium | Human analogue of [`templ-registry-structure.mdc`](../.cursor/rules/templ-registry-structure.mdc):81–91 “how to add a brick”. Currently agent-facing rules only. |
| 3.4 | **F4: ListItem `Tag: "dt"/"dd"`** | Low | [`ui/list/list.templ`](../ui/list/list.templ):34–49 — `ResolveTag` for definition lists; one line in spec. |
| 3.5 | **C3: NavLink polymorphism** | Low | [`components/nav/nav.tsx`](../components/nav/nav.tsx) — `<a>` or `<span>` by `Disabled`/empty `Href`; in spec but no “why not asChild”. |
| 3.6 | **`examples/README.md:22` — single root command** | Low | “From examples/ (or the repository root…)” → unambiguous: root `bun install` + `bun run dev:vite`. |
| 3.7 | **LLM weak spots in rules** | Low | `templ-spec-driver.mdc:25` “tiny mechanical edits” — LLM may skip spec-step. `templ-react-port.mdc:89–99` positional value string — validate-spec doesn't catch children-API. Empty-string variant keys — variantcheck catches, LLM may not understand defaults. |

---

## Recommended lesson order (strategy, not a blocker)

1. **Split-tutorial modes:** React → Templ first, then Templ → React.
2. **Topic order:** Button → Badge → Layout grammar (04) → Card → Hero (01) → Sidebar (02) → Sheet (03) → showcase/tools/notice (when added).
3. **Existing suggested order:** 01 → 04 → 02 → 03 (until 05–07 exist).

---

## Reference: engagement by persona

| Persona | Likelihood | Main reason |
|---------|------------|-------------|
| React middle+, knows shadcn | 🟢 High | README side-by-side; cn, composeRecipe, asChild, forwardRef — familiar; `bun run dev` ≤60s |
| Junior after shadcn → Templ | 🟡 Medium-high | 4 lessons + exercises; Go struct literals — 1–2 day threshold |
| Frontend dev learning 2nd stack | 🟡 Medium | mental-model + docs; no browser split-view — needs IDE + Go + Bun |
| LLM assistant | 🟢 Very high | 12 `.mdc` rules, `*.spec.md`, validate-spec/variantcheck/blockonce |

---

## Reference: parity on key bricks

| Brick | API | Variants | Semantics | behavior hooks | Gaps |
|-------|-----|----------|-----------|----------------|------|
| Button | ✅ | ✅ one JSON | ✅ `<button>` | n/a | `asChild` TSX only; templ → `ButtonClasses` |
| Badge | ✅ | ✅ | ✅ `<div>` | n/a | — |
| Title | ✅ | ✅ | ✅ h1–h6 | n/a | TSX H1–H6 sugar; templ `Title(As: n)` |
| Block/Box | ✅ | ✅ | ✅ tag policies | n/a | Box always `<div>` |
| Card | ✅ | ✅ | ✅ | n/a | `asChild` TSX only; templ → `CardClasses` |
| Sheet | ⚠️ target/For | ✅ | ✅ role=dialog | ✅ ui8kit | `useFrozenOpen` TSX only |
| Form | ⚠️ HTMLAttributes vs 9 fields | ✅ | ✅ | n/a | Attrs parity restored |
| Hero/Sidebar/Mobile Sheet blocks | ✅ | ✅ shared JSON | ✅ | ✅ sheet-ids twins | cosmetic syntax only |

> **Note:** this table reflects 2 of the 5+ runtimes described in `.project/runtimes.md`. Treat the two-column shape as a snapshot of today's ports, not the target contract shape — a 3rd runtime turns this into per-runtime rows, not more columns (see **M8**).

---

## Reference: onboarding map (current state)

```
README.md → mental-model / coming-from-shadcn / docs/learn / examples/README
examples/README.md → bun install (root once) → dev:vite / dev:templ
docs/learn/ → 01-hero, 04-layout-grammar, 02-sidebar, 03-sheet (✓)
            → 05-button, 06-badge, 07-card (✗ todo)
Build a screen → hero.tsx ↔ hero.templ + home.data.json + bun run generate
```

**Onboarding risk points:**

| Point | Risk | Comment |
|-------|------|---------|
| `docs/learn/` links | 🟢 | P0 closed — linkcheck OK |
| `examples/vite/src/blocks/home/*` | 🟡 | 9 files — easy to get lost |
| `bun run generate` | 🟡 | not in lesson README |
| Button/Badge/Card without lessons | 🟡 | first bricks after the trail |

---

## Strengths (no work needed — context)

- **ui/:** shadcn-pattern ButtonProps, RecipeKey from JSON, Title H1–H6 sugar, Block/Box smoke tests.
- **components/:** Card named exports + asChild Slot, Sheet useFrozenOpen dev-warn, spec contract Open/Behavior.
- **examples/:** hero.tsx ↔ hero.templ ~1:1; twin `sheet-ids`, `workflowStepLabel`; single `home.data.json`.
- **docs/:** mental-model 97 lines; 01-hero line-by-line table + A/B exercises; 04-layout-grammar spot-the-violation.
- **rules/:** templ-component-spec, templ-layout-grammar — agent-facing reference.

---

## “First 5 PRs” checklist (minimal path to working onboarding)

1. ~~P0.1 + P0.2 — links + validate-spec path~~ ✅  
2. P1.6 — Box wording in rules  
3. **P1.15 — remove runtime-count hardcoding from `sheet.spec.md` and vocabulary sweep** (do this before more lessons/docs reference "dual-stack")  
4. P1.8 + P1.9 — page.tsx comment + generate in 01-hero  
5. P1.1 — `05-button` lesson (01-hero template)  

Then: P1.13 (twin-helper policy) and P1.10(b) (`target`/`For` naming) before scaffolding runtime #3, `06-badge`, `07-card`, P1.4 cheat sheet, split-view (2.1), rest top-to-bottom in the tables above.
