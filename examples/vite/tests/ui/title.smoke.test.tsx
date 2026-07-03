import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import type React from "react";
import { H1, H2, H3, H4, H5, H6, Title } from "../../../../ui/title/title";

describe("ui/title", () => {
  test("Title with explicit as={1} renders <h1>", () => {
    const html = renderToStaticMarkup(<Title as={1}>t</Title>);
    expect(html).toContain("<h1");
  });

  test("H1–H6 shortcuts produce matching heading tags", () => {
    const cases: Array<[React.ComponentType<{ children?: React.ReactNode }>, string]> = [
      [H1, "<h1"],
      [H2, "<h2"],
      [H3, "<h3"],
      [H4, "<h4"],
      [H5, "<h5"],
      [H6, "<h6"],
    ];
    for (const [Comp, expected] of cases) {
      expect(renderToStaticMarkup(<Comp>h</Comp>)).toContain(expected);
    }
  });
});
