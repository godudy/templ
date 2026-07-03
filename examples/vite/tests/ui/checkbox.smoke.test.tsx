import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Checkbox } from "../../../../ui/checkbox/checkbox";

describe("ui/checkbox", () => {
  test('renders <input type="checkbox">', () => {
    const html = renderToStaticMarkup(<Checkbox />);
    expect(html).toContain('type="checkbox"');
  });
});
