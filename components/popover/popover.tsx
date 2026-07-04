import {
  forwardRef,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import popoverRecipeJson from "./popover.variants.json";
import {
  cn,
  composeRecipe,
  defineRecipe,
  isDevEnv,
  type BehaviorMode,
  normalizeBehaviorMode,
} from "../../utils";
import { Button, type ButtonVariant, type ButtonSize } from "../../ui/button/button";

const { recipe: popoverRecipe, keys: popoverKeys } = defineRecipe(popoverRecipeJson);

type PopoverVariant = typeof popoverKeys.variant;

export type PopoverProps = Omit<HTMLAttributes<HTMLDivElement>, "className" | "role"> & {
  variant?: PopoverVariant;
  /**
   * Initial open state only. When `behavior="ui8kit"`, runtime toggling is owned
   * by `@ui8kit/aria`; React must not rebind this to changing state.
   */
  open?: boolean;
  className?: string;
  "aria-labelledby"?: string;
  behavior?: BehaviorMode;
};

export type PopoverTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
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

export type PopoverContentProps = HTMLAttributes<HTMLDivElement>;

function popoverState(open?: boolean): string {
  return open ? "open" : "closed";
}

function popoverBehavior(value?: BehaviorMode): BehaviorMode {
  return normalizeBehaviorMode(value);
}

/**
 * Freeze `open` to first commit when ui8kit owns runtime attribute toggling.
 * Mirrors Sheet's `useFrozenOpen` — see that file for the full rationale.
 */
function useFrozenOpen(open: boolean | undefined, behavior: BehaviorMode | undefined): boolean {
  const initialOpenRef = useRef(open ?? false);
  const warnedRef = useRef(false);
  const isUi8kit = popoverBehavior(behavior) === "ui8kit";

  if (
    isDevEnv() &&
    isUi8kit &&
    !warnedRef.current &&
    (open ?? false) !== initialOpenRef.current
  ) {
    warnedRef.current = true;
    // eslint-disable-next-line no-console
    console.warn(
      "[Popover] `open` changed after mount with behavior=\"ui8kit\" — ignored. " +
        "`@ui8kit/aria` owns runtime visibility. Pass `open` only as initial SSR state."
    );
  }

  if (isUi8kit) return initialOpenRef.current;
  return open ?? false;
}

function popoverRootAttrs(
  id: string | undefined,
  open: boolean,
  ariaLabel: string | undefined,
  ariaLabelledBy: string | undefined,
  behavior: BehaviorMode | undefined,
  rest: HTMLAttributes<HTMLDivElement> | undefined
): Record<string, unknown> {
  const attrs: Record<string, unknown> = { ...(rest ?? {}) };
  if (id?.trim()) attrs.id = id.trim();
  attrs.role = "dialog";
  attrs["data-state"] = popoverState(open);
  if (ariaLabel?.trim()) attrs["aria-label"] = ariaLabel.trim();
  if (ariaLabelledBy?.trim()) attrs["aria-labelledby"] = ariaLabelledBy.trim();
  if (popoverBehavior(behavior) === "ui8kit") {
    attrs["data-ui8kit"] = "popover";
    attrs["data-ui8kit-dialog"] = true;
  }
  return attrs;
}

function popoverTriggerAttrs(
  panelId: string | undefined,
  open: boolean | undefined,
  behavior: BehaviorMode | undefined,
  rest: ButtonHTMLAttributes<HTMLButtonElement> | undefined
): Record<string, unknown> {
  const attrs: Record<string, unknown> = { ...(rest ?? {}) };
  if (panelId?.trim()) attrs["aria-controls"] = panelId.trim();
  attrs["aria-haspopup"] = "dialog";
  attrs["aria-expanded"] = open ?? false;
  if (popoverBehavior(behavior) === "ui8kit" && panelId?.trim()) {
    attrs["data-ui8kit-dialog-open"] = true;
    attrs["data-ui8kit-dialog-target"] = panelId.trim();
  }
  return attrs;
}

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  {
    id,
    variant,
    open = false,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
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
      className={composeRecipe(popoverRecipe, { variant }, className)}
      hidden={isHidden ? true : undefined}
      {...popoverRootAttrs(id, resolvedOpen, ariaLabel, ariaLabelledBy, behavior, rest)}
    >
      {children}
    </div>
  );
});
Popover.displayName = "Popover";

export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  function PopoverTrigger(
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
        {...popoverTriggerAttrs(panelId, resolvedOpen, behavior, rest)}
      >
        {children}
      </Button>
    );
  }
);
PopoverTrigger.displayName = "PopoverTrigger";

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent({ id, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        id={id || undefined}
        className={cn("flex flex-col gap-1 p-4", className)}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
PopoverContent.displayName = "PopoverContent";
