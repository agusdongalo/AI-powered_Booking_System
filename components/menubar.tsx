import * as React from "react";

import { cn } from "./utils";

function Menubar({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="menubar" className={cn("flex items-center gap-1", className)} {...props}>
      {children}
    </div>
  );
}

function MenubarMenu({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="menubar-menu" className={cn(className)} {...props}>
      {children}
    </div>
  );
}

function MenubarGroup({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="menubar-group" className={cn(className)} {...props}>
      {children}
    </div>
  );
}

function MenubarPortal({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}

function MenubarRadioGroup({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="menubar-radio-group" className={cn(className)} {...props}>
      {children}
    </div>
  );
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="menubar-trigger"
      className={cn(className)}
      {...props}
    />
  );
}

function MenubarContent({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="menubar-content" className={cn(className)} {...props}>
      {children}
    </div>
  );
}

function MenubarItem({
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <button
      type="button"
      data-slot="menubar-item"
      className={cn(className)}
      {...props}
    >
      {children}
    </button>
  );
}

function MenubarCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  checked?: boolean;
}) {
  return (
    <button
      type="button"
      data-slot="menubar-checkbox-item"
      className={cn(className)}
      {...props}
    >
      {children}
    </button>
  );
}

function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="menubar-radio-item"
      className={cn(className)}
      {...props}
    >
      {children}
    </button>
  );
}

function MenubarLabel({
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  inset?: boolean;
}) {
  return (
    <div data-slot="menubar-label" className={cn(className)} {...props}>
      {children}
    </div>
  );
}

function MenubarSeparator({ className, ...props }: React.ComponentProps<"hr">) {
  return <hr data-slot="menubar-separator" className={cn(className)} {...props} />;
}

function MenubarShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="menubar-shortcut" className={cn(className)} {...props} />;
}

function MenubarSub({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="menubar-sub" className={cn(className)} {...props}>
      {children}
    </div>
  );
}

function MenubarSubTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  inset?: boolean;
}) {
  return (
    <button
      type="button"
      data-slot="menubar-sub-trigger"
      className={cn(className)}
      {...props}
    >
      {children}
    </button>
  );
}

function MenubarSubContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div data-slot="menubar-sub-content" className={cn(className)} {...props}>
      {children}
    </div>
  );
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
