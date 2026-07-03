package main

import (
	"fmt"
	"os"
	"path/filepath"
)

func main() {
	repoRoot, err := findRepoRoot()
	if err != nil {
		fmt.Fprintf(os.Stderr, "validate-spec: %v\n", err)
		os.Exit(1)
	}
	repoRootCached = repoRoot

	tagLists, err := loadTagGroups(repoRoot)
	if err != nil {
		fmt.Fprintf(os.Stderr, "validate-spec: load tags: %v\n", err)
		os.Exit(1)
	}
	recipeLists, err := loadRecipeKeys(repoRoot)
	if err != nil {
		fmt.Fprintf(os.Stderr, "validate-spec: load recipes: %v\n", err)
		os.Exit(1)
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
		fmt.Fprintf(os.Stderr, "validate-spec: discover specs: %v\n", err)
		os.Exit(1)
	}
	if len(specPaths) == 0 {
		fmt.Println("validate-spec: no *.spec.md files found")
		os.Exit(0)
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
		fmt.Fprintf(os.Stderr, "validate-spec: %d error(s)\n", len(allErrs))
		for _, e := range allErrs {
			fmt.Fprintf(os.Stderr, "  %s\n", e.Error())
		}
		os.Exit(1)
	}
	fmt.Printf("validate-spec: OK (%d specs, components.json)\n", len(specPaths))
}
