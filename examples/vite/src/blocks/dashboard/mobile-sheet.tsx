import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
} from "@registry/components";
import type { DashboardPageProps } from "../../types/dashboard";
import { DashboardHeaderNav, DashboardPrimaryNav } from "./nav";
import { dashboardSheetPanelID, dashboardSheetTitleID } from "./sheet-ids";

export function DashboardMobileSheet({ props }: { props: DashboardPageProps }) {
  return (
    <Sheet
      id={dashboardSheetPanelID}
      side="left"
      size="default"
      variant="card"
      behavior="ui8kit"
      aria-label="Navigation menu"
      aria-labelledby={dashboardSheetTitleID}
      className="md:hidden max-h-dvh overflow-y-auto p-0"
    >
      <SheetOverlay
        panelId={dashboardSheetPanelID}
        behavior="ui8kit"
        className="cursor-pointer bg-background/80"
      />
      <SheetContent className="p-4">
        <SheetHeader>
          <SheetTitle id={dashboardSheetTitleID} className="text-sm font-medium">
            {props.Brand}
          </SheetTitle>
          <SheetClose
            panelId={dashboardSheetPanelID}
            behavior="ui8kit"
            variant="outline"
            size="icon"
            aria-label="Close navigation menu"
          >
            ×
          </SheetClose>
        </SheetHeader>
        <DashboardPrimaryNav items={props.Sidebar} className="mt-4" />
        <DashboardHeaderNav items={props.HeaderNav} className="mt-4 border-t border-border pt-4" />
      </SheetContent>
    </Sheet>
  );
}
