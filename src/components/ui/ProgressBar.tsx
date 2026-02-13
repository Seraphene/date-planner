"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
    progress: number; // 0 to 100
    className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
    return (
        <div className={cn("relative h-6 w-full overflow-hidden rounded-full bg-white/50 backdrop-blur-sm border-2 border-pastel-pink/20 shadow-inner", className)}>
            <motion.div
                className="h-full bg-gradient-to-r from-pastel-pink to-[#ffb6c1] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
            />
            {/* Cute icon that follows the progress */}
            <motion.div
                className="absolute top-1/2 -ml-4 -mt-4 flex h-8 w-8 items-center justify-center text-xl drop-shadow-md z-10"
                initial={{ left: 0 }}
                animate={{ left: `${progress}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
            >
                ❤️
            </motion.div>
        </div>
    );
}
