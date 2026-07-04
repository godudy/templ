import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes } from "react";
import menuRecipeJson from "./menu.variants.json";
import { cn, composeRecipe, defineRecipe, type BehaviorMode, normalizeBehaviorMode } from "../../utils";
import { Button, type ButtonVariant, type ButtonSize } from "../../ui/button/button";

const { recipe: menuRecipe, keys: menuKeys } = defineRecipe(menuRecipeJson);

type MenuVariant = typeof menuKeys.variant;

export type MenuButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  id?: string;
  menuId?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  open?: boolean;
  behavior?: BehaviorMode;
  "aria-label"?: string;
  asChild?: boolean;
};

export type MenuProps = Omit<HTMLAttributes<HTMLDivElement>, "className" | "role"> & {
  variant?: MenuVariant;
  open?: boolean;
  className?: string;
  behavior?: BehaviorMode;
};

export type MenuItemProps = HTMLAttributes<HTMLDivElement> & {
  disabled?: boolean;
};

function menuState(open?: boolean): string {
  return open ? "open" : "closed";
}

function menuBehavior(value?: BehaviorMode): BehaviorMode {
  return normalizeBehaviorMode(value);
}

function menuButtonAttrs(
  menuId: string | undefined,
  open: boolean | undefined,
  behavior: BehaviorMode | undefined,
  rest: ButtonHTMLAttributes<HTMLButtonElement> | undefined
): Record<string, unknown> {
  const attrs: Record<string, unknown> = { ...(rest ?? {}) };
  if (menuId?.trim()) attrs["aria-controls"] = menuId.trim();
  attrs["aria-haspopup"] = "menu";
  attrs["aria-expanded"] = open ?? false;
  if (menuBehavior(behavior) === "ui8kit") {
    attrs["data-ui8kit"] = "menubutton";
    if (menuId?.trim()) attrs["data-menubutton-target"] = menuId.trim();
  }
  return attrs;
}

function menuRootAttrs(
  id: string | undefined,
  open: boolean,
  behavior: BehaviorMode | undefined,
  rest: HTMLAttributes<HTMLDivElement> | undefined
): Record<string, unknown> {
  const attrs: Record<string, unknown> = { ...(rest ?? {}) };
  if (id?.trim()) attrs.id = id.trim();
  attrs.role = "menu";
  attrs["data-state"] = menuState(open);
  if (menuBehavior(behavior) === "ui8kit") {
    attrs["data-ui8kit"] = "menu";
  }
  return attrs;
}

export const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(function MenuButton(
  {
    id,
    menuId,
    variant,
    size,
    open,
    behavior,
    "aria-label": ariaLabel,
    className,
    children,
    type,
    asChild,
    ...rest
  },
  ref
) {
  return (
    <Button
      ref={ref}
      id={id}
      type={type ?? "button"}
      variant={variant}
      size={size}
      className={className}
      aria-label={ariaLabel}
      asChild={asChild}
      {...menuButtonAttrs(menuId, open, behavior, rest)}
    >
      {children}
    </Button>
  );
});
MenuButton.displayName = "MenuButton";

export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(
  { id, variant, open = false, behavior, className, hidden, children, ...rest },
  ref
) {
  const isHidden = hidden ?? !open;
  return (
    <div
      ref={ref}
      className={composeRecipe(menuRecipe, { variant }, className)}
      hidden={isHidden ? true : undefined}
      {...menuRootAttrs(id, open, behavior, rest)}
    >
      {children}
    </div>
  );
});
Menu.displayName = "Menu";

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(function MenuItem(
  { disabled, className, id, children, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      id={id || undefined}
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled ? "true" : undefined}
      data-menu-item={true}
      className={cn(
        "cursor-pointer select-none rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
MenuItem.displayName = "MenuItem";
