package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

// sheetOpenContractFiles are registry specs/docs that must not teach binding
// Sheet Open to a runtime's reactive state when Behavior=ui8kit.
var sheetOpenContractFiles = []string{
	"components/sheet/sheet.spec.md",
	"docs/aria.md",
	"docs/learn/03-sheet/README.md",
	"docs/coming-from-shadcn.md",
}

// forbiddenSheetOpenPhrases match teaching that makes a single runtime the owner
// of Sheet visibility. Negated guidance ("do not bind…") is allowed when the
// match is only inside a longer runtime-neutral sentence — patterns are chosen
// to avoid the approved contract wording in sheet.spec.md.
var forbiddenSheetOpenPhrases = []*regexp.Regexp{
	regexp.MustCompile(`(?i)bind\s+open\s+to\s+react\s+state`),
	regexp.MustCompile(`(?i)bind\s+open\s+to\s+react\s+(?:component\s+)?state`),
	regexp.MustCompile(`(?i)controlled\s+open(?:\s+state)?`),
	regexp.MustCompile(`(?i)useState\s*\(\s*(?:open|isOpen)\s*\)`),
	regexp.MustCompile(`(?i)react\s+state\s+(?:for|to)\s+(?:control\s+)?(?:sheet\s+)?open`),
}

func validateSheetOpenContract(repoRoot string) []validationError {
	var errs []validationError
	for _, relPath := range sheetOpenContractFiles {
		abs := filepath.Join(repoRoot, filepath.FromSlash(relPath))
		raw, err := os.ReadFile(abs)
		if err != nil {
			if os.IsNotExist(err) {
				errs = append(errs, validationError{relPath, "sheet-open-contract", "contract doc missing"})
				continue
			}
			errs = append(errs, validationError{relPath, "sheet-open-contract", err.Error()})
			continue
		}
		text := strings.ReplaceAll(string(raw), "\r\n", "\n")
		for _, re := range forbiddenSheetOpenPhrases {
			if loc := re.FindStringIndex(text); loc != nil {
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
