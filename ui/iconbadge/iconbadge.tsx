import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import iconBadgeRecipeJson from "./iconbadge.variants.json";
import { composeRecipe, defineRecipe, isDevEnv } from "../../utils";

const { recipe: iconBadgeRecipe, keys: iconBadgeKeys } = defineRecipe(iconBadgeRecipeJson);

type IconBadgeVariant = typeof iconBadgeKeys.variant;
type IconBadgeSize = typeof iconBadgeKeys.size;

export type { IconBadgeVariant, IconBadgeSize };

export type IconBadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, "className" | "title"> & {
  variant?: IconBadgeVariant;
  size?: IconBadgeSize;
  className?: string;
  children?: ReactNode;
  /** @deprecated Pass the letter or glyph as children. */
  name?: string;
  /** @deprecated Pass an <Icon /> as children instead. */
  iconType?: "svg" | "img" | "font";
  /** @deprecated Pass an <Icon /> as children instead. */
  baseClass?: string;
  /** @deprecated Pass an <Icon /> as children instead. */
  prefix?: string;
  /** @deprecated Pass content as children. */
  text?: string;
  /** @deprecated Pass an <Icon /> as children instead. */
  title?: string;
};

const warnedDeprecatedProps = new Set<string>();

function warnIconBadgeDeprecation(prop: string, hint: string): void {
  if (!isDevEnv()) return;
  const key = `IconBadge.${prop}`;
  if (warnedDeprecatedProps.has(key)) return;
  warnedDeprecatedProps.add(key);
  console.warn(`[IconBadge] "${prop}" is deprecated. ${hint}`);
}

export const IconBadge = forwardRef<HTMLSpanElement, IconBadgeProps>(function IconBadge(
  {
    variant,
    size,
    className,
    children,
    name: _name,
    iconType: _iconType,
    baseClass: _baseClass,
    prefix: _prefix,
    text: _text,
    title: _title,
    ...rest
  },
  ref
) {
  if (_name?.trim()) {
    warnIconBadgeDeprecation("name", "Pass the glyph/letter as children.");
  }
  if (_iconType?.trim()) {
    warnIconBadgeDeprecation("iconType", "Pass an <Icon /> as children.");
  }
  if (_baseClass?.trim()) {
    warnIconBadgeDeprecation("baseClass", "Move icon classes to <Icon />.");
  }
  if (_prefix?.trim()) {
    warnIconBadgeDeprecation("prefix", "Pass prefixed content directly as children.");
  }
  if (_text?.trim()) {
    warnIconBadgeDeprecation("text", "Pass text as children.");
  }
  if (_title?.trim()) {
    warnIconBadgeDeprecation("title", "Set title/aria-label directly on IconBadge.");
  }

  let resolvedChildren = children;
  if (resolvedChildren === undefined || resolvedChildren === null || resolvedChildren === false) {
    if (_text?.trim()) {
      resolvedChildren = _text.trim();
    } else if (_name?.trim()) {
      resolvedChildren = _name.trim();
    } else if (_prefix?.trim()) {
      resolvedChildren = _prefix.trim();
    }
  }

  const cls = composeRecipe(iconBadgeRecipe, { variant, size }, className);
  return (
    <span ref={ref} className={cls} {...rest}>
      {resolvedChildren}
    </span>
  );
});
IconBadge.displayName = "IconBadge";
