import { Badge, Block, Button, Group } from "@registry/ui";
import { Nav, NavItem, NavLink, NavList, SheetTrigger } from "@registry/components";
import type { DashboardPageProps } from "../../types/dashboard";
import { dashboardSheetPanelID, dashboardSheetTriggerID } from "./sheet-ids";

export function DashboardHeader({ props }: { props: DashboardPageProps }) {
  return (
    <Block
      tag="header"
      className="grid h-16 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-border bg-card/80 px-4 backdrop-blur-sm"
    >
      <Group className="col-start-1 items-center gap-2 justify-self-start">
        <SheetTrigger
          id={dashboardSheetTriggerID}
          panelId={dashboardSheetPanelID}
          behavior="ui8kit"
          variant="outline"
          size="icon"
          aria-label="Open menu"
        >
          ☰
        </SheetTrigger>
        <Button asChild variant="outline" size="sm">
          <a href="#gallery">{props.Workspace}</a>
        </Button>
      </Group>
      <Nav className="col-start-2 hidden justify-self-center md:block">
        <NavList orientation="horizontal">
          {props.HeaderNav.map((item) => (
            <NavItem key={item.Label}>
              <NavLink href={item.Href} variant="ghost" size="sm">{item.Label}</NavLink>
            </NavItem>
          ))}
        </NavList>
      </Nav>
      <Group className="col-start-3 items-center justify-end gap-2 justify-self-end">
        <Badge variant="secondary">{props.Status}</Badge>
        <Button asChild variant="ghost" size="sm">
          <a href="#profile">{props.ProfileName}</a>
        </Button>
      </Group>
    </Block>
  );
}
