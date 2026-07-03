import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Select, SelectOption, OptGroup } from "../../../../ui/select/select";

describe("ui/select", () => {
  test("renders <select> with options + option groups", () => {
    const html = renderToStaticMarkup(
      <Select options={[{ value: "a", label: "A" }]}>
        <OptGroup label="grp">
          <SelectOption value="b" label="B" />
        </OptGroup>
      </Select>
    );
    expect(html).toContain("<select");
    expect(html).toContain("<optgroup");
    expect(html).toContain('value="a"');
    expect(html).toContain('value="b"');
  });
});
