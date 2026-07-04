import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../node_modules/react-dom/server";
import { Menu, MenuButton, MenuItem } from "../../../components/menu/menu";

describe("Menu ui8kit markup contract", () => {
  test("emits ui8kit menu hooks when behavior is ui8kit", () => {
    const markup = renderToStaticMarkup(
      <>
        <MenuButton id="trigger" menuId="menu" behavior="ui8kit" aria-label="Open actions menu">
          Actions
        </MenuButton>
        <Menu id="menu" behavior="ui8kit">
          <MenuItem>Edit</MenuItem>
          <MenuItem disabled>Delete</MenuItem>
        </Menu>
      </>
    );

    expect(markup).toContain('data-ui8kit="menubutton"');
    expect(markup).toContain('data-menubutton-target="menu"');
    expect(markup).toContain('data-ui8kit="menu"');
    expect(markup).toContain("data-menu-item");
    expect(markup).toContain('aria-haspopup="menu"');
    expect(markup).toContain('role="menu"');
    expect(markup).toContain('role="menuitem"');
  });

  test("closed menu renders hidden div root", () => {
    const markup = renderToStaticMarkup(
      <Menu id="menu" behavior="ui8kit">
        <MenuItem>Edit</MenuItem>
      </Menu>
    );

    expect(markup).toContain('data-state="closed"');
    expect(markup).toContain("hidden");
  });

  test("open menu renders without hidden", () => {
    const markup = renderToStaticMarkup(
      <Menu id="menu" open behavior="ui8kit">
        <MenuItem>Edit</MenuItem>
      </Menu>
    );

    expect(markup).toContain('data-state="open"');
    expect(markup).not.toContain("hidden");
  });

  test("does not emit ui8kit hooks by default", () => {
    const markup = renderToStaticMarkup(
      <Menu id="menu">
        <MenuItem>Edit</MenuItem>
      </Menu>
    );

    expect(markup).not.toContain("data-ui8kit");
  });
});
