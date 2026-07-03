# Templ Repository Audit — Work Plan

> Readonly audit. Links point to real files at time of review.  
> Note: some P0 items from `.project/audit.md` (double `bun install`, missing root `dev`) are already closed — `package.json` declares `workspaces: ["examples"]`, root `dev: cd examples && bun run dev:vite`, `examples/README.md` documents single-bun install.  
> Cross-checked against `.project/runtimes.md` (target: 5+ runtimes, file since removed from the repo) — see **Multi-runtime consistency review** below.  
> Checkboxes (`[x]`) mark tasks completed in this chat session; unchecked (`[ ]`) tasks are still open.

**Overall score:** 4.5/5 for this audit's scope (contracts, docs, lessons, code hygiene). An interactive browser playground / split-view lesson viewer is a separate initiative and is out of scope for this audit — not tracked in this plan.

---

## Duplicates found (merged below)

| Topic | Where it repeated |
|-------|-------------------|
| Broken `docs/` links after `.project/` → `docs/` move | §4, §5, §7, §9, onboarding map |
| `validate-spec` pointed at `examples/ui/blocks` instead of `examples/templ/ui/blocks` | §4, §6, §7, §9, friction E1-area, code review 3.3 |
| Box = `div` only — rules vs lesson drift | §4, §7, §9, parity report |
| Missing Button / Badge / Card lessons | §1–3, §5, §7, §9, D2, G2, top quick wins |
| Cheat sheet for React devs | §10, executive P2, G3 |
| Escape hatch `asChild` ↔ `*Classes()` | §5, §7, §6 LayerTable, top-3 discrepancies, G7 |
| `bun run generate` not in lessons | onboarding map, G6 |
| `page.tsx` — junior lost among 9 home files | §1, onboarding, E1, G4 |
| `react-router-dom` undocumented | §1–3 |
| Twin helpers maintained manually (`workflowStepLabel`, `sheet-ids`) | §1 P3 |
| `examples/README.md:22` ambiguous “or” | §2–3 |
| Friction F1–F4, C1–C3, E1–E3, D1–D5 | lines 88–151 and §3 code review (full duplicate) |
| Lesson numbering | §9: `00-button`, `05-card`; §3/G2: `05-button`, `06-badge`, `07-card` → **canonical: 05/06/07** |

---

## Multi-runtime consistency review

> Checked against `.project/runtimes.md` (informational only — target is **5+ runtimes**: React, Go Templ, Svelte 5, Vue 3, PHP/Latte or Blazor; not applying that architecture now). Goal: make sure this plan does not bake in 2-runtime assumptions that break once runtime #3 lands, and that useState/hook-shaped "fixes" for React aren't treated as the model to replicate per runtime.

| Done | # | Finding | Where | Why it matters at N=5 | Plan change |
|:---:|---|---------|-------|------------------------|-------------|
| [x] | M1 | Contract semantics hardcode a specific runtime name | `components/sheet/sheet.spec.md`:107–108 — "on **both stacks**", "do not bind Open to **React** state" | `*.spec.md` is the single source of truth read by every port. Naming "React" inside a runtime-neutral contract is already false the day a 3rd port exists, and nothing greps for it today. | **Fixed** — wording is now runtime-neutral (see **1.15**) |
| [x] | M2 | "Dual-stack" / "Two Stacks" is baked into foundational vocabulary | `docs/architecture.md` (title), `mental-model.md`, `coming-from-shadcn.md` (`## Why Two Stacks?`), every `learn/*/README.md` ("dual-stack contract") | Cosmetic today, but every one of these files becomes literally incorrect the moment a 3rd runtime ships. A rename sweep across ~10 files is cheap now, expensive once linked from N onboarding docs. | **Fixed** — sweep done (see **1.15**) |
| [x] | M3 | `target` (TSX) vs `For` (Go) naming split is treated as "explain the difference," not a decision deadline | 1.10(b), `docs/learn/03-sheet/README.md`:40 | Whichever name Svelte/Vue/PHP ports copy locks in the inconsistency for good, or forces a 3-vs-2 tiebreak. Cost of renaming grows linearly with shipped ports. | **Fixed** — canonical name decided and migrated (`panelId`/`PanelID`) via **1.10** |
| [x] | M4 | Twin-helpers pattern (`workflowStepLabel`, `sheet-ids`) has no scaling story | `examples/vite/src/lib/helpers.ts` ↔ `examples/templ/ui/blocks/*/helpers.go` | Pure logic, not styling — the `*.variants.json` JSON-compiler trick does not cover it. At 5 runtimes this is 5 hand-synced copies with nothing catching drift. Currently filed as P3 "write a checklist," which under-rates the risk. | **Policy decided** via **1.13** (`docs/architecture.md` Twin-Helper Policy); **3.2** remains the P3 follow-up for codegen/fixture-test tooling |
| [x] | M5 | Task 1.3 modeled the fix as replicating a React hook (`useFrozenOpen`) per runtime | `components/sheet/sheet.tsx`:92 | A hook-shaped enforcement mechanism is, by construction, a fresh implementation per runtime (React hook, Svelte rune guard, Vue watcher, Go test). That's the same "edit N files by hand" failure mode called out for styling — it applies equally to behavioral contracts. | Wording fixed (part of **1.15**); **`validate-spec` lint implemented** — see **1.3** |
| [x] | M7 | Escape-hatch framing implies Templ is "missing" `asChild` | `coming-from-shadcn.md` Feature Parity table, plan **2.2**, Reference parity table | `*Classes()` on a manual wrapper is the pattern every non-React runtime will use (Go today, Svelte/Vue/PHP tomorrow) — React's `asChild`+`Slot` is the outlier because only React has `cloneElement`. Framing it as "TSX has a feature Templ lacks" teaches the wrong mental model to the next runtime's author. | **Fixed** — `coming-from-shadcn.md`, `05-button`, `07-card` frame `asChild` as React-only sugar over the universal `*Classes()` pattern; confirmed via **1.10** |
| [ ] | M8 | "Reference: parity on key bricks" table is structurally 2-column (TSX / Templ) | this plan, §Reference: parity | Fine as today's snapshot; needs to become per-runtime rows (not more columns) once runtime #3 ships. No action needed now — flagged so nobody treats the table shape as "the contract." | Footnote already present below the table |

`[x]` closed · `[~]` partially closed · `[ ]` open. M1/M2/M5 closed earlier this session; M3, M4, M7 closed via **1.10**/**1.13**.

---

## Work order: critical and complex first, simple last

### P0 — blocks “open and go” ✅ done

| Done | # | Task | What was done |
|:---:|---|------|---------------|
| [x] | 0.1 | **Linkcheck + fix relative links** | `docs/coming-from-shadcn.md`: `../../` → `../` for `ui/` and `examples/`. `docs/learn/README.md`: `../examples|ui|components` → `../../…`; sibling docs → `../…`. `docs/learn/01-hero/README.md`: `../coming-from-shadcn` / `mental-model` → `../../…`. Linkcheck over `docs/**/*.md` — OK. |
| [x] | 0.2 | **Fix `validate-spec` block spec discovery** | `.validate/cmd/validate-spec/validate.go`: `examples/ui/blocks` → `examples/templ/ui/blocks`. Discovery: 37 → **39 specs** (home + dashboard). `validate-spec: OK`. |
| [x] | 0.3 | **Normalize `$schema` references** | `variant.schema.json` → `variants.schema.json` (5 composite files). `examples/data/*.data.json`: `../../../../../schemas` → `../../schemas`. `utils/tags.json`: `../../schemas` → `../schemas`. All local `$schema` refs resolve. |
| [x] | 0.4 | **P0 tail: runtime-count hardcoding found during the audit** | Folded into and closed via **1.15** (below) — `sheet.spec.md` wording + docs vocabulary sweep. Re-ran `validate-spec` and the docs linkcheck after the fix; both green. |

---

### P1 — improves onboarding, reduces wrong mental model risk

#### P1 — complex / multi-part

| Done | # | Task | Effort | Where / what to do |
|:---:|---|------|--------|-------------------|
| [x] | 1.1 | **Annotated lessons: Button, Badge, Card** | High (~2 h × 3) | **Done.** [`docs/learn/05-button/`](../docs/learn/05-button/), [`06-badge/`](../docs/learn/06-badge/), [`07-card/`](../docs/learn/07-card/) following [`01-hero`](../docs/learn/01-hero/). [`docs/learn/README.md`](../docs/learn/README.md) lists all three with links and suggested order. |
| [x] | 1.2 | **Button lesson: variants mental model** | Medium | **Done.** Lesson 05 documents `button.variants.json` → `button.tsx` → `button.templ`, JSON-as-source-of-truth, and exercise for adding a named variant (no `unstyled`). |
| [x] | 1.3 | **Sheet `Open` state — enforce at the contract level, not a per-runtime hook** | Medium | **Done.** Contract wording fixed in **1.15**. Added `validateSheetOpenContract` in `.validate/cmd/validate-spec/sheet_contract_validate.go` — scans registry specs and docs for forbidden Sheet Open teaching, including markdown/backtick variants such as controlled `Open` or binding `Open` to React state. Tests in `sheet_contract_validate_test.go`. |
| [x] | 1.4 | **Single-page “Templ cheat sheet for React devs”** | Medium | **Done.** [`docs/cheatsheet-react-to-templ.md`](../docs/cheatsheet-react-to-templ.md) — multi-runtime-aware naming, invocation, variants, behavior boundary. Linked from [`docs/README.md`](../docs/README.md), [`coming-from-shadcn.md`](../docs/coming-from-shadcn.md), [`learn/README.md`](../docs/learn/README.md). |
| [x] | 1.5 | **Wire preview URLs into each lesson** | Medium | **Done.** Preview sections in `01-hero`, `02-sidebar`, `03-sheet`, `04-layout-grammar`, `05-button`, `06-badge`, `07-card` with `http://127.0.0.1:5173` / `:8080` and `bun run dev:vite` / `dev:templ` commands. |

#### P1 — medium

| Done | # | Task | Effort | Where / what to do |
|:---:|---|------|--------|-------------------|
| [x] | 1.6 | **Align Box = div only in rules** | Low | **Done.** [`.cursor/rules/templ-layout-grammar.mdc`](../.cursor/rules/templ-layout-grammar.mdc) now says `Box` renders `<div>` only, matching [`docs/learn/04-layout-grammar`](../docs/learn/04-layout-grammar/). |
| [x] | 1.7 | **`docs/learn/README.md` — visual progression** | Low | **Done.** All 7 lessons marked `✓ done`; added a "Recommended path (primitives first)" and "Alternative path (block-first)" with explicit numbered steps and per-lesson checkmarks, replacing the flat "suggested order" list. |
| [x] | 1.8 | **`page.tsx` router comment** | Low | **Done.** [`examples/vite/src/blocks/home/page.tsx`](../examples/vite/src/blocks/home/page.tsx) top comment: start with `hero.tsx`, then `sidebar.tsx`, then `mobile-sheet.tsx`; notes the file is only the router/composition shell. |
| [x] | 1.9 | **`bun run generate` in lessons** | Low | **Done.** [`docs/learn/01-hero/README.md`](../docs/learn/01-hero/README.md) gained Exercise C (edit `examples/data/home.data.json`, run `bun run generate`, confirm both ports update). [`docs/learn/README.md`](../docs/learn/README.md) "How to use these lessons" gained a step-5 reminder. `05-button`/`06-badge` already covered generation. |
| [x] | 1.10 | **Top-3 discrepancies — unify before runtime #3, not just document** | Medium-High | **Done.** (a) `asChild` confirmed framed as "React-only sugar over the universal `*Classes()` pattern" in `coming-from-shadcn.md`, `05-button`, `07-card` (see **M7**). (b) Sheet id-reference field migrated to one canonical name: React `panelId`, Go `PanelID`, across `sheet.spec.md`, `sheet.tsx`, `sheet.templ`, all `examples/vite`/`examples/templ` call sites, `docs/learn/03-sheet`, `docs/coming-from-shadcn.md`, `docs/cheatsheet-react-to-templ.md`, and tests (see **M3**). (c) `Open` runtime semantics — see **1.3**; `docs/aria.md` now points to the `sheet_contract_validate.go` enforcement. |
| [x] | 1.11 | **`blockonce` — comment vs implementation** | Low | **Done.** Clarified wording (not implementation): rule 6 and the Validation section in [`.cursor/rules/templ-layout-grammar.mdc`](../.cursor/rules/templ-layout-grammar.mdc) now say the enforced invariant is "at most one `Block` per file, counted, order not checked" rather than implying node-order enforcement. `blockonce`'s own top-of-file comment already matched this. |
| [x] | 1.13 | **Decide a duplication/generation policy for twin logic helpers** | High | **Done (policy only).** Added a "Twin-Helper Policy" section to [`docs/architecture.md`](../docs/architecture.md): IDs/constants (e.g. `sheet-ids`) stay hand-synced twins pending future codegen; variant/class maps are never twinned (`*.variants.json` only); algorithmic helpers (`workflowStepLabel`, `navIconLetter`) may diverge per runtime only with shared fixture tests; intentional divergence must be documented. Updated header comments in `helpers.ts`/`helpers.go` (home, dashboard) and `sheet-ids.{ts,go}` (home, dashboard) to reference the policy and drop "two runtimes" wording. Codegen/fixture-test buildout stays in **3.2**. See **M4**. |
| [x] | 1.15 | **Remove runtime-count hardcoding from contracts and vocabulary** | Medium | **Done.** `components/sheet/sheet.spec.md`:107–108 — "on both stacks" → "on every runtime port"; "React state" → "a runtime's own reactive component state (React state, Svelte runes, Vue refs, ...)"; "first React commit" → "first client-side render". Vocabulary sweep: `docs/architecture.md` title → "Multi-Runtime Component Architecture" + generalized body and Runtime Parity note; `docs/README.md`, `mental-model.md` (§5 heading + body), `coming-from-shadcn.md` (`## Why Go Templ And React First?`, `## 5-Minute Example: Button on Both Ports`, intro footnote), `docs/learn/README.md`, `01-hero`, `02-sidebar`, `03-sheet`, `04-layout-grammar` — all "dual-stack"/"both stacks"/"two stacks" phrasing replaced with "runtime port(s)" wording. Re-ran `validate-spec` (39 specs, OK) and docs linkcheck (OK) after the edit. See **M1**, **M2**. |

#### P1 — quick

| Done | # | Task | Effort | Where / what to do |
|:---:|---|------|--------|-------------------|
| [x] | 1.12 | **F1: Attrs vs explicit Button fields table** | Low | **Done.** Added a field-by-field table to the "Explicit Fields on Templ Button" section of [`docs/coming-from-shadcn.md`](../docs/coming-from-shadcn.md): 4 registry fields (`Variant`/`Size`/`Class`/`asChild`) vs 7 DOM fields Go must name explicitly (`Type`, `Form`, `Disabled`, `ID`, `Role`, `TabIndex`, `AriaLabel`) vs `Attrs` catch-all. |

---

### P2 — UX polish, closing gaps in the learning trail

> An interactive browser playground / split-view lesson artifact is separate work, out of scope for this audit, and intentionally not tracked here.

#### P2 — complex / strategic

| Done | # | Task | Effort | Where / what to do |
|:---:|---|------|--------|-------------------|
| [x] | 2.2 | **Escape hatch lesson: `asChild` ↔ `*Classes()`** | Medium | Button `ButtonClasses` on manual `<a>`; Card `CardClasses` on manual `<section>` — include LayerTable pattern in Card lesson. [`components/card/card.spec.md`](../components/card/card.spec.md):252–289, coming-from-shadcn:158–174. Frame `*Classes()`-on-manual-wrapper as the universal pattern (works for Go today, Svelte/Vue/PHP tomorrow); `asChild`+`Slot` is the React-only exception because only React has `cloneElement` — do not teach it as "Templ is missing asChild" (see **M7**). |
| [x] | 2.3 | **@ui8kit/aria diagram in Sheet lesson** | Medium | “markup only → app runtime owns behavior”. Sheet lesson is good but needs a diagram for `behavior="ui8kit"` mental model. |
| [x] | 2.4 | **Lessons for remaining home blocks** | Medium | E2: [`showcase.tsx`](../examples/vite/src/blocks/home/showcase.tsx), `tools.tsx`, `notice.tsx` — no lessons; trail ends after 4 lessons. |
| [x] | 2.5 | **Split `primitives.smoke.test.tsx`** | Medium | E3/G10: one file 67–300+ lines, 30+ `describe("ui/...")` — good for CI, bad for “how to test one brick”. Per-brick test next to `button.tsx` or `targets.react.test` in spec. |

#### P2 — medium / documentation

| Done | # | Task | Effort | Where / what to do |
|:---:|---|------|--------|-------------------|
| [x] | 2.6 | **“Why no asChild in templ?” — dedicated section** | Low | G7: in coming-from-shadcn + 3 examples (Button, Card, SheetTrigger). |
| [ ] | 2.7 | **F2: Form “verbs-y” perception** | Low | [`ui/form/form.templ`](../ui/form/form.templ):13–24 — 9 explicit fields vs TSX `FormHTMLAttributes`. Short note in docs. |
| [ ] | 2.8 | **C2: Breadcrumb — documented exception** | Low | [`components/breadcrumb/breadcrumb.templ`](../components/breadcrumb/breadcrumb.templ) — only composite with `Items []BreadcrumbItem`, not children/slots. |
| [~] | 2.9 | **D3: coming-from-shadcn — 5-minute onboarding** | Low | 240 lines, 11 H2. Heading renamed to “5-Minute Example: Button on Both Ports” as part of **1.15**'s vocabulary sweep, but the section still needs to **move above** “Main Differences” — not done yet. |
| [ ] | 2.10 | **D4: architecture.md — React/Templ ergonomics** | Low | [`docs/architecture.md`](../docs/architecture.md):38–40 — `htmlFor`/`onClick`/`ref` vs `HTMLFor`/`Attrs`; one sentence, needs examples. |
| [ ] | 2.11 | **`react-router-dom` in examples/README** | Low | Only dep outside peers; [`examples/vite/src/main.tsx`](../examples/vite/src/main.tsx):3 imports `BrowserRouter`. One line in [`examples/README.md`](../examples/README.md). |

#### P2 — quick

| Done | # | Task | Effort | Where / what to do |
|:---:|---|------|--------|-------------------|
| [ ] | 2.12 | **Card lesson: LayerTable escape hatch** | Low | §6: manual `<section class={ CardClasses(...) }>` / `<Card asChild><section>` — legitimate pattern; without explicit mention junior sees “raw section” and gets confused. |

---

### P3 — long tail, contributor DX

| Done | # | Task | Effort | Where / what to do |
|:---:|---|------|--------|-------------------|
| [ ] | 3.1 | **F3: Grid double API** | Medium | [`ui/grid/grid.templ`](../ui/grid/grid.templ):32–108 — 5 legacy maps `Cols/Span/Start/End/Order`. [`ui/grid/grid.spec.md`](../ui/grid/grid.spec.md):96: “prefer Class”. G8: deprecate with lint or remove. |
| [ ] | 3.2 | **Twin helpers — codegen or review checklist** | Medium | `workflowStepLabel` in two files/languages; `sheet-ids.{ts,go}` too. As pairs grow, need codegen or review checklist. Execution task for the policy decided in **1.13**. |
| [ ] | 3.3 | **G9/D5: `docs/contributing.md` for humans** | Medium | Human analogue of [`templ-registry-structure.mdc`](../.cursor/rules/templ-registry-structure.mdc):81–91 “how to add a brick”. Currently agent-facing rules only. |
| [ ] | 3.4 | **F4: ListItem `Tag: "dt"/"dd"`** | Low | [`ui/list/list.templ`](../ui/list/list.templ):34–49 — `ResolveTag` for definition lists; one line in spec. |
| [ ] | 3.5 | **C3: NavLink polymorphism** | Low | [`components/nav/nav.tsx`](../components/nav/nav.tsx) — `<a>` or `<span>` by `Disabled`/empty `Href`; in spec but no “why not asChild”. |
| [ ] | 3.6 | **`examples/README.md:22` — single root command** | Low | “From examples/ (or the repository root…)” → unambiguous: root `bun install` + `bun run dev:vite`. |
| [ ] | 3.7 | **LLM weak spots in rules** | Low | `templ-spec-driver.mdc:25` “tiny mechanical edits” — LLM may skip spec-step. `templ-react-port.mdc:89–99` positional value string — validate-spec doesn't catch children-API. Empty-string variant keys — variantcheck catches, LLM may not understand defaults. |

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
| Frontend dev learning 2nd stack | 🟡 Medium | mental-model + docs; needs IDE + Go + Bun to compare ports side by side |
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
| Sheet | ✅ panelId/PanelID | ✅ | ✅ role=dialog | ✅ ui8kit | `useFrozenOpen` TSX only |
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

## “First 5 PRs” checklist (minimal path to working onboarding) — done

- [x] P0.1 + P0.2 — links + validate-spec path
- [x] P1.15 — remove runtime-count hardcoding from `sheet.spec.md` and vocabulary sweep
- [x] P1.1–P1.5 — Button/Badge/Card lessons, variant JSON mental model, Sheet Open contract lint, cheat sheet, preview URLs
- [x] P1.6 — Box wording in rules
- [x] P1.8 + P1.9 — page.tsx comment + generate in 01-hero
- [x] P1.7, P1.10, P1.11, P1.13 — learn/README progression, Sheet `panelId`/`PanelID` migration, `blockonce` wording, twin-helper policy
- [x] P1.12 — Attrs vs explicit Button fields table

All of P0 and P1 are closed.

## Next priority queue (P2/P3, in this order)

1. **2.5** — Split `primitives.smoke.test.tsx` into per-brick test files (test organization, not a lesson).
2. **2.7** — Form "verbs-y" perception note (doc/reference).
3. **2.8** — Breadcrumb documented exception (doc/reference).
4. **2.9** — Finish moving the "5-Minute Example" section above "Main Differences" in `coming-from-shadcn.md` (doc reorg; already `[~]` partial from **1.15**).
5. **2.10** — `architecture.md` React/Templ ergonomics examples (doc/reference).
6. **2.11** — Document `react-router-dom` in `examples/README.md` (doc/reference).
7. **3.1** — Deprecate Grid's legacy `Cols`/`Span`/`Start`/`End`/`Order` props (code debt).
8. **3.2** — Twin-helpers codegen or review checklist — execution of the **1.13** policy (tooling).

Everything else remaining in P2 (`2.2`, `2.3`, `2.4`, `2.6`, `2.12`) and P3 (`3.3`–`3.7`) comes after these eight, in table order.

> An interactive browser playground / split-view lesson artifact is separate work and out of scope for this audit — it is not tracked in this plan.
