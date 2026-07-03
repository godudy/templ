import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../../node_modules/react-dom/server";
import { Table, TableBody, TableCaption, TableCell, TableCol, TableColGroup, TableFoot, TableHead, TableHeadCell, TableRow } from "../../../../ui/table/table";

describe("ui/table", () => {
  test("full table skeleton renders", () => {
    const html = renderToStaticMarkup(
      <Table>
        <TableCaption>cap</TableCaption>
        <TableColGroup span={1}>
          <TableCol span={1} />
        </TableColGroup>
        <TableHead>
          <TableRow>
            <TableHeadCell scope="col">H</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>C</TableCell>
          </TableRow>
        </TableBody>
        <TableFoot>
          <TableRow>
            <TableCell>F</TableCell>
          </TableRow>
        </TableFoot>
      </Table>
    );
    for (const tag of [
      "<table",
      "<caption",
      "<colgroup",
      "<col",
      "<thead",
      "<tbody",
      "<tfoot",
      "<tr",
      "<th",
      "<td",
    ]) {
      expect(html).toContain(tag);
    }
    expect(html).toContain('scope="col"');
  });
});
