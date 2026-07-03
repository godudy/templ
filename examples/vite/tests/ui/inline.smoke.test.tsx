import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Inline } from "../../../../ui/inline/inline";

describe("ui/inline", () => {
  test("renders <span>", () => {
    const html = renderToStaticMarkup(<Inline>x</Inline>);
    expect(html).toContain("<span");
    expect(html).toContain(">x</span>");
  });
});
