import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        basic: "bg-primary text-primary-foreground hover:bg-primary/90",
        shadow: "shadow-[0_4px_14px_0_rgb(0,0,0,5%)] hover:shadow-[0_6px_20px_rgba(93,93,93,15%)] px-8 py-2 bg-[#fff] text-[#696969] font-bold rounded-md transition duration-200 ease-linear",
        glass: "relative z-30 inline-flex items-center justify-center w-auto px-8 py-3 overflow-hidden font-bold text-gray-500 transition-all duration-500 border border-gray-200 rounded-md cursor-pointer group bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-white active:to-white before:content-[''] before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0 before:bg-gray-100 before:transition-all before:duration-500 before:ease-in-out after:content-[''] after:absolute after:h-full after:w-0.5 after:bottom-0 after:right-0 after:bg-gray-100 after:transition-all after:duration-500 after:ease-in-out active:before:bg-transparent active:after:bg-transparent",
        sketch: "px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 cursor-pointerO",
        default: "shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        addLesson: "border border-gray-300 text-primary hover:bg-stone-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
