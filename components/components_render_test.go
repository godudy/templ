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

func TestTabsBehaviorHooksAreOptIn(t *testing.T) {
	html := renderComponent(t, Tabs(TabsProps{ID: "demo-tabs", Value: "account"}))
	if strings.Contains(html, "data-ui8kit") {
		t.Fatalf("tabs should not render behavior hooks by default: %s", html)
	}
}

func TestTabsUI8KitRoot(t *testing.T) {
	html := renderComponent(t, Tabs(TabsProps{ID: "demo-tabs", Behavior: "ui8kit", Value: "account"}))
	for _, want := range []string{
		`data-ui8kit="tabs"`,
		`data-tabs-value="account"`,
	} {
		if !strings.Contains(html, want) {
			t.Fatalf("expected %q in %s", want, html)
		}
	}
}

func TestTabsTriggerAndPanelAttrs(t *testing.T) {
	trigger := renderComponent(t, TabsTrigger(TabsTriggerProps{Value: "account", PanelID: "panel-account", Active: true}))
	for _, want := range []string{
		`role="tab"`,
		`aria-selected="true"`,
		`aria-controls="panel-account"`,
		`data-tabs-trigger`,
		`data-tabs-value="account"`,
	} {
		if !strings.Contains(trigger, want) {
			t.Fatalf("expected %q in %s", want, trigger)
		}
	}

	panel := renderComponent(t, TabsPanel(TabsPanelProps{ID: "panel-billing", Value: "billing", LabelledBy: "billing"}))
	if !strings.Contains(panel, "hidden") {
		t.Fatalf("inactive tabs panel should render hidden: %s", panel)
	}

	activePanel := renderComponent(t, TabsPanel(TabsPanelProps{ID: "panel-account", Value: "account", LabelledBy: "account", Active: true}))
	if strings.Contains(activePanel, "hidden") {
		t.Fatalf("active tabs panel should not render hidden: %s", activePanel)
	}
}

func TestPopoverBehaviorHooksAreOptIn(t *testing.T) {
	html := renderComponent(t, Popover(PopoverProps{ID: "demo-popover", AriaLabel: "More info"}))
	if strings.Contains(html, "data-ui8kit") {
		t.Fatalf("popover should not render behavior hooks by default: %s", html)
	}
	if strings.Contains(html, "aria-modal") {
		t.Fatalf("popover should be non-modal: %s", html)
	}
	if !strings.Contains(html, `role="dialog"`) {
		t.Fatalf("popover should render dialog semantics: %s", html)
	}
	if !strings.Contains(html, "hidden") {
		t.Fatalf("closed popover should render hidden: %s", html)
	}
}

func TestPopoverUI8KitRoot(t *testing.T) {
	html := renderComponent(t, Popover(PopoverProps{ID: "demo-popover", Behavior: "ui8kit", AriaLabel: "More info"}))
	for _, want := range []string{
		`data-ui8kit="popover"`,
		`data-ui8kit-dialog`,
		`data-state="closed"`,
		`hidden`,
	} {
		if !strings.Contains(html, want) {
			t.Fatalf("expected %q in %s", want, html)
		}
	}
}

func TestPopoverUI8KitTrigger(t *testing.T) {
	html := renderComponent(t, PopoverTrigger(PopoverTriggerProps{PanelID: "demo-popover", Behavior: "ui8kit"}))
	for _, want := range []string{
		`data-ui8kit-dialog-open`,
		`data-ui8kit-dialog-target="demo-popover"`,
		`aria-haspopup="dialog"`,
		`aria-controls="demo-popover"`,
	} {
		if !strings.Contains(html, want) {
			t.Fatalf("expected %q in %s", want, html)
		}
	}
}

func TestComboboxBehaviorHooksAreOptIn(t *testing.T) {
	html := renderComponent(t, Combobox(ComboboxProps{ID: "demo-combobox"}))
	if strings.Contains(html, "data-ui8kit") {
		t.Fatalf("combobox should not render behavior hooks by default: %s", html)
	}
}

func TestComboboxUI8KitRoot(t *testing.T) {
	html := renderComponent(t, Combobox(ComboboxProps{ID: "demo-combobox", Behavior: "ui8kit"}))
	if !strings.Contains(html, `data-ui8kit="combobox"`) {
		t.Fatalf("expected data-ui8kit=combobox in %s", html)
	}
}

func TestComboboxInputAndToggleAttrs(t *testing.T) {
	input := renderComponent(t, ComboboxInput(ComboboxInputProps{ListID: "demo-combobox-list", AriaLabel: "Choose a fruit"}))
	for _, want := range []string{
		`role="combobox"`,
		`aria-expanded="false"`,
		`aria-autocomplete="list"`,
		`aria-controls="demo-combobox-list"`,
	} {
		if !strings.Contains(input, want) {
			t.Fatalf("expected %q in %s", want, input)
		}
	}

	toggle := renderComponent(t, ComboboxToggle(ComboboxToggleProps{InputID: "demo-combobox-input", ListID: "demo-combobox-list", Behavior: "ui8kit"}))
	for _, want := range []string{
		`data-combobox-toggle`,
		`data-ui8kit-dialog-target="demo-combobox-input"`,
		`aria-controls="demo-combobox-list"`,
	} {
		if !strings.Contains(toggle, want) {
			t.Fatalf("expected %q in %s", want, toggle)
		}
	}
}

func TestComboboxOptionAttrs(t *testing.T) {
	option := renderComponent(t, ComboboxOption(ComboboxOptionProps{Value: "apple", Selected: true}))
	for _, want := range []string{
		`role="option"`,
		`aria-selected="true"`,
		`data-combobox-option`,
		`data-combobox-value="apple"`,
	} {
		if !strings.Contains(option, want) {
			t.Fatalf("expected %q in %s", want, option)
		}
	}
}

func TestMenuBehaviorHooksAreOptIn(t *testing.T) {
	html := renderComponent(t, Menu(MenuProps{ID: "demo-menu"}))
	if strings.Contains(html, "data-ui8kit") {
		t.Fatalf("menu should not render behavior hooks by default: %s", html)
	}
	if !strings.Contains(html, `role="menu"`) {
		t.Fatalf("menu should render menu semantics: %s", html)
	}
	if !strings.Contains(html, "hidden") {
		t.Fatalf("closed menu should render hidden: %s", html)
	}
}

func TestMenuUI8KitRoot(t *testing.T) {
	html := renderComponent(t, Menu(MenuProps{ID: "demo-menu", Behavior: "ui8kit"}))
	for _, want := range []string{
		`data-ui8kit="menu"`,
		`data-state="closed"`,
		`hidden`,
	} {
		if !strings.Contains(html, want) {
			t.Fatalf("expected %q in %s", want, html)
		}
	}
}

func TestMenuUI8KitButton(t *testing.T) {
	html := renderComponent(t, MenuButton(MenuButtonProps{MenuID: "demo-menu", Behavior: "ui8kit"}))
	for _, want := range []string{
		`data-ui8kit="menubutton"`,
		`data-menubutton-target="demo-menu"`,
		`aria-haspopup="menu"`,
		`aria-controls="demo-menu"`,
	} {
		if !strings.Contains(html, want) {
			t.Fatalf("expected %q in %s", want, html)
		}
	}
}

func TestMenuItemAttrs(t *testing.T) {
	html := renderComponent(t, MenuItem(MenuItemProps{Disabled: true}))
	for _, want := range []string{
		`role="menuitem"`,
		`aria-disabled="true"`,
		`data-menu-item`,
	} {
		if !strings.Contains(html, want) {
			t.Fatalf("expected %q in %s", want, html)
		}
	}
}

func TestToastBehaviorHooksAreOptIn(t *testing.T) {
	html := renderComponent(t, Toast(ToastProps{ID: "demo-toast", Open: true}))
	if strings.Contains(html, "data-ui8kit") {
		t.Fatalf("toast should not render behavior hooks by default: %s", html)
	}
	if !strings.Contains(html, `role="status"`) || !strings.Contains(html, `aria-live="polite"`) {
		t.Fatalf("toast should render status live-region semantics: %s", html)
	}
}

func TestToastUI8KitRoot(t *testing.T) {
	html := renderComponent(t, Toast(ToastProps{ID: "demo-toast", Behavior: "ui8kit", Open: true}))
	for _, want := range []string{
		`data-ui8kit="toast"`,
		`data-state="open"`,
	} {
		if !strings.Contains(html, want) {
			t.Fatalf("expected %q in %s", want, html)
		}
	}
	if strings.Contains(html, "hidden") {
		t.Fatalf("open toast should not render hidden: %s", html)
	}
}

func TestToastClosedRendersHidden(t *testing.T) {
	html := renderComponent(t, Toast(ToastProps{ID: "demo-toast"}))
	if !strings.Contains(html, "hidden") {
		t.Fatalf("closed toast should render hidden: %s", html)
	}
	if !strings.Contains(html, `data-state="closed"`) {
		t.Fatalf("closed toast should render data-state closed: %s", html)
	}
}

func TestToastUI8KitClose(t *testing.T) {
	html := renderComponent(t, ToastClose(ToastCloseProps{PanelID: "demo-toast", Behavior: "ui8kit"}))
	for _, want := range []string{
		`data-ui8kit-dialog-close`,
		`data-ui8kit-dialog-target="demo-toast"`,
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
