// Twin: examples/templ/ui/blocks/{home,dashboard}/helpers.go
// These files implement the same block-level presentation helpers per
// runtime port under the twin-helper policy (docs/architecture.md#twin-helper-policy):
// keep function names, signatures, and returned enum strings identical.
// When you edit one, update every twin and the associated *_test.tsx/*_test.go
// if present.

import type { IconBadgeVariant } from "../../../../components/iconbadge/iconbadge";

export function navIconLetter(icon?: string): string {
  const trimmed = (icon ?? "").trim();
  if (!trimmed) return "•";
  return trimmed[0].toUpperCase();
}

export function navIconVariant(active?: boolean): IconBadgeVariant {
  return active ? "accent" : "secondary";
}

export function toolIconLetter(icon?: string): string {
  return navIconLetter(icon);
}

export function workflowStepLabel(index: number): string {
  return String.fromCharCode("1".charCodeAt(0) + index);
}

export function workflowStepVariant(index: number): IconBadgeVariant {
  return index === 0 ? "accent" : "secondary";
}

export function showcaseIconLetter(name?: string): string {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return "?";
  return trimmed[0].toUpperCase();
}
