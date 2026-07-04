import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import toastRecipeJson from "./toast.variants.json";
import { cn, composeRecipe, defineRecipe, type BehaviorMode, normalizeBehaviorMode } from "../../utils";
import { Button, type ButtonVariant, type ButtonSize } from "../../ui/button/button";

const { recipe: toastRecipe, keys: toastKeys } = defineRecipe(toastRecipeJson);

type ToastVariant = typeof toastKeys.variant;

export type ToastProps = Omit<HTMLAttributes<HTMLDivElement>, "className" | "role"> & {
  variant?: ToastVariant;
  role?: "status" | "alert";
  "aria-live"?: "off" | "polite" | "assertive";
  open?: boolean;
  className?: string;
  behavior?: BehaviorMode;
};

export type ToastTitleProps = HTMLAttributes<HTMLDivElement>;
export type ToastDescriptionProps = HTMLAttributes<HTMLDivElement>;

export type ToastCloseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  panelId?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  behavior?: BehaviorMode;
  "aria-label"?: string;
  asChild?: boolean;
};

function toastState(open?: boolean): string {
  return open ? "open" : "closed";
}

function toastBehavior(value?: BehaviorMode): BehaviorMode {
  return normalizeBehaviorMode(value);
}

function toastCloseAttrs(
  panelId: string | undefined,
  behavior: BehaviorMode | undefined,
  rest: HTMLAttributes<HTMLElement> | undefined
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...(rest ?? {}) };
  if (toastBehavior(behavior) === "ui8kit") {
    out["data-ui8kit-dialog-close"] = true;
    if (panelId?.trim()) out["data-ui8kit-dialog-target"] = panelId.trim();
  }
  return out;
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  {
    id,
    variant,
    role,
    "aria-live": ariaLive,
    open = false,
    behavior,
    className,
    hidden,
    children,
    ...rest
  },
  ref
) {
  const resolvedLive: ToastProps["aria-live"] = ariaLive ?? "polite";
  const resolvedRole: "status" | "alert" = role ?? "status";
  const isHidden = hidden ?? !open;

  const attrs: Record<string, unknown> = { ...rest };
  if (toastBehavior(behavior) === "ui8kit") {
    attrs["data-ui8kit"] = "toast";
  }

  return (
    <div
      ref={ref}
      id={id || undefined}
      className={composeRecipe(toastRecipe, { variant }, className)}
      role={resolvedRole}
      aria-live={resolvedLive}
      data-state={toastState(open)}
      hidden={isHidden ? true : undefined}
      {...attrs}
    >
      {children}
    </div>
  );
});
Toast.displayName = "Toast";

export const ToastTitle = forwardRef<HTMLDivElement, ToastTitleProps>(function ToastTitle(
  { id, className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} id={id || undefined} className={cn("text-sm font-semibold", className)} {...rest}>
      {children}
    </div>
  );
});
ToastTitle.displayName = "ToastTitle";

export const ToastDescription = forwardRef<HTMLDivElement, ToastDescriptionProps>(
  function ToastDescription({ id, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        id={id || undefined}
        className={cn("text-sm text-muted-foreground", className)}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
ToastDescription.displayName = "ToastDescription";

export const ToastClose = forwardRef<HTMLButtonElement, ToastCloseProps>(function ToastClose(
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
      {...toastCloseAttrs(panelId, behavior, rest)}
    >
      {children}
    </Button>
  );
});
ToastClose.displayName = "ToastClose";
