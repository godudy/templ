import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Text } from "../../../../ui/text/text";

describe("ui/text", () => {
  test("renders <p>", () => {
    const html = renderToStaticMarkup(<Text>x</Text>);
    expect(html).toContain("<p");
    expect(html).toContain(">x</p>");
  });
});
