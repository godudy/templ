package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

var reDescribeSubject = regexp.MustCompile(`describe\(\s*["']([^"']+)["']`)

// validateReactTestDescribe enforces that the React test file declared at
// `targets.react.test` actually contains a describe() block for this brick,
// not just that the file exists (see validateReactTestTarget).
//
// Contract:
//  1. When a spec declares `targets.react.test: <path>`, derive the expected
//     describe() subject from `id` by replacing every "." with "/"
//     (ui.button -> "ui/button", ui.card -> "ui/card").
//  2. A spec MAY override the expected subject with
//     `targets.react.describe: <string>` for non-standard test files (e.g.
//     Sheet's dedicated contract test uses a descriptive sentence instead of
//     a path-shaped subject).
//  3. The resolved test file MUST contain at least one
//     describe("<expected>", ...) block matching the expected subject.
func validateReactTestDescribe(doc *specDoc, rel, repoRoot string) []validationError {
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
	if testPath == "" {
		return nil
	}
	if !strings.HasSuffix(testPath, ".test.tsx") && !strings.HasSuffix(testPath, ".test.ts") {
		// validateReactTestTarget already reports the bad-suffix error.
		return nil
	}

	expected, _ := react["describe"].(string)
	expected = strings.TrimSpace(expected)
	if expected == "" {
		id := stringField(doc.fm, "id")
		if id == "" {
			return nil
		}
		expected = strings.ReplaceAll(id, ".", "/")
	}

	specDir := filepath.Dir(doc.path)
	abs := filepath.Join(specDir, filepath.FromSlash(testPath))
	if !filepath.IsAbs(abs) {
		abs = filepath.Clean(abs)
	}
	raw, err := os.ReadFile(abs)
	if err != nil {
		// validateReactTestTarget already reports the missing-file error.
		return nil
	}

	for _, m := range reDescribeSubject.FindAllStringSubmatch(string(raw), -1) {
		if m[1] == expected {
			return nil
		}
	}

	relTest, _ := filepath.Rel(repoRoot, abs)
	return []validationError{{rel, "targets.react.test", fmt.Sprintf(
		"no describe(%q, ...) found in %s; add one or set targets.react.describe to override",
		expected, filepath.ToSlash(relTest),
	)}}
}
