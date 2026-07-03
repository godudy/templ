import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Button } from "../../../../ui/button/button";

describe("ui/button", () => {
  test("renders <button> with default type", () => {
    const html = renderToStaticMarkup(<Button>Save</Button>);
    expect(html).toContain("<button");
    expect(html).toContain('type="button"');
    expect(html).toContain(">Save</button>");
  });

  test("asChild delegates root to child", () => {
    const html = renderToStaticMarkup(
      <Button asChild variant="outline">
        <a href="/docs">Docs</a>
      </Button>
    );
    expect(html).toMatch(/^<a /);
    expect(html).toContain('href="/docs"');
    expect(html).toContain(">Docs</a>");
  });
});
