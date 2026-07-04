import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import cardRecipeJson from "./card.variants.json";
import { cn, composeRecipe, defineRecipe } from "../../utils";
import { titleTag, type HeadingLevel } from "../../utils/attrs";
import { Slot } from "../slot/slot";

const { recipe: cardRecipe, keys: cardKeys } = defineRecipe(cardRecipeJson);

type CardVariant = typeof cardKeys.variant;

export type CardProps = Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
  variant?: CardVariant;
  className?: string;
  children?: ReactNode;
  asChild?: boolean;
};

export type CardHeaderProps = Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
  className?: string;
  children?: ReactNode;
};

export type CardContentProps = Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
  className?: string;
  children?: ReactNode;
};

export type CardFooterProps = Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
  className?: string;
  children?: ReactNode;
};

export type CardTitleProps = Omit<HTMLAttributes<HTMLHeadingElement>, "className"> & {
  as?: HeadingLevel;
  className?: string;
  children?: ReactNode;
};

export type CardDescriptionProps = Omit<HTMLAttributes<HTMLParagraphElement>, "className"> & {
  className?: string;
  children?: ReactNode;
};

const cardHeaderBase = "border-b border-border px-4 py-2";
const cardTitleBase = "text-sm font-semibold";
const cardDescriptionBase = "text-sm text-muted-foreground";
const cardContentBase = "p-4";
const cardFooterBase = "border-t border-border px-4 py-3";

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant, className, children, asChild, ...rest },
  ref
) {
  const cls = composeRecipe(cardRecipe, { variant }, className);
  if (asChild) {
    return (
      <Slot ref={ref} className={cls} {...rest}>
        {children}
      </Slot>
    );
  }
  return (
    <div ref={ref} className={cls} {...rest}>
      {children}
    </div>
  );
});
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cn(cardHeaderBase, className)} {...rest}>
      {children}
    </div>
  );
});
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { as, className, children, ...rest },
  ref
) {
  const Tag = titleTag(as) as ElementType;
  return (
    <Tag ref={ref} className={cn(cardTitleBase, className)} {...rest}>
      {children}
    </Tag>
  );
});
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  function CardDescription({ className, children, ...rest }, ref) {
    return (
      <p ref={ref} className={cn(cardDescriptionBase, className)} {...rest}>
        {children}
      </p>
    );
  }
);
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(function CardContent(
  { className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cn(cardContentBase, className)} {...rest}>
      {children}
    </div>
  );
});
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cn(cardFooterBase, className)} {...rest}>
      {children}
    </div>
  );
});
CardFooter.displayName = "CardFooter";
