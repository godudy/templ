import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../node_modules/react-dom/server";
import { Tabs, TabsList, TabsPanel, TabsTrigger } from "../../../components/tabs/tabs";

describe("Tabs ui8kit markup contract", () => {
  test("emits ui8kit tabs hooks when behavior is ui8kit", () => {
    const markup = renderToStaticMarkup(
      <Tabs id="demo-tabs" behavior="ui8kit" value="account">
        <TabsList aria-label="Settings">
          <TabsTrigger value="account" panelId="panel-account" active>
            Account
          </TabsTrigger>
          <TabsTrigger value="billing" panelId="panel-billing">
            Billing
          </TabsTrigger>
        </TabsList>
        <TabsPanel id="panel-account" value="account" active>
          Account settings
        </TabsPanel>
        <TabsPanel id="panel-billing" value="billing">
          Billing settings
        </TabsPanel>
      </Tabs>
    );

    expect(markup).toContain('data-ui8kit="tabs"');
    expect(markup).toContain('data-tabs-value="account"');
    expect(markup).toContain('data-tabs-trigger="true"');
    expect(markup).toContain('data-tabs-panel="true"');
    expect(markup).toContain('role="tablist"');
    expect(markup).toContain('role="tab"');
    expect(markup).toContain('role="tabpanel"');
  });

  test("does not emit ui8kit hooks by default", () => {
    const markup = renderToStaticMarkup(
      <Tabs id="demo-tabs" value="account">
        <TabsTrigger value="account" active>
          Account
        </TabsTrigger>
      </Tabs>
    );

    expect(markup).not.toContain("data-ui8kit");
  });

  test("inactive panel renders hidden", () => {
    const markup = renderToStaticMarkup(
      <TabsPanel id="panel-billing" value="billing">
        Billing settings
      </TabsPanel>
    );

    expect(markup).toContain("hidden");
  });

  test("active panel renders without hidden", () => {
    const markup = renderToStaticMarkup(
      <TabsPanel id="panel-account" value="account" active>
        Account settings
      </TabsPanel>
    );

    expect(markup).not.toContain("hidden");
  });
});
