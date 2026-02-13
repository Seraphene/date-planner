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
import { cardSwipe, staggerContainer, fadeInUp, tiltAction, parallaxLabel } from "@/lib/animations";

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
        <main className="flex min-h-screen flex-col bg-cream-50 overflow-hidden font-sans">
            {/* Top Bar - Progress */}
            <div className="px-6 py-8 sticky top-0 bg-cream-50/90 backdrop-blur-lg z-20">
                <ProgressBar progress={progress} />
            </div>

            <div className="flex-1 flex flex-col px-6">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentQuestion.id}
                        variants={cardSwipe(direction)}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        custom={direction}
                        className="flex-1 flex flex-col"
                    >
                        {/* Question Text - Standardized Top Placement */}
                        <motion.div
                            variants={fadeInUp}
                            className="pt-4 pb-10"
                        >
                            <h2 className="text-3xl font-black text-charcoal-muted text-center leading-tight tracking-tight uppercase">
                                {currentQuestion.text}
                            </h2>
                        </motion.div>

                        {/* Interactive Area - Thumb Zone (Centered to Bottom) */}
                        <div className="flex-1 flex flex-col justify-end pb-32">
                            {(!currentQuestion.options || currentQuestion.options.length === 0) && currentQuestion.type !== 'text' ? (
                                <SoftCard className="text-center p-10 bg-white">
                                    <p className="text-gray-500 italic text-lg font-bold">No choices here! ✨</p>
                                    <p className="text-xs text-pastel-pink mt-4 font-black uppercase tracking-widest">Check Admin Panel</p>
                                </SoftCard>
                            ) : null}

                            {currentQuestion.type === 'binary' && (
                                <motion.div
                                    variants={staggerContainer}
                                    initial="initial"
                                    animate="animate"
                                    className="grid grid-cols-1 gap-6"
                                >
                                    {currentQuestion.options?.map((opt) => {
                                        const isSelected = session?.answers?.[currentQuestion.id] === opt.value;
                                        return (
                                            <motion.div
                                                key={opt.id}
                                                variants={tiltAction}
                                                initial="initial"
                                                whileHover="whileHover"
                                                whileTap="whileTap"
                                                className={cn(
                                                    "relative min-h-[160px] rounded-[2.5rem] overflow-hidden shadow-pink-glow cursor-pointer transition-all duration-300 preserve-3d",
                                                    isSelected ? "border-[6px] border-pastel-pink" : "border-[4px] border-white"
                                                )}
                                                onClick={() => handleAnswer(opt.value)}
                                            >
                                                {/* Image Layer */}
                                                {opt.imageUrl && (
                                                    <motion.div
                                                        className="absolute inset-0 bg-cover bg-center"
                                                        style={{ backgroundImage: `url(${opt.imageUrl})`, translateZ: -20 }}
                                                    />
                                                )}

                                                {/* Content Overlay - Frosted Glass Parallax */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex flex-col items-center justify-center p-4 preserve-3d">
                                                    <motion.div
                                                        variants={parallaxLabel}
                                                        className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-full shadow-2xl border-2 border-pastel-pink/20"
                                                    >
                                                        <h3 className="text-charcoal-muted text-xl font-black uppercase tracking-tight">
                                                            {opt.label}
                                                        </h3>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}

                            {currentQuestion.type === 'selection' && (
                                <motion.div
                                    variants={staggerContainer}
                                    initial="initial"
                                    animate="animate"
                                    className="grid grid-cols-1 gap-3"
                                >
                                    {currentQuestion.options?.map((opt) => {
                                        const isSelected = session?.answers?.[currentQuestion.id] === opt.value;
                                        return (
                                            <motion.div key={opt.id} variants={fadeInUp}>
                                                <motion.div
                                                    whileTap={{ scale: 0.98 }}
                                                    animate={{
                                                        scale: isSelected ? [1, 1.02, 1] : 1,
                                                        borderColor: isSelected ? "#FFD1DC" : "#ffffff"
                                                    }}
                                                    transition={{
                                                        scale: { duration: 2, repeat: isSelected ? Infinity : 0, ease: "easeInOut" },
                                                        borderColor: { duration: 0.2 }
                                                    }}
                                                    className={cn(
                                                        "bg-white p-6 rounded-[2rem] border-[4px] shadow-soft cursor-pointer transition-all",
                                                        isSelected ? "border-pastel-pink shadow-pink-glow" : "border-white hover:border-pastel-pink/30"
                                                    )}
                                                    onClick={() => handleAnswer(opt.value)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xl font-black text-charcoal-muted uppercase tracking-tight">{opt.label}</span>
                                                        {isSelected && (
                                                            <motion.span
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="text-2xl"
                                                            >
                                                                ✨
                                                            </motion.span>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}

                            {currentQuestion.type === 'text' && (
                                <motion.div
                                    variants={fadeInUp}
                                    initial="initial"
                                    animate="animate"
                                    className="w-full flex flex-col space-y-4"
                                >
                                    <textarea
                                        className="w-full h-40 rounded-[2.5rem] border-4 border-lavender bg-white p-8 text-xl font-bold text-charcoal-muted shadow-soft focus:outline-none focus:border-pastel-pink focus:ring-8 focus:ring-pastel-pink/10 resize-none transition-all placeholder:text-gray-200"
                                        placeholder={currentQuestion.placeholder || "Tell me anything..."}
                                        value={session?.answers?.[currentQuestion.id] || ""}
                                        onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
                                    />
                                    <SoftButton onClick={handleNext} size="lg" className="w-full uppercase tracking-tighter">
                                        Continue ✨
                                    </SoftButton>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Floating Navigation Controls - Thumb Zone Left/Right Tips */}
            <div className="fixed bottom-8 left-0 right-0 px-8 flex justify-between items-center pointer-events-none z-30">
                {currentQuestionIndex > 0 ? (
                    <SoftButton
                        variant="outline"
                        size="sm"
                        onClick={handleBack}
                        className="pointer-events-auto h-12 w-12 !rounded-full p-0 flex items-center justify-center"
                    >
                        ←
                    </SoftButton>
                ) : <div />}

                {/* Visual indicator of current step */}
                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-pastel-pink/20 text-[10px] font-black uppercase tracking-[0.2em] text-pastel-pink shadow-soft">
                    Step {currentQuestionIndex + 1} / {questions.length}
                </div>
            </div>
        </main>
    );
}
