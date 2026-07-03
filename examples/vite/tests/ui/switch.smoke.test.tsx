import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Switch } from "../../../../ui/switch/switch";

describe("ui/switch", () => {
  test('renders <input type="checkbox" role="switch">', () => {
    const html = renderToStaticMarkup(<Switch checked readOnly />);
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('role="switch"');
    expect(html).toContain('aria-checked="true"');
  });
});
