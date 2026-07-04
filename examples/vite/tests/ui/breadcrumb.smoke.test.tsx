import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Breadcrumb } from "../../../../ui/breadcrumb/breadcrumb";

describe("ui/breadcrumb", () => {
  test("renders nav > ol > li structure with current marker", () => {
    const html = renderToStaticMarkup(
      <Breadcrumb
        aria-label="Breadcrumb"
        items={[
          { label: "Home", href: "/" },
          { label: "Docs", current: true },
        ]}
      />
    );
    expect(html).toContain("<nav");
    expect(html).toContain('aria-label="Breadcrumb"');
    expect(html).toContain("<ol");
    expect(html).toContain('href="/"');
    expect(html).toContain('aria-current="page"');
  });

  test("ui8kit behavior emits data-ui8kit=breadcrumb", () => {
    const html = renderToStaticMarkup(<Breadcrumb behavior="ui8kit" items={[{ label: "H" }]} />);
    expect(html).toContain('data-ui8kit="breadcrumb"');
  });
});
