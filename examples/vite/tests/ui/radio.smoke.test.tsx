import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Radio } from "../../../../ui/radio/radio";

describe("ui/radio", () => {
  test('renders <input type="radio">', () => {
    const html = renderToStaticMarkup(<Radio />);
    expect(html).toContain('type="radio"');
  });
});
