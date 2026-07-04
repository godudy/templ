// variantcheck validates *.variants.json cross-key invariants across the registry.
package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

type variantJSON struct {
	ID       string                       `json:"id"`
	Keys     []string                     `json:"keys"`
	Defaults map[string]string            `json:"defaults"`
	ByKey    map[string]map[string]string `json:"byKey"`
}

func main() {
	repoRoot, err := findRepoRoot()
	if err != nil {
		fmt.Fprintf(os.Stderr, "variantcheck: %v\n", err)
		os.Exit(1)
	}

	var errs []string
	for _, path := range discoverVariantJSONFiles(repoRoot) {
		fileErrs := validateVariantJSONFile(repoRoot, path)
		errs = append(errs, fileErrs...)
	}

	if len(errs) > 0 {
		fmt.Fprintf(os.Stderr, "variantcheck: %d error(s)\n", len(errs))
		for _, e := range errs {
			fmt.Fprintf(os.Stderr, "  %s\n", e)
		}
		os.Exit(1)
	}
	fmt.Println("variantcheck: ok")
}

func findRepoRoot() (string, error) {
	cwd, err := os.Getwd()
	if err != nil {
		return "", err
	}
	dir := cwd
	for {
		if _, err := os.Stat(filepath.Join(dir, "go.mod")); err == nil {
			return dir, nil
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			return "", fmt.Errorf("go.mod not found from %s", cwd)
		}
		dir = parent
	}
}

func discoverVariantJSONFiles(repoRoot string) []string {
	roots := []string{
		filepath.Join(repoRoot, "ui"),
		filepath.Join(repoRoot, "components"),
		filepath.Join(repoRoot, "examples", "templ", "ui", "blocks"),
	}
	var out []string
	for _, root := range roots {
		if _, err := os.Stat(root); err != nil {
			continue
		}
		_ = filepath.WalkDir(root, func(path string, d os.DirEntry, err error) error {
			if err != nil || d.IsDir() {
				return nil
			}
			if strings.HasSuffix(d.Name(), ".variants.json") {
				out = append(out, path)
			}
			return nil
		})
	}
	sort.Strings(out)
	return out
}

func validateVariantJSONFile(repoRoot, path string) []string {
	rel, _ := filepath.Rel(repoRoot, path)
	raw, err := os.ReadFile(path)
	if err != nil {
		return []string{fmt.Sprintf("%s: read error: %v", rel, err)}
	}

	var payload variantJSON
	if err := json.Unmarshal(raw, &payload); err != nil {
		return []string{fmt.Sprintf("%s: invalid JSON: %v", rel, err)}
	}

	var errs []string
	keySet := map[string]bool{}
	for _, key := range payload.Keys {
		k := strings.TrimSpace(key)
		if k == "" {
			errs = append(errs, fmt.Sprintf("%s: keys contains empty entry", rel))
			continue
		}
		keySet[k] = true
	}

	if len(payload.Keys) == 0 {
		if len(payload.ByKey) > 0 {
			errs = append(errs, fmt.Sprintf("%s: keys is empty but byKey is non-empty", rel))
		}
		if len(payload.Defaults) > 0 {
			errs = append(errs, fmt.Sprintf("%s: keys is empty but defaults is non-empty", rel))
		}
	} else {
		if len(payload.ByKey) == 0 {
			errs = append(errs, fmt.Sprintf("%s: keys is non-empty but byKey is empty", rel))
		}
		for _, key := range payload.Keys {
			if _, ok := payload.ByKey[key]; !ok {
				errs = append(errs, fmt.Sprintf("%s: keys contains %q but byKey[%s] is missing", rel, key, key))
			}
		}
		for key, options := range payload.ByKey {
			if strings.TrimSpace(key) == "" {
				errs = append(errs, fmt.Sprintf("%s: byKey contains empty key name", rel))
				continue
			}
			if !keySet[key] {
				errs = append(errs, fmt.Sprintf("%s: byKey[%s] exists but keys is missing %q", rel, key, key))
			}
			if len(options) == 0 {
				errs = append(errs, fmt.Sprintf("%s: byKey[%s] has no options", rel, key))
			}
			if _, ok := options[""]; ok {
				errs = append(errs, fmt.Sprintf("%s: byKey[%s] contains empty-string key", rel, key))
			}
		}
		for key, def := range payload.Defaults {
			if strings.TrimSpace(key) == "" {
				errs = append(errs, fmt.Sprintf("%s: defaults contains empty key name", rel))
				continue
			}
			def = strings.TrimSpace(def)
			if def == "" {
				errs = append(errs, fmt.Sprintf("%s: defaults[%s] is empty-string", rel, key))
				continue
			}
			options, ok := payload.ByKey[key]
			if !ok {
				errs = append(errs, fmt.Sprintf("%s: defaults[%s] references missing byKey[%s]", rel, key, key))
				continue
			}
			if _, ok := options[def]; !ok {
				errs = append(errs, fmt.Sprintf("%s: defaults[%s]=%q not found in byKey[%s]", rel, key, def, key))
			}
		}
	}

	if warn := idPathMismatch(rel, payload.ID); warn != "" {
		fmt.Fprintf(os.Stderr, "variantcheck: warning: %s\n", warn)
	}

	return errs
}

// idPathMismatch returns a best-effort warning when recipe id does not match file path.
func idPathMismatch(rel, id string) string {
	id = strings.TrimSpace(id)
	if id == "" {
		return ""
	}
	normalized := filepath.ToSlash(rel)
	parts := strings.Split(normalized, "/")
	if len(parts) < 2 {
		return ""
	}
	// ui/button/button.variants.json -> ui.button
	// ui/alert/alert.variants.json -> ui.alert
	// ui/form/legend.variants.json -> ui.form.legend (multi-recipe folder)
	dir := parts[len(parts)-2]
	expected := strings.Join(parts[:len(parts)-1], ".")
	if strings.HasPrefix(expected, "examples/templ/ui/blocks/") {
		block := parts[len(parts)-2]
		expected = "examples.blocks." + block
	}
	simple := ""
	if strings.HasPrefix(normalized, "ui/") {
		simple = "ui." + dir
	} else if strings.HasPrefix(normalized, "components/") {
		simple = "components." + dir
	}
	multiRecipe := simple != "" && strings.HasPrefix(id, simple+".")
	if id != expected && id != simple && !strings.HasSuffix(id, "."+dir) && !multiRecipe {
		return fmt.Sprintf("%s: id %q may not match path (expected ~%q or %q)", rel, id, expected, simple)
	}
	return ""
}
