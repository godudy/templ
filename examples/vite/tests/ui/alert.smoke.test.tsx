import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Alert } from "../../../../ui/alert/alert";

describe("ui/alert", () => {
  test("renders div with role=status + polite aria-live by default", () => {
    const html = renderToStaticMarkup(<Alert>note</Alert>);
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
  });

  test("destructive variant + role=alert + assertive works together", () => {
    const html = renderToStaticMarkup(
      <Alert variant="destructive" role="alert" aria-live="assertive">
        err
      </Alert>
    );
    expect(html).toContain('role="alert"');
    expect(html).toContain('aria-live="assertive"');
  });
});
