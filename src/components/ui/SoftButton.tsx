"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface SoftButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
}

export function SoftButton({
    className,
    variant = "primary",
    size = "md",
    children,
    ...props
}: SoftButtonProps) {
    const baseStyles = "rounded-2xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-pastel-pink/50 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-pastel-pink text-white shadow-soft-pink hover:bg-opacity-90",
        secondary: "bg-white text-text-primary shadow-soft hover:bg-gray-50",
        outline: "border-2 border-pastel-pink text-pastel-pink hover:bg-pastel-pink/10",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base min-h-[44px]", // Mobile touch target size
        lg: "px-8 py-4 text-lg min-h-[56px]",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </motion.button>
    );
}
