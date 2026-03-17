import * as React from "react";

import { cn } from "./utils";

function Drawer({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="drawer" className={cn(className)} {...props}>
      {children}
    </div>
  );
}

function DrawerTrigger({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="drawer-trigger"
      className={cn(className)}
      {...props}
    />
  );
}

function DrawerPortal({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}

function DrawerClose({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="drawer-close"
      className={cn(className)}
      {...props}
    />
  );
}

function DrawerOverlay({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="drawer-overlay" className={cn(className)} {...props} />;
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div data-slot="drawer-content" className={cn(className)} {...props}>
      {children}
    </div>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="drawer-header" className={cn(className)} {...props} />;
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="drawer-footer" className={cn(className)} {...props} />;
}

function DrawerTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="drawer-title" className={cn(className)} {...props} />;
}

function DrawerDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="drawer-description" className={cn(className)} {...props} />;
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
