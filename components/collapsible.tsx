import * as React from "react";

import { cn } from "./utils";

function Collapsible({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div data-slot="collapsible" className={cn("w-full", className)} {...props}>
      {children}
    </div>
  );
}

function CollapsibleTrigger({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="collapsible-trigger"
      className={cn(className)}
      {...props}
    />
  );
}

function CollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="collapsible-content"
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
