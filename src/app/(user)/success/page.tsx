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
        <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-cream-50 text-center relative overflow-hidden">
            {/* Success Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(209,255,220,0.3),transparent_70%)]" />

            <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="text-9xl mb-12 drop-shadow-2xl relative z-10"
            >
                💝
            </motion.div>

            <SoftCard className="space-y-6 max-w-sm bg-white/95 backdrop-blur-md border-[4px] border-mint-green shadow-soft relative z-10">
                <h1 className="text-4xl font-black text-charcoal-muted uppercase tracking-tighter leading-none">
                    It's a Date! ✨
                </h1>
                <p className="text-charcoal-muted/70 font-bold text-lg leading-relaxed">
                    I've received your choices. I'll take care of the rest.
                    Get ready for a magical time!
                </p>
                <div className="pt-4">
                    <div className="inline-block px-4 py-2 bg-mint-green/30 rounded-full text-xs font-black uppercase tracking-widest text-charcoal-muted/60">
                        Submission Successful
                    </div>
                </div>
            </SoftCard>
        </main>
    );
}
