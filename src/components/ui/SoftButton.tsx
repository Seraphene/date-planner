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
    const baseStyles = "relative overflow-hidden rounded-full font-bold transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed selection:bg-white/30";

    const variants = {
        primary: "bg-gradient-to-r from-pastel-pink to-[#ffb6c1] text-charcoal-muted shadow-pink-glow",
        secondary: "bg-mint-green text-charcoal-muted shadow-soft hover:brightness-105",
        outline: "border-[3px] border-lavender text-charcoal-muted bg-white/50 backdrop-blur-sm shadow-lavender-glow",
    };

    const sizes = {
        sm: "px-6 py-2 text-sm",
        md: "px-8 py-4 text-base min-h-[50px]",
        lg: "px-10 py-5 text-xl min-h-[64px]",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{
                    scale: 1,
                    opacity: 1,
                    transition: { duration: 0.4 }
                }}
                style={{ borderRadius: "inherit" }}
            />
            {/* Pulsing Outer Glow */}
            <motion.div
                className="absolute inset-0 ring-4 ring-pastel-pink/30 rounded-full"
                animate={{ scale: [1, 1.05, 1], opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
}
