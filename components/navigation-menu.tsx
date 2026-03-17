import * as React from "react";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "./utils";

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<"nav"> & {
  viewport?: boolean;
}) {
  return (
    <nav data-slot="navigation-menu" data-viewport={viewport} className={cn(className)} {...props}>
      {children}
      {viewport && <NavigationMenuViewport />}
    </nav>
  );
}

function NavigationMenuList({
  className,
  children,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul data-slot="navigation-menu-list" className={cn(className)} {...props}>
      {children}
    </ul>
  );
}

function NavigationMenuItem({
  className,
  children,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li data-slot="navigation-menu-item" className={cn(className)} {...props}>
      {children}
    </li>
  );
}

const navigationMenuTriggerStyle = cva(
  "inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 outline-none",
);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon className="relative top-[1px] ml-1 size-3" aria-hidden="true" />
    </button>
  );
}

function NavigationMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div data-slot="navigation-menu-content" className={cn(className)} {...props}>
      {children}
    </div>
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div data-slot="navigation-menu-viewport" className={cn(className)} {...props} />;
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<"a">) {
  return <a data-slot="navigation-menu-link" className={cn(className)} {...props} />;
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div data-slot="navigation-menu-indicator" className={cn(className)} {...props} />;
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
