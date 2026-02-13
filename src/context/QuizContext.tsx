"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserSession } from '@/lib/types';

interface QuizContextType {
    session: UserSession | null;
    startQuiz: () => void;
    setAnswer: (questionId: string, value: string | string[]) => void;
    resetQuiz: () => void;
    isLoading: boolean;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const SESSION_KEY = 'plan_date_session';

export function QuizProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<UserSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load from local storage on mount
    useEffect(() => {
        const stored = localStorage.getItem(SESSION_KEY);
        if (stored) {
            try {
                setSession(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse session", e);
                localStorage.removeItem(SESSION_KEY);
            }
        }
        setIsLoading(false);
    }, []);

    // Save to local storage whenever session changes
    useEffect(() => {
        if (session) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        } else {
            localStorage.removeItem(SESSION_KEY);
        }
    }, [session]);

    const startQuiz = () => {
        const newSession: UserSession = {
            id: crypto.randomUUID(),
            startedAt: Date.now(),
            answers: {},
            isComplete: false,
        };
        setSession(newSession);
    };

    const setAnswer = (questionId: string, value: string | string[]) => {
        setSession((prev) => {
            if (!prev) return null;
            return {
                ...prev,
                answers: {
                    ...prev.answers,
                    [questionId]: value,
                },
            };
        });
    };

    const resetQuiz = () => {
        setSession(null);
    };

    return (
        <QuizContext.Provider value={{ session, startQuiz, setAnswer, resetQuiz, isLoading }}>
            {children}
        </QuizContext.Provider>
    );
}

export function useQuiz() {
    const context = useContext(QuizContext);
    if (context === undefined) {
        throw new Error('useQuiz must be used within a QuizProvider');
    }
    return context;
}
