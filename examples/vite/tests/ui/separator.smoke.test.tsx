import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Separator } from "../../../../ui/separator/separator";

describe("ui/separator", () => {
  test("renders <hr>", () => {
    const html = renderToStaticMarkup(<Separator />);
    expect(html).toContain("<hr");
  });

  test("decorative separator marks presentation", () => {
    const html = renderToStaticMarkup(<Separator decorative />);
    expect(html).toContain('role="presentation"');
    expect(html).toContain('aria-hidden="true"');
  });
});
