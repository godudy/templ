import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { List, ListItem } from "../../../../ui/list/list";

describe("ui/list", () => {
  test("List defaults to <ul>, ListItem to <li>", () => {
    const html = renderToStaticMarkup(
      <List>
        <ListItem>a</ListItem>
      </List>
    );
    expect(html).toContain("<ul");
    expect(html).toContain("<li");
  });
});
