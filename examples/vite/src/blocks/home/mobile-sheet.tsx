import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
} from "@registry/components";
import type { HomePageProps } from "../../types/home";
import { CatalogHeaderNav, CatalogPrimaryNav } from "./catalog-nav";
import { homeSheetPanelID, homeSheetTitleID } from "./sheet-ids";

export function CatalogMobileSheet({ props }: { props: HomePageProps }) {
  return (
    <Sheet
      id={homeSheetPanelID}
      side="left"
      size="default"
      variant="card"
      behavior="ui8kit"
      aria-label="Navigation menu"
      aria-labelledby={homeSheetTitleID}
      className="md:hidden max-h-dvh overflow-y-auto p-0"
    >
      <SheetOverlay
        panelId={homeSheetPanelID}
        behavior="ui8kit"
        className="cursor-pointer bg-background/80"
      />
      <SheetContent className="p-4">
        <SheetHeader>
          <SheetTitle id={homeSheetTitleID} className="text-sm font-medium">{props.Brand}</SheetTitle>
          <SheetClose
            panelId={homeSheetPanelID}
            behavior="ui8kit"
            variant="outline"
            size="icon"
            aria-label="Close navigation menu"
          >
            ×
          </SheetClose>
        </SheetHeader>
        <CatalogPrimaryNav items={props.Sidebar} className="mt-4" />
        <CatalogHeaderNav items={props.HeaderNav} className="mt-4 border-t border-border pt-4" />
      </SheetContent>
    </Sheet>
  );
}
