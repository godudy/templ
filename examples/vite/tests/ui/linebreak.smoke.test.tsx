import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Break } from "../../../../ui/linebreak/linebreak";

describe("ui/linebreak", () => {
  test("renders <br> by default and <wbr> when type=wbr", () => {
    expect(renderToStaticMarkup(<Break />)).toContain("<br");
    expect(renderToStaticMarkup(<Break type="wbr" />)).toContain("<wbr");
  });
});
