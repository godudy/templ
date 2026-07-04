import {
  Badge,
  Block,
  Box,
  Button,
  Group,
  Grid,
  GridCol,
  H1,
  IconBadge,
  Stack,
  Text,
  Textarea,
} from "@registry/ui";
import { workflowStepLabel, workflowStepVariant } from "../../lib/helpers";
import type { HeroProps } from "../../types/home";

export function HeroChat({ hero }: { hero: HeroProps }) {
  return (
    <Block tag="section" className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <Grid className="gap-0 md:grid-cols-2">
        <GridCol>
          <Box className="border-b border-border p-6 md:border-b-0 md:border-r">
            <Stack className="gap-6">
              <Stack className="gap-2">
                <Badge variant="outline">AI workspace</Badge>
                <H1 className="text-3xl font-bold tracking-tight md:text-4xl">{hero.Title}</H1>
                <Text className="text-sm leading-relaxed text-muted-foreground md:text-base">{hero.Subtitle}</Text>
              </Stack>
              <Box className="rounded-lg border border-border bg-background p-4 shadow-sm">
                <Textarea
                  name="prompt"
                  placeholder={hero.Prompt}
                  rows={4}
                  className="min-h-28 border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
                <Group className="mt-4 items-center justify-between gap-2">
                  <Group className="items-center gap-2">
                    <Button variant="outline" size="sm" aria-label={hero.AttachmentLabel}>+</Button>
                    <Button variant="outline" size="sm" aria-label={hero.AssistantLabel}>AI</Button>
                    <Button variant="ghost" size="sm" aria-label={hero.ShortcutLabel}>/</Button>
                  </Group>
                  <Button variant="default" size="sm">{hero.PrimaryAction}</Button>
                </Group>
              </Box>
              <Stack className="gap-2">
                <Text className="text-xs font-medium text-muted-foreground">{hero.SuggestionsLabel}</Text>
                <Group className="flex flex-wrap gap-2">
                  {hero.Suggestions.map((suggestion) => (
                    <Badge key={suggestion} variant="secondary">{suggestion}</Badge>
                  ))}
                </Group>
              </Stack>
            </Stack>
          </Box>
        </GridCol>
        <GridCol>
          <Box className="bg-muted/30 p-6">
            <Stack className="gap-4">
              <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Workflow</Text>
              {hero.Workflow.map((step, index) => (
                <Group
                  key={step.Label}
                  className="items-center gap-4 rounded-md border border-border bg-card px-4 py-4 shadow-sm"
                >
                  <IconBadge size="sm" variant={workflowStepVariant(index)}>
                    {workflowStepLabel(index)}
                  </IconBadge>
                  <Text className="text-sm font-medium">{step.Label}</Text>
                </Group>
              ))}
            </Stack>
          </Box>
        </GridCol>
      </Grid>
    </Block>
  );
}
