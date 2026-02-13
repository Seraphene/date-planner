"use client";

import { useEffect, useState } from "react";
import { SoftCard } from "@/components/ui/SoftCard";
import { SoftButton } from "@/components/ui/SoftButton";
import { getQuestions, deleteQuestion, addQuestion } from "@/lib/questions";
import { Question } from "@/lib/types";

export default function AdminDashboard() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadQuestions();
    }, []);

    async function loadQuestions() {
        setLoading(true);
        try {
            const data = await getQuestions();
            setQuestions(data);
        } catch (error) {
            console.error("Failed to load questions", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this question?")) return;
        await deleteQuestion(id);
        await loadQuestions(); // Refresh list
    }

    async function handleAdd() {
        // MVP: Add a placeholder question for now
        // TODO: Implement full modal form
        const newQ = {
            order: questions.length + 1,
            text: "New Question (Edit me)",
            type: "text" as const,
            placeholder: "Type here...",
        };
        await addQuestion(newQ);
        await loadQuestions();
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Question Manager</h1>
                    <SoftButton onClick={handleAdd}>+ Add Question</SoftButton>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading questions...</div>
                ) : (
                    <div className="grid gap-6">
                        {questions.map((q) => (
                            <SoftCard key={q.id} className="flex justify-between items-center group hover:shadow-md transition-shadow">
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs uppercase font-bold">
                                            {q.type}
                                        </span>
                                        <h3 className="font-semibold text-lg">{q.text}</h3>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {q.options ? `${q.options.length} options` : "Text input"}
                                    </p>
                                </div>
                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <SoftButton size="sm" variant="secondary" onClick={() => alert("Edit feature coming soon!")}>Edit</SoftButton>
                                    <SoftButton
                                        size="sm"
                                        variant="outline"
                                        className="text-red-400 border-red-200 hover:bg-red-50"
                                        onClick={() => handleDelete(q.id)}
                                    >
                                        Delete
                                    </SoftButton>
                                </div>
                            </SoftCard>
                        ))}
                        {questions.length === 0 && (
                            <div className="text-center py-10 text-gray-400 italic">
                                No questions found. Add one to get started!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
