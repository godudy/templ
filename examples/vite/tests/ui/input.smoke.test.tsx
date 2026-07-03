import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Input } from "../../../../ui/input/input";

describe("ui/input", () => {
  test("defaults type to text", () => {
    const html = renderToStaticMarkup(<Input />);
    expect(html).toContain('type="text"');
  });
});
