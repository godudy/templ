// New reader? Start with hero.tsx, then sidebar.tsx, then mobile-sheet.tsx —
// see docs/learn/01-hero, 02-sidebar, 03-sheet. This file is only the
// router/composition shell that assembles those blocks into one page.
import { Block, Box, Group } from "@registry/ui";
import { defaultHomePage } from "../../data/home";
import type { HomePageProps } from "../../types/home";
import { CatalogHeader } from "./header";
import { CatalogMobileSheet } from "./mobile-sheet";
import { CatalogSidebar } from "./sidebar";
import { HeroChat } from "./hero";
import { ToolCards } from "./tools";
import { ShowcaseGrid } from "./showcase";
import { PrototypeNotice } from "./notice";

export type HomePageViewProps = {
  props: HomePageProps;
};

export function HomePageView({ props }: HomePageViewProps) {
  return (
    <Block tag="main" className="min-h-screen bg-muted/30 text-foreground">
      <CatalogMobileSheet props={props} />
      <Group className="min-h-screen w-full items-stretch">
        <CatalogSidebar props={props} />
        <Box className="flex min-w-0 flex-1 flex-col bg-background">
          <CatalogHeader props={props} />
          <Box className="flex flex-1 flex-col gap-8 p-4 md:p-8">
            <HeroChat hero={props.Hero} />
            <ToolCards items={props.Tools} />
            <ShowcaseGrid showcase={props.Showcase} />
            <PrototypeNotice notice={props.Notice} />
          </Box>
        </Box>
      </Group>
    </Block>
  );
}

export function HomePage() {
  return <HomePageView props={defaultHomePage} />;
}
