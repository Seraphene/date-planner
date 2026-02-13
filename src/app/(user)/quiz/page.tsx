"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "@/context/QuizContext";
import { SoftButton } from "@/components/ui/SoftButton";
import { SoftCard } from "@/components/ui/SoftCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getQuestions } from "@/lib/questions";
import { Question } from "@/lib/types";
import { cn } from "@/lib/utils";
import { cardSwipe, staggerContainer, fadeInUp } from "@/lib/animations";

export default function QuizPage() {
    const router = useRouter();
    // ... (rest of the code unchanged until loading check)

    // ...

    // ...


    const { session, setAnswer, isLoading: isSessionLoading } = useQuiz();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
    const [direction, setDirection] = useState(1); // 1 for next, -1 for back

    useEffect(() => {
        async function loadQuestions() {
            try {
                const data = await getQuestions();
                setQuestions(data);
            } catch (error) {
                console.error("Failed to load questions", error);
            } finally {
                setIsLoadingQuestions(false);
            }
        }
        loadQuestions();
    }, []);

    // Ensure session exists
    useEffect(() => {
        if (!isSessionLoading && !session) {
            //   router.push("/"); // Redirect if no session
        }
    }, [isSessionLoading, session, router]);

    const currentQuestion = questions[currentQuestionIndex];

    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    const handleAnswer = (value: string | string[]) => {
        if (!currentQuestion) return;
        setAnswer(currentQuestion.id, value);

        // Add a small delay for visual feedback before moving next
        setTimeout(() => {
            handleNext();
        }, 300);
    };

    const handleNext = () => {
        if (isLastQuestion) {
            router.push("/review");
        } else {
            setDirection(1);
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setDirection(-1);
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    if (isSessionLoading || isLoadingQuestions || !currentQuestion) {
        return <div className="flex bg-white min-h-screen items-center justify-center">Loading...</div>;
    }

    return (
        <main className="flex min-h-screen flex-col bg-soft-gray overflow-hidden">
            {/* Top Bar */}
            <div className="p-6 sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100">
                <ProgressBar progress={progress} />
            </div>

            <div className="flex-1 flex flex-col p-6 overflow-y-auto pb-32">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentQuestion.id}
                        variants={cardSwipe(direction)}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        custom={direction}
                        className="flex-1 flex flex-col space-y-8"
                    >
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl font-bold text-text-primary text-center mt-4"
                        >
                            {currentQuestion.text}
                        </motion.h2>

                        {/* Dynamic Question Rendering */}
                        <div className="flex-1 flex flex-col justify-center">
                            {/* Debug Log (Visible only in Console) */}
                            {console.log("Current Question:", currentQuestion)}

                            {(!currentQuestion.options || currentQuestion.options.length === 0) && currentQuestion.type !== 'text' ? (
                                <div className="text-center p-8 bg-white rounded-3xl shadow-soft">
                                    <p className="text-gray-500 italic">No options formulated for this question.</p>
                                    <p className="text-sm text-pastel-pink mt-2">Check Admin Dashboard to add options!</p>
                                </div>
                            ) : null}

                            {currentQuestion.type === 'binary' && (
                                <motion.div
                                    variants={staggerContainer}
                                    initial="initial"
                                    animate="animate"
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full max-h-[60vh]"
                                >
                                    {currentQuestion.options?.map((opt) => (
                                        <motion.div
                                            key={opt.id}
                                            variants={fadeInUp}
                                            whileTap={{ scale: 0.95 }}
                                            whileHover={{ scale: 1.02 }}
                                            className="relative rounded-3xl overflow-hidden shadow-soft cursor-pointer group h-64 md:h-auto"
                                            onClick={() => handleAnswer(opt.value)}
                                        >
                                            {/* Image Placeholder if actual image fails */}
                                            <div className="absolute inset-0 bg-pastel-pink/20 group-hover:bg-pastel-pink/30 transition-colors" />

                                            {opt.imageUrl && (
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                                    style={{ backgroundImage: `url(${opt.imageUrl})` }}
                                                />
                                            )}

                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity group-hover:bg-black/30">
                                                <span className="text-white text-3xl font-bold drop-shadow-md text-center px-4">
                                                    {opt.label}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}

                            {currentQuestion.type === 'selection' && (
                                <motion.div
                                    variants={staggerContainer}
                                    initial="initial"
                                    animate="animate"
                                    className="grid grid-cols-2 gap-4"
                                >
                                    {currentQuestion.options?.map((opt) => (
                                        <motion.div key={opt.id} variants={fadeInUp}>
                                            <SoftButton
                                                variant="secondary"
                                                className="w-full h-32 flex flex-col items-center justify-center space-y-2 text-xl"
                                                onClick={() => handleAnswer(opt.value)}
                                            >
                                                <span>{opt.label}</span>
                                            </SoftButton>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}

                            {currentQuestion.type === 'text' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="w-full flex flex-col space-y-6"
                                >
                                    <textarea
                                        className="w-full h-48 rounded-3xl border-none bg-white p-6 text-lg shadow-inner focus:ring-2 focus:ring-pastel-pink/50 resize-none transition-shadow"
                                        placeholder={currentQuestion.placeholder}
                                        onBlur={(e) => setAnswer(currentQuestion.id, e.target.value)}
                                    />
                                    <SoftButton onClick={handleNext} className="w-full">
                                        Continue
                                    </SoftButton>
                                </motion.div>
                            )}
                        </div>

                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Navigation (Only show Back if not first) */}
            {currentQuestionIndex > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white to-transparent pointer-events-none">
                    <div className="pointer-events-auto">
                        <SoftButton variant="secondary" size="sm" onClick={handleBack}>
                            Back
                        </SoftButton>
                    </div>
                </div>
            )}

        </main>
    );
}
