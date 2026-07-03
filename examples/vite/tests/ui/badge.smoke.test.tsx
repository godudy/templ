import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Badge } from "../../../../ui/badge/badge";

describe("ui/badge", () => {
  test("renders a div with recipe classes", () => {
    const html = renderToStaticMarkup(<Badge variant="secondary">x</Badge>);
    expect(html).toMatch(/^<div /);
    expect(html).toContain("class=");
    expect(html).toContain(">x</div>");
  });
});
