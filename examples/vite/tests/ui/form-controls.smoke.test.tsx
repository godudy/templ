import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { DataList, DataOption, Fieldset, Legend, Meter, Output, Progress } from "../../../../ui/form/controls";

describe("ui/form/controls", () => {
  test("controls render their native tags", () => {
    const html = renderToStaticMarkup(
      <Fieldset>
        <Legend>legend</Legend>
        <Progress value={50} max={100} />
        <Meter value={0.5} />
        <Output>out</Output>
        <DataList id="list">
          <DataOption value="a" />
        </DataList>
      </Fieldset>
    );
    expect(html).toContain("<fieldset");
    expect(html).toContain("<legend");
    expect(html).toContain("<progress");
    expect(html).toContain("<meter");
    expect(html).toContain("<output");
    expect(html).toContain("<datalist");
    expect(html).toContain("<option");
  });
});
