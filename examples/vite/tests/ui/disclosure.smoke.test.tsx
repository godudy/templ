import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Disclosure, Summary } from "../../../../ui/disclosure/disclosure";

describe("ui/disclosure", () => {
  test("renders <details>/<summary>", () => {
    const html = renderToStaticMarkup(
      <Disclosure>
        <Summary>Toggle</Summary>
        <p>body</p>
      </Disclosure>
    );
    expect(html).toContain("<details");
    expect(html).toContain("<summary");
  });
});
