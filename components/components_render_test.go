package components

import (
	"bytes"
	"context"
	"strings"
	"testing"

	"github.com/a-h/templ"
)

func renderComponent(t *testing.T, component templ.Component) string {
	t.Helper()
	var buf bytes.Buffer
	if err := component.Render(context.Background(), &buf); err != nil {
		t.Fatal(err)
	}
	return buf.String()
}

func TestSheetBehaviorHooksAreOptIn(t *testing.T) {
	html := renderComponent(t, Sheet(SheetProps{ID: "demo-sheet", AriaLabel: "Navigation"}))
	if strings.Contains(html, "data-ui8kit") {
		t.Fatalf("sheet should not render behavior hooks by default: %s", html)
	}
	if strings.Contains(html, "<dialog") {
		t.Fatalf("sheet root should be div, not dialog: %s", html)
	}
	if !strings.Contains(html, `role="dialog"`) || !strings.Contains(html, `aria-modal="true"`) {
		t.Fatalf("sheet should render dialog semantics: %s", html)
	}
	if !strings.Contains(html, "hidden") {
		t.Fatalf("closed sheet should render hidden: %s", html)
	}
}

func TestSheetUI8KitRoot(t *testing.T) {
	html := renderComponent(t, Sheet(SheetProps{ID: "demo-sheet", Behavior: "ui8kit", AriaLabel: "Navigation"}))
	for _, want := range []string{
		`data-ui8kit="sheet"`,
		`data-ui8kit-dialog`,
		`data-state="closed"`,
		`hidden`,
	} {
		if !strings.Contains(html, want) {
			t.Fatalf("expected %q in %s", want, html)
		}
	}
	if strings.Contains(html, "<dialog") {
		t.Fatalf("sheet root should be div, not dialog: %s", html)
	}
}

func TestSheetUI8KitBehavior(t *testing.T) {
	html := renderComponent(t, SheetTrigger(SheetTriggerProps{PanelID: "demo-sheet", Behavior: "ui8kit"}))
	for _, want := range []string{
		`data-ui8kit-dialog-open`,
		`data-ui8kit-dialog-target="demo-sheet"`,
		`aria-haspopup="dialog"`,
		`aria-controls="demo-sheet"`,
	} {
		if !strings.Contains(html, want) {
			t.Fatalf("expected %q in %s", want, html)
		}
	}
}

func TestNavLinkActiveState(t *testing.T) {
	html := renderComponent(t, NavLink(NavLinkProps{Href: "/docs", Active: true}))
	if !strings.Contains(html, `aria-current="page"`) {
		t.Fatalf("active nav link should mark current page: %s", html)
	}
	if !strings.Contains(html, `href="/docs"`) {
		t.Fatalf("nav link should render href: %s", html)
	}
}

func TestCardClassesOnManualWrapper(t *testing.T) {
	cls := CardClasses(CardProps{Variant: "default"})
	if !strings.Contains(cls, "rounded-md") {
		t.Fatalf("card classes should include base: %s", cls)
	}
}
