# Lesson 04: Layout grammar

Unlike the previous lessons, this one is not a single file pair — it is the
rule set behind every `Block` / `Box` / `Stack` / `Group` you have already
seen in [`01-hero`](../01-hero/), [`02-sidebar`](../02-sidebar/), and
[`03-sheet`](../03-sheet/). Read this lesson to understand *why* those files
are structured the way they are, then use [`02-sidebar`](../02-sidebar/) as
the worked example that already applies every rule below in real code.

## What you'll learn

- The four layout primitives, their allowed tags, and their direction.
- Why raw `<div>` / `<aside>` / `<section>` markup is forbidden inside
  `ui/`, `components/`, and example blocks.
- The six layout-grammar rules, and which automated checks enforce them.
- How to spot a violation in a short snippet and name the rule it breaks.

## The four primitives

| Primitive | Renders | Direction | Role |
|-----------|---------|-----------|------|
| `Block` | semantic landmark (`tag`) | — | Opens every block exactly once per file. Carries the landmark `tag` (`aside`, `header`, `main`, `section`, `nav`, …). Defaults to `<div>` when the widget is not a document landmark. |
| `Box` | `<div>` | — | Free-form inner container. Lives only inside `Block` (or another layout primitive). Never opens a block, never carries a landmark tag. |
| `Stack` | `<div>`, `<ul>`, or `<ol>` | column | Vertical rhythm: sections, form fields, list rows. Base classes: `flex flex-col items-start justify-start`. |
| `Group` | `<div>`, `<fieldset>`, or `<dl>` | row | Horizontal flex grouping. Base classes: `flex min-w-0`. Use `tag="fieldset"` for related form controls. |

Every runtime port resolves these tag restrictions from the same source of truth —
`TagGroupLayout`, `TagGroupBoxAllowed`, `TagGroupStack`, and `TagGroupGroup`
in [`utils/tags.go`](../../../utils/tags.go) (Go, generated) and
[`utils/tags.ts`](../../../utils/tags.ts) (React). Passing a tag outside the
allowed set silently falls back to the primitive's default tag — it does not
throw. `ui/box`'s smoke test in
[`primitives.smoke.test.tsx`](../../../examples/vite/tests/primitives.smoke.test.tsx)
pins this contract by asserting `<Box>` always renders `<div>`; `ui/block`'s
smoke test in the same file asserts the opposite — every landmark tag you
pass to `Block` (`main`, `header`, `aside`, `section`, `nav`, `footer`,
`article`) is honored.

## When to choose which

| Need | Use |
|------|-----|
| Top of a file / start of any block | `Block` |
| Independent widget root that may live in its own file | `Block` (even when not a landmark — default `<div>` is fine) |
| Inner container with no flex direction | `Box` |
| Stack rows top-to-bottom with consistent gap | `Stack` |
| Lay items in a row, wrap on small screens | `Group` |
| Group related form controls (`<fieldset>` semantics) | `Group tag="fieldset"` |
| Ordered/unordered list rendered as a stack | `Stack tag="ul"` (or `"ol"`) |
| Definition list rendered as a row | `Group tag="dl"` |

Rule of thumb: if you reach for a raw `<div>`, ask first whether `Stack` or
`Group` expresses the intent. If neither rhythm nor row applies, use `Box`.
Two `Box` in a row inside one `Block` is *usually* fine when each `Box` is an
independent sibling section — see the sidebar's three `Box` siblings in
[Lesson 02](../02-sidebar/#why-three-box-and-not-three-stack) for a worked
example of when that is correct rather than a smell.

## The six rules

1. **`Block` is the entry point of a block.** Each file or composite block
   begins with exactly one `Block`. Do not nest `Block` inside `Block` in the
   same file. *Exception:* a child composite may own its own landmark
   `Block` (a `Sidebar`, a `Header`) — the parent file must not re-wrap it
   with a duplicate landmark wrapper.
2. **`Box` is strictly inside `Block`.** `Box` never carries a landmark tag
   (`aside`, `header`, `main`, `section`, `nav`). Use `Block` for that.
3. **No raw markup in bricks or blocks.** Inside `ui/`, `components/`, and
   `examples/templ/ui/blocks/`, do not write `<div>`, `<aside>`, `<section>`,
   `<header>`, etc. directly — use `Block`/`Box`/`Stack`/`Group` (or another
   primitive/composite that wraps them). *Exceptions:* brick root elements
   required by semantics (`<dialog>`, `<button>`, `<details>`, `<table>`
   family, `<form>`, `<fieldset>`); `asChild` roots that intentionally
   delegate the semantic root to child markup; document shells
   (`<!DOCTYPE>`, `<html>`, `<head>`, `<body>`, asset tags).
4. **`Stack` is vertical.** Use it for top-to-bottom rhythm. Do not add
   `flex-row` overrides — switch to `Group` instead.
5. **`Group` is horizontal.** Use `tag="fieldset"` only when grouping related
   form controls; otherwise default `<div>`.
6. **`Block` appears at most once per file, and as the first JSX/templ node
   the file returns.** Subsequent containers inside that root use `Box`,
   `Stack`, or `Group`.

The full rule text lives in
[`.cursor/rules/templ-layout-grammar.mdc`](../../../.cursor/rules/templ-layout-grammar.mdc)
— that file is the authoritative source for both agents and this lesson.

## Correct vs. incorrect

Correct — block opens with `Block`, inner boxes use `Box`, vertical rhythm
via `Stack`, horizontal row via `Group`:

```templ
@ui.Block(ui.BlockProps{Tag: "aside", Class: "hidden w-64 md:flex md:flex-col"}) {
  @ui.Box(ui.BoxProps{Class: "flex h-16 items-center gap-4 border-b"}) {
    @cmp.IconBadge(cmp.IconBadgeProps{Size: "sm", Variant: "accent"}) { BY }
    @ui.Stack(ui.StackProps{Class: "gap-0"}) {
      @ui.Text(ui.TextProps{Class: "text-sm font-semibold"}) { Brand }
      @ui.Text(ui.TextProps{Class: "text-xs text-muted-foreground"}) { Subtitle }
    }
  }
}
```

Incorrect — raw markup, nested `Block`, wrong direction:

```templ
<aside class="hidden w-64 md:flex">            // raw markup — forbidden (rule 3)
  @ui.Block(ui.BlockProps{Tag: "div"}) {        // Block inside Block — forbidden (rule 1)
    @ui.Stack(ui.StackProps{Class: "flex-row"}) // Stack used for row — use Group (rule 4)
      …
    }
  }
}
```

## Try it yourself

### Exercise — spot the violation

Each snippet below breaks exactly one rule from the list above. Name the rule
number, then rewrite the snippet correctly.

**Snippet 1:**

```tsx
export function StatusPanel() {
  return (
    <div className="rounded-lg border p-4">
      <Text>Status: healthy</Text>
    </div>
  );
}
```

**Snippet 2:**

```tsx
<Block tag="section" className="p-6">
  <Group className="gap-2">
    <Text>Row one</Text>
  </Group>
  <Block tag="div" className="mt-4">
    <Text>Row two</Text>
  </Block>
</Block>
```

**Snippet 3:**

```tsx
<Box tag="aside" className="w-64">
  <Text>Sidebar content</Text>
</Box>
```

**Snippet 4:**

```tsx
<Stack className="flex-row gap-4">
  <Badge>One</Badge>
  <Badge>Two</Badge>
</Stack>
```

<details>
<summary>Answers (click to expand)</summary>

1. **Rule 3** — raw `<div>` instead of `Block`/`Box`. Fix: wrap in
   `<Block className="rounded-lg border p-4">` (or `<Box>` if this is nested
   inside an existing `Block`).
2. **Rule 1** — a second `Block` nested inside the first `Block`, in the same
   file. Fix: change the inner `Block tag="div"` to `Box` (or `Stack`, since
   it is a second vertical row).
3. **Rule 2** — `Box` carries a landmark tag (`aside`). Fix: use
   `<Block tag="aside" className="w-64">` instead.
4. **Rule 4** — `Stack` overridden with `flex-row`. Fix: use
   `<Group className="gap-4">` instead.

</details>

## Validation

These rules are not just style guidance — they are enforced mechanically:

```bash
bun run lint:ui8px                          # scans ui/, components/, utils/, examples/
bash .validate/scripts/validate-spec.sh --with-tests
bun run typecheck:react
go run ./.validate/cmd/blockonce            # enforces rule 6: one <Block> per file
```

`blockonce` specifically catches rule 6 violations — more than one `<Block`
(TSX) or `@<pkg>.Block(` (Templ) invocation in a single file — which is the
mistake most likely to slip past a quick read.

## Preview locally

From the repository root:

```bash
bun install
bun run dev:vite    # React — http://127.0.0.1:5173
bun run dev:templ   # Go Templ — http://127.0.0.1:8080
```

Open the current React/Templ home scaffolds and identify `Block`, `Box`, `Stack`,
and `Group` in the rendered page using the rules above.

## Where to look next

- [`02-sidebar`](../02-sidebar/) — a real file that applies `Block`, `Box`,
  and `Stack` together, with a note on why three sibling `Box` elements are
  correct there.
- [`03-sheet`](../03-sheet/) — layout primitives combined with behavior
  hooks inside `SheetContent`.
- [`docs/mental-model.md`](../../mental-model.md) — the five core ideas
  behind the shared runtime contract, including the layout grammar summary.
- [`.cursor/rules/templ-layout-grammar.mdc`](../../../.cursor/rules/templ-layout-grammar.mdc) —
  the authoritative rule file.
