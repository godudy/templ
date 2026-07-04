import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../node_modules/react-dom/server";
import { Toast, ToastClose, ToastDescription, ToastTitle } from "../../../components/toast/toast";

describe("Toast ui8kit markup contract", () => {
  test("emits ui8kit toast marker when behavior is ui8kit", () => {
    const markup = renderToStaticMarkup(
      <Toast id="demo-toast" behavior="ui8kit" open>
        <ToastTitle>Saved</ToastTitle>
        <ToastDescription>Your changes have been saved.</ToastDescription>
        <ToastClose panelId="demo-toast" behavior="ui8kit" aria-label="Dismiss">
          ×
        </ToastClose>
      </Toast>
    );

    expect(markup).toContain('data-ui8kit="toast"');
    expect(markup).toContain("data-ui8kit-dialog-close");
    expect(markup).toContain('data-ui8kit-dialog-target="demo-toast"');
    expect(markup).toContain('role="status"');
    expect(markup).toContain('aria-live="polite"');
    expect(markup).not.toContain("<dialog");
  });

  test("does not emit ui8kit hooks by default", () => {
    const markup = renderToStaticMarkup(
      <Toast id="demo-toast" open>
        Saved
      </Toast>
    );

    expect(markup).not.toContain("data-ui8kit");
  });

  test("closed toast renders hidden", () => {
    const markup = renderToStaticMarkup(<Toast id="demo-toast">Saved</Toast>);

    expect(markup).toContain('data-state="closed"');
    expect(markup).toContain("hidden");
  });

  test("open toast renders without hidden", () => {
    const markup = renderToStaticMarkup(
      <Toast id="demo-toast" open>
        Saved
      </Toast>
    );

    expect(markup).toContain('data-state="open"');
    expect(markup).not.toContain("hidden");
  });

  test("role alert renders assertive live region", () => {
    const markup = renderToStaticMarkup(
      <Toast id="demo-toast" role="alert" aria-live="assertive" open>
        Error occurred
      </Toast>
    );

    expect(markup).toContain('role="alert"');
    expect(markup).toContain('aria-live="assertive"');
  });
});
