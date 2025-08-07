"use client";

import * as React from "react";
import * as VisuallyHiddenPrimitive from "@radix-ui/react-visually-hidden@1.1.1";

function VisuallyHidden({
  ...props
}: React.ComponentProps<typeof VisuallyHiddenPrimitive.Root>) {
  return <VisuallyHiddenPrimitive.Root {...props} />;
}

export { VisuallyHidden };