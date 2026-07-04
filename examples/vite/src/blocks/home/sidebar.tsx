import { Block, Box, Button, IconBadge, Inline, Stack } from "@registry/ui";
import type { HomePageProps } from "../../types/home";
import { CatalogPrimaryNav } from "./catalog-nav";

export function CatalogSidebar({ props }: { props: HomePageProps }) {
  return (
    <Block tag="aside" className="hidden w-64 shrink-0 border-r border-border bg-card md:flex md:flex-col">
      <Box className="flex h-16 items-center gap-4 border-b border-border px-4">
        <IconBadge size="sm" variant="accent">BY</IconBadge>
        <Stack className="gap-0">
          <Inline className="text-sm font-semibold tracking-tight">{props.Brand}</Inline>
          <Inline className="text-xs text-muted-foreground">Workspace catalog</Inline>
        </Stack>
      </Box>
      <Box className="flex-1 py-2">
        <CatalogPrimaryNav items={props.Sidebar} />
      </Box>
      <Box className="border-t border-border p-4">
        <Button asChild variant="outline" size="sm" className="w-full">
          <a href="/">Dashboard block</a>
        </Button>
      </Box>
    </Block>
  );
}
