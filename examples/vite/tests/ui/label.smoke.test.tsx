import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Label } from "../../../../ui/label/label";

describe("ui/label", () => {
  test("renders <label> with htmlFor", () => {
    const html = renderToStaticMarkup(<Label htmlFor="x">L</Label>);
    expect(html).toContain('for="x"');
  });
});
