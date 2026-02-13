"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SoftButton } from "@/components/ui/SoftButton";
import { useQuiz } from "@/context/QuizContext";

export default function WelcomePage() {
    const router = useRouter();
    const { startQuiz } = useQuiz();

    const handleStart = () => {
        startQuiz();
        router.push("/quiz");
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gradient-to-br from-pastel-pink/30 to-white relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-10 left-10 text-6xl opacity-20 animate-pulse">🌸</div>
            <div className="absolute bottom-20 right-10 text-6xl opacity-20 animate-bounce">💖</div>

            <motion.div
                initial={{ opacity: 1, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center space-y-8 z-10"
            >
                <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-soft-pink border-4 border-white">
                    {/* Placeholder for couple photo */}
                    <div className="w-full h-full bg-pastel-pink/50 flex items-center justify-center text-4xl">
                        Couple 📸
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-text-primary">
                        Let's Plan<br />Our Perfect Date
                    </h1>
                    <p className="text-lg text-gray-500 max-w-xs mx-auto">
                        I want to make sure our next date is exactly what you want.
                        Answer a few quick questions!
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 50, opacity: 1 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-sm z-10"
            >
                <SoftButton
                    size="lg"
                    className="w-full shadow-lg shadow-pastel-pink/40"
                    onClick={handleStart}
                >
                    Start Planning ✨
                </SoftButton>
            </motion.div>
        </main>
    );
}
