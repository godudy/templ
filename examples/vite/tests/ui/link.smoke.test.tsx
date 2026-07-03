import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Link } from "../../../../ui/link/link";

describe("ui/link", () => {
  test("renders <a> and computes rel for external", () => {
    const html = renderToStaticMarkup(<Link href="https://x" external>go</Link>);
    expect(html).toContain('href="https://x"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });
});
