import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Container } from "../../../../ui/container/container";

describe("ui/container", () => {
  test("renders as div by default", () => {
    const html = renderToStaticMarkup(<Container>x</Container>);
    expect(html).toMatch(/^<div /);
  });
});
