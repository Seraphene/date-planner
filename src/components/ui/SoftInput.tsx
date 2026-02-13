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
                    "flex h-12 w-full rounded-2xl border-none bg-soft-gray px-4 py-3 text-base shadow-inner transition-all",
                    "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pastel-pink/50",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    error && "ring-2 ring-red-300 bg-red-50",
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
