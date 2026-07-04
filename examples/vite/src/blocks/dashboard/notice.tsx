import { Alert, Stack, Text } from "@registry/ui";
import type { NoticeProps } from "../../types/dashboard";

export function DashboardNotice({ notice }: { notice: NoticeProps }) {
  return (
    <Alert variant="warning" role="status" aria-live="polite">
      <Stack className="gap-2">
        <Text className="text-sm font-semibold">{notice.Title}</Text>
        <Text className="text-sm">{notice.Description}</Text>
      </Stack>
    </Alert>
  );
}
