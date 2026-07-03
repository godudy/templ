import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Box } from "../../../../ui/box/box";

describe("ui/box", () => {
  test("defaults to <div> and rejects landmark tags", () => {
    const html = renderToStaticMarkup(<Box>x</Box>);
    expect(html).toMatch(/^<div /);
  });
});
