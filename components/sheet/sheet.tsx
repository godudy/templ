import {
  forwardRef,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import sheetRecipeJson from "./sheet.variants.json";
import {
  cn,
  composeRecipe,
  defineRecipe,
  isDevEnv,
  type BehaviorMode,
  normalizeBehaviorMode,
} from "../../utils";
import { Button, type ButtonVariant, type ButtonSize } from "../../ui/button/button";

const { recipe: sheetRecipe, keys: sheetKeys } = defineRecipe(sheetRecipeJson);

type SheetVariant = typeof sheetKeys.variant;
type SheetSide = typeof sheetKeys.side;
type SheetSize = typeof sheetKeys.size;

export type SheetProps = Omit<HTMLAttributes<HTMLDivElement>, "className" | "role"> & {
  variant?: SheetVariant;
  side?: SheetSide;
  size?: SheetSize;
  /**
   * Initial open state only. When `behavior="ui8kit"`, runtime toggling is owned
   * by `@ui8kit/aria`; React must not rebind this to changing state.
   */
  open?: boolean;
  className?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  behavior?: BehaviorMode;
};

export type SheetTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  id?: string;
  panelId?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * Initial expanded state only. When `behavior="ui8kit"`, `@ui8kit/aria` owns
   * `aria-expanded` after the first commit; do not bind to React state.
   */
  open?: boolean;
  behavior?: BehaviorMode;
  "aria-label"?: string;
  asChild?: boolean;
};

export type SheetOverlayProps = HTMLAttributes<HTMLDivElement> & {
  panelId?: string;
  /**
   * Initial visibility only. When `behavior="ui8kit"`, `@ui8kit/aria` owns
   * `hidden` after the first commit; do not bind to React state.
   */
  open?: boolean;
  behavior?: BehaviorMode;
};

export type SheetContentProps = HTMLAttributes<HTMLDivElement>;
export type SheetHeaderProps = HTMLAttributes<HTMLDivElement>;
export type SheetTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type SheetDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export type SheetCloseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  panelId?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  behavior?: BehaviorMode;
  "aria-label"?: string;
  asChild?: boolean;
};

function sheetState(open?: boolean): string {
  return open ? "open" : "closed";
}

function sheetBehavior(value?: BehaviorMode): BehaviorMode {
  return normalizeBehaviorMode(value);
}

/**
 * Freeze `open` to first commit when ui8kit owns runtime attribute toggling.
 * In dev, log once if a parent re-renders with a different `open` value while
 * `behavior="ui8kit"` is active — the new value is discarded and `@ui8kit/aria`
 * keeps owning visibility.
 */
function useFrozenOpen(open: boolean | undefined, behavior: BehaviorMode | undefined): boolean {
  const initialOpenRef = useRef(open ?? false);
  const warnedRef = useRef(false);
  const isUi8kit = sheetBehavior(behavior) === "ui8kit";

  if (
    isDevEnv() &&
    isUi8kit &&
    !warnedRef.current &&
    (open ?? false) !== initialOpenRef.current
  ) {
    warnedRef.current = true;
    // eslint-disable-next-line no-console
    console.warn(
      "[Sheet] `open` changed after mount with behavior=\"ui8kit\" — ignored. " +
        "`@ui8kit/aria` owns runtime visibility. Pass `open` only as initial SSR state."
    );
  }

  if (isUi8kit) return initialOpenRef.current;
  return open ?? false;
}

function sheetRootAttrs(
  id: string | undefined,
  open: boolean,
  ariaLabel: string | undefined,
  ariaLabelledBy: string | undefined,
  ariaDescribedBy: string | undefined,
  behavior: BehaviorMode | undefined,
  rest: HTMLAttributes<HTMLDivElement> | undefined
): Record<string, unknown> {
  const attrs: Record<string, unknown> = { ...(rest ?? {}) };
  if (id?.trim()) attrs.id = id.trim();
  attrs.role = "dialog";
  attrs["aria-modal"] = true;
  attrs["data-state"] = sheetState(open);
  if (ariaLabel?.trim()) attrs["aria-label"] = ariaLabel.trim();
  if (ariaLabelledBy?.trim()) attrs["aria-labelledby"] = ariaLabelledBy.trim();
  if (ariaDescribedBy?.trim()) attrs["aria-describedby"] = ariaDescribedBy.trim();
  if (sheetBehavior(behavior) === "ui8kit") {
    attrs["data-ui8kit"] = "sheet";
    attrs["data-ui8kit-dialog"] = true;
  }
  return attrs;
}

function sheetTriggerAttrs(
  panelId: string | undefined,
  open: boolean | undefined,
  behavior: BehaviorMode | undefined,
  rest: ButtonHTMLAttributes<HTMLButtonElement> | undefined
): Record<string, unknown> {
  const attrs: Record<string, unknown> = { ...(rest ?? {}) };
  if (panelId?.trim()) attrs["aria-controls"] = panelId.trim();
  attrs["aria-haspopup"] = "dialog";
  attrs["aria-expanded"] = open ?? false;
  if (sheetBehavior(behavior) === "ui8kit" && panelId?.trim()) {
    attrs["data-ui8kit-dialog-open"] = true;
    attrs["data-ui8kit-dialog-target"] = panelId.trim();
  }
  return attrs;
}

function sheetCloseAttrs(
  panelId: string | undefined,
  behavior: BehaviorMode | undefined,
  rest: HTMLAttributes<HTMLElement> | undefined
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...(rest ?? {}) };
  if (sheetBehavior(behavior) === "ui8kit") {
    out["data-ui8kit-dialog-close"] = true;
    if (panelId?.trim()) out["data-ui8kit-dialog-target"] = panelId.trim();
  }
  return out;
}

export const Sheet = forwardRef<HTMLDivElement, SheetProps>(function Sheet(
  {
    id,
    variant,
    side,
    size,
    open = false,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    behavior,
    className,
    hidden,
    children,
    ...rest
  },
  ref
) {
  const resolvedOpen = useFrozenOpen(open, behavior);
  const isHidden = hidden ?? !resolvedOpen;

  return (
    <div
      ref={ref}
      className={composeRecipe(
        sheetRecipe,
        { side, size, variant },
        className
      )}
      hidden={isHidden ? true : undefined}
      {...sheetRootAttrs(
        id,
        resolvedOpen,
        ariaLabel,
        ariaLabelledBy,
        ariaDescribedBy,
        behavior,
        rest
      )}
    >
      {children}
    </div>
  );
});
Sheet.displayName = "Sheet";

export const SheetTrigger = forwardRef<HTMLButtonElement, SheetTriggerProps>(
  function SheetTrigger(
    {
      id,
      panelId,
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
    const resolvedOpen = useFrozenOpen(open, behavior);
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
        {...sheetTriggerAttrs(panelId, resolvedOpen, behavior, rest)}
      >
        {children}
      </Button>
    );
  }
);
SheetTrigger.displayName = "SheetTrigger";

export const SheetOverlay = forwardRef<HTMLDivElement, SheetOverlayProps>(function SheetOverlay(
  { panelId, open = false, behavior, className, hidden, ...rest },
  ref
) {
  const resolvedOpen = useFrozenOpen(open, behavior);
  const isHidden = hidden ?? !resolvedOpen;

  return (
    <div
      ref={ref}
      className={cn("fixed inset-0 z-40 bg-background/80", className)}
      hidden={isHidden ? true : undefined}
      {...sheetCloseAttrs(panelId, behavior, rest)}
    />
  );
});
SheetOverlay.displayName = "SheetOverlay";

export const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>(function SheetContent(
  { id, className, children, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      id={id || undefined}
      className={cn("relative z-50 flex h-full flex-col overflow-y-auto p-4", className)}
      {...rest}
    >
      {children}
    </div>
  );
});
SheetContent.displayName = "SheetContent";

export const SheetHeader = forwardRef<HTMLDivElement, SheetHeaderProps>(function SheetHeader(
  { className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cn("flex items-start justify-between gap-4", className)} {...rest}>
      {children}
    </div>
  );
});
SheetHeader.displayName = "SheetHeader";

export const SheetTitle = forwardRef<HTMLHeadingElement, SheetTitleProps>(function SheetTitle(
  { id, className, children, ...rest },
  ref
) {
  return (
    <h2 ref={ref} id={id || undefined} className={cn("text-sm font-semibold", className)} {...rest}>
      {children}
    </h2>
  );
});
SheetTitle.displayName = "SheetTitle";

export const SheetDescription = forwardRef<HTMLParagraphElement, SheetDescriptionProps>(
  function SheetDescription({ id, className, children, ...rest }, ref) {
    return (
      <p
        ref={ref}
        id={id || undefined}
        className={cn("text-sm text-muted-foreground", className)}
        {...rest}
      >
        {children}
      </p>
    );
  }
);
SheetDescription.displayName = "SheetDescription";

export const SheetClose = forwardRef<HTMLButtonElement, SheetCloseProps>(function SheetClose(
  {
    panelId,
    variant,
    size,
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
      type={type ?? "button"}
      variant={variant}
      size={size}
      className={className}
      aria-label={ariaLabel}
      asChild={asChild}
      {...sheetCloseAttrs(panelId, behavior, rest)}
    >
      {children}
    </Button>
  );
});
SheetClose.displayName = "SheetClose";
