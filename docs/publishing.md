# Publishing Model

This repository is currently a Go module that also contains React TSX sources
for the first shipped runtime ports.

## Delivery Channels

| Consumer | Channel | Notes |
|----------|---------|-------|
| Go / Templ | `go get github.com/fastygo/templ@...` | Uses Go module zip |
| React | future npm package or copy-paste | Uses TSX sources and JSON recipes |

The shared contract files (`*.spec.md`, `*.variants.json`, `*.data.json`) live
in git and are useful to every runtime port.

## Go Module Zip

The Go module zip contains files committed at the tag, excluding paths marked
with `export-ignore` in `.gitattributes`.

Go ignores non-Go files such as `*.tsx`, but those files may still increase the
module archive size unless excluded.

Use `.gitattributes` for archive shaping. Release scripts tag and publish; they
do not decide which files enter the Go module archive.

## Recommended Split

Keep in the Go module:

- `ui/`, `components/`, `utils/`;
- `.templ`, generated Go, specs, variants, and data files needed by Templ users;
- validation metadata that supports shipped contracts when useful.

Usually exclude from release archives when not needed by Go consumers:

- local examples and preview bundles;
- node tooling output;
- internal planning notes;
- future npm package build artifacts.

## React Package

When an npm package is introduced, publish from an explicit package manifest and
include only the React runtime surface:

- TSX components;
- `*.variants.json`;
- utility helpers (`cn`, `composeRecipe`, `Slot`);
- type declarations;
- generated or curated docs derived from specs.

Do not rely on `go mod vendor` or the Go module proxy to distribute npm
dependencies.
