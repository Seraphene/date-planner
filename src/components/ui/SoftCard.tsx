"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface SoftCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
}

export function SoftCard({ className, children, ...props }: SoftCardProps) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className={cn(
                "bg-white rounded-3xl shadow-pink-glow p-8 border-2 border-pastel-pink/10",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
