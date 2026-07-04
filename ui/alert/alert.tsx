import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import alertRecipeJson from "./alert.variants.json";
import { composeRecipe, defineRecipe } from "../../utils";
import { Slot } from "../slot/slot";

const { recipe: alertRecipe, keys: alertKeys } = defineRecipe(alertRecipeJson);

type AlertVariant = typeof alertKeys.variant;

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
  variant?: AlertVariant;
  role?: "status" | "alert";
  "aria-live"?: "off" | "polite" | "assertive";
  className?: string;
  children?: ReactNode;
  asChild?: boolean;
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant, role, "aria-live": ariaLive, className, children, asChild, ...rest },
  ref
) {
  const resolvedLive: AlertProps["aria-live"] = ariaLive ?? "polite";
  const resolvedRole: "status" | "alert" = role ?? "status";
  const cls = composeRecipe(alertRecipe, { variant }, className);
  if (asChild) {
    return (
      <Slot
        ref={ref}
        className={cls}
        role={resolvedRole}
        aria-live={resolvedLive}
        {...rest}
      >
        {children}
      </Slot>
    );
  }
  return (
    <div
      ref={ref}
      className={cls}
      role={resolvedRole}
      aria-live={resolvedLive}
      {...rest}
    >
      {children}
    </div>
  );
});
Alert.displayName = "Alert";
