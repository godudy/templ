import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Image, Picture, Source } from "../../../../ui/image/image";

describe("ui/image", () => {
  test("renders <img> with default loading/decoding", () => {
    const html = renderToStaticMarkup(<Image src="/logo.png" alt="logo" />);
    expect(html).toContain("<img");
    expect(html).toContain('src="/logo.png"');
    expect(html).toContain('loading="lazy"');
  });

  test("Picture + Source render", () => {
    const html = renderToStaticMarkup(
      <Picture>
        <Source srcSet="a.webp" type="image/webp" />
      </Picture>
    );
    expect(html).toContain("<picture");
    expect(html).toContain("<source");
  });
});
