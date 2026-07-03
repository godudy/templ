import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Dialog } from "../../../../ui/dialog/dialog";

describe("ui/dialog", () => {
  test("renders <dialog>", () => {
    const html = renderToStaticMarkup(<Dialog>ok</Dialog>);
    expect(html).toContain("<dialog");
  });

  test("ui8kit behavior emits data-ui8kit=dialog", () => {
    const html = renderToStaticMarkup(<Dialog behavior="ui8kit">ok</Dialog>);
    expect(html).toContain('data-ui8kit="dialog"');
  });
});
