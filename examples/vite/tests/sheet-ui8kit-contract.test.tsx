import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../node_modules/react-dom/server";
import {
  Sheet,
  SheetClose,
  SheetOverlay,
  SheetTrigger,
} from "../../../components/sheet/sheet";

describe("Sheet ui8kit markup contract", () => {
  test("emits ui8kit dialog hooks when behavior is ui8kit", () => {
    const markup = renderToStaticMarkup(
      <>
        <SheetTrigger id="trigger" panelId="panel" behavior="ui8kit" aria-label="Open">
          Open
        </SheetTrigger>
        <Sheet id="panel" behavior="ui8kit" aria-label="Panel">
          <SheetOverlay panelId="panel" behavior="ui8kit" />
          <SheetClose panelId="panel" behavior="ui8kit">
            Close
          </SheetClose>
        </Sheet>
      </>
    );

    expect(markup).toContain('data-ui8kit-dialog-open');
    expect(markup).toContain('data-ui8kit-dialog-close');
    expect(markup).toContain('data-ui8kit-dialog-target="panel"');
    expect(markup).toContain('data-ui8kit="sheet"');
    expect(markup).toContain('role="dialog"');
    expect(markup).toContain('aria-modal="true"');
    expect(markup).not.toContain("<dialog");
  });

  test("closed sheet renders hidden div root", () => {
    const markup = renderToStaticMarkup(
      <Sheet id="panel" behavior="ui8kit" aria-label="Panel">
        Panel
      </Sheet>
    );

    expect(markup).toContain('data-state="closed"');
    expect(markup).toContain("hidden");
    expect(markup).not.toContain("<dialog");
  });

  test("open sheet renders without hidden", () => {
    const markup = renderToStaticMarkup(
      <Sheet id="panel" open behavior="ui8kit" aria-label="Panel">
        Panel
      </Sheet>
    );

    expect(markup).toContain('data-state="open"');
    expect(markup).not.toContain("hidden");
  });
});
