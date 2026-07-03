import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Grid, GridCol } from "../../../../ui/grid/grid";

describe("ui/grid", () => {
  test("Grid + GridCol render", () => {
    const html = renderToStaticMarkup(
      <Grid cols="2">
        <GridCol span={1}>a</GridCol>
        <GridCol span={1} start={2}>
          b
        </GridCol>
      </Grid>
    );
    expect(html).toContain("grid-cols-2");
    expect(html).toContain("col-span-1");
    expect(html).toContain("col-start-2");
  });
});
