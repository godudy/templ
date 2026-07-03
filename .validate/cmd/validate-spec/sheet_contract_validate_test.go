package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestValidateSheetOpenContractRepoFiles(t *testing.T) {
	repoRoot, err := findRepoRoot()
	if err != nil {
		t.Fatal(err)
	}
	errs := validateSheetOpenContract(repoRoot)
	if len(errs) > 0 {
		var b strings.Builder
		for _, e := range errs {
			b.WriteString(e.Error())
			b.WriteByte('\n')
		}
		t.Fatal(b.String())
	}
}

func TestValidateSheetOpenContractFlagsForbiddenPhrases(t *testing.T) {
	dir := t.TempDir()
	docPath := filepath.Join(dir, "docs", "learn", "03-sheet", "README.md")
	if err := os.MkdirAll(filepath.Dir(docPath), 0o755); err != nil {
		t.Fatal(err)
	}
	bad := "With behavior=ui8kit, control `Open` with React state for the mobile menu.\n"
	if err := os.WriteFile(docPath, []byte(bad), 0o644); err != nil {
		t.Fatal(err)
	}
	specPath := filepath.Join(dir, "components", "sheet", "sheet.spec.md")
	if err := os.MkdirAll(filepath.Dir(specPath), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(specPath, []byte("---\nid: components.sheet\n---\n"), 0o644); err != nil {
		t.Fatal(err)
	}

	errs := validateSheetOpenContract(dir)
	if len(errs) == 0 {
		t.Fatal("expected forbidden phrase to be reported")
	}
	found := false
	for _, e := range errs {
		if e.file == "docs/learn/03-sheet/README.md" && strings.Contains(e.message, "control") {
			found = true
			break
		}
	}
	if !found {
		t.Fatalf("expected bind-open violation, got: %v", errs)
	}
}

func TestValidateSheetOpenContractAllowsNegatedGuidance(t *testing.T) {
	dir := t.TempDir()
	for _, rel := range []string{
		"components/sheet/sheet.spec.md",
		"docs/learn/03-sheet/README.md",
		"docs/cheatsheet-react-to-templ.md",
	} {
		p := filepath.Join(dir, filepath.FromSlash(rel))
		if err := os.MkdirAll(filepath.Dir(p), 0o755); err != nil {
			t.Fatal(err)
		}
		body := "Open sets initial hidden only. With Behavior=ui8kit, do not bind `Open` to React state or a runtime's own reactive component state.\n"
		if err := os.WriteFile(p, []byte(body), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	errs := validateSheetOpenContract(dir)
	if len(errs) > 0 {
		t.Fatalf("expected approved wording to pass, got: %v", errs)
	}
}
