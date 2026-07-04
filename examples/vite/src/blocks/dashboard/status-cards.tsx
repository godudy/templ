import dashboardVariants from "@blocks/dashboard-variants";
import { Badge, Card, CardContent, Grid, GridCol, Group, IconBadge, Stack, Text } from "@registry/ui";
import { blockVariant } from "../../lib/block-variant";
import type { StatusCard } from "../../types/dashboard";

export function StatusCards({ items }: { items: StatusCard[] }) {
  return (
    <Grid className="gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <GridCol key={item.Title}>
          <Card asChild variant="default" className="h-full transition-colors hover:bg-muted/20">
            <article>
              <CardContent className="p-6">
                <Stack className="gap-4">
                  <Group className="items-start justify-between gap-4">
                    <IconBadge
                      size="default"
                      className={blockVariant(dashboardVariants, "statusTone", item.Tone)}
                    >
                      {item.Icon}
                    </IconBadge>
                    <Badge variant="outline" size="sm">{item.Meta}</Badge>
                  </Group>
                  <Stack className="gap-2">
                    <Text className="text-2xl font-bold tracking-tight">{item.Value}</Text>
                    <Text className="text-sm font-semibold">{item.Title}</Text>
                    <Text className="text-xs leading-relaxed text-muted-foreground">{item.Description}</Text>
                  </Stack>
                </Stack>
              </CardContent>
            </article>
          </Card>
        </GridCol>
      ))}
    </Grid>
  );
}
