package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestValidateAllSpecs(t *testing.T) {
	repoRoot, err := findRepoRoot()
	if err != nil {
		t.Fatal(err)
	}
	repoRootCached = repoRoot

	tagLists, err := loadTagGroups(repoRoot)
	if err != nil {
		t.Fatal(err)
	}
	recipeLists, err := loadRecipeKeys(repoRoot)
	if err != nil {
		t.Fatal(err)
	}
	allowLists := map[string][]string{}
	for k, v := range tagLists {
		allowLists[k] = v
	}
	for k, v := range recipeLists {
		allowLists[k] = v
	}

	specPaths, err := discoverSpecs(repoRoot)
	if err != nil {
		t.Fatal(err)
	}
	if len(specPaths) == 0 {
		t.Fatal("expected spec files")
	}

	var allErrs []validationError
	for _, path := range specPaths {
		doc, err := loadSpec(path)
		if err != nil {
			rel, _ := filepath.Rel(repoRoot, path)
			allErrs = append(allErrs, validationError{rel, "", err.Error()})
			continue
		}
		allErrs = append(allErrs, validateSpec(doc, allowLists)...)
	}
	allErrs = append(allErrs, validateComponentsJSON(repoRoot)...)
	allErrs = append(allErrs, validateAllVariantJSON(repoRoot)...)
	allErrs = append(allErrs, validateViteImportStyle(repoRoot)...)
	allErrs = append(allErrs, validateSheetOpenContract(repoRoot)...)

	if len(allErrs) > 0 {
		var b strings.Builder
		for _, e := range allErrs {
			b.WriteString(e.Error())
			b.WriteByte('\n')
		}
		t.Fatal(b.String())
	}
}

func TestLoadSpecCRLF(t *testing.T) {
	repoRoot, err := findRepoRoot()
	if err != nil {
		t.Fatal(err)
	}
	path := filepath.Join(repoRoot, "ui", "button", "button.spec.md")
	doc, err := loadSpec(path)
	if err != nil {
		t.Fatal(err)
	}
	if doc.fm["id"] != "ui.button" {
		t.Fatalf("expected ui.button id, got %v", doc.fm["id"])
	}
}

func TestMain(m *testing.M) {
	if _, err := findRepoRoot(); err != nil {
		// Allow running from validate-spec directory in isolation.
		if wd, werr := os.Getwd(); werr == nil {
			repoRootCached = filepath.Clean(filepath.Join(wd, "..", ".."))
		}
	}
	os.Exit(m.Run())
}
