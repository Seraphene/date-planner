export type QuestionType = 'binary' | 'selection' | 'text';

export interface QuestionOption {
    id: string;
    label: string;
    imageUrl?: string;
    value: string;
}

export interface Question {
    id: string;
    order: number;
    text: string;
    type: QuestionType;
    options?: QuestionOption[];
    placeholder?: string;
}

export interface Answer {
    questionId: string;
    value: string | string[]; // Single value or array for multiple choice
}

export interface UserSession {
    id: string;
    startedAt: number;
    answers: Record<string, string | string[]>; // Map questionId to answer value
    isComplete: boolean;
}
