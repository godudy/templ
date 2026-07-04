import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  GridCol,
  Group,
  H2,
  H3,
  IconBadge,
  Stack,
  Text,
} from "@registry/ui";
import { showcaseIconLetter } from "../../lib/helpers";
import type { ShowcaseItem, ShowcaseProps } from "../../types/home";

function ShowcaseCardView({ item }: { item: ShowcaseItem }) {
  return (
    <Card asChild variant="raised" className="h-full">
      <article>
        <CardContent className="p-6">
          <Stack className="gap-4">
            <Box className="flex h-28 items-center justify-center rounded-md border border-dashed border-border bg-muted/50">
              <IconBadge size="lg" variant="accent">{showcaseIconLetter(item.Name)}</IconBadge>
            </Box>
            <Group className="items-start justify-between gap-4">
              <Stack className="gap-2">
                <H3 className="text-base font-semibold">{item.Name}</H3>
                <Text className="text-sm leading-relaxed text-muted-foreground">{item.Description}</Text>
              </Stack>
              <Badge variant="outline">{item.Category}</Badge>
            </Group>
            <Stack className="gap-2">
              {item.Capabilities.map((capability) => (
                <Group key={capability} className="items-center gap-2">
                  <IconBadge size="xs" variant="secondary">✓</IconBadge>
                  <Text className="text-xs text-muted-foreground">{capability}</Text>
                </Group>
              ))}
            </Stack>
            <Group className="gap-2">
              <Button asChild variant="default" size="sm">
                <a href="#use">{item.UseLabel}</a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="#preview">{item.PreviewLabel}</a>
              </Button>
            </Group>
          </Stack>
        </CardContent>
      </article>
    </Card>
  );
}

export function ShowcaseGrid({ showcase }: { showcase: ShowcaseProps }) {
  return (
    <Stack className="gap-6">
      <Group className="items-end justify-between gap-4">
        <Stack className="gap-2">
          <H2 className="text-xl font-semibold tracking-tight">{showcase.Title}</H2>
          <Text className="text-sm text-muted-foreground">{showcase.Description}</Text>
        </Stack>
        <Button asChild variant="outline" size="sm">
          <a href="#templates">{showcase.ActionLabel}</a>
        </Button>
      </Group>
      <Grid className="gap-4 md:grid-cols-2 xl:grid-cols-3">
        {showcase.Items.map((item) => (
          <GridCol key={item.Name}>
            <ShowcaseCardView item={item} />
          </GridCol>
        ))}
      </Grid>
    </Stack>
  );
}
