import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Textarea } from "../../../../ui/textarea/textarea";

describe("ui/textarea", () => {
  test("renders <textarea>", () => {
    const html = renderToStaticMarkup(<Textarea rows={3} />);
    expect(html).toContain("<textarea");
    expect(html).toContain('rows="3"');
  });
});
