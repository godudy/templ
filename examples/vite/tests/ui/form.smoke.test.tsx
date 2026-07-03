import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Form, FormItem, FormDescription, FormMessage } from "../../../../ui/form/form";

describe("ui/form", () => {
  test("Form parts render", () => {
    const html = renderToStaticMarkup(
      <Form>
        <FormItem>
          <FormDescription>hint</FormDescription>
          <FormMessage>err</FormMessage>
        </FormItem>
      </Form>
    );
    expect(html).toContain("<form");
    expect(html).toContain('role="alert"');
  });
});
