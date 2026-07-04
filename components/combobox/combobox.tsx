import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LiHTMLAttributes,
} from "react";
import comboboxRecipeJson from "./combobox.variants.json";
import { cn, composeRecipe, defineRecipe, type BehaviorMode, normalizeBehaviorMode } from "../../utils";

const { recipe: comboboxRecipe, keys: comboboxKeys } = defineRecipe(comboboxRecipeJson);

type ComboboxVariant = typeof comboboxKeys.variant;

export type ComboboxProps = Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
  variant?: ComboboxVariant;
  /** Initial open state only. With behavior="ui8kit", @ui8kit/aria owns toggling. */
  open?: boolean;
  className?: string;
  behavior?: BehaviorMode;
};

export type ComboboxInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "role"> & {
  listId?: string;
  open?: boolean;
};

export type ComboboxToggleProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  inputId?: string;
  listId?: string;
  open?: boolean;
  behavior?: BehaviorMode;
};

export type ComboboxListProps = HTMLAttributes<HTMLUListElement> & {
  open?: boolean;
};

export type ComboboxOptionProps = LiHTMLAttributes<HTMLLIElement> & {
  value?: string;
  selected?: boolean;
  disabled?: boolean;
};

function comboboxState(open?: boolean): string {
  return open ? "open" : "closed";
}

function comboboxBehavior(value?: BehaviorMode): BehaviorMode {
  return normalizeBehaviorMode(value);
}

function comboboxRootAttrs(
  open: boolean | undefined,
  behavior: BehaviorMode | undefined
): Record<string, unknown> {
  const attrs: Record<string, unknown> = { "data-state": comboboxState(open) };
  if (comboboxBehavior(behavior) === "ui8kit") {
    attrs["data-ui8kit"] = "combobox";
  }
  return attrs;
}

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(function Combobox(
  { variant, open, behavior, className, id, children, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      id={id || undefined}
      className={composeRecipe(comboboxRecipe, { variant }, className)}
      {...comboboxRootAttrs(open, behavior)}
      {...rest}
    >
      {children}
    </div>
  );
});
Combobox.displayName = "Combobox";

export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  function ComboboxInput(
    { listId, open, className, "aria-label": ariaLabel, id, ...rest },
    ref
  ) {
    return (
      <input
        ref={ref}
        id={id || undefined}
        type="text"
        role="combobox"
        aria-expanded={open ?? false}
        aria-autocomplete="list"
        aria-controls={listId?.trim() || undefined}
        aria-label={ariaLabel?.trim() || undefined}
        className={cn(
          "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
        {...rest}
      />
    );
  }
);
ComboboxInput.displayName = "ComboboxInput";

export const ComboboxToggle = forwardRef<HTMLButtonElement, ComboboxToggleProps>(
  function ComboboxToggle(
    {
      inputId,
      listId,
      open,
      behavior,
      className,
      "aria-label": ariaLabel,
      id,
      type,
      children,
      ...rest
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        id={id || undefined}
        type={type ?? "button"}
        tabIndex={-1}
        aria-expanded={open ?? false}
        aria-controls={listId?.trim() || undefined}
        aria-label={ariaLabel?.trim() || undefined}
        data-combobox-toggle={comboboxBehavior(behavior) === "ui8kit" ? true : undefined}
        data-ui8kit-dialog-target={
          comboboxBehavior(behavior) === "ui8kit" ? inputId?.trim() || undefined : undefined
        }
        className={cn(
          "inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground",
          className
        )}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
ComboboxToggle.displayName = "ComboboxToggle";

export const ComboboxList = forwardRef<HTMLUListElement, ComboboxListProps>(function ComboboxList(
  { open, className, hidden, id, children, ...rest },
  ref
) {
  return (
    <ul
      ref={ref}
      id={id || undefined}
      role="listbox"
      hidden={hidden ?? !open}
      className={cn(
        "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover p-1 shadow-md",
        className
      )}
      {...rest}
    >
      {children}
    </ul>
  );
});
ComboboxList.displayName = "ComboboxList";

export const ComboboxOption = forwardRef<HTMLLIElement, ComboboxOptionProps>(
  function ComboboxOption(
    { value, selected, disabled, className, id, children, ...rest },
    ref
  ) {
    return (
      <li
        ref={ref}
        id={id || undefined}
        role="option"
        aria-selected={selected ? "true" : "false"}
        aria-disabled={disabled ? "true" : undefined}
        data-combobox-option={true}
        data-combobox-value={value?.trim() || undefined}
        className={cn(
          "cursor-pointer rounded-sm px-2 py-1.5 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground",
          className
        )}
        {...rest}
      >
        {children}
      </li>
    );
  }
);
ComboboxOption.displayName = "ComboboxOption";
