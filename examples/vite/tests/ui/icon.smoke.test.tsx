import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Icon } from "../../../../ui/icon/icon";

describe("ui/icon", () => {
  test("default renders decorative <span>", () => {
    const html = renderToStaticMarkup(<Icon />);
    expect(html).toContain('aria-hidden="true"');
  });

  test("svg type renders <svg>", () => {
    const html = renderToStaticMarkup(<Icon type="svg" href="#icon" title="save" />);
    expect(html).toContain("<svg");
    expect(html).toContain("<title>save</title>");
  });
});
