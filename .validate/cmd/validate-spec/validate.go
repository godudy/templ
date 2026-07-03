package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"gopkg.in/yaml.v3"
)

type specDoc struct {
	path string
	raw  string
	fm   map[string]any
	body string
}

type validationError struct {
	file    string
	field   string
	message string
}

func (e validationError) Error() string {
	if e.field != "" {
		return fmt.Sprintf("%s: %s: %s", e.file, e.field, e.message)
	}
	return fmt.Sprintf("%s: %s", e.file, e.message)
}

func findRepoRoot() (string, error) {
	dir, err := os.Getwd()
	if err != nil {
		return "", err
	}
	for {
		if _, err := os.Stat(filepath.Join(dir, "go.mod")); err == nil {
			if _, err := os.Stat(filepath.Join(dir, "ui")); err == nil {
				return dir, nil
			}
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			return "", fmt.Errorf("repo root not found from cwd")
		}
		dir = parent
	}
}

func loadSpec(path string) (*specDoc, error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	text := strings.ReplaceAll(string(raw), "\r\n", "\n")
	if !strings.HasPrefix(text, "---\n") {
		return nil, fmt.Errorf("missing YAML front matter")
	}
	end := strings.Index(text[4:], "\n---")
	if end < 0 {
		return nil, fmt.Errorf("unclosed YAML front matter")
	}
	fmText := text[4 : 4+end]
	body := strings.TrimLeft(text[4+end+4:], "\n")

	fm := map[string]any{}
	if err := yaml.Unmarshal([]byte(fmText), &fm); err != nil {
		return nil, fmt.Errorf("front matter YAML: %w", err)
	}
	return &specDoc{path: path, raw: text, fm: fm, body: body}, nil
}

func discoverSpecs(repoRoot string) ([]string, error) {
	var paths []string
	roots := []string{"ui", "components", "utils", filepath.Join("examples", "templ", "ui", "blocks")}
	for _, root := range roots {
		rootPath := filepath.Join(repoRoot, root)
		err := filepath.WalkDir(rootPath, func(path string, d os.DirEntry, err error) error {
			if err != nil {
				return err
			}
			if d.IsDir() {
				return nil
			}
			if strings.HasSuffix(path, ".spec.md") {
				paths = append(paths, path)
			}
			return nil
		})
		if err != nil && !os.IsNotExist(err) {
			return nil, err
		}
	}
	return paths, nil
}

func validateSpec(doc *specDoc, allowLists map[string][]string) []validationError {
	var errs []validationError
	rel, _ := filepath.Rel(findRepoRootMust(), doc.path)

	layer := stringField(doc.fm, "layer")
	required := []string{"id", "layer", "kind", "package", "facade", "semantics"}
	for _, key := range required {
		if _, ok := doc.fm[key]; !ok {
			errs = append(errs, validationError{rel, key, "required front matter key missing"})
		}
	}

	if layer == "helper" {
		if _, ok := doc.fm["exports"]; !ok {
			errs = append(errs, validationError{rel, "exports", "helper spec requires exports"})
		}
		if _, ok := doc.fm["api"]; ok {
			errs = append(errs, validationError{rel, "api", "helper spec must not use api"})
		}
		if _, ok := doc.fm["showcase"]; ok {
			errs = append(errs, validationError{rel, "showcase", "helper spec must not use showcase"})
		}
		errs = append(errs, validateHelperExamples(doc, rel)...)
		return errs
	}

	for _, forbidden := range []string{"props", "omitted"} {
		if _, ok := doc.fm[forbidden]; ok {
			errs = append(errs, validationError{rel, forbidden, "legacy key; use api/showcase only"})
		}
	}
	if raw, ok := doc.fm["variants"]; ok {
		if _, isString := raw.(string); !isString {
			errs = append(errs, validationError{rel, "variants", "legacy key; use variants: <file>.variants.json path string"})
		}
	}
	for _, key := range []string{"api", "showcase"} {
		if _, ok := doc.fm[key]; !ok {
			errs = append(errs, validationError{rel, key, "required for brick specs"})
		}
	}

	errs = append(errs, validateShowcaseExamples(doc, rel)...)
	errs = append(errs, validateAllowLists(doc, rel, allowLists)...)
	errs = append(errs, validateBehaviorHookEnums(doc, rel)...)
	errs = append(errs, validateRuntimeScopedAPIFields(doc, rel)...)
	errs = append(errs, validateBlockContract(doc, rel, findRepoRootMust())...)
	errs = append(errs, validateReactTestTarget(doc, rel, findRepoRootMust())...)
	errs = append(errs, validateReactTestDescribe(doc, rel, findRepoRootMust())...)
	errs = append(errs, validateCVAPresence(doc, rel)...)
	return errs
}

// reactTestRequiredLayers lists spec layers where a React test target is
// mandatory whenever `targets.react` is declared. Bricks (primitive/composite)
// ship both stacks and must carry a smoke or contract test on the React side.
//
// Other layers (helper, catalog-block, …) opt in via `targets.react.test:`;
// they are covered by different validators or bespoke page-render tests.
var reactTestRequiredLayers = map[string]bool{
	"primitive": true,
	"composite": true,
}

// validateReactTestTarget enforces the spec-driven React test coverage contract.
//
// Contract:
//  1. When a spec declares `targets.react.test: <path>` (relative to the spec
//     file), the referenced TSX test file MUST exist on disk.
//  2. When a spec has `layer` in reactTestRequiredLayers AND declares a
//     `targets.react` block, the `test` field is REQUIRED.
//     This closes the gap where a brick could ship a React target without any
//     coverage promise, which used to slip through CI unnoticed.
//
// Specs whose layer is not in reactTestRequiredLayers (helpers, catalog blocks)
// remain opt-in for back-compat; they either have no React target or use their
// own render tests (see examples/templ/ui/blocks/*/page_render_test.go).
func validateReactTestTarget(doc *specDoc, rel, repoRoot string) []validationError {
	targets, _ := doc.fm["targets"].(map[string]any)
	if targets == nil {
		return nil
	}
	react, _ := targets["react"].(map[string]any)
	if react == nil {
		return nil
	}
	testPath, _ := react["test"].(string)
	testPath = strings.TrimSpace(testPath)

	layer := stringField(doc.fm, "layer")
	if testPath == "" {
		if reactTestRequiredLayers[layer] {
			return []validationError{{rel, "targets.react.test", fmt.Sprintf("required for layer %q when targets.react is declared", layer)}}
		}
		return nil
	}
	if !strings.HasSuffix(testPath, ".test.tsx") && !strings.HasSuffix(testPath, ".test.ts") {
		return []validationError{{rel, "targets.react.test", fmt.Sprintf("must end in .test.tsx or .test.ts, got %q", testPath)}}
	}
	specDir := filepath.Dir(doc.path)
	abs := filepath.Join(specDir, filepath.FromSlash(testPath))
	if !filepath.IsAbs(abs) {
		abs = filepath.Clean(abs)
	}
	if _, err := os.Stat(abs); err != nil {
		relTest, _ := filepath.Rel(repoRoot, abs)
		return []validationError{{rel, "targets.react.test", fmt.Sprintf("declared test file not found: %s", filepath.ToSlash(relTest))}}
	}
	return nil
}

// validBehaviorModes is the single source of truth for behavior-hook enums.
// Keep in sync with utils/behavior.go (BehaviorModeOff, BehaviorModeUI8Kit)
// and utils/behavior.ts (BEHAVIOR_MODES).
var validBehaviorModes = []string{"", "ui8kit"}

// validateBehaviorHookEnums ensures every api field with role: behavior-hook
// declares the canonical ["", "ui8kit"] enum from utils/behavior.*.
func validateBehaviorHookEnums(doc *specDoc, rel string) []validationError {
	api, _ := doc.fm["api"].(map[string]any)
	if api == nil {
		return nil
	}
	var errs []validationError
	for field, raw := range api {
		fm, _ := raw.(map[string]any)
		if fm == nil {
			continue
		}
		role, _ := fm["role"].(string)
		if role != "behavior-hook" {
			continue
		}
		specEnum := getStringSliceAny(fm["enum"])
		missing, extra := diffEnum(specEnum, validBehaviorModes)
		if len(missing) > 0 {
			errs = append(errs, validationError{rel, field, fmt.Sprintf("behavior-hook enum must include %v (from utils/behavior.*); missing: %v", validBehaviorModes, missing)})
		}
		if len(extra) > 0 {
			errs = append(errs, validationError{rel, field, fmt.Sprintf("behavior-hook enum must be exactly %v; extra: %v", validBehaviorModes, extra)})
		}
	}
	return errs
}

// validateRuntimeScopedAPIFields validates api fields marked as react-only.
// Contract:
// - react-only must be a boolean true
// - spec must declare targets.react
// - react-only fields must not appear in templ parts[].props
func validateRuntimeScopedAPIFields(doc *specDoc, rel string) []validationError {
	api, _ := doc.fm["api"].(map[string]any)
	if api == nil {
		return nil
	}
	targets, _ := doc.fm["targets"].(map[string]any)
	_, hasReactTarget := targets["react"].(map[string]any)
	templProps := collectTemplPartProps(doc.fm)

	var errs []validationError
	for field, raw := range api {
		fm, _ := raw.(map[string]any)
		if fm == nil {
			continue
		}
		rawReactOnly, hasReactOnly := fm["react-only"]
		if !hasReactOnly {
			continue
		}
		flag, ok := rawReactOnly.(bool)
		if !ok {
			errs = append(errs, validationError{rel, field, "react-only must be boolean true"})
			continue
		}
		if !flag {
			errs = append(errs, validationError{rel, field, "react-only=false is unsupported; omit the key instead"})
			continue
		}
		if !hasReactTarget {
			errs = append(errs, validationError{rel, field, "react-only field requires targets.react metadata"})
		}
		if templProps[field] {
			errs = append(errs, validationError{rel, field, "react-only field must not appear in parts[].props (templ runtime)"})
		}
	}
	return errs
}

func collectTemplPartProps(fm map[string]any) map[string]bool {
	out := map[string]bool{}
	parts, _ := fm["parts"].([]any)
	for _, rawPart := range parts {
		part, _ := rawPart.(map[string]any)
		if part == nil {
			continue
		}
		props, _ := part["props"].([]any)
		for _, rawProp := range props {
			prop, _ := rawProp.(string)
			prop = strings.TrimSpace(prop)
			if prop == "" {
				continue
			}
			out[prop] = true
		}
	}
	return out
}

func validateHelperExamples(doc *specDoc, rel string) []validationError {
	var ids []string
	for _, item := range getSlice(doc.fm, "examples") {
		m, _ := item.(map[string]any)
		if m == nil {
			continue
		}
		id, _ := m["id"].(string)
		if id != "" {
			ids = append(ids, id)
		}
	}
	if len(ids) == 0 {
		return nil
	}
	return validateExampleSections(doc, rel, ids, "go")
}

func validateShowcaseExamples(doc *specDoc, rel string) []validationError {
	showcase := getSlice(doc.fm, "showcase")
	if showcase == nil {
		return nil
	}
	var ids []string
	for _, item := range showcase {
		m, _ := item.(map[string]any)
		if m == nil {
			continue
		}
		id, _ := m["id"].(string)
		if id == "" {
			errs := []validationError{{rel, "showcase", "entry missing id"}}
			return errs
		}
		ids = append(ids, id)
	}
	return validateExampleSections(doc, rel, ids, "templ")
}

var reExampleHeading = regexp.MustCompile(`(?m)^## Example ([^\n]+)\s*$`)
var reFence = regexp.MustCompile("(?s)```(templ|go)\\s*\\n(.*?)```")

func validateExampleSections(doc *specDoc, rel string, showcaseIDs []string, fenceLang string) []validationError {
	var errs []validationError
	showcaseSet := map[string]bool{}
	for _, id := range showcaseIDs {
		showcaseSet[id] = true
	}

	exampleIDs := map[string]bool{}
	for _, m := range reExampleHeading.FindAllStringSubmatch(doc.body, -1) {
		id := strings.TrimSpace(m[1])
		exampleIDs[id] = true
		if !showcaseSet[id] {
			errs = append(errs, validationError{rel, "showcase", fmt.Sprintf("## Example %s has no matching showcase/export entry", id)})
		}
	}

	for _, id := range showcaseIDs {
		if !exampleIDs[id] {
			errs = append(errs, validationError{rel, "showcase", fmt.Sprintf("missing ## Example %s section", id)})
			continue
		}
		section := extractExampleSection(doc.body, id)
		fences := reFence.FindAllStringSubmatch(section, -1)
		if len(fences) != 1 {
			errs = append(errs, validationError{rel, id, fmt.Sprintf("expected exactly one fenced code block, found %d", len(fences))})
			continue
		}
		if fences[0][1] != fenceLang {
			errs = append(errs, validationError{rel, id, fmt.Sprintf("expected ```%s fence, found ```%s", fenceLang, fences[0][1])})
		}
	}
	return errs
}

func extractExampleSection(body, id string) string {
	startMarker := "## Example " + id
	start := strings.Index(body, startMarker)
	if start < 0 {
		return ""
	}
	rest := body[start+len(startMarker):]
	next := strings.Index(rest, "\n## ")
	if next >= 0 {
		return rest[:next]
	}
	return rest
}

func validateAllowLists(doc *specDoc, rel string, allowLists map[string][]string) []validationError {
	api, _ := doc.fm["api"].(map[string]any)
	if api == nil {
		return nil
	}
	var errs []validationError
	for field, raw := range api {
		fm, _ := raw.(map[string]any)
		if fm == nil {
			continue
		}
		source, _ := fm["allow-list-source"].(string)
		if source == "" {
			continue
		}
		if strings.Contains(source, ".json#") {
			continue
		}
		specEnum := getStringSliceAny(fm["enum"])
		codeEnum, ok := resolveAllowList(source, field, allowLists)
		if !ok {
			errs = append(errs, validationError{rel, field, fmt.Sprintf("unknown allow-list-source %q", source)})
			continue
		}
		missing, extra := diffEnum(specEnum, codeEnum)
		if len(missing) > 0 {
			errs = append(errs, validationError{rel, field, fmt.Sprintf("api.enum missing code values from %s: %v", source, missing)})
		}
		if len(extra) > 0 {
			errs = append(errs, validationError{rel, field, fmt.Sprintf("api.enum has extra values not in %s: %v", source, extra)})
		}
	}
	return errs
}

func validateComponentsJSON(repoRoot string) []validationError {
	path := filepath.Join(repoRoot, "components.json")
	data, err := os.ReadFile(path)
	if err != nil {
		return []validationError{{"components.json", "", err.Error()}}
	}
	var cfg map[string]any
	if err := json.Unmarshal(data, &cfg); err != nil {
		return []validationError{{"components.json", "", "invalid JSON: " + err.Error()}}
	}
	var errs []validationError
	aliases, _ := cfg["aliases"].(map[string]any)
	expect := map[string]string{
		"components": "@/components",
		"ui":         "@/components/ui",
		"utils":      "@/utils",
	}
	for k, v := range expect {
		got, _ := aliases[k].(string)
		if got != v {
			errs = append(errs, validationError{"components.json", "aliases." + k, fmt.Sprintf("expected %q, got %q", v, got)})
		}
	}
	templCfg, _ := cfg["templ"].(map[string]any)
	for _, key := range []string{"utils", "ui", "components"} {
		if _, ok := templCfg[key]; !ok {
			errs = append(errs, validationError{"components.json", "templ." + key, "missing package group"})
		}
	}
	for _, bad := range []string{"css", "preview", "examples"} {
		if _, ok := cfg[bad]; ok {
			errs = append(errs, validationError{"components.json", bad, "registry must not reference preview/css paths"})
		}
	}
	return errs
}

func getSlice(fm map[string]any, key string) []any {
	v, ok := fm[key]
	if !ok {
		return nil
	}
	s, _ := v.([]any)
	return s
}

func getStringSlice(fm map[string]any, key string) []string {
	return getStringSliceAny(fm[key])
}

func getStringSliceAny(v any) []string {
	switch t := v.(type) {
	case []any:
		var out []string
		for _, item := range t {
			out = append(out, normalizeEnumValue(item))
		}
		return out
	case []string:
		return t
	default:
		return nil
	}
}

func stringField(fm map[string]any, key string) string {
	v, _ := fm[key].(string)
	return v
}

var repoRootCached string

func findRepoRootMust() string {
	if repoRootCached == "" {
		r, err := findRepoRoot()
		if err != nil {
			return "."
		}
		repoRootCached = r
	}
	return repoRootCached
}
