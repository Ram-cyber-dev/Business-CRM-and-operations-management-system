import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label" // Usually needs install, but backing off to simple label if not present?
// Actually if I use radix-ui it might fail. I'll make a simple one.

import { cn } from "@/lib/utils"

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className, ...props }, ref) => (
        <label
            ref={ref}
            className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                className
            )}
            {...props}
        />
    )
)
Label.displayName = "Label"

export { Label }
