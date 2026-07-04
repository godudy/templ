import { Nav, NavItem, NavLink, NavList } from "@registry/components";
import { IconBadge } from "@registry/ui";
import { navIconLetter, navIconVariant } from "../../lib/helpers";
import type { NavItem as NavItemData } from "../../types/dashboard";

export function DashboardPrimaryNav({ items, className }: { items: NavItemData[]; className?: string }) {
  return (
    <Nav aria-label="Primary navigation" className={className}>
      <NavList className="px-2">
        {items.map((item, index) => (
          <NavItem key={item.Label}>
            <NavLink href={item.Href} active={index === 0} aria-label={item.Label}>
              <IconBadge size="sm" variant={navIconVariant(index === 0)}>
                {navIconLetter(item.Icon)}
              </IconBadge>
              {item.Label}
            </NavLink>
          </NavItem>
        ))}
      </NavList>
    </Nav>
  );
}

export function DashboardHeaderNav({ items, className }: { items: NavItemData[]; className?: string }) {
  return (
    <Nav aria-label="Header navigation" className={className}>
      <NavList className="px-2">
        {items.map((item) => (
          <NavItem key={item.Label}>
            <NavLink href={item.Href} variant="ghost" size="sm">{item.Label}</NavLink>
          </NavItem>
        ))}
      </NavList>
    </Nav>
  );
}
