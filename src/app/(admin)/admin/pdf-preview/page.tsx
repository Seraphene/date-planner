"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { PDFLayout } from "@/lib/pdf-generator";
import { Question, UserSession } from "@/lib/types";
import { getQuestions } from "@/lib/questions";

const PDFViewer = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
    {
        ssr: false,
        loading: () => <p>Loading PDF Viewer...</p>,
    }
);

export default function PDFPreviewPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock Session Structure
    const [previewSession, setPreviewSession] = useState<UserSession | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const data = await getQuestions();
                setQuestions(data);

                // Create mock answers based on loaded questions
                const mockAnswers: Record<string, string> = {};
                data.forEach(q => {
                    if (q.options && q.options.length > 0) {
                        // Select the first option for preview
                        mockAnswers[q.id] = q.options[0].value;
                    } else {
                        mockAnswers[q.id] = "This is a sample text answer locally generated for preview.";
                    }
                });

                setPreviewSession({
                    id: "preview-session-123",
                    startedAt: Date.now(),
                    isComplete: true,
                    answers: mockAnswers
                });

            } catch (e) {
                console.error("Failed to load questions", e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading || !previewSession) return <div className="flex items-center justify-center h-screen">Loading Preview Data...</div>;

    return (
        <div className="h-screen w-full flex flex-col">
            <div className="p-4 bg-white shadow-sm border-b flex justify-between items-center">
                <h1 className="text-xl font-bold text-pastel-pink">PDF Preview Mode</h1>
                <span className="text-sm text-gray-500">Showing sample data</span>
            </div>
            <div className="flex-1 bg-soft-gray p-8">
                <PDFViewer className="w-full h-full rounded-xl shadow-lg border-none">
                    <PDFLayout session={previewSession} questions={questions} />
                </PDFViewer>
            </div>
        </div>
    );
}
