"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { SoftCard } from "@/components/ui/SoftCard";
// import confetti from "canvas-confetti"; // We would install this if we could

export default function SuccessPage() {

    useEffect(() => {
        // Simple confetti effect if library was installed
        // confetti();
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-pastel-mint/30 to-white text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="text-8xl mb-8"
            >
                🎉
            </motion.div>

            <SoftCard className="space-y-4 max-w-sm">
                <h1 className="text-2xl font-bold text-text-primary">
                    It's a Date!
                </h1>
                <p className="text-gray-500">
                    I've received your choices. I'll take care of the rest.
                    Get ready for a magical time!
                </p>
            </SoftCard>
        </main>
    );
}
