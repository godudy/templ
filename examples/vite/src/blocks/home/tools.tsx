import homeVariants from "@blocks/home-variants";
import { Badge, Card, CardContent, Grid, GridCol, Group, IconBadge, Stack, Text } from "@registry/ui";
import { blockVariant } from "../../lib/block-variant";
import { toolIconLetter } from "../../lib/helpers";
import type { ToolCard } from "../../types/home";

export function ToolCards({ items }: { items: ToolCard[] }) {
  return (
    <Grid className="gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <GridCol key={item.Title}>
          <Card asChild variant="default" className="h-full hover:bg-muted/20">
            <article>
              <CardContent className="p-6">
                <Group className="items-start gap-4">
                  <IconBadge
                    size="default"
                    className={blockVariant(homeVariants, "toolTone", item.Tone)}
                  >
                    {toolIconLetter(item.Icon)}
                  </IconBadge>
                  <Stack className="gap-2">
                    <Text className="text-sm font-semibold">{item.Title}</Text>
                    <Text className="text-xs leading-relaxed text-muted-foreground">{item.Description}</Text>
                  </Stack>
                </Group>
              </CardContent>
            </article>
          </Card>
        </GridCol>
      ))}
    </Grid>
  );
}

// Re-export Badge to keep tree-shaking happy if a consumer wants alternative chrome.
export { Badge };
