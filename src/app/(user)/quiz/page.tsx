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
                        <div className="flex-1 flex flex-col justify-start py-8">
                            {(!currentQuestion.options || currentQuestion.options.length === 0) && currentQuestion.type !== 'text' ? (
                                <div className="text-center p-10 bg-white rounded-3xl shadow-soft">
                                    <p className="text-gray-500 italic text-lg">No options found for this question.</p>
                                    <p className="text-sm text-pastel-pink mt-3 font-semibold">Please check the Admin Dashboard!</p>
                                </div>
                            ) : null}

                            {currentQuestion.type === 'binary' && (
                                <motion.div
                                    variants={staggerContainer}
                                    initial="initial"
                                    animate="animate"
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20"
                                >
                                    {currentQuestion.options?.map((opt) => (
                                        <motion.div
                                            key={opt.id}
                                            variants={fadeInUp}
                                            whileTap={{ scale: 0.95 }}
                                            whileHover={{ scale: 1.02 }}
                                            className="relative min-h-[250px] md:min-h-[320px] rounded-[2.5rem] overflow-hidden shadow-soft-pink cursor-pointer group border-4 border-white bg-pastel-pink/20"
                                            onClick={() => handleAnswer(opt.value)}
                                        >
                                            {/* Image Layer */}
                                            {opt.imageUrl && (
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                                    style={{ backgroundImage: `url(${opt.imageUrl})` }}
                                                />
                                            )}

                                            {/* Content Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col items-center justify-center p-8 text-center transition-colors group-hover:bg-black/10">
                                                <h3 className="text-white text-3xl md:text-4xl font-black drop-shadow-2xl uppercase tracking-tighter leading-tight mb-2">
                                                    {opt.label}
                                                </h3>
                                                <div className="mt-4 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] uppercase tracking-[0.2em] font-black border border-white/20 group-hover:bg-pastel-pink group-hover:border-transparent transition-all">
                                                    Tap to Choose
                                                </div>
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
                                    className="grid grid-cols-1 gap-4 pb-20"
                                >
                                    {currentQuestion.options?.map((opt) => (
                                        <motion.div key={opt.id} variants={fadeInUp}>
                                            <SoftButton
                                                variant="secondary"
                                                className="w-full h-24 flex items-center justify-center text-xl md:text-2xl font-black shadow-soft uppercase tracking-tight"
                                                onClick={() => handleAnswer(opt.value)}
                                            >
                                                {opt.label}
                                            </SoftButton>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}

                            {currentQuestion.type === 'text' && (
                                <motion.div
                                    variants={fadeInUp}
                                    initial="initial"
                                    animate="animate"
                                    className="w-full flex flex-col space-y-6"
                                >
                                    <textarea
                                        className="w-full h-48 rounded-3xl border-none bg-white p-6 text-xl shadow-soft focus:ring-4 focus:ring-pastel-pink/30 resize-none"
                                        placeholder={currentQuestion.placeholder}
                                        onBlur={(e) => setAnswer(currentQuestion.id, e.target.value)}
                                    />
                                    <SoftButton onClick={handleNext} size="lg" className="w-full shadow-lg">
                                        Continue ✨
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
