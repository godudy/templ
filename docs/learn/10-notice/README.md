# Lesson 10: Prototype notice

Compare the home-page prototype-mode notice banner on React and Go Templ. Both
files render an `Alert` with status copy and a single outline action link from
the same `home.data.json` fixture.

**Level: Block.** Shortest home-block lesson — one composite (`Alert`), one
escape-hatch link, and live-region semantics.

## What you'll learn

- `Alert` as a composite wrapper (not a layout primitive).
- `role="status"` + `aria-live="polite"` for non-blocking announcements.
- React `Button asChild` vs Go `ButtonClasses` on the action link.
- `Group` + `flex-wrap` for a responsive title/action row.

## The two files

| Runtime | Path |
|---------|------|
| React | [`examples/vite/src/blocks/home/notice.tsx`](../../../examples/vite/src/blocks/home/notice.tsx) |
| Go Templ | [`examples/templ/ui/blocks/home/notice.templ`](../../../examples/templ/ui/blocks/home/notice.templ) |

Open both files in a split editor before reading the table below.

## Read them side by side

| # | React (TSX) | Go Templ | Rule |
|---|-------------|----------|------|
| 1 | `PrototypeNotice({ notice })` | `templ PrototypeNotice(props NoticeProps)` | Single-purpose banner block. |
| 2 | `<Alert variant="default" role="status" aria-live="polite">` | `@cmp.Alert(cmp.AlertProps{Variant: "default", Role: "status", AriaLive: "polite"})` | Live region on the alert root. |
| 3 | `<Group className="items-center justify-between gap-4 flex-wrap">` | `@ui.Group(ui.GroupProps{Class: "items-center justify-between gap-4 flex-wrap"})` | Horizontal row that wraps on narrow viewports. |
| 4 | `<Button asChild variant="outline" size="sm"><a href="#prototype-mode">…</a></Button>` | `<a href="#prototype-mode" class={ ui.ButtonClasses(ui.ButtonProps{Variant: "outline", Size: "sm"}) }>…</a>` | Same [escape hatch](../../coming-from-shadcn.md#escape-hatch-aschild-vs-classes) as sidebar and showcase. |

## Try it yourself

### Exercise A — React to Templ

1. Open [`notice.tsx`](../../../examples/vite/src/blocks/home/notice.tsx).
2. Write `PrototypeNotice` in templ without peeking at `notice.templ`.
3. Compare with [`notice.templ`](../../../examples/templ/ui/blocks/home/notice.templ).

### Exercise B — Change the copy

1. Edit the notice title or description in
   [`home.data.json`](../../../examples/data/home.data.json).
2. Run `bun run generate` and confirm both ports show the update.

## Preview locally

```bash
bun install
bun run dev:vite    # React — http://127.0.0.1:5173
bun run dev:templ   # Go Templ — http://127.0.0.1:8080
```

The notice appears near the top of the home page in both ports.

## Where to look next

- [`08-showcase`](../08-showcase/) and [`09-tools`](../09-tools/) — other home blocks.
- [`05-button`](../05-button/) — `ButtonClasses` primitive lesson.
- [`01-hero`](../01-hero/) — first home scaffold in the recommended path.
