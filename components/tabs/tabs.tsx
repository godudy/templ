import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import tabsRecipeJson from "./tabs.variants.json";
import { composeRecipe, cn, defineRecipe, type BehaviorMode, normalizeBehaviorMode } from "../../utils";

const { recipe: tabsRecipe, keys: tabsKeys } = defineRecipe(tabsRecipeJson);

type TabsVariant = typeof tabsKeys.variant;

export type TabsProps = Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
  variant?: TabsVariant;
  /** Initial active tab value only. With behavior="ui8kit", @ui8kit/aria owns switching. */
  value?: string;
  className?: string;
  behavior?: BehaviorMode;
};

export type TabsListProps = HTMLAttributes<HTMLDivElement> & {
  "aria-label"?: string;
};

export type TabsTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  value?: string;
  panelId?: string;
  active?: boolean;
};

export type TabsPanelProps = HTMLAttributes<HTMLDivElement> & {
  value?: string;
  labelledBy?: string;
  active?: boolean;
};

function tabsBehavior(value?: BehaviorMode): BehaviorMode {
  return normalizeBehaviorMode(value);
}

function tabsRootAttrs(
  value: string | undefined,
  behavior: BehaviorMode | undefined
): Record<string, unknown> {
  const attrs: Record<string, unknown> = {};
  if (tabsBehavior(behavior) === "ui8kit") {
    attrs["data-ui8kit"] = "tabs";
    if (value?.trim()) attrs["data-tabs-value"] = value.trim();
  }
  return attrs;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { variant, value, behavior, className, children, id, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      id={id || undefined}
      className={composeRecipe(tabsRecipe, { variant }, className)}
      {...tabsRootAttrs(value, behavior)}
      {...rest}
    >
      {children}
    </div>
  );
});
Tabs.displayName = "Tabs";

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, children, "aria-label": ariaLabel, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={ariaLabel?.trim() || undefined}
      className={cn("inline-flex items-center gap-1 rounded-md bg-muted p-1", className)}
      {...rest}
    >
      {children}
    </div>
  );
});
TabsList.displayName = "TabsList";

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger(
    { value, panelId, active, className, type, disabled, id, children, ...rest },
    ref
  ) {
    return (
      <button
        ref={ref}
        id={id || undefined}
        type={type ?? "button"}
        role="tab"
        disabled={disabled}
        aria-selected={active ? "true" : "false"}
        aria-controls={panelId?.trim() || undefined}
        tabIndex={disabled ? -1 : active ? 0 : -1}
        data-tabs-trigger={value?.trim() ? true : undefined}
        data-tabs-value={value?.trim() || undefined}
        className={cn(
          "inline-flex items-center rounded-sm px-3 py-1.5 text-sm font-medium transition-colors aria-selected:bg-background aria-selected:shadow-sm disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

export const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(function TabsPanel(
  { value, labelledBy, active, className, id, hidden, children, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      id={id || undefined}
      role="tabpanel"
      aria-labelledby={labelledBy?.trim() || undefined}
      hidden={hidden ?? !active}
      data-tabs-panel={value?.trim() ? true : undefined}
      data-tabs-value={value?.trim() || undefined}
      className={cn("mt-2", className)}
      {...rest}
    >
      {children}
    </div>
  );
});
TabsPanel.displayName = "TabsPanel";
