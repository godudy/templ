# Documentation

Long-lived project documentation lives here. Cursor/LLM operating rules live in
`.cursor/rules`; machine-readable brick contracts live in colocated
`*.spec.md`, `*.variants.json`, and `*.data.json` files.

**Learners start here.** The `.cursor/rules/` folder targets AI agents and
contributors adding new bricks. If you are trying to *use* the registry, read
[`mental-model.md`](mental-model.md), [`coming-from-shadcn.md`](coming-from-shadcn.md),
and [`learn/`](learn/) first.

## Guides

- [`mental-model.md`](mental-model.md) — five core ideas: recipes, specs, layout
  grammar, ui8kit boundary, and the shared runtime contract.
- [`architecture.md`](architecture.md) — multi-runtime component contract,
  shipped today as Go Templ SSR and React TSX.
- [`aria.md`](aria.md) — static ARIA, behavior hooks, `@ui8kit/aria`, and the
  Sheet dialog contract.
- [`coming-from-shadcn.md`](coming-from-shadcn.md) — onboarding notes for
  developers familiar with shadcn.
- [`cheatsheet-react-to-templ.md`](cheatsheet-react-to-templ.md) — one-page
  React ↔ Templ syntax and naming map.
- [`learn/`](learn/) — split-view lessons (React ↔ Templ) for the examples scaffolds.
- [`publishing.md`](publishing.md) — Go module vs future npm delivery model.

## Rule Files

Use `.cursor/rules` for agent-facing operational guidance:

- `templ-registry-structure.mdc`
- `templ-component-spec.mdc`
- `templ-layout-grammar.mdc`
- `templ-atomic-ui8px.mdc`
- `templ-aria.mdc`
- `templ-react-port.mdc`
- `templ-validation-testing.mdc`
- `templ-spec-driver.mdc`
