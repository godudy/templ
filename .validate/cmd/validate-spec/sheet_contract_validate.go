package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

// forbiddenSheetOpenPhrases match teaching that makes a single runtime the owner
// of Sheet visibility. Negated guidance ("do not bind…") is skipped below.
var forbiddenSheetOpenPhrases = []*regexp.Regexp{
	regexp.MustCompile("(?i)bind\\s+`?open`?\\s+to\\s+react\\s+(?:component\\s+)?state"),
	regexp.MustCompile("(?i)controlled\\s+(?:sheet\\s+)?`?open`?(?:\\s+state)?"),
	regexp.MustCompile("(?i)useState\\s*\\(\\s*(?:open|isOpen)\\s*\\)"),
	regexp.MustCompile("(?i)react\\s+state\\s+(?:for|to)\\s+(?:control\\s+)?(?:sheet\\s+)?`?open`?"),
	regexp.MustCompile("(?i)control\\s+(?:sheet\\s+)?`?open`?\\s+with\\s+react\\s+(?:component\\s+)?state"),
	regexp.MustCompile("(?i)custom\\s+react\\s+state\\s+logic\\s+for\\s+(?:runtime\\s+)?open"),
}

func validateSheetOpenContract(repoRoot string) []validationError {
	var errs []validationError
	paths, err := sheetOpenContractPaths(repoRoot)
	if err != nil {
		return []validationError{{"sheet-open-contract", "", err.Error()}}
	}
	for _, relPath := range paths {
		abs := filepath.Join(repoRoot, filepath.FromSlash(relPath))
		raw, err := os.ReadFile(abs)
		if err != nil {
			errs = append(errs, validationError{relPath, "sheet-open-contract", err.Error()})
			continue
		}
		text := strings.ReplaceAll(string(raw), "\r\n", "\n")
		for _, re := range forbiddenSheetOpenPhrases {
			if loc := re.FindStringIndex(text); loc != nil {
				if isNegatedSheetOpenGuidance(text, loc[0]) {
					continue
				}
				snippet := snippetAround(text, loc[0], loc[1], 60)
				errs = append(errs, validationError{
					file:    relPath,
					field:   "sheet-open-contract",
					message: fmt.Sprintf("forbidden Sheet Open guidance %q: …%s…", re.String(), snippet),
				})
			}
		}
	}
	return errs
}

func sheetOpenContractPaths(repoRoot string) ([]string, error) {
	seen := map[string]bool{}
	var paths []string
	addRel := func(path string) {
		rel, err := filepath.Rel(repoRoot, path)
		if err != nil {
			return
		}
		rel = filepath.ToSlash(rel)
		if !seen[rel] {
			seen[rel] = true
			paths = append(paths, rel)
		}
	}

	specPaths, err := discoverSpecs(repoRoot)
	if err != nil {
		return nil, err
	}
	for _, path := range specPaths {
		addRel(path)
	}

	docsRoot := filepath.Join(repoRoot, "docs")
	if _, err := os.Stat(docsRoot); err != nil {
		if os.IsNotExist(err) {
			return paths, nil
		}
		return nil, err
	}
	err = filepath.WalkDir(docsRoot, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() || !strings.HasSuffix(path, ".md") {
			return nil
		}
		addRel(path)
		return nil
	})
	if err != nil {
		return nil, err
	}
	return paths, nil
}

func isNegatedSheetOpenGuidance(text string, start int) bool {
	from := start - 48
	if from < 0 {
		from = 0
	}
	prefix := strings.ToLower(text[from:start])
	prefix = strings.ReplaceAll(prefix, "`", "")
	return strings.Contains(prefix, "do not ") ||
		strings.Contains(prefix, "don't ") ||
		strings.Contains(prefix, "must not ") ||
		strings.Contains(prefix, "never ")
}

func snippetAround(text string, start, end, radius int) string {
	from := start - radius
	if from < 0 {
		from = 0
	}
	to := end + radius
	if to > len(text) {
		to = len(text)
	}
	snippet := strings.ReplaceAll(text[from:to], "\n", " ")
	return strings.TrimSpace(snippet)
}
