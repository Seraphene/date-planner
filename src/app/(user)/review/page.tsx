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

    if (isSessionLoading || !session) return <div className="flex bg-white min-h-screen items-center justify-center">Loading...</div>;

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
        <main className="flex min-h-screen flex-col bg-soft-gray p-6 space-y-6 pb-32">
            <h1 className="text-3xl font-bold text-center text-text-primary mt-4">
                Let's double check!
            </h1>
            <p className="text-center text-gray-500">
                Here's what you picked for our date.
            </p>

            <div className="space-y-4">
                {questions.map((q) => {
                    const answer = session?.answers[q.id];
                    // Find label if possible
                    let displayAnswer = answer;
                    if (Array.isArray(answer)) {
                        displayAnswer = answer.join(", ");
                    }

                    if (q.options) {
                        if (Array.isArray(answer)) {
                            // Handle array answers logic if needed
                        } else {
                            const selectedOption = q.options.find(opt => opt.value === answer);
                            if (selectedOption) displayAnswer = selectedOption.label;
                        }
                    }

                    return (
                        <SoftCard key={q.id} className="flex flex-col space-y-2">
                            <span className="text-sm text-gray-400 uppercase tracking-wider font-bold">
                                {q.text}
                            </span>
                            <span className="text-xl font-medium text-pastel-pink">
                                {displayAnswer ? displayAnswer : "Skipped"}
                            </span>
                        </SoftCard>
                    );
                })}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white to-transparent">
                <SoftButton disabled={isSubmitting} onClick={handleSubmit} className="w-full shadow-lg shadow-pastel-pink/30">
                    {isSubmitting ? "Sending..." : "Send to My Love 💌"}
                </SoftButton>
            </div>
        </main>
    );
}
