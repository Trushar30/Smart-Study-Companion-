import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    fillColor?: "primary" | "secondary" | "accent" | "destructive"
  }
>(({ className, value, fillColor = "primary", ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "progress-bar bg-dark relative overflow-hidden rounded-full w-full",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full transition-all",
        {
          "progress-fill-primary": fillColor === "primary",
          "progress-fill-secondary": fillColor === "secondary", 
          "progress-fill-accent": fillColor === "accent",
          "progress-fill-destructive": fillColor === "destructive"
        }
      )}
      style={{ width: `${value || 0}%` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
