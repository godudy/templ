import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../node_modules/react-dom/server";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/popover/popover";

describe("Popover ui8kit markup contract", () => {
  test("emits ui8kit popover hooks when behavior is ui8kit", () => {
    const markup = renderToStaticMarkup(
      <>
        <PopoverTrigger id="trigger" panelId="panel" behavior="ui8kit" aria-label="Open">
          Open
        </PopoverTrigger>
        <Popover id="panel" behavior="ui8kit" aria-label="Panel">
          <PopoverContent>Details</PopoverContent>
        </Popover>
      </>
    );

    expect(markup).toContain("data-ui8kit-dialog-open");
    expect(markup).toContain('data-ui8kit-dialog-target="panel"');
    expect(markup).toContain('data-ui8kit="popover"');
    expect(markup).toContain('role="dialog"');
    expect(markup).not.toContain('aria-modal');
    expect(markup).not.toContain("<dialog");
  });

  test("closed popover renders hidden div root", () => {
    const markup = renderToStaticMarkup(
      <Popover id="panel" behavior="ui8kit" aria-label="Panel">
        Panel
      </Popover>
    );

    expect(markup).toContain('data-state="closed"');
    expect(markup).toContain("hidden");
    expect(markup).not.toContain("<dialog");
  });

  test("open popover renders without hidden", () => {
    const markup = renderToStaticMarkup(
      <Popover id="panel" open behavior="ui8kit" aria-label="Panel">
        Panel
      </Popover>
    );

    expect(markup).toContain('data-state="open"');
    expect(markup).not.toContain("hidden");
  });

  test("does not emit ui8kit hooks by default", () => {
    const markup = renderToStaticMarkup(
      <Popover id="panel" aria-label="Panel">
        Panel
      </Popover>
    );

    expect(markup).not.toContain("data-ui8kit");
  });
});
