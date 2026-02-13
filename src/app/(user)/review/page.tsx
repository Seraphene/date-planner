"use client";

import { useEffect, useState } from "react";
import { useQuiz } from "@/context/QuizContext";
import { getQuestions } from "@/lib/questions";
import { Question } from "@/lib/types";
import { SoftButton } from "@/components/ui/SoftButton";
import { SoftCard } from "@/components/ui/SoftCard";
import { useRouter } from "next/navigation";

export default function ReviewPage() {
    const { session, isLoading: isSessionLoading } = useQuiz();
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function loadQuestions() {
            const data = await getQuestions();
            setQuestions(data);
        }
        loadQuestions();
    }, []);

    if (isSessionLoading || !session) return (
        <div className="flex bg-soft-gray min-h-screen items-center justify-center">
            <div className="animate-pulse text-pastel-pink text-xl font-bold">Loading your choices...</div>
        </div>
    );

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ session }),
            });

            if (response.ok) {
                router.push("/success");
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Submission failed", error);
            alert("Submission failed. Check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col bg-cream-50 p-6 space-y-8 pb-40">
            <header className="space-y-3 text-center mt-8">
                <div className="text-5xl mb-4">📝</div>
                <h1 className="text-4xl font-black text-charcoal-muted uppercase tracking-tight">
                    Review Time! ✨
                </h1>
                <p className="text-charcoal-muted/60 font-bold">
                    Let's make sure everything is perfect.
                </p>
            </header>

            <div className="grid gap-4 max-w-sm mx-auto w-full">
                {questions.map((q) => {
                    const answer = session?.answers[q.id];
                    let displayAnswer = answer;
                    if (Array.isArray(answer)) {
                        displayAnswer = answer.join(", ");
                    }

                    if (q.options) {
                        if (Array.isArray(answer)) {
                            // Logic remains same
                        } else {
                            const selectedOption = q.options.find(opt => opt.value === answer);
                            if (selectedOption) displayAnswer = selectedOption.label;
                        }
                    }

                    return (
                        <SoftCard key={q.id} className="border-l-[6px] border-pastel-pink">
                            <h3 className="text-[10px] text-pastel-pink uppercase tracking-[0.2em] font-black mb-2 px-1">
                                {q.text}
                            </h3>
                            <p className="text-xl font-black text-charcoal-muted bg-cream-50/50 p-4 rounded-2xl border-2 border-white/50 shadow-inner">
                                {displayAnswer ? displayAnswer : <span className="text-charcoal-muted/20 italic">Empty...</span>}
                            </p>
                        </SoftCard>
                    );
                })}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-cream-50 via-cream-50/90 to-transparent z-30">
                <div className="max-w-sm mx-auto">
                    <SoftButton
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        size="lg"
                        className="w-full h-20 text-2xl uppercase tracking-tighter"
                    >
                        {isSubmitting ? "Sending..." : "Send it! ❤️"}
                    </SoftButton>
                </div>
            </div>
        </main>
    );
}
