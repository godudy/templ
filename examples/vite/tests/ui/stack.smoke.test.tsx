import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Stack } from "../../../../ui/stack/stack";

describe("ui/stack", () => {
  test("vertical flex base", () => {
    const html = renderToStaticMarkup(<Stack>x</Stack>);
    expect(html).toContain("flex-col");
  });
});
