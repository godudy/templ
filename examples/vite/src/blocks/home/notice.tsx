import { Alert, Button, Group, Stack, Text } from "@registry/ui";
import type { NoticeProps } from "../../types/home";

export function PrototypeNotice({ notice }: { notice: NoticeProps }) {
  return (
    <Alert variant="default" role="status" aria-live="polite">
      <Group className="items-center justify-between gap-4 flex-wrap">
        <Stack className="gap-2">
          <Text className="text-sm font-semibold">{notice.Title}</Text>
          <Text className="text-sm text-muted-foreground">{notice.Description}</Text>
        </Stack>
        <Button asChild variant="outline" size="sm">
          <a href="#prototype-mode">{notice.ActionLabel}</a>
        </Button>
      </Group>
    </Alert>
  );
}
