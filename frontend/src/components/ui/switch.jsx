import React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      "w-10 h-6 rounded-full bg-red-200 relative transition-colors focus:outline-none",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb 
      className="block w-4 h-4 bg-primary rounded-full transition-transform transform translate-x-1 data-[state=checked]:translate-x-5" 
    />
  </SwitchPrimitive.Root>
));

Switch.displayName = "Switch";

export { Switch };
