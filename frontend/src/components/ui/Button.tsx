import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "glow"
    size?: "default" | "sm" | "lg" | "icon"
    isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={isLoading || props.disabled}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95",

                    // Variants
                    variant === "default" && "bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(124,58,237,0.5)]",
                    variant === "destructive" && "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                    variant === "outline" && "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
                    variant === "secondary" && "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                    variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
                    variant === "link" && "text-primary underline-offset-4 hover:underline",
                    variant === "glow" && "bg-gradient-to-r from-primary to-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_30px_rgba(124,58,237,0.8)] hover:scale-105 border border-white/10",

                    // Sizes
                    size === "default" && "h-10 px-6 py-2",
                    size === "sm" && "h-8 rounded-md px-3 text-xs",
                    size === "lg" && "h-12 rounded-lg px-8 text-base",
                    size === "icon" && "h-9 w-9",
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button }
