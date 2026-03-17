import * as React from "react";

import { cn } from "./utils";

type AspectRatioProps = React.ComponentProps<"div"> & {
  ratio?: number | string;
};

function AspectRatio({ className, ratio = 1, style, ...props }: AspectRatioProps) {
  return (
    <div
      data-slot="aspect-ratio"
      className={cn("relative w-full overflow-hidden", className)}
      style={{
        aspectRatio: ratio,
        ...style,
      }}
      {...props}
    />
  );
}

export { AspectRatio };
