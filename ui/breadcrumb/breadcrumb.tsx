import { forwardRef, type HTMLAttributes } from "react";
import { cn, type BehaviorMode } from "../../utils";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  current?: boolean;
  disabled?: boolean;
};

export type BreadcrumbProps = HTMLAttributes<HTMLElement> & {
  items?: BreadcrumbItem[];
  "aria-label"?: string;
  behavior?: BehaviorMode;
};

function breadcrumbLinkClasses(item: BreadcrumbItem): string {
  const classes = ["text-sm"];
  if (item.current) {
    classes.push("font-medium");
  } else if (item.disabled) {
    classes.push("text-muted-foreground");
  } else {
    classes.push("text-primary underline-offset-4 hover:underline");
  }
  return cn(...classes);
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items = [], className, "aria-label": ariaLabel, behavior, ...rest },
  ref
) {
  return (
    <nav
      ref={ref}
      className={cn("text-sm", className?.trim())}
      aria-label={ariaLabel?.trim() || undefined}
      data-ui8kit={behavior === "ui8kit" ? "breadcrumb" : undefined}
      {...rest}
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="inline-flex items-center">
            {item.href?.trim() && !item.disabled ? (
              <a
                href={item.href}
                className={breadcrumbLinkClasses(item)}
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
              </a>
            ) : (
              <span
                className={breadcrumbLinkClasses(item)}
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
});
Breadcrumb.displayName = "Breadcrumb";
