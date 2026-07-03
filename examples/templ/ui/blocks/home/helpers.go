package home

// Twin: examples/vite/src/lib/helpers.ts
// This file implements the same block-level presentation helpers per
// runtime port under the twin-helper policy (docs/architecture.md#twin-helper-policy):
// keep function names, signatures, and returned enum strings identical.
// When you edit one, update every twin and the associated *_test.tsx/*_test.go
// if present.

import "strings"

func navIconLetter(icon string) string {
	icon = strings.TrimSpace(icon)
	if icon == "" {
		return "•"
	}
	return strings.ToUpper(string([]rune(icon)[0]))
}

func navIconVariant(active bool) string {
	if active {
		return "accent"
	}
	return "secondary"
}

func toolIconLetter(icon string) string {
	icon = strings.TrimSpace(icon)
	if icon == "" {
		return "•"
	}
	return strings.ToUpper(string([]rune(icon)[0]))
}

func workflowStepLabel(index int) string {
	return string(rune('1' + index))
}

func workflowStepVariant(index int) string {
	if index == 0 {
		return "accent"
	}
	return "secondary"
}

func showcaseIconLetter(name string) string {
	name = strings.TrimSpace(name)
	if name == "" {
		return "?"
	}
	return strings.ToUpper(string([]rune(name)[0]))
}
