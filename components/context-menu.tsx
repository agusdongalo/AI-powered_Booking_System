import * as React from "react";

import { cn } from "./utils";

function ContextMenu({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="context-menu" className={cn(className)} {...props}>
      {children}
    </div>
  );
}

function ContextMenuTrigger({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="context-menu-trigger"
      className={cn(className)}
      {...props}
    />
  );
}

function ContextMenuGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="context-menu-group" className={cn(className)} {...props} />;
}

function ContextMenuPortal({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}

function ContextMenuSub({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="context-menu-sub" className={cn(className)} {...props}>
      {children}
    </div>
  );
}

function ContextMenuRadioGroup({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="context-menu-radio-group"
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ContextMenuSubTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  inset?: boolean;
}) {
  return (
    <button
      type="button"
      data-slot="context-menu-sub-trigger"
      className={cn(className)}
      {...props}
    >
      {children}
    </button>
  );
}

function ContextMenuSubContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div data-slot="context-menu-sub-content" className={cn(className)} {...props}>
      {children}
    </div>
  );
}

function ContextMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div data-slot="context-menu-content" className={cn(className)} {...props}>
      {children}
    </div>
  );
}

function ContextMenuItem({
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
      data-slot="context-menu-item"
      className={cn(className)}
      {...props}
    >
      {children}
    </button>
  );
}

function ContextMenuCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  checked?: boolean;
}) {
  return (
    <button
      type="button"
      data-slot="context-menu-checkbox-item"
      className={cn(className)}
      {...props}
    >
      {children}
    </button>
  );
}

function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="context-menu-radio-item"
      className={cn(className)}
      {...props}
    >
      {children}
    </button>
  );
}

function ContextMenuLabel({
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  inset?: boolean;
}) {
  return (
    <div data-slot="context-menu-label" className={cn(className)} {...props}>
      {children}
    </div>
  );
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<"hr">) {
  return <hr data-slot="context-menu-separator" className={cn(className)} {...props} />;
}

function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return <span data-slot="context-menu-shortcut" className={cn(className)} {...props} />;
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
