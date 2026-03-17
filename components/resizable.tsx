import * as React from "react";

import { cn } from "./utils";

function ResizablePanelGroup({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div data-slot="resizable-panel-group" className={cn("flex h-full w-full", className)} {...props}>
      {children}
    </div>
  );
}

function ResizablePanel({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div data-slot="resizable-panel" className={cn(className)} {...props}>
      {children}
    </div>
  );
}

function ResizableHandle({
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  withHandle?: boolean;
}) {
  return (
    <div data-slot="resizable-handle" className={cn(className)} {...props}>
      {children}
    </div>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
