"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SoftButton } from "@/components/ui/SoftButton";
import { useQuiz } from "@/context/QuizContext";
import { cn } from "@/lib/utils";
import { float, pulse, fadeInUp, staggerContainer, softSpring, subtleFloat } from "@/lib/animations";

export default function WelcomePage() {
    const router = useRouter();
    const { startQuiz } = useQuiz();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [secretCode, setSecretCode] = useState("");
    const [error, setError] = useState(false);

    // Use the secret code from .env or fallback
    const SECRET = process.env.NEXT_PUBLIC_SHARED_SECRET || "2024";

    useEffect(() => {
        const isUnlocked = localStorage.getItem("gatekeeper_unlocked");
        if (isUnlocked === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (secretCode === SECRET) {
            localStorage.setItem("gatekeeper_unlocked", "true");
            setIsAuthenticated(true);
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    const handleStart = () => {
        startQuiz();
        router.push("/quiz");
    };

    if (!isAuthenticated) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-cream-50 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,209,220,0.2),transparent_40%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(224,187,228,0.2),transparent_40%)]" />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-sm bg-white rounded-[3rem] shadow-pink-glow p-10 text-center space-y-8 relative z-10 border-2 border-pastel-pink/10"
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="text-7xl mb-6 drop-shadow-lg"
                    >
                        🔐
                    </motion.div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-charcoal-muted uppercase tracking-tight">
                            Secret Diary
                        </h1>
                        <p className="text-charcoal-muted/60 font-semibold text-sm">
                            Enter our special year to unlock.
                        </p>
                    </div>

                    <form onSubmit={handleUnlock} className="space-y-6">
                        <div className="space-y-1">
                            <input
                                type="text"
                                inputMode="numeric"
                                value={secretCode}
                                onChange={(e) => setSecretCode(e.target.value)}
                                className={cn(
                                    "flex h-20 w-full rounded-full border-[3px] bg-white px-8 py-4 text-4xl text-center font-black text-charcoal-muted shadow-soft transition-all tracking-[0.3em]",
                                    "placeholder:text-gray-200 focus:outline-none focus:ring-8 focus:ring-pastel-pink/20",
                                    error ? "border-red-300 bg-red-50 text-red-500" : "border-lavender focus:border-pastel-pink"
                                )}
                                placeholder="0000"
                                maxLength={4}
                            />
                        </div>
                        <SoftButton type="submit" className="w-full" size="lg">
                            Unlock Love ❤️
                        </SoftButton>
                    </form>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-cream-50 relative overflow-hidden">
            {/* Background Decorations */}
            <motion.div
                variants={subtleFloat}
                animate="animate"
                className="absolute top-20 left-[10%] text-4xl opacity-20"
            >
                ✨
            </motion.div>
            <motion.div
                variants={subtleFloat}
                animate="animate"
                className="absolute bottom-40 right-[15%] text-4xl opacity-20"
                style={{ animationDelay: "1s" }}
            >
                💝
            </motion.div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,209,220,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(224,187,228,0.1),transparent_50%)]" />

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="w-full max-w-sm flex flex-col items-center text-center space-y-12 z-10"
            >
                <motion.div
                    variants={pulse}
                    animate="animate"
                    className="relative w-56 h-56 rounded-full overflow-hidden shadow-pink-glow border-[6px] border-white bg-white"
                >
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: "url('/images/us.jfif')" }}
                    />
                </motion.div>

                <div className="space-y-4">
                    <motion.h1
                        variants={fadeInUp}
                        className="text-4xl md:text-5xl font-black text-charcoal-muted leading-[1.1] tracking-tighter uppercase"
                    >
                        Plan Our<br />Perfect Date
                    </motion.h1>
                    <motion.p
                        variants={fadeInUp}
                        className="text-lg text-charcoal-muted/70 font-bold max-w-xs mx-auto leading-relaxed"
                    >
                        I want to make sure our next date is exactly what you want. ✨
                    </motion.p>
                </div>

                <motion.div
                    variants={fadeInUp}
                    className="w-full pt-4"
                >
                    <SoftButton
                        size="lg"
                        className="w-full h-20 text-2xl uppercase tracking-tighter"
                        onClick={handleStart}
                    >
                        Start Planning ✨
                    </SoftButton>
                </motion.div>
            </motion.div>
        </main>
    );
}
