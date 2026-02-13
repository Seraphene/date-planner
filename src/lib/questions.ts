import { db } from "./firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, getDoc } from "firebase/firestore";
import { Question } from "./types";

export const COLLECTION_NAME = "questions";

export const MOCK_QUESTIONS: Question[] = [
    {
        id: "q1",
        order: 1,
        text: "Where should we go?",
        type: "binary",
        options: [
            { id: "opt1", label: "City", value: "city", imageUrl: "https://images.unsplash.com/photo-1449824913929-2b362616df50?w=500&q=80" },
            { id: "opt2", label: "Nature", value: "nature", imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80" },
        ],
    },
    {
        id: "q2",
        order: 2,
        text: "What vibe are we feeling for food?",
        type: "selection",
        options: [
            { id: "food1", label: "Italian 🍝", value: "italian" },
            { id: "food2", label: "Japanese 🍣", value: "japanese" },
            { id: "food3", label: "Mexican 🌮", value: "mexican" },
            { id: "food4", label: "Burgers 🍔", value: "burgers" },
        ],
    },
    {
        id: "q3",
        order: 3,
        text: "Any specific requests?",
        type: "text",
        placeholder: "Tell me what's on your mind...",
    },
];

export async function getQuestions(): Promise<Question[]> {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        const questions: Question[] = [];
        querySnapshot.forEach((doc) => {
            questions.push({ id: doc.id, ...doc.data() } as Question); // Use doc.id from Firestore
        });
        
        // Fallback to MOCK if DB is empty (for development/testing without DB)
        if (questions.length === 0) {
            console.warn("No questions found in Firestore, using MOCK_QUESTIONS");
            return MOCK_QUESTIONS;
        }

        return questions;
    } catch (error) {
        console.error("Error fetching questions:", error);
        return MOCK_QUESTIONS; // Fail safe
    }
}

export async function addQuestion(question: Omit<Question, "id">) {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), question);
        return docRef.id;
    } catch (e) {
        console.error("Error adding question: ", e);
        throw e;
    }
}

export async function updateQuestion(id: string, question: Partial<Question>) {
    try {
        const questionRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(questionRef, question);
    } catch (e) {
        console.error("Error updating question: ", e);
        throw e;
    }
}

export async function deleteQuestion(id: string) {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (e) {
        console.error("Error deleting question: ", e);
        throw e;
    }
}
