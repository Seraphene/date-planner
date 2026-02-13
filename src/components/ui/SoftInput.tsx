"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

const SoftInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-16 w-full rounded-full border-2 border-lavender bg-white px-8 py-4 text-2xl text-center font-bold text-charcoal-muted shadow-soft transition-all",
                    "placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-pastel-pink/30 focus:border-pastel-pink",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    error && "border-red-300 bg-red-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
SoftInput.displayName = "SoftInput";

export { SoftInput };
