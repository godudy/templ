import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Group,
  Stack,
  Text,
} from "@registry/ui";
import type { LayerItem } from "../../types/dashboard";

function LayerStatusBadge({ status }: { status: string }) {
  if (status === "primitive") return <Badge variant="default">primitive</Badge>;
  if (status === "composite") return <Badge variant="secondary">composite</Badge>;
  if (status === "block") return <Badge variant="outline">block</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}

export function LayerTable({ items }: { items: LayerItem[] }) {
  return (
    <Card asChild variant="default">
      <section>
        <CardHeader>
          <CardTitle as={2}>Registry inventory</CardTitle>
          <CardDescription>
            Public bricks included in this preview and how they layer together.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Stack className="gap-2">
            {items.map((item) => (
              <Group
                key={item.Name}
                className="items-center justify-between gap-4 rounded-md border border-border bg-muted/20 px-4 py-4"
              >
                <Stack className="gap-2 min-w-0">
                  <Text className="text-sm font-medium font-mono">{item.Name}</Text>
                  <Text className="text-xs text-muted-foreground">{item.Description}</Text>
                </Stack>
                <LayerStatusBadge status={item.Status} />
              </Group>
            ))}
          </Stack>
        </CardContent>
      </section>
    </Card>
  );
}
