"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SoftButton } from "@/components/ui/SoftButton";
import { useQuiz } from "@/context/QuizContext";
import { float, pulse, fadeInUp, staggerContainer, softSpring } from "@/lib/animations";

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
            <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-soft-gray relative overflow-hidden">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-md bg-white rounded-3xl shadow-soft-pink p-8 text-center space-y-6"
                >
                    <div className="text-6xl mb-4">🔐</div>
                    <h1 className="text-2xl font-bold text-text-primary">Secret Diary</h1>
                    <p className="text-gray-500">Enter our special year to unlock.</p>

                    <form onSubmit={handleUnlock} className="space-y-4">
                        <input
                            type="text" // Using text to allow leading zeros if needed
                            inputMode="numeric"
                            value={secretCode}
                            onChange={(e) => setSecretCode(e.target.value)}
                            className={`w-full text-center text-3xl tracking-widest p-4 rounded-xl border-2 focus:outline-none transition-colors ${error
                                ? "border-red-300 bg-red-50 text-red-500"
                                : "border-gray-200 focus:border-pastel-pink focus:ring-4 focus:ring-pastel-pink/20"
                                }`}
                            placeholder="YYYY"
                            maxLength={4}
                        />
                        <SoftButton type="submit" className="w-full">
                            Unlock ❤️
                        </SoftButton>
                    </form>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gradient-to-br from-pastel-pink/30 to-white relative overflow-hidden">
            {/* Decorative Background Elements */}
            <motion.div
                variants={float}
                animate="animate"
                className="absolute top-10 left-10 text-6xl opacity-20 cursor-default select-none"
            >
                🌸
            </motion.div>
            <motion.div
                variants={float}
                animate="animate"
                transition={{ delay: 1.5 }}
                className="absolute bottom-20 right-10 text-6xl opacity-20 cursor-default select-none"
            >
                💖
            </motion.div>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="flex-1 flex flex-col items-center justify-center text-center space-y-8 z-10"
            >
                <motion.div
                    variants={pulse}
                    animate="animate"
                    className="relative w-48 h-48 rounded-full overflow-hidden shadow-soft-pink border-4 border-white"
                >
                    {/* Placeholder for couple photo */}
                    <div className="w-full h-full bg-pastel-pink/50 flex items-center justify-center text-4xl">
                        Couple 📸
                    </div>
                </motion.div>

                <div className="space-y-4">
                    <motion.h1
                        variants={fadeInUp}
                        className="text-4xl font-bold text-text-primary"
                    >
                        Let's Plan<br />Our Perfect Date
                    </motion.h1>
                    <motion.p
                        variants={fadeInUp}
                        className="text-lg text-gray-500 max-w-xs mx-auto"
                    >
                        I want to make sure our next date is exactly what you want.
                        Answer a few quick questions!
                    </motion.p>
                </div>

                <motion.div
                    variants={fadeInUp}
                    className="w-full max-w-sm"
                >
                    <SoftButton
                        size="lg"
                        className="w-full shadow-lg shadow-pastel-pink/40"
                        onClick={handleStart}
                    >
                        Start Planning ✨
                    </SoftButton>
                </motion.div>
            </motion.div>
        </main>
    );
}
