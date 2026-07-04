/**
 * Package components is the composite registry facade.
 * Import cmp "github.com/fastygo/templ/components" for Sheet, Nav.
 */

// Package components is the composite registry facade. Import as:
//
//	import cmp "github.com/fastygo/templ/components"
//
// Use @cmp.Sheet, @cmp.Nav, … Granular imports remain valid.
package components

import (
	"github.com/fastygo/templ/components/combobox"
	"github.com/fastygo/templ/components/menu"
	"github.com/fastygo/templ/components/nav"
	"github.com/fastygo/templ/components/popover"
	"github.com/fastygo/templ/components/sheet"
	"github.com/fastygo/templ/components/tabs"
	"github.com/fastygo/templ/components/toast"
)

type (
	SheetProps            = sheet.SheetProps
	SheetTriggerProps     = sheet.SheetTriggerProps
	SheetOverlayProps     = sheet.SheetOverlayProps
	SheetContentProps     = sheet.SheetContentProps
	SheetHeaderProps      = sheet.SheetHeaderProps
	SheetTitleProps       = sheet.SheetTitleProps
	SheetDescriptionProps = sheet.SheetDescriptionProps
	SheetCloseProps       = sheet.SheetCloseProps
	NavProps              = nav.NavProps
	NavListProps          = nav.NavListProps
	NavItemProps          = nav.NavItemProps
	NavLinkProps          = nav.NavLinkProps
	TabsProps             = tabs.TabsProps
	TabsListProps         = tabs.TabsListProps
	TabsTriggerProps      = tabs.TabsTriggerProps
	TabsPanelProps        = tabs.TabsPanelProps
	PopoverProps          = popover.PopoverProps
	PopoverTriggerProps   = popover.PopoverTriggerProps
	PopoverContentProps   = popover.PopoverContentProps
	ComboboxProps         = combobox.ComboboxProps
	ComboboxInputProps    = combobox.ComboboxInputProps
	ComboboxToggleProps   = combobox.ComboboxToggleProps
	ComboboxListProps     = combobox.ComboboxListProps
	ComboboxOptionProps   = combobox.ComboboxOptionProps
	MenuButtonProps       = menu.MenuButtonProps
	MenuProps             = menu.MenuProps
	MenuItemProps         = menu.MenuItemProps
	ToastProps            = toast.ToastProps
	ToastTitleProps       = toast.ToastTitleProps
	ToastDescriptionProps = toast.ToastDescriptionProps
	ToastCloseProps       = toast.ToastCloseProps
)

func SheetClasses(p SheetProps) string       { return sheet.SheetClasses(p) }
func NavListClasses(p NavListProps) string   { return nav.NavListClasses(p) }
func NavLinkClasses(p NavLinkProps) string   { return nav.NavLinkClasses(p) }
func TabsClasses(p TabsProps) string         { return tabs.TabsClasses(p) }
func PopoverClasses(p PopoverProps) string   { return popover.PopoverClasses(p) }
func ComboboxClasses(p ComboboxProps) string { return combobox.ComboboxClasses(p) }
func MenuClasses(p MenuProps) string         { return menu.MenuClasses(p) }
func ToastClasses(p ToastProps) string       { return toast.ToastClasses(p) }
