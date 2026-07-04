package ui

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

func TestCardClassesOnManualWrapper(t *testing.T) {
	cls := CardClasses(CardProps{Variant: "default"})
	if !strings.Contains(cls, "rounded-md") {
		t.Fatalf("card classes should include base: %s", cls)
	}
}
