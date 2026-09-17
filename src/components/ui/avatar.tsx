import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";

export function Avatar({ className, ...props }: ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>) {
  return <AvatarPrimitive.Root className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white/70 bg-secondary", className)} {...props} />;
}

export function AvatarImage({ className, ...props }: ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image className={cn("aspect-square h-full w-full object-cover", className)} {...props} />;
}

export function AvatarFallback({ className, ...props }: ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>) {
  return <AvatarPrimitive.Fallback className={cn("flex h-full w-full items-center justify-center bg-primary text-xs font-bold text-primary-foreground", className)} {...props} />;
}
