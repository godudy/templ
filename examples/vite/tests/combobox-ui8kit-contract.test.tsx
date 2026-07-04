import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../node_modules/react-dom/server";
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxToggle,
} from "../../../components/combobox/combobox";

describe("Combobox ui8kit markup contract", () => {
  test("emits ui8kit combobox hooks when behavior is ui8kit", () => {
    const markup = renderToStaticMarkup(
      <Combobox id="demo-combobox" behavior="ui8kit">
        <ComboboxInput id="demo-combobox-input" listId="demo-combobox-list" aria-label="Choose a fruit" />
        <ComboboxToggle inputId="demo-combobox-input" listId="demo-combobox-list" behavior="ui8kit" aria-label="Toggle">
          ▾
        </ComboboxToggle>
        <ComboboxList id="demo-combobox-list">
          <ComboboxOption value="apple" selected>
            Apple
          </ComboboxOption>
          <ComboboxOption value="banana">Banana</ComboboxOption>
        </ComboboxList>
      </Combobox>
    );

    expect(markup).toContain('data-ui8kit="combobox"');
    expect(markup).toContain("data-combobox-toggle");
    expect(markup).toContain('data-ui8kit-dialog-target="demo-combobox-input"');
    expect(markup).toContain('data-combobox-value="apple"');
    expect(markup).toContain('role="combobox"');
    expect(markup).toContain('role="listbox"');
    expect(markup).toContain('role="option"');
  });

  test("does not emit ui8kit hooks by default", () => {
    const markup = renderToStaticMarkup(
      <Combobox id="demo-combobox">
        <ComboboxInput aria-label="Choose a fruit" />
      </Combobox>
    );

    expect(markup).not.toContain("data-ui8kit");
  });

  test("closed list renders hidden", () => {
    const markup = renderToStaticMarkup(
      <ComboboxList id="demo-combobox-list">
        <ComboboxOption value="apple">Apple</ComboboxOption>
      </ComboboxList>
    );

    expect(markup).toContain("hidden");
  });

  test("open list renders without hidden", () => {
    const markup = renderToStaticMarkup(
      <ComboboxList id="demo-combobox-list" open>
        <ComboboxOption value="apple">Apple</ComboboxOption>
      </ComboboxList>
    );

    expect(markup).not.toContain("hidden");
  });
});
