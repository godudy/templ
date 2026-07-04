import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { IconBadge } from "../../../../ui/iconbadge/iconbadge";

describe("ui/iconbadge", () => {
  test("renders <span> with children", () => {
    const html = renderToStaticMarkup(
      <IconBadge size="sm" variant="accent">
        H
      </IconBadge>
    );
    expect(html).toMatch(/^<span /);
    expect(html).toContain(">H</span>");
  });
});
