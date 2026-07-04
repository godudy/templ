import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../ui/card/card";

describe("ui/card", () => {
  test("named parts compose", () => {
    const html = renderToStaticMarkup(
      <Card variant="default">
        <CardHeader>
          <CardTitle as={2}>Hello</CardTitle>
          <CardDescription>d</CardDescription>
        </CardHeader>
        <CardContent>c</CardContent>
        <CardFooter>f</CardFooter>
      </Card>
    );
    expect(html).toContain("<h2");
    expect(html).toContain(">Hello</h2>");
    expect(html).toContain(">d</p>");
    expect(html).toContain(">c</div>");
  });

  test("asChild delegates root", () => {
    const html = renderToStaticMarkup(
      <Card asChild variant="default">
        <article>a</article>
      </Card>
    );
    expect(html).toMatch(/^<article /);
  });
});
