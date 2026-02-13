"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface SoftCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
}

export function SoftCard({ className, children, ...props }: SoftCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
                "bg-white rounded-3xl shadow-soft p-6",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
