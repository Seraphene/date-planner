"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
    progress: number; // 0 to 100
    className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
    return (
        <div className={cn("relative h-4 w-full overflow-hidden rounded-full bg-soft-gray shadow-inner", className)}>
            <motion.div
                className="h-full bg-pastel-pink"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 15 }}
            />
            {/* Cute icon that follows the progress */}
            <motion.div
                className="absolute top-1/2 -ml-3 -mt-3 flex h-6 w-6 items-center justify-center text-lg"
                initial={{ left: 0 }}
                animate={{ left: `${progress}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 15 }}
            >
                ❤️
            </motion.div>
        </div>
    );
}
