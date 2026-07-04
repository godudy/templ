import { type ReactNode } from "react";
import {
  Nav,
  NavItem,
  NavLink,
  NavList,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from "@registry/components";
import {
  Alert,
  Badge,
  Block,
  Box,
  Breadcrumb,
  Button,
  FormDescription,
  FormItem,
  Grid,
  GridCol,
  Group,
  IconBadge,
  Input,
  Label,
  Progress,
  Stack,
  Text,
} from "@registry/ui";

const demoSheetID = "demo-sheet-panel";
const demoSheetTriggerID = "demo-sheet-trigger";
const demoSheetTitleID = "demo-sheet-title";

function GalleryPanel({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <Box className="border-b border-border p-6 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
      <Stack className="gap-4">
        <Stack className="gap-2">
          <Text className="text-sm font-semibold">{title}</Text>
          <Text className="text-xs text-muted-foreground">{description}</Text>
        </Stack>
        {children}
      </Stack>
    </Box>
  );
}

export function ComponentExamples() {
  return (
    <Block id="component-examples" tag="section" className="rounded-lg border border-border bg-card shadow-sm">
      <Grid className="gap-0 lg:grid-cols-2">
        <GridCol>
          <GalleryPanel title="Actions" description="Button variants from button.variants.json">
            <Stack className="gap-4">
              <Group className="flex flex-wrap gap-2">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </Group>
              <Group className="flex flex-wrap gap-2">
                <Badge variant="default">Badge</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Error</Badge>
                <Badge variant="outline">Outline</Badge>
              </Group>
            </Stack>
          </GalleryPanel>
        </GridCol>
        <GridCol>
          <GalleryPanel title="Forms" description="Input stack with labels and helpers">
            <FormItem>
              <Label htmlFor="demo-email">Email</Label>
              <Input id="demo-email" name="email" type="email" placeholder="name@example.com" />
              <FormDescription>We never share your email.</FormDescription>
            </FormItem>
            <Group className="mt-4 flex flex-wrap gap-2">
              <Button variant="default">Save</Button>
              <Button variant="outline" size="sm">Cancel</Button>
            </Group>
          </GalleryPanel>
        </GridCol>
        <GridCol>
          <GalleryPanel title="Feedback" description="Alerts and progress">
            <Stack className="gap-2">
              <Alert variant="success" role="status" aria-live="polite">
                <Text className="text-sm">Success — deployment ready.</Text>
              </Alert>
              <Alert variant="warning" role="status" aria-live="polite">
                <Text className="text-sm">Warning — review token mapping.</Text>
              </Alert>
              <Alert variant="destructive" role="alert" aria-live="assertive">
                <Text className="text-sm">Error — validation failed.</Text>
              </Alert>
              <Progress value="68" max="100" variant="default" />
            </Stack>
          </GalleryPanel>
        </GridCol>
        <GridCol>
          <GalleryPanel title="Surfaces" description="Nav, icons, sheet, cards">
            <Stack className="gap-4">
              <Nav aria-label="Gallery navigation">
                <NavList orientation="horizontal">
                  <NavItem>
                    <NavLink href="/" active>
                      <IconBadge size="sm" variant="accent">H</IconBadge>
                      Home
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="/docs">
                      <IconBadge size="sm" variant="secondary">D</IconBadge>
                      Docs
                    </NavLink>
                  </NavItem>
                </NavList>
              </Nav>
              <Group className="flex flex-wrap gap-2">
                <IconBadge size="default" variant="accent">★</IconBadge>
                <IconBadge size="default" variant="destructive">!</IconBadge>
                <SheetTrigger
                  id={demoSheetTriggerID}
                  panelId={demoSheetID}
                  behavior="ui8kit"
                  variant="outline"
                  size="sm"
                  aria-label="Open demo sheet"
                >
                  Open sheet
                </SheetTrigger>
              </Group>
              <Sheet
                id={demoSheetID}
                side="right"
                behavior="ui8kit"
                aria-label="Demo sheet"
                aria-labelledby={demoSheetTitleID}
              >
                <SheetOverlay panelId={demoSheetID} behavior="ui8kit" />
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle id={demoSheetTitleID}>Sheet panel</SheetTitle>
                    <SheetClose panelId={demoSheetID} behavior="ui8kit" aria-label="Close demo sheet">
                      Close
                    </SheetClose>
                  </SheetHeader>
                  <SheetDescription>Sheet with ui8kit open/close hooks.</SheetDescription>
                </SheetContent>
              </Sheet>
              <Breadcrumb
                aria-label="Breadcrumb"
                items={[
                  { label: "Registry", href: "/" },
                  { label: "Gallery", current: true },
                ]}
              />
            </Stack>
          </GalleryPanel>
        </GridCol>
      </Grid>
    </Block>
  );
}
