/**
 * Smoke coverage for every components/* composite.
 *
 * Each composite spec declares `targets.react.test:` pointing here (except
 * `components/sheet/sheet.spec.md`, which owns its own contract test at
 * `examples/vite/tests/sheet-ui8kit-contract.test.tsx`).
 */
import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../node_modules/react-dom/server";

import { Nav, NavItem, NavLink, NavList } from "../../../components/nav/nav";

describe("components/nav", () => {
  test("Nav + NavList + NavItem + NavLink render with aria-current for active", () => {
    const html = renderToStaticMarkup(
      <Nav aria-label="Primary">
        <NavList orientation="horizontal">
          <NavItem>
            <NavLink href="/" active>
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/about">About</NavLink>
          </NavItem>
        </NavList>
      </Nav>
    );
    expect(html).toContain("<nav");
    expect(html).toContain('aria-label="Primary"');
    expect(html).toContain("<ul");
    expect(html).toContain("<li");
    expect(html).toContain('href="/"');
    expect(html).toContain('aria-current="page"');
  });

  test("disabled NavLink degrades to <span>", () => {
    const html = renderToStaticMarkup(
      <Nav>
        <NavList>
          <NavItem>
            <NavLink href="/x" disabled>
              X
            </NavLink>
          </NavItem>
        </NavList>
      </Nav>
    );
    expect(html).toContain("<span");
    expect(html).toContain('aria-disabled="true"');
  });
});
