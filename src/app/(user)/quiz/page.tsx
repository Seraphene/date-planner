"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "@/context/QuizContext";
import { SoftButton } from "@/components/ui/SoftButton";
import { SoftCard } from "@/components/ui/SoftCard";
import { SoftInput } from "@/components/ui/SoftInput";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getQuestions } from "@/lib/questions";
import { Question } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function QuizPage() {
    const router = useRouter();
    // ... (rest of the code unchanged until loading check)

    // ...

    // ...


    const { session, setAnswer, isLoading: isSessionLoading } = useQuiz();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

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
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    if (isSessionLoading || isLoadingQuestions || !currentQuestion) {
        return <div className="flex bg-white min-h-screen items-center justify-center">Loading...</div>;
    }

    return (
        <main className="flex min-h-screen flex-col bg-soft-gray">
            {/* Top Bar */}
            <div className="p-6 sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100">
                <ProgressBar progress={progress} />
            </div>

            <div className="flex-1 flex flex-col p-6 overflow-y-auto pb-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 1, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="flex-1 flex flex-col space-y-8"
                    >
                        <h2 className="text-2xl font-bold text-text-primary text-center mt-4">
                            {currentQuestion.text}
                        </h2>

                        {/* Dynamic Question Rendering */}
                        <div className="flex-1 flex flex-col justify-center">
                            {currentQuestion.type === 'binary' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full max-h-[60vh]">
                                    {currentQuestion.options?.map((opt) => (
                                        <motion.div
                                            key={opt.id}
                                            whileTap={{ scale: 0.95 }}
                                            className="relative rounded-3xl overflow-hidden shadow-soft cursor-pointer group h-64 md:h-auto"
                                            onClick={() => handleAnswer(opt.value)}
                                        >
                                            {/* Image Placeholder if actual image fails */}
                                            <div className="absolute inset-0 bg-pastel-pink/20 group-hover:bg-pastel-pink/30 transition-colors" />

                                            {opt.imageUrl && (
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center"
                                                    style={{ backgroundImage: `url(${opt.imageUrl})` }}
                                                />
                                            )}

                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                <span className="text-white text-3xl font-bold drop-shadow-md">
                                                    {opt.label}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {currentQuestion.type === 'selection' && (
                                <div className="grid grid-cols-2 gap-4">
                                    {currentQuestion.options?.map((opt) => (
                                        <SoftButton
                                            key={opt.id}
                                            variant="secondary"
                                            className="h-32 flex flex-col items-center justify-center space-y-2 text-xl"
                                            onClick={() => handleAnswer(opt.value)}
                                        >
                                            <span>{opt.label}</span>
                                        </SoftButton>
                                    ))}
                                </div>
                            )}

                            {currentQuestion.type === 'text' && (
                                <div className="w-full flex flex-col space-y-6">
                                    <textarea
                                        className="w-full h-48 rounded-3xl border-none bg-white p-6 text-lg shadow-inner focus:ring-2 focus:ring-pastel-pink/50 resize-none"
                                        placeholder={currentQuestion.placeholder}
                                        // defaultValue={session?.answers[currentQuestion.id] as string || ""}
                                        onBlur={(e) => setAnswer(currentQuestion.id, e.target.value)}
                                    />
                                    <SoftButton onClick={handleNext} className="w-full">
                                        Continue
                                    </SoftButton>
                                </div>
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
