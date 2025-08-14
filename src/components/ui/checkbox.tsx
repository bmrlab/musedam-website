"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import Image from 'next/image'
import { cn } from "@/utilities/cn"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer size-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed  ",
      'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      'disabled:data-[state=checked]:border-[rgba(197,206,224,0.2)] disabled:data-[state=checked]:bg-[#414141] disabled:data-[state=checked]:text-[#C5CEE0]',
      'transition-all duration-300 ease-in-out hover:border-white/40',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.10533 7.60407L5.08771 7.62169L0.687866 3.22185L2.12054 1.78917L5.10539 4.77402L9.87941 0L11.3121 1.43268L5.12301 7.62175L5.10533 7.60407Z" fill="currentColor" />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
