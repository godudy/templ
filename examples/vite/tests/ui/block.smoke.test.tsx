import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Block } from "../../../../ui/block/block";

describe("ui/block", () => {
  test("defaults to <div>", () => {
    const html = renderToStaticMarkup(<Block>ok</Block>);
    expect(html).toMatch(/^<div /);
  });

  test("emits landmark tags", () => {
    for (const tag of ["main", "header", "aside", "section", "nav", "footer", "article"]) {
      const html = renderToStaticMarkup(<Block tag={tag}>x</Block>);
      expect(html).toMatch(new RegExp(`^<${tag}\\b`));
    }
  });
});
