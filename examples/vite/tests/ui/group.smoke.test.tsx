import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Group } from "../../../../ui/group/group";

describe("ui/group", () => {
  test("horizontal flex base", () => {
    const html = renderToStaticMarkup(<Group>x</Group>);
    expect(html).toContain("flex");
  });
});
