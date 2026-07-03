# Contributing

Human-focused contributor guide for this registry. This is the practical
counterpart to agent-oriented rules in
[`.cursor/rules/templ-registry-structure.mdc`](../.cursor/rules/templ-registry-structure.mdc).

## Working model

Treat each brick as one shared contract with multiple runtime ports:

- Contract sources: `*.spec.md`, `*.variants.json`, optional `*.data.json`
- Runtime ports: `*.templ` and `*.tsx`
- Shared behavior/docs policy: [`architecture.md`](architecture.md)

If a behavior or API is not in the spec/variants contract, it is not part of
the public surface.

## Recommended root commands

From repository root:

```bash
bun install
bun run dev:vite
bun run dev:templ
```

Use `examples/` local commands only when you intentionally work inside that
subdirectory.

## Add or change a brick checklist

1. Update or create the contract in `ui/<brick>/` or `components/<brick>/`:
   - `*.spec.md` (API, semantics, examples, targets)
   - `*.variants.json` (single source of variant classes)
   - optional `*.data.json` (fixture/showcase data)
2. Keep both runtime ports aligned:
   - `*.templ`
   - `*.tsx`
3. Keep docs aligned when behavior is non-obvious:
   - `docs/coming-from-shadcn.md`
   - lesson docs under `docs/learn/`
4. Keep example scaffolds aligned if the change affects previews:
   - `examples/templ/`
   - `examples/vite/`
5. Run validation before marking done (see below).

## Twin helpers checklist (review-first path)

Follow this when changing hand-synced twins such as `sheet-ids.{ts,go}` and
helpers like `workflowStepLabel`, `navIconLetter`, `toolIconLetter`,
`showcaseIconLetter`.

1. Identify the twin pair(s) up front and list both paths in your PR notes.
2. Keep names/signatures/constants aligned across runtime files.
3. Update both sides in one change; never leave a one-sided helper edit.
4. If behavior changes, update fixtures/tests/docs in the same change set.
5. Confirm comments still point to the correct twin file.
6. Cross-check with Twin-Helper Policy in [`architecture.md`](architecture.md).

## Validation checklist

Run from repository root:

```bash
bash .validate/scripts/validate-spec.sh --with-tests
bun run typecheck:react
bun run lint:ui8px
bun run validate:aria
go test ./...
```

For full gate parity, run:

```bash
bun run verify
```

## Common mistakes

- Editing only one side of a twin helper pair
- Adding variant classes directly in runtime files instead of `*.variants.json`
- Treating docs-only exceptions as implicit (always document intentional divergence)
- Using positional text arguments where the contract expects `{ children... }`
