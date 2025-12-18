import * as React from "react"
// Note: Normally we'd use @radix-ui/react-label but for simplicity without extra installs we'll use a basic label
// If you want full accessibility features, ensure radix-ui label is installed.
// For now, standard label with correct styling.

import { cn } from "@/lib/utils"

const Label = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            className
        )}
        {...props}
    />
))
Label.displayName = "Label"

export { Label }
